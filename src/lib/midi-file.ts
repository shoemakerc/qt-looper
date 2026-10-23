import { DRUM_CHANNEL, programName } from "./gm";
import type { Track } from "./looper";

/*
 * The loop as a Standard MIDI File, to carry on with in GarageBand, Logic or
 * anything else. Each track keeps its channel and General MIDI program, so
 * the Channel column means what it did in 2016. The loop is free time, not
 * bars, so the file runs at 120 bpm and one second is two beats.
 */

const PPQ = 480; // ticks per beat
const TEMPO = 500_000; // microseconds per beat: 120 bpm
const ticks = (seconds: number) => Math.round(((seconds * 1_000_000) / TEMPO) * PPQ);

/** MIDI's variable-length numbers: seven bits a byte, high bit set on all but the last. */
export function varLen(n: number) {
  const bytes = [n & 0x7f];
  for (n >>= 7; n > 0; n >>= 7) bytes.unshift((n & 0x7f) | 0x80);
  return bytes;
}

const ascii = (text: string) => [...text].map((c) => c.charCodeAt(0) & 0x7f);
const uint32 = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
const chunk = (type: string, data: number[]) => [...ascii(type), ...uint32(data.length), ...data];
const trackName = (name: string) => [0, 0xff, 0x03, ...varLen(name.length), ...ascii(name)];

export function midiFile(tracks: Track[], loopLength: number) {
  const end = ticks(loopLength);
  const conductor = [
    ...trackName("Qt-Looper"),
    ...[0, 0xff, 0x51, 3, (TEMPO >> 16) & 255, (TEMPO >> 8) & 255, TEMPO & 255],
    ...[0, 0xff, 0x58, 4, 4, 2, 24, 8], // 4/4
    ...varLen(end),
    ...[0xff, 0x2f, 0],
  ];
  const chunks = [conductor];

  tracks.forEach((track, i) => {
    if (!track.notes.length) return;
    const channel = track.channel - 1;
    const drums = track.channel === DRUM_CHANNEL;
    const events: { tick: number; bytes: number[] }[] = [];
    for (const n of track.notes) {
      const on = ticks(n.at);
      // Anything still ringing at the end of the loop is cut there.
      const off = Math.max(Math.min(ticks(n.at + n.duration), end), on + 1);
      events.push({ tick: on, bytes: [0x90 | channel, n.note, Math.max(1, Math.round(n.velocity))] });
      events.push({ tick: off, bytes: [0x80 | channel, n.note, 0] });
    }
    // Note-offs first when they land together, so a repeated note isn't cut short.
    events.sort((a, b) => a.tick - b.tick || (a.bytes[0] & 0xf0) - (b.bytes[0] & 0xf0));

    // Plain ASCII: MIDI text has no agreed encoding, so "·" would come out garbled.
    const data = trackName(`Track ${i + 1}: ${drums ? "Drums" : programName(track.program)}`);
    if (!drums) data.push(0, 0xc0 | channel, track.program);
    data.push(0, 0xb0 | channel, 7, track.volume);
    let last = 0;
    for (const event of events) {
      data.push(...varLen(event.tick - last), ...event.bytes);
      last = event.tick;
    }
    data.push(...varLen(Math.max(end - last, 0)), 0xff, 0x2f, 0);
    chunks.push(data);
  });

  const header = chunk("MThd", [0, 1, 0, chunks.length, PPQ >> 8, PPQ & 255]);
  return new Uint8Array([...header, ...chunks.flatMap((data) => chunk("MTrk", data))]);
}
