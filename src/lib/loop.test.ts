import { describe, expect, it } from "vitest";
import { MIN_LOOP, Take, loopPosition, occurrences } from "./loop";

const loop = { start: 10, length: 2 };

describe("loopPosition", () => {
  it("wraps time into the loop", () => {
    expect(loopPosition(10, loop)).toBe(0);
    expect(loopPosition(11.5, loop)).toBeCloseTo(1.5);
    expect(loopPosition(12.25, loop)).toBeCloseTo(0.25);
  });

  it("works before the loop's start too", () => {
    expect(loopPosition(9.5, loop)).toBeCloseTo(1.5);
  });
});

describe("occurrences", () => {
  it("finds every pass of a note inside a window", () => {
    expect(occurrences(0.5, loop, 10, 16)).toEqual([10.5, 12.5, 14.5]);
  });

  it("plays each pass exactly once across back-to-back windows", () => {
    const times: number[] = [];
    // Awkward window edges, like a real scheduler's.
    for (let from = 9.7; from < 20; from += 0.0371) {
      times.push(...occurrences(0, loop, from, from + 0.0371));
      times.push(...occurrences(1.3, loop, from, from + 0.0371));
    }
    const rounded = times.map((t) => Math.round(t * 1000) / 1000);
    // The last window runs just past 20, so it catches that pass too.
    expect(rounded).toEqual([10, 11.3, 12, 13.3, 14, 15.3, 16, 17.3, 18, 19.3, 20]);
  });

  it("includes a note on the window's start and leaves one on its end", () => {
    expect(occurrences(0, loop, 12, 14)).toEqual([12]);
  });

  it("handles passes from before the window started", () => {
    expect(occurrences(1, { start: 0, length: 2 }, 100, 104)).toEqual([101, 103]);
  });
});

describe("Take", () => {
  it("starts a first take on its first note and ends the loop when it closes", () => {
    const take = new Take(null);
    expect(take.started).toBe(false);
    take.noteOn(5, 60, 100);
    expect(take.started).toBe(true);
    take.noteOff(5.5, 60);
    take.noteOn(6, 64, 80);
    take.noteOff(6.25, 64);
    const { length } = take.close(7);
    expect(length).toBeCloseTo(2);
    expect(take.notes).toEqual([
      { at: 0, note: 60, velocity: 100, duration: 0.5 },
      { at: 1, note: 64, velocity: 80, duration: 0.25 },
    ]);
  });

  it("lets go of held notes at the end of the take", () => {
    const take = new Take(null);
    take.noteOn(1, 60, 100);
    take.noteOn(2, 67, 100);
    const { released, length } = take.close(3);
    expect(length).toBeCloseTo(2);
    expect(released.map((n) => [n.note, n.duration])).toEqual([
      [60, 2],
      [67, 1],
    ]);
  });

  it("makes no loop from nothing, or from a take too short to loop", () => {
    expect(new Take(null).close(5).length).toBeNull();
    const quick = new Take(null);
    quick.noteOn(1, 60, 100);
    expect(quick.close(1 + MIN_LOOP / 2).length).toBeNull();
  });

  it("records an overdub into the loop, wrapping at the end", () => {
    const take = new Take(loop);
    take.noteOn(11.5, 60, 100);
    expect(take.noteOff(11.75, 60)).toEqual({ at: 1.5, note: 60, velocity: 100, duration: 0.25 });
    take.noteOn(13.9, 62, 90); // 1.9 s into the second pass
    const { released, length } = take.close(14.3);
    expect(length).toBe(2);
    expect(released).toHaveLength(1);
    expect(released[0].at).toBeCloseTo(1.9);
    expect(released[0].duration).toBeCloseTo(0.4);
  });

  it("never lets a note outlast the loop", () => {
    const take = new Take(loop);
    take.noteOn(10, 48, 100);
    expect(take.noteOff(17, 48)?.duration).toBe(2);
  });

  it("ends a note struck again without a release", () => {
    const take = new Take(null);
    take.noteOn(1, 60, 100);
    take.noteOn(1.5, 60, 70);
    take.close(2);
    expect(take.notes.map((n) => [n.at, n.duration, n.velocity])).toEqual([
      [0, 0.5, 100],
      [0.5, 0.5, 70],
    ]);
  });
});
