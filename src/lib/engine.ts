import { DrumMachine, SampleLoader, Soundfont } from "smplr";
import { drumSound, soundfontName } from "./gm";
import type { Engine, EngineEvents, Sound } from "./looper";

/*
 * Sound, by way of Web Audio and smplr. Each track gets its own instrument:
 * a General MIDI soundfont (MusyngKite, fetched from gleitz.github.io) or a
 * sampled drum machine (from smpldsnds.github.io). The 2016 version sent
 * MIDI to one General MIDI synth instead; this plays the same programs.
 */

type Instrument = ReturnType<typeof Soundfont> | ReturnType<typeof DrumMachine>;

type Slot = {
  /** The sound this track should have, once audio is running. */
  wanted: Sound | null;
  current: { key: string; instrument: Instrument; drums: string[] | null } | null;
  /** A sound that's still downloading. The current one keeps playing until it's ready. */
  loading: { key: string; instrument: Instrument } | null;
  volume: number;
};

const soundKey = (sound: Sound) =>
  sound.kind === "drums" ? `drums:${sound.kit}` : `program:${sound.program}`;

export class AudioEngine implements Engine {
  private context: AudioContext | null = null;
  private output: AudioNode | null = null;
  private analyser: AnalyserNode | null = null;
  private loader: SampleLoader | null = null;
  /** Set while a resume is under way, so the click that started audio can play a note too. */
  private resuming = false;
  private slots: Slot[];

  constructor(
    tracks: number,
    private events: EngineEvents,
  ) {
    this.slots = Array.from({ length: tracks }, () => ({
      wanted: null,
      current: null,
      loading: null,
      volume: 100,
    }));
  }

  get running() {
    return this.context?.state === "running";
  }

  start() {
    if (!this.context) {
      let context: AudioContext;
      try {
        context = new AudioContext({ latencyHint: "interactive" });
      } catch {
        return; // No Web Audio here; the looper still works, silently.
      }
      // A gentle limiter, so six tracks at full volume don't clip.
      const limiter = context.createDynamicsCompressor();
      limiter.threshold.value = -8;
      limiter.knee.value = 6;
      limiter.ratio.value = 12;
      limiter.attack.value = 0.003;
      limiter.release.value = 0.25;
      // The samples are mastered quietly (a piano note peaks around -23 dBFS
      // as is), so bring everything up and let the limiter catch the stacks.
      const master = context.createGain();
      master.gain.value = 1.5;
      master.connect(limiter).connect(context.destination);
      this.analyser = context.createAnalyser();
      limiter.connect(this.analyser);
      context.onstatechange = () => this.events.running(context.state === "running");
      this.context = context;
      this.output = master;
      this.loader = SampleLoader(context);
      this.slots.forEach((_, i) => this.load(i));
    }
    // Ask every time until it runs: a touch only counts once the finger
    // lifts, so the press that got here first may not be allowed yet.
    if (this.context.state !== "running") {
      this.resuming = true;
      const done = () => (this.resuming = false);
      this.context.resume().then(done, done);
    }
  }

  now() {
    return this.context?.currentTime ?? 0;
  }

  latency() {
    const c = this.context;
    return c ? (c.outputLatency || 0) + (c.baseLatency || 0) : 0;
  }

  /** Loudness of everything playing, 0–1. */
  level() {
    if (!this.analyser) return 0;
    const samples = new Float32Array(this.analyser.fftSize);
    this.analyser.getFloatTimeDomainData(samples);
    let sum = 0;
    for (const s of samples) sum += s * s;
    return Math.sqrt(sum / samples.length);
  }

  setSound(track: number, sound: Sound) {
    this.slots[track].wanted = sound;
    this.load(track);
  }

  private load(track: number) {
    const slot = this.slots[track];
    const { context, output, loader } = this;
    if (!slot.wanted || !context || !output || !loader) return;
    const key = soundKey(slot.wanted);
    if (slot.current?.key === key || slot.loading?.key === key) return;
    slot.loading?.instrument.dispose();
    const options = { destination: output, loader, volume: slot.volume };
    let instrument: Instrument;
    // A drum machine knows which sounds it has once it's loaded.
    let drumSounds: () => string[] | null;
    if (slot.wanted.kind === "drums") {
      const machine = DrumMachine(context, { ...options, instrument: slot.wanted.kit });
      instrument = machine;
      drumSounds = () => machine.getGroupNames();
    } else {
      instrument = Soundfont(context, {
        ...options,
        instrument: soundfontName(slot.wanted.program),
        // smplr's default is 5; this sits the instruments level with the drum machines.
        extraGain: 9,
      });
      drumSounds = () => null;
    }
    slot.loading = { key, instrument };
    this.events.loading(track, true);
    const done = (ok: boolean) => {
      if (slot.loading?.instrument !== instrument) return; // Replaced while it loaded.
      slot.loading = null;
      if (ok) {
        slot.current?.instrument.dispose();
        slot.current = { key, instrument, drums: drumSounds() };
        instrument.output.volume = slot.volume;
      } else {
        instrument.dispose();
      }
      this.events.loading(track, false);
    };
    instrument.ready.then(
      () => done(true),
      () => done(false),
    );
  }

  setVolume(track: number, volume: number) {
    const slot = this.slots[track];
    slot.volume = volume;
    if (slot.current) slot.current.instrument.output.volume = volume;
    if (slot.loading) slot.loading.instrument.output.volume = volume;
  }

  isReady(track: number) {
    return this.slots[track].current !== null;
  }

  play(track: number, note: number, velocity: number, time: number, duration: number) {
    const current = this.slots[track].current;
    if (!current) return;
    if (current.drums) {
      // Drum hits are one-shots: let them ring out however long the key was held.
      const sound = drumSound(note, current.drums);
      if (sound) current.instrument.start({ note: sound, velocity, time });
    } else {
      current.instrument.start({ note, velocity, time, duration });
    }
  }

  noteOn(track: number, note: number, velocity: number) {
    const current = this.slots[track].current;
    // While the clock is paused for a resume, a note started now waits the few
    // milliseconds until it runs. Without a resume coming, it would wait forever.
    if (!current || !(this.running || this.resuming)) return () => {};
    if (current.drums) {
      const sound = drumSound(note, current.drums);
      if (sound) current.instrument.start({ note: sound, velocity });
      return () => {};
    }
    const stop = current.instrument.start({ note, velocity });
    return () => stop();
  }

  stop(track?: number) {
    const slots = track === undefined ? this.slots : [this.slots[track]];
    for (const slot of slots) slot.current?.instrument.stop();
  }
}
