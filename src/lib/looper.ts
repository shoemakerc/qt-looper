import {
  DRUM_CHANNEL,
  DRUM_KITS,
  categoryOf,
  defaultOctave,
  isDrumKit,
  programName,
  type DrumKitId,
} from "./gm";
import { Take, occurrences, type Note } from "./loop";

/*
 * The looper: six tracks, a transport, and the scheduler that plays the
 * loop. It keeps its own state and hands React immutable snapshots through
 * subscribe/getSnapshot, so audio timing never waits on a render. Sound
 * goes through an Engine; the real one wraps Web Audio (engine.ts), and the
 * tests swap in a fake clock.
 */

export const TRACKS = 6;

/** How far ahead the scheduler queues notes, and how often it checks. */
const LOOKAHEAD = 0.12;
const TICK_MS = 25;
/** Background tabs only get a timer tick about once a second, so queue further ahead there. */
const HIDDEN_LOOKAHEAD = 2;
/** A little headroom before the first note, so it isn't clipped. */
const START_DELAY = 0.06;
const MAX_UNDO = 30;

export type Sound = { kind: "program"; program: number } | { kind: "drums"; kit: DrumKitId };

/** What the looper needs from the audio side. */
export interface Engine {
  /** False until the browser lets audio start, which takes a click or key press. */
  readonly running: boolean;
  /** Start (or resume) audio. Call it from a click or key press. */
  start(): void;
  /** Seconds on the audio clock. */
  now(): number;
  /** Seconds between the clock and the speakers, to line recordings up with what you heard. */
  latency(): number;
  setSound(track: number, sound: Sound): void;
  setVolume(track: number, volume: number): void;
  isReady(track: number): boolean;
  /** Queue a note at `time` on the audio clock. */
  play(track: number, note: number, velocity: number, time: number, duration: number): void;
  /** Start a note now; the returned function lets go of it. */
  noteOn(track: number, note: number, velocity: number): () => void;
  /** Silence one track, or everything. */
  stop(track?: number): void;
}

export type EngineEvents = {
  loading(track: number, loading: boolean): void;
  running(running: boolean): void;
};

export type Track = {
  /** 1–16. Channel 10 plays drums. */
  channel: number;
  /** General MIDI program, for every channel but 10. */
  program: number;
  /** Drum machine, for channel 10. */
  kit: DrumKitId;
  /** 0–127. */
  volume: number;
  /** Whether the track is in the mix (the 2016 "Play" checkbox). */
  play: boolean;
  /** The computer keyboard's A key plays C in this octave. */
  octave: number;
  notes: Note[];
  loading: boolean;
};

/**
 * stopped: nothing playing. waiting: Record is on but there's no loop yet,
 * so it's waiting for the first note. recording: a take is under way.
 * playing: the loop is going round.
 */
export type Transport = "stopped" | "waiting" | "recording" | "playing";

export type MidiState = {
  status: "off" | "connecting" | "on" | "unsupported" | "denied";
  inputs: string[];
};

export type Snapshot = {
  tracks: Track[];
  /** The track Record goes to and the keyboard plays (the 2016 Record radio button). */
  armed: number;
  transport: Transport;
  /** Seconds, once the first take has set it. */
  loopLength: number | null;
  /** How hard the computer keyboard plays, 1–127. */
  velocity: number;
  /** Notes being played right now, for lighting up keys. */
  held: number[];
  canUndo: boolean;
  /** Whether the browser has let sound start yet. */
  audio: boolean;
  midi: MidiState;
  /** A passing message for the status bar. */
  notice: string | null;
};

export const soundOf = (track: Track): Sound =>
  track.channel === DRUM_CHANNEL
    ? { kind: "drums", kit: track.kit }
    : { kind: "program", program: track.program };

/** "Electric Bass (finger)", or the drum machine's name on channel 10. */
export const soundName = (track: Track) =>
  track.channel === DRUM_CHANNEL
    ? (DRUM_KITS.find((kit) => kit.id === track.kit)?.name ?? "Drums")
    : programName(track.program);

