import { beforeEach, describe, expect, it, vi } from "vitest";
import { Looper, initialSnapshot, parseSaved, type Engine } from "./looper";

/** An engine with a hand-cranked clock that writes down what it was asked to play. */
class FakeEngine implements Engine {
  running = true;
  time = 0;
  lag = 0;
  played: { track: number; note: number; time: number; duration: number }[] = [];
  stopped: (number | undefined)[] = [];
  start() {}
  now() {
    return this.time;
  }
  latency() {
    return this.lag;
  }
  setSound() {}
  setVolume() {}
  isReady() {
    return true;
  }
  play(track: number, note: number, _velocity: number, time: number, duration: number) {
    this.played.push({ track, note, time: Math.round(time * 1000) / 1000, duration });
  }
  noteOn() {
    return () => {};
  }
  stop(track?: number) {
    this.stopped.push(track);
  }
}

let engine: FakeEngine;
let looper: Looper;
const state = () => looper.getSnapshot();

/** Move the clock forward, ticking the scheduler the way setInterval would. */
function runTo(time: number) {
  while (engine.time < time - 1e-9) {
    engine.time = Math.min(time, engine.time + 0.025);
    looper.tick();
  }
}

function at(time: number, action: () => void) {
  engine.time = time;
  action();
}

/** Record C then E on track 1, making a 2-second loop, and keep it playing. */
function recordFirstLoop() {
  at(10, () => looper.record());
  at(10.5, () => looper.noteOn(60, 100));
  at(11, () => looper.noteOff(60));
  at(11.5, () => looper.noteOn(64, 90));
  at(11.8, () => looper.noteOff(64));
  at(12.5, () => looper.play());
}

beforeEach(() => {
  vi.useFakeTimers();
  engine = new FakeEngine();
  looper = new Looper(() => engine);
});

describe("the first take", () => {
  it("waits for the first note, then sets the loop when Play is pressed", () => {
    at(10, () => looper.record());
    expect(state().transport).toBe("waiting");
    at(10.5, () => looper.noteOn(60, 100));
    expect(state().transport).toBe("recording");
    at(11, () => looper.noteOff(60));
    at(11.5, () => looper.noteOn(64, 90));
    at(11.8, () => looper.noteOff(64));
    at(12.5, () => looper.play());

    expect(state().transport).toBe("playing");
    expect(state().loopLength).toBeCloseTo(2);
    const notes = state().tracks[0].notes;
    expect(notes.map((n) => n.note)).toEqual([60, 64]);
    expect(notes[0].at).toBeCloseTo(0);
    expect(notes[1].at).toBeCloseTo(1);
    expect(notes[1].duration).toBeCloseTo(0.3);
  });

  it("goes straight back to the top and loops every pass", () => {
    recordFirstLoop();
    runTo(17);
    expect(engine.played.map((p) => [p.note, p.time])).toEqual([
      [60, 12.56],
      [64, 13.56],
      [60, 14.56],
      [64, 15.56],
      [60, 16.56],
    ]);
  });

  it("loops the take on Space, and Space again stops", () => {
    at(1, () => looper.record());
    at(1.2, () => looper.noteOn(60, 100));
    at(1.5, () => looper.noteOff(60));
    at(2.2, () => looper.toggle());
    expect(state().transport).toBe("playing");
    expect(state().loopLength).toBeCloseTo(1);
    at(3, () => looper.toggle());
    expect(state().transport).toBe("stopped");
  });

  it("can end with Stop instead, keeping the loop", () => {
    at(1, () => looper.record());
    at(1.2, () => looper.noteOn(60, 100));
    at(2.2, () => looper.stop());
    expect(state().transport).toBe("stopped");
    expect(state().loopLength).toBeCloseTo(1);
    expect(state().tracks[0].notes[0].duration).toBeCloseTo(1);
  });

  it("drops a take too short to loop, and says so", () => {
    at(1, () => looper.record());
    at(1.1, () => looper.noteOn(60, 100));
    at(1.2, () => looper.play());
    expect(state().loopLength).toBeNull();
    expect(state().transport).toBe("stopped");
    expect(state().notice).toMatch(/too short/);
    expect(state().canUndo).toBe(false);
  });

  it("cancels cleanly if nothing was played", () => {
    at(1, () => looper.record());
    at(2, () => looper.stop());
    expect(state().transport).toBe("stopped");
    expect(state().canUndo).toBe(false);
  });

  it("holds notes under the sustain pedal", () => {
    at(1, () => looper.record());
    at(1, () => looper.noteOn(60, 100));
    at(1.1, () => looper.setSustain(true));
    at(1.2, () => looper.noteOff(60));
    at(1.5, () => looper.setSustain(false));
    at(2, () => looper.stop());
    expect(state().tracks[0].notes[0].duration).toBeCloseTo(0.5);
  });
});

