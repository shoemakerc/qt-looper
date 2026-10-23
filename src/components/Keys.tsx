"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import {
  DRUM_CHANNEL,
  DRUM_KEYS,
  DRUM_NAMES,
  KEY_LABELS,
  PIANO_KEYS,
  noteName,
  programLabel,
} from "@/lib/gm";
import { listenToPointer } from "@/lib/input";
import { soundName, type Track } from "@/lib/looper";
import { getLooper } from "@/lib/use-looper";

const WHITE = new Set([0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17]);
const whiteKeys = PIANO_KEYS.filter((k) => WHITE.has(k.offset));
const blackKeys = PIANO_KEYS.filter((k) => !WHITE.has(k.offset)).map((k) => ({
  ...k,
  // How many white keys sit to its left.
  after: whiteKeys.findIndex((w) => w.offset === k.offset - 1) + 1,
}));

/** Drum pads go where their keys are: the home row, with the row above tucked between. */
const homeRow = ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"];
const padPlace = (code: string) => {
  const home = homeRow.indexOf(code);
  if (home >= 0) return { row: 2, column: home * 2 + 1, order: home };
  const before = PIANO_KEYS.find((k) => k.code === code)!.offset - 1;
  const left = whiteKeys.findIndex((w) => w.offset === before);
  return { row: 1, column: left * 2 + 2, order: homeRow.length + left };
};

type Props = {
  track: Track;
  armed: number;
  held: number[];
  velocity: number;
};

export function Keys({ track, armed, held, velocity }: Props) {
  const keys = useRef<HTMLDivElement>(null);
  const drums = track.channel === DRUM_CHANNEL;
  const base = 12 * (track.octave + 1);

  useEffect(() => {
    const element = keys.current;
    if (element) return listenToPointer(element, getLooper());
  }, []);

  return (
    <section className="keys" aria-labelledby="keys-title">
      <div className="keys-head">
        <p className="meta" id="keys-title">
          Playing track {armed + 1} ·{" "}
          <span className="keys-sound">{drums ? soundName(track) : programLabel(track.program)}</span>
        </p>
        <div className="keys-controls">
          {!drums && (
            <Stepper
              label="Octave"
              value={`C${track.octave}`}
              keys="Z X"
              onDown={() => getLooper().shiftOctave(-1)}
              onUp={() => getLooper().shiftOctave(1)}
            />
          )}
          <Stepper
            label="Velocity"
            value={String(velocity)}
            keys="C V"
            onDown={() => getLooper().shiftVelocity(-10)}
            onUp={() => getLooper().shiftVelocity(10)}
          />
        </div>
      </div>

      {/* The computer keyboard plays these too, so they stay out of the tab order. */}
      <div
        ref={keys}
        className={`${drums ? "pads" : "piano"}${track.loading ? " is-loading" : ""}`}
        aria-hidden="true"
        data-loading={track.loading ? `Loading ${soundName(track)}…` : undefined}
      >
        {drums
          ? DRUM_KEYS.map(({ code, note }) => {
              const place = padPlace(code);
              const style = {
                "--row": place.row,
                "--column": place.column,
                "--order": place.order,
              } as CSSProperties;
              return (
                <div
                  key={code}
                  className={`pad${held.includes(note) ? " is-down" : ""}`}
                  data-note={note}
                  style={style}
                >
                  <span className="pad-name">{DRUM_NAMES[note]}</span>
                  <span className="key-letter">{KEY_LABELS[code]}</span>
                </div>
              );
            })
          : [
              ...whiteKeys.map(({ code, offset }, i) => {
                const note = base + offset;
                return (
                  <div
                    key={code}
                    className={`piano-key white${held.includes(note) ? " is-down" : ""}`}
                    data-note={note}
                    data-index={i}
                  >
                    {note % 12 === 0 && <span className="key-name">{noteName(note)}</span>}
                    <span className="key-letter">{KEY_LABELS[code]}</span>
                  </div>
                );
              }),
              ...blackKeys.map(({ code, offset, after }) => {
                const note = base + offset;
                return (
                  <div
                    key={code}
                    className={`piano-key black${held.includes(note) ? " is-down" : ""}`}
                    data-note={note}
                    data-after={after}
                    style={{ "--after": after } as CSSProperties}
                  >
                    <span className="key-letter">{KEY_LABELS[code]}</span>
                  </div>
                );
              }),
            ]}
      </div>
    </section>
  );
}

function Stepper(props: {
  label: string;
  value: string;
  keys: string;
  onDown: () => void;
  onUp: () => void;
}) {
  const [down, up] = props.keys.split(" ");
  return (
    <div className="stepper">
      <span className="meta">{props.label}</span>
      <button
        type="button"
        className="button button-icon"
        aria-label={`${props.label} down (${down})`}
        onClick={props.onDown}
      >
        −
      </button>
      <span className="stepper-value">{props.value}</span>
      <button
        type="button"
        className="button button-icon"
        aria-label={`${props.label} up (${up})`}
        onClick={props.onUp}
      >
        +
      </button>
    </div>
  );
}