/** Piano, bass, electric piano, strings and vibraphone, with drums on channel 10. */
const DEFAULTS: Pick<Track, "channel" | "program">[] = [
  { channel: 1, program: 0 },
  { channel: 2, program: 33 },
  { channel: 3, program: 4 },
  { channel: 4, program: 48 },
  { channel: 5, program: 11 },
  { channel: DRUM_CHANNEL, program: 0 },
];

export function initialSnapshot(): Snapshot {
  return {
    tracks: DEFAULTS.map(({ channel, program }) => ({
      channel,
      program,
      kit: "TR-808",
      volume: 100,
      play: true,
      octave: defaultOctave(program),
      notes: [],
      loading: false,
    })),
    armed: 0,
    transport: "stopped",
    loopLength: null,
    velocity: 100,
    held: [],
    canUndo: false,
    audio: false,
    midi: { status: "off", inputs: [] },
    notice: null,
  };
}

const clamp = (n: number, low: number, high: number) => Math.min(high, Math.max(low, n));

export class Looper {
  private state: Snapshot;
  private listeners = new Set<() => void>();
  private engine: Engine;

  /** When the loop's current run started (or would have), on the audio clock. */
  private loopStart = 0;
  private scheduledUntil = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private take: Take | null = null;

  /** Notes sounding from the keyboard, and how to let go of each. */
  private live = new Map<number, () => void>();
  private sustain = false;
  private sustained = new Set<number>();

