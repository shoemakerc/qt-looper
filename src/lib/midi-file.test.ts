import { describe, expect, it } from "vitest";
import { initialSnapshot } from "./looper";
import { midiFile, varLen } from "./midi-file";

const text = (bytes: Uint8Array, start: number, length: number) =>
  String.fromCharCode(...bytes.slice(start, start + length));

/** Split a file into its chunks: [type, data]. */
function chunks(bytes: Uint8Array) {
  const out: [string, Uint8Array][] = [];
  for (let i = 0; i < bytes.length; ) {
    const length = (bytes[i + 4] << 24) | (bytes[i + 5] << 16) | (bytes[i + 6] << 8) | bytes[i + 7];
    out.push([text(bytes, i, 4), bytes.slice(i + 8, i + 8 + length)]);
    i += 8 + length;
  }
  return out;
}

const indexOf = (data: Uint8Array, sequence: number[]) =>
  data.findIndex((_, i) => sequence.every((b, j) => data[i + j] === b));

describe("varLen", () => {
  it("encodes MIDI's variable-length numbers", () => {
    expect(varLen(0)).toEqual([0]);
    expect(varLen(0x7f)).toEqual([0x7f]);
    expect(varLen(0x80)).toEqual([0x81, 0x00]);
    expect(varLen(0x3fff)).toEqual([0xff, 0x7f]);
    expect(varLen(0x200000)).toEqual([0x81, 0x80, 0x80, 0x00]);
  });
});

describe("midiFile", () => {
  const tracks = initialSnapshot().tracks;
  tracks[1] = { ...tracks[1], notes: [{ at: 0.5, note: 40, velocity: 100, duration: 0.25 }] };
  tracks[5] = { ...tracks[5], notes: [{ at: 0, note: 36, velocity: 110, duration: 0.1 }] };
  const bytes = midiFile(tracks, 2);
  const parts = chunks(bytes);

  it("writes a type 1 file with a track per recorded track, plus tempo", () => {
    expect(parts[0][0]).toBe("MThd");
    expect([...parts[0][1]]).toEqual([0, 1, 0, 3, 0x01, 0xe0]);
    expect(parts.slice(1).map(([type]) => type)).toEqual(["MTrk", "MTrk", "MTrk"]);
  });

  it("keeps each track's channel and program", () => {
    const bass = parts[2][1];
    // Delta 0, then a track-name meta event: FF 03, its length, the name.
    expect(text(bass, 4, bass[3])).toBe("Track 2: Electric Bass (finger)");
    expect(indexOf(bass, [0xc1, 33])).toBeGreaterThan(-1); // program change, channel 2
    // Half a second in at 120 bpm is a beat: 480 ticks, written as 0x83 0x60.
    expect(indexOf(bass, [0x83, 0x60, 0x91, 40, 100])).toBeGreaterThan(-1);
    expect(indexOf(bass, [0x81, 0x70, 0x81, 40, 0])).toBeGreaterThan(-1); // off 240 ticks later
  });

  it("puts drums on channel 10 without a program change", () => {
    const drums = parts[3][1];
    expect(indexOf(drums, [0x00, 0x99, 36, 110])).toBeGreaterThan(-1);
    expect(drums.some((b) => (b & 0xf0) === 0xc0)).toBe(false);
  });

  it("ends every track at the end of the loop", () => {
    for (const [, data] of parts.slice(1)) {
      expect([...data.slice(-3)]).toEqual([0xff, 0x2f, 0]);
    }
  });
});
