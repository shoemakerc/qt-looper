import { DRUM_CHANNEL, DRUM_KEYS, PIANO_KEYS } from "./gm";
import type { Looper } from "./looper";

/*
 * The three ways in: the computer keyboard, the on-screen keys, and a MIDI
 * keyboard through Web MIDI (Chrome, Edge and Firefox; Safari has none).
 */

/** The note a computer key plays on the armed track, if it plays one. */
export function keyNote(looper: Looper, code: string): number | undefined {
  const { tracks, armed } = looper.getSnapshot();
  const track = tracks[armed];
  if (track.channel === DRUM_CHANNEL) return DRUM_KEYS.find((k) => k.code === code)?.note;
  const key = PIANO_KEYS.find((k) => k.code === code);
  return key && 12 * (track.octave + 1) + key.offset;
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLInputElement &&
      !["checkbox", "radio", "range", "button"].includes(target.type)));

/** Space already does something on these, so leave it alone. */
const isPressable = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  target.matches("button, select, a[href], summary, input[type=checkbox], input[type=radio]");

export function listenToKeyboard(looper: Looper) {
  // Which note each held key started, so letting go ends the right one
  // even if the octave changed in between.
  const down = new Map<string, number>();

  const onKeyDown = (event: KeyboardEvent) => {
    if (isTyping(event.target)) return;
    if (event.metaKey || event.ctrlKey) {
      if (event.code === "KeyZ" && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        looper.undo();
      }
      return;
    }
    if (event.altKey) return;

    const note = keyNote(looper, event.code);
    if (note !== undefined) {
      // Also stops a focused dropdown from jumping to whatever starts with that letter.
      event.preventDefault();
      if (event.repeat || down.has(event.code)) return;
      looper.wake();
      down.set(event.code, note);
      looper.noteOn(note);
      return;
    }
    if (event.repeat) return;

    switch (event.code) {
      case "KeyZ":
        looper.shiftOctave(-1);
        break;
      case "KeyX":
        looper.shiftOctave(1);
        break;
      case "KeyC":
        looper.shiftVelocity(-10);
        break;
      case "KeyV":
        looper.shiftVelocity(10);
        break;
      case "KeyR":
        looper.record();
        break;
      case "Escape":
        looper.stop();
        break;
      case "Space":
        if (isPressable(event.target)) return;
        looper.wake();
        looper.toggle();
        break;
      default: {
        const digit = /^Digit([1-6])$/.exec(event.code);
        if (!digit) return;
        looper.arm(Number(digit[1]) - 1);
      }
    }
    event.preventDefault();
  };

  const onKeyUp = (event: KeyboardEvent) => {
    const note = down.get(event.code);
    if (note === undefined) return;
    down.delete(event.code);
    looper.noteOff(note);
  };

  // Keys let go while the window isn't looking never send a keyup.
  const letGo = () => {
    for (const note of down.values()) looper.noteOff(note);
    down.clear();
  };
  const onVisibility = () => document.hidden && letGo();

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", letGo);
  document.addEventListener("visibilitychange", onVisibility);
  return () => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("blur", letGo);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}

/**
 * On-screen keys (anything inside `element` with a data-note). Press, slide
 * across to play the next key, let go. Each finger plays its own note.
 */
export function listenToPointer(element: HTMLElement, looper: Looper) {
  const playing = new Map<number, number | null>(); // pointer → note under it

  const noteAt = (x: number, y: number) => {
    const key = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-note]");
    return key && element.contains(key) ? Number(key.dataset.note) : null;
  };

  const press = (pointer: number, note: number | null) => {
    const previous = playing.get(pointer);
    if (previous === note) return;
    if (previous != null) looper.noteOff(previous);
    if (note !== null) looper.noteOn(note);
    playing.set(pointer, note);
  };

  const onDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    const note = noteAt(event.clientX, event.clientY);
    if (note === null) return;
    event.preventDefault();
    looper.wake();
    press(event.pointerId, note);
    // Keep getting this pointer's moves even once it leaves the key it started on.
    try {
      element.setPointerCapture(event.pointerId);
    } catch {
      // Not a live pointer (a synthetic event); the note still plays.
    }
  };

  const onMove = (event: PointerEvent) => {
    if (playing.has(event.pointerId)) press(event.pointerId, noteAt(event.clientX, event.clientY));
  };

  const onUp = (event: PointerEvent) => {
    if (!playing.has(event.pointerId)) return;
    press(event.pointerId, null);
    playing.delete(event.pointerId);
  };

  element.addEventListener("pointerdown", onDown);
  element.addEventListener("pointermove", onMove);
  element.addEventListener("pointerup", onUp);
  element.addEventListener("pointercancel", onUp);
  element.addEventListener("lostpointercapture", onUp);
  return () => {
    element.removeEventListener("pointerdown", onDown);
    element.removeEventListener("pointermove", onMove);
    element.removeEventListener("pointerup", onUp);
    element.removeEventListener("pointercancel", onUp);
    element.removeEventListener("lostpointercapture", onUp);
  };
}

export const hasWebMidi = () => typeof navigator !== "undefined" && "requestMIDIAccess" in navigator;

/** Listen to every connected MIDI keyboard. Asks for permission the first time. */
export async function connectMidi(looper: Looper, { quiet = false } = {}) {
  if (!hasWebMidi()) {
    looper.setMidi({ status: "unsupported", inputs: [] });
    return;
  }
  looper.setMidi({ status: "connecting", inputs: [] });
  let access: MIDIAccess;
  try {
    access = await navigator.requestMIDIAccess();
  } catch {
    looper.setMidi({ status: quiet ? "off" : "denied", inputs: [] });
    return;
  }

  const onMessage = (event: MIDIMessageEvent) => {
    const data = event.data;
    if (!data || data.length < 2) return;
    const [status, a, b = 0] = data;
    const type = status & 0xf0;
    // Any channel goes to the armed track. A note-on at velocity 0 is how a
    // lot of keyboards say note-off; the 2016 version turned those into
    // stuck notes.
    if (type === 0x90 && b > 0) looper.noteOn(a, b);
    else if (type === 0x80 || type === 0x90) looper.noteOff(a);
    else if (type === 0xb0 && a === 64) looper.setSustain(b >= 64);
    else if (type === 0xb0 && (a === 120 || a === 123)) looper.releaseAll();
  };

  const update = () => {
    const inputs = [...access.inputs.values()].filter((input) => input.state === "connected");
    for (const input of inputs) input.onmidimessage = onMessage;
    looper.setMidi({ status: "on", inputs: inputs.map((input) => input.name || "MIDI keyboard") });
  };
  access.onstatechange = update;
  update();
}

/** Connect without asking if this site already has MIDI permission. */
export async function reconnectMidi(looper: Looper) {
  if (!hasWebMidi() || !navigator.permissions) return;
  try {
    const permission = await navigator.permissions.query({ name: "midi" as PermissionName });
    if (permission.state === "granted") await connectMidi(looper, { quiet: true });
  } catch {
    // This browser can't say; wait for the button.
  }
}