  private undoStack: { notes: Note[][]; loopLength: number | null }[] = [];
  private noticeTimer: ReturnType<typeof setTimeout> | undefined;
  private saveTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    createEngine: (events: EngineEvents) => Engine,
    saved?: Partial<Snapshot> | null,
    private onSave?: (snapshot: Snapshot) => void,
  ) {
    this.state = { ...initialSnapshot(), ...saved };
    this.engine = createEngine({
      loading: (track, loading) => this.setTrack(track, { loading }, false),
      running: (audio) => this.set({ audio }, false),
    });
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.state;

  private set(patch: Partial<Snapshot>, save = true) {
    this.state = { ...this.state, ...patch };
    for (const listener of this.listeners) listener();
    if (save && this.onSave) {
      clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => this.onSave?.(this.state), 400);
    }
  }

  private setTrack(index: number, patch: Partial<Track>, save = true) {
    const tracks = this.state.tracks.slice();
    tracks[index] = { ...tracks[index], ...patch };
    this.set({ tracks }, save);
  }

  private notify(text: string) {
    clearTimeout(this.noticeTimer);
    this.set({ notice: text }, false);
    this.noticeTimer = setTimeout(() => this.set({ notice: null }, false), 4000);
  }

  /** Call on any click or key press: browsers only start audio from one. */
  wake() {
    this.engine.start();
    this.loadSounds();
  }

  /** Load sounds for the armed track and any track with something on it. */
  private loadSounds() {
    this.state.tracks.forEach((track, i) => {
      if (i === this.state.armed || track.notes.length) {
        this.engine.setSound(i, soundOf(track));
        this.engine.setVolume(i, track.volume);
      }
    });
  }

  // ---------- Track settings ----------

  get busy() {
    return this.state.transport === "waiting" || this.state.transport === "recording";
  }

  arm(index: number) {
    if (this.busy || index === this.state.armed) return;
    this.releaseAll();
    this.set({ armed: index });
    this.loadSounds();
  }

  setChannel(index: number, channel: number) {
    this.setTrack(index, { channel: clamp(Math.round(channel), 1, 16) });
    this.engine.stop(index);
    this.loadSounds();
  }

  /** Picking a category picks its first instrument, as the 2016 dropdowns did. */
  setCategory(index: number, category: number) {
    this.setProgram(index, clamp(category, 0, 15) * 8);
  }

  setProgram(index: number, program: number) {
    const track = this.state.tracks[index];
    const patch: Partial<Track> = { program };
    if (categoryOf(program) !== categoryOf(track.program)) patch.octave = defaultOctave(program);
    this.setTrack(index, patch);
    this.loadSounds();
  }

  setKit(index: number, kit: DrumKitId) {
    this.setTrack(index, { kit });
    this.loadSounds();
  }

  setVolume(index: number, volume: number) {
    this.setTrack(index, { volume: clamp(Math.round(volume), 0, 127) });
    this.engine.setVolume(index, this.state.tracks[index].volume);
  }

  setPlay(index: number, play: boolean) {
    this.setTrack(index, { play });
    if (!play) this.engine.stop(index);
  }

  shiftOctave(by: number) {
    const { armed, tracks } = this.state;
    this.releaseAll();
    this.setTrack(armed, { octave: clamp(tracks[armed].octave + by, 0, 8) });
  }

  shiftVelocity(by: number) {
    this.set({ velocity: clamp(this.state.velocity + by, 1, 127) });
  }

  // ---------- Playing ----------

  /** What the recording clock reads: the audio clock, less the trip to the speakers. */
  private recordTime() {
    return this.engine.now() - this.engine.latency();
  }

  noteOn(note: number, velocity = this.state.velocity) {
    if (note < 0 || note > 127) return;
    this.live.get(note)?.();
    this.live.set(note, this.engine.noteOn(this.state.armed, note, velocity));
    this.sustained.delete(note);
    const patch: Partial<Snapshot> = {
      held: this.state.held.includes(note) ? this.state.held : [...this.state.held, note],
    };
    if (this.take) {
      this.take.noteOn(this.recordTime(), note, velocity);
      if (this.state.transport === "waiting") patch.transport = "recording";
    }
    this.set(patch, false);
  }

  noteOff(note: number) {
    if (!this.live.has(note)) return;
    if (this.sustain) this.sustained.add(note);
    else this.release(note);
    this.set({ held: this.state.held.filter((n) => n !== note) }, false);
  }

  /** The sustain pedal: notes let go while it's down keep sounding until it comes up. */
  setSustain(down: boolean) {
    this.sustain = down;
    if (down) return;
    for (const note of this.sustained) this.release(note);
    this.sustained.clear();
  }

  private release(note: number) {
    this.live.get(note)?.();
    this.live.delete(note);
    const finished = this.take?.noteOff(this.recordTime(), note);
    // Overdubs go straight onto the track, so they play on the next pass round.
    if (finished && this.take?.loop) this.addNotes([finished]);
  }

  /** Let go of everything the keyboard is playing. */
  releaseAll() {
    for (const note of [...this.live.keys()]) this.release(note);
    this.sustained.clear();
    if (this.state.held.length) this.set({ held: [] }, false);
  }

  private addNotes(notes: Note[]) {
    if (!notes.length) return;
    const { armed, tracks } = this.state;
    this.setTrack(armed, { notes: [...tracks[armed].notes, ...notes] });
  }

  // ---------- Transport ----------

  /**
   * With no loop yet, Record waits for the first note and the take runs
   * until Play or Stop, which sets the loop's length. With a loop, Record
   * plays it and records over it, replacing whatever the armed track had.
   * Pressing Record again while recording is the same as Play.
   */
  record() {
    this.wake();
    if (this.busy) return this.play();
    const { armed, loopLength, transport } = this.state;
    this.pushUndo();
    this.engine.stop(armed);
    this.setTrack(armed, { notes: [], play: true });
    if (loopLength === null) {
      this.take = new Take(null);
      this.set({ transport: "waiting" });
      return;
    }
    if (transport !== "playing") this.startPlayback();
    this.take = new Take({ start: this.loopStart, length: loopLength });
    this.set({ transport: "recording" });
  }

  play() {
    this.wake();
    switch (this.state.transport) {
      case "waiting":
        return this.cancelTake();
      case "recording":
        return this.closeTake(true);
      case "stopped":
        if (this.state.loopLength === null) {
          return this.notify("Nothing to play yet. Press Record and play something first.");
        }
        return this.startPlayback();
    }
  }

  stop() {
    if (this.state.transport === "waiting") this.cancelTake();
    else if (this.state.transport === "recording") this.closeTake(false);
    this.stopPlayback();
    if (this.state.transport !== "stopped") this.set({ transport: "stopped" }, false);
  }

  /**
   * Space bar: Play, or Stop if the loop is already playing. While
   * recording that means keeping the take and playing on, which is what
   * you want in a looper far more often than stopping.
   */
  toggle() {
    if (this.state.transport === "playing") this.stop();
    else this.play();
  }

  private cancelTake() {
    this.take = null;
    this.undoStack.pop();
    this.set({ transport: "stopped", canUndo: this.undoStack.length > 0 }, false);
  }

  /** Finish the take. With keepPlaying the loop carries on; otherwise stop() takes it from here. */
  private closeTake(keepPlaying: boolean) {
    const take = this.take;
    if (!take) return;
    this.take = null;
    const { released, length } = take.close(this.recordTime());
    if (take.loop) {
      this.addNotes(released);
      if (keepPlaying) this.set({ transport: "playing" }, false);
      return;
    }
    if (length === null) {
      // Nothing usable, so nothing to undo either.
      this.undoStack.pop();
      this.set({ transport: "stopped", canUndo: this.undoStack.length > 0 }, false);
      this.notify(take.notes.length ? "That was too short to loop. Try a longer take." : "Nothing was recorded.");
      return;
    }
    this.setTrack(this.state.armed, { notes: take.notes });
    this.set({ loopLength: length });
    if (!keepPlaying) return;
    // Go straight back to the top, as if the loop had been running all along.
    const top = this.engine.now() + START_DELAY;
    this.loopStart = top - length;
    this.scheduledUntil = top;
    this.set({ transport: "playing" }, false);
    this.startTimer();
  }

  private startPlayback() {
    this.loopStart = this.engine.now() + START_DELAY;
    this.scheduledUntil = this.loopStart;
    this.set({ transport: "playing" }, false);
    this.startTimer();
  }

  private startTimer() {
    this.timer ??= setInterval(this.tick, TICK_MS);
    this.tick();
  }

  private stopPlayback() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.engine.stop();
  }

  /** Queue every note that falls in the next little window of time. */
  tick = () => {
    const length = this.state.loopLength;
    if (length === null || (this.state.transport !== "playing" && this.state.transport !== "recording")) return;
    const loop = { start: this.loopStart, length };
    const now = this.engine.now();
    const hidden = typeof document !== "undefined" && document.hidden;
    // If the tab was asleep, skip what's already late instead of playing it all at once.
    const from = Math.max(this.scheduledUntil, now);
    const to = now + (hidden ? HIDDEN_LOOKAHEAD : LOOKAHEAD);
    if (to <= from) return;
    this.state.tracks.forEach((track, i) => {
      if (!track.play || !this.engine.isReady(i)) return;
      for (const n of track.notes) {
        for (const time of occurrences(n.at, loop, from, to)) {
          this.engine.play(i, n.note, n.velocity, time, n.duration);
        }
      }
    });
    this.scheduledUntil = to;
  };

  /** Where the loop is now, 0–1, as heard through the speakers. */
  position() {
    const length = this.state.loopLength;
    if (length === null || this.state.transport === "stopped" || this.state.transport === "waiting") return null;
    const heard = this.engine.now() - this.engine.latency() - this.loopStart;
    return heard < 0 ? 0 : (heard % length) / length;
  }

  // ---------- Editing ----------

  private pushUndo() {
    this.undoStack.push({
      notes: this.state.tracks.map((t) => t.notes),
      loopLength: this.state.loopLength,
    });
    if (this.undoStack.length > MAX_UNDO) this.undoStack.shift();
    this.set({ canUndo: true }, false);
  }

  undo() {
    if (this.busy) return;
    const previous = this.undoStack.pop();
    if (!previous) return;
    if (previous.loopLength !== this.state.loopLength) this.stop();
    // Cut off whatever's ringing on the tracks that change, and leave the rest playing.
    this.state.tracks.forEach((t, i) => t.notes !== previous.notes[i] && this.engine.stop(i));
    this.set({
      tracks: this.state.tracks.map((t, i) => ({ ...t, notes: previous.notes[i] })),
      loopLength: previous.loopLength,
      canUndo: this.undoStack.length > 0,
    });
  }

  /** Empty the armed track. Emptying the last one clears the loop's length too. */
  clearTrack() {
    const { armed, tracks } = this.state;
    if (this.busy || !tracks[armed].notes.length) return;
    this.pushUndo();
    this.engine.stop(armed);
    this.setTrack(armed, { notes: [] });
    if (this.state.tracks.every((t) => !t.notes.length)) this.clearAll(false);
  }

  /** Start over with an empty loop. */
  clearAll(undoable = true) {
    if (this.busy) return;
    if (undoable && this.state.tracks.some((t) => t.notes.length)) this.pushUndo();
    this.stop();
    this.set({
      tracks: this.state.tracks.map((t) => ({ ...t, notes: [] })),
      loopLength: null,
    });
  }

  setMidi(midi: MidiState) {
    this.set({ midi }, false);
  }
}

