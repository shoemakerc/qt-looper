import { useSyncExternalStore } from "react";
import { AudioEngine } from "./engine";
import { Looper, TRACKS, initialSnapshot, readSaved, writeSaved } from "./looper";

let engine: AudioEngine | null = null;
let looper: Looper | null = null;

/** The page's one looper, made the first time something in the browser asks for it. */
export function getLooper() {
  looper ??= new Looper(
    (events) => (engine = new AudioEngine(TRACKS, events)),
    readSaved(),
    writeSaved,
  );
  return looper;
}

/** For poking at from the console while developing: __looper.engine.level() */
export function exposeForDebugging() {
  if (process.env.NODE_ENV === "production") return;
  Object.assign(window, { __looper: { looper: getLooper(), engine } });
}

const serverSnapshot = initialSnapshot();
const subscribe = (listener: () => void) => getLooper().subscribe(listener);
const getSnapshot = () => getLooper().getSnapshot();
const getServerSnapshot = () => serverSnapshot;

export function useLooper() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
