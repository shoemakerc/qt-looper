/*
 * Loop timing, separate from any audio so it can be tested. Times are seconds
 * on the audio clock. A loop is `length` seconds long and its first pass
 * began at `start`, so a note recorded `at` seconds in sounds at
 * start + at, start + at + length, start + at + 2·length, and so on.
 */

export type Note = {
  /** Seconds from the top of the loop. */
  at: number;
  /** MIDI note number. */
  note: number;
  velocity: number;
  /** Seconds the key was held. */
  duration: number;
};

export type Loop = { start: number; length: number };

/** Shortest loop worth keeping, so a stray double tap doesn't make a 50 ms loop. */
export const MIN_LOOP = 0.25;

/** Notes are at least this long, so a glancing tap still makes a sound. */
export const MIN_NOTE = 0.03;

/** Where `time` falls in the loop, from 0 up to (not including) its length. */
export function loopPosition(time: number, loop: Loop) {
  const position = (time - loop.start) % loop.length;
  return position < 0 ? position + loop.length : position;
}

/**
 * Every time in [from, to) that a note `at` seconds into the loop sounds.
 * The scheduler asks for back-to-back windows, so a note that lands exactly
 * on an edge belongs to the later window and is never played twice.
 */
export function occurrences(at: number, loop: Loop, from: number, to: number) {
  const times: number[] = [];
  // Start a pass early so floating-point rounding can't skip one.
  for (let pass = Math.ceil((from - loop.start - at) / loop.length) - 1; ; pass++) {
    const time = loop.start + at + pass * loop.length;
    if (time >= to) break;
    if (time >= from) times.push(time);
  }
  return times;
}

/**
 * One run of the Record button on one track.
 *
 * The first take has no loop to fit into yet. It starts with its first note
 * (the 2016 version did the same, by lining tracks up on their first note),
 * and the loop is however long the take runs. Every later take records into
 * the loop that's already playing, wrapping around at the end.
 */
export class Take {
  readonly notes: Note[] = [];
  private held = new Map<number, { time: number; velocity: number }>();
  /** When a first take's first note came in. */
  private firstNote: number | null = null;

  constructor(readonly loop: Loop | null) {}

  get started() {
    return this.loop !== null || this.firstNote !== null;
  }

  noteOn(time: number, note: number, velocity: number) {
    if (!this.loop && this.firstNote === null) this.firstNote = time;
    // Struck again without a release in between (MIDI allows it): end the first one.
    if (this.held.has(note)) this.noteOff(time, note);
    this.held.set(note, { time, velocity });
  }

  /** Returns the finished note, so an overdub can play it on the next pass. */
  noteOff(time: number, note: number): Note | undefined {
    const on = this.held.get(note);
    if (!on) return undefined;
    this.held.delete(note);
    const finished: Note = {
      at: this.loop ? loopPosition(on.time, this.loop) : on.time - (this.firstNote ?? on.time),
      note,
      velocity: on.velocity,
      duration: Math.max(time - on.time, MIN_NOTE),
    };
    if (this.loop) finished.duration = Math.min(finished.duration, this.loop.length);
    this.notes.push(finished);
    return finished;
  }

  /**
   * End the take at `time`, letting go of anything still held, and return
   * the notes that let go. For a first take this is also where the loop
   * ends: `length` is the new loop's length, or null if nothing was played
   * or the take was shorter than MIN_LOOP. Everything it recorded is in
   * `notes` either way.
   */
  close(time: number): { released: Note[]; length: number | null } {
    const released: Note[] = [];
    for (const note of [...this.held.keys()]) {
      const finished = this.noteOff(time, note);
      if (finished) released.push(finished);
    }
    if (this.loop) return { released, length: this.loop.length };
    const length = this.firstNote === null ? 0 : time - this.firstNote;
    if (length < MIN_LOOP) return { released, length: null };
    for (const note of this.notes) note.duration = Math.min(note.duration, length);
    return { released, length };
  }
}