// ---------- Saving the session ----------

const STORAGE_KEY = "qt-looper:session";

type SavedTrack = Omit<Track, "loading">;
type Saved = {
  version: 1;
  tracks: SavedTrack[];
  armed: number;
  loopLength: number | null;
  velocity: number;
};

const isNumber = (n: unknown, low: number, high: number): n is number =>
  typeof n === "number" && Number.isFinite(n) && n >= low && n <= high;

const isNote = (n: unknown): n is Note => {
  if (!n || typeof n !== "object") return false;
  const x = n as Record<string, unknown>;
  return (
    isNumber(x.at, 0, 3600) &&
    isNumber(x.note, 0, 127) &&
    isNumber(x.velocity, 0, 127) &&
    isNumber(x.duration, 0, 3600)
  );
};

/** Read back a saved session, keeping only what checks out. */
export function parseSaved(raw: unknown): Partial<Snapshot> | null {
  if (!raw || typeof raw !== "object") return null;
  const saved = raw as Partial<Saved>;
  if (saved.version !== 1 || !Array.isArray(saved.tracks) || saved.tracks.length !== TRACKS) return null;
  const defaults = initialSnapshot().tracks;
  const tracks = saved.tracks.map((t, i): Track => {
    const d = defaults[i];
    const x = (t ?? {}) as Partial<SavedTrack>;
    return {
      channel: isNumber(x.channel, 1, 16) ? Math.round(x.channel) : d.channel,
      program: isNumber(x.program, 0, 127) ? Math.round(x.program) : d.program,
      kit: isDrumKit(x.kit) ? x.kit : d.kit,
      volume: isNumber(x.volume, 0, 127) ? x.volume : d.volume,
      play: typeof x.play === "boolean" ? x.play : d.play,
      octave: isNumber(x.octave, 0, 8) ? Math.round(x.octave) : d.octave,
      notes: Array.isArray(x.notes) ? x.notes.filter(isNote) : [],
      loading: false,
    };
  });
  const hasNotes = tracks.some((t) => t.notes.length);
  const loopLength = hasNotes && isNumber(saved.loopLength, 0.25, 3600) ? saved.loopLength : null;
  return {
    tracks: loopLength ? tracks : tracks.map((t) => ({ ...t, notes: [] })),
    armed: isNumber(saved.armed, 0, TRACKS - 1) ? Math.round(saved.armed) : 0,
    loopLength,
    velocity: isNumber(saved.velocity, 1, 127) ? Math.round(saved.velocity) : 100,
  };
}

export function readSaved(): Partial<Snapshot> | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? parseSaved(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function writeSaved(snapshot: Snapshot) {
  const saved: Saved = {
    version: 1,
    tracks: snapshot.tracks.map(({ channel, program, kit, volume, play, octave, notes }) => ({
      channel,
      program,
      kit,
      volume,
      play,
      octave,
      notes,
    })),
    armed: snapshot.armed,
    loopLength: snapshot.loopLength,
    velocity: snapshot.velocity,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // Storage is full or blocked; the session just won't come back next time.
  }
}