describe("overdubs", () => {
  it("record into the playing loop and play back on the next pass", () => {
    recordFirstLoop();
    runTo(13);
    looper.arm(1);
    at(13, () => looper.record());
    expect(state().transport).toBe("recording");
    // The loop's top was 10.56, so 13.2 is 0.64 s into a pass.
    at(13.2, () => looper.noteOn(40, 100));
    at(13.4, () => looper.noteOff(40));
    expect(state().tracks[1].notes).toHaveLength(1);
    expect(state().tracks[1].notes[0].at).toBeCloseTo(0.64);

    engine.played = [];
    runTo(15.5);
    expect(engine.played.filter((p) => p.track === 1).map((p) => p.time)).toEqual([15.2]);
  });

  it("wrap a held note round the end of the loop", () => {
    recordFirstLoop();
    looper.arm(1);
    at(13, () => looper.record());
    at(14.5, () => looper.noteOn(43, 100)); // 1.94 s in
    at(14.7, () => looper.play());
    const note = state().tracks[1].notes[0];
    expect(note.at).toBeCloseTo(1.94);
    expect(note.duration).toBeCloseTo(0.2);
    expect(state().transport).toBe("playing");
  });

  it("line up with what you heard, allowing for the speakers' delay", () => {
    recordFirstLoop();
    engine.lag = 0.1;
    looper.arm(1);
    at(13, () => looper.record());
    at(13.2, () => looper.noteOn(40, 100));
    at(13.3, () => looper.noteOff(40));
    expect(state().tracks[1].notes[0].at).toBeCloseTo(0.54);
  });

  it("replace what was on the track", () => {
    recordFirstLoop();
    at(13, () => looper.record()); // still track 1
    expect(state().tracks[0].notes).toEqual([]);
    at(13.1, () => looper.noteOn(72, 100));
    at(13.2, () => looper.noteOff(72));
    at(13.5, () => looper.stop());
    expect(state().tracks[0].notes.map((n) => n.note)).toEqual([72]);
    expect(state().transport).toBe("stopped");
  });

  it("start the loop from the top if it was stopped", () => {
    recordFirstLoop();
    at(13, () => looper.stop());
    looper.arm(5);
    at(20, () => looper.record());
    expect(state().transport).toBe("recording");
    at(20.06, () => looper.noteOn(36, 100)); // right on the top
    at(20.1, () => looper.noteOff(36));
    expect(state().tracks[5].notes[0].at).toBeCloseTo(0);
  });
});

describe("the mix", () => {
  it("leaves out tracks whose Play box is off", () => {
    recordFirstLoop();
    looper.setPlay(0, false);
    engine.played = [];
    runTo(16);
    expect(engine.played).toEqual([]);
    expect(engine.stopped).toContain(0);
  });

  it("won't switch tracks in the middle of a take", () => {
    at(1, () => looper.record());
    looper.arm(3);
    expect(state().armed).toBe(0);
  });
});

describe("undo and clearing", () => {
  it("undoes takes one at a time, back to no loop at all", () => {
    recordFirstLoop();
    looper.arm(1);
    at(13, () => looper.record());
    at(13.2, () => looper.noteOn(40, 100));
    at(13.4, () => looper.noteOff(40));
    at(13.5, () => looper.play());

    looper.undo();
    expect(state().tracks[1].notes).toEqual([]);
    expect(state().tracks[0].notes).toHaveLength(2);
    expect(state().transport).toBe("playing");

    looper.undo();
    expect(state().tracks[0].notes).toEqual([]);
    expect(state().loopLength).toBeNull();
    expect(state().transport).toBe("stopped");
    expect(state().canUndo).toBe(false);
  });

  it("clears the loop once the last track is emptied", () => {
    recordFirstLoop();
    looper.clearTrack();
    expect(state().loopLength).toBeNull();
    expect(state().transport).toBe("stopped");
    looper.undo();
    expect(state().loopLength).toBeCloseTo(2);
  });

  it("starts over with Clear all", () => {
    recordFirstLoop();
    looper.clearAll();
    expect(state().tracks.every((t) => t.notes.length === 0)).toBe(true);
    expect(state().loopLength).toBeNull();
  });
});

describe("track settings", () => {
  it("picks a category's first instrument and an octave to suit it", () => {
    looper.setCategory(0, 4); // Bass
    expect(state().tracks[0].program).toBe(32);
    expect(state().tracks[0].octave).toBe(2);
    looper.setProgram(0, 38); // Synth Bass 1: same category, octave stays
    looper.shiftOctave(1);
    looper.setProgram(0, 39);
    expect(state().tracks[0].octave).toBe(3);
  });

  it("keeps numbers in range", () => {
    looper.setVolume(0, 300);
    looper.setChannel(0, 0);
    for (let i = 0; i < 20; i++) looper.shiftVelocity(10);
    expect(state().tracks[0].volume).toBe(127);
    expect(state().tracks[0].channel).toBe(1);
    expect(state().velocity).toBe(127);
  });
});

describe("saved sessions", () => {
  it("round-trips a session and drops anything malformed", () => {
    const tracks = initialSnapshot().tracks.map((t) => ({ ...t }));
    tracks[0] = { ...tracks[0], volume: 80, notes: [{ at: 0, note: 60, velocity: 100, duration: 0.5 }] };
    tracks[1] = { ...tracks[1], notes: [{ at: 0, note: 999, velocity: 100, duration: 1 }] as never };
    const restored = parseSaved({ version: 1, tracks, armed: 2, loopLength: 2, velocity: 90 });
    expect(restored?.armed).toBe(2);
    expect(restored?.loopLength).toBe(2);
    expect(restored?.tracks?.[0].volume).toBe(80);
    expect(restored?.tracks?.[0].notes).toHaveLength(1);
    expect(restored?.tracks?.[1].notes).toEqual([]);
  });

  it("ignores something that isn't a session", () => {
    expect(parseSaved(null)).toBeNull();
    expect(parseSaved({ version: 2 })).toBeNull();
    expect(parseSaved({ version: 1, tracks: [] })).toBeNull();
  });
});
