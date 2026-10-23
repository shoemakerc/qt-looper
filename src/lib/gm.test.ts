import { describe, expect, it } from "vitest";
import {
  CATEGORIES,
  DRUM_KEYS,
  DRUM_NAMES,
  PIANO_KEYS,
  drumSound,
  noteName,
  programLabel,
  soundfontName,
} from "./gm";

describe("General MIDI names", () => {
  it("has sixteen categories of eight", () => {
    expect(CATEGORIES).toHaveLength(16);
    expect(CATEGORIES.every((c) => c.instruments.length === 8)).toBe(true);
  });

  it("numbers programs the way the 2016 dropdowns did", () => {
    expect(programLabel(0)).toBe("0 Acoustic Grand Piano");
    expect(programLabel(33)).toBe("33 Electric Bass (finger)");
    expect(programLabel(127)).toBe("127 Gunshot");
  });

  it("lines programs up with the soundfont's files", () => {
    expect(soundfontName(0)).toBe("acoustic_grand_piano");
    expect(soundfontName(54)).toBe("synth_choir"); // GM's "Synth Voice"
    expect(soundfontName(87)).toBe("lead_8_bass__lead");
    expect(soundfontName(127)).toBe("gunshot");
  });

  it("names notes", () => {
    expect(noteName(60)).toBe("C4");
    expect(noteName(61)).toBe("C♯4");
    expect(noteName(36)).toBe("C2");
  });
});

describe("drum machines", () => {
  // Sound names from two of the machines, which spell them differently.
  const tr808 = ["clap", "clave", "cowbell", "cymbal", "hihat-close", "hihat-open", "kick", "maraca", "mid-tom", "rimshot", "snare", "tom-hi", "tom-low"];
  const lm2 = ["cabasa", "clap", "cowbell", "crash", "hhclosed", "hhopen", "kick", "kick-alt", "ride", "snare-m", "stick-m", "tambourine", "tom-h", "tom-l", "tom-m"];

  it("finds each machine's own name for a GM drum", () => {
    expect(drumSound(36, tr808)).toBe("kick");
    expect(drumSound(42, tr808)).toBe("hihat-close");
    expect(drumSound(42, lm2)).toBe("hhclosed");
    expect(drumSound(35, lm2)).toBe("kick-alt");
    expect(drumSound(38, lm2)).toBe("snare-m");
    expect(drumSound(49, tr808)).toBe("cymbal");
    expect(drumSound(49, lm2)).toBe("crash");
  });

  it("stays quiet for drums a machine doesn't have", () => {
    expect(drumSound(81, tr808)).toBeUndefined();
    expect(drumSound(54, ["kick"])).toBeUndefined();
  });

  it("puts a named drum on every drum key", () => {
    for (const { note } of DRUM_KEYS) expect(DRUM_NAMES[note]).toBeDefined();
    expect(drumSound(36, tr808)).toBeDefined();
  });
});

describe("computer keys", () => {
  it("covers an octave and a half with no gaps", () => {
    expect(PIANO_KEYS.map((k) => k.offset)).toEqual([...Array(18).keys()]);
  });

  it("uses the same keys for drums", () => {
    const pianoCodes = new Set(PIANO_KEYS.map((k) => k.code));
    expect(DRUM_KEYS.every((k) => pianoCodes.has(k.code))).toBe(true);
  });
});
