"use client";

import { useEffect, useRef } from "react";
import type { Track, Transport } from "@/lib/looper";
import { getLooper } from "@/lib/use-looper";

type Props = {
  tracks: Track[];
  armed: number;
  loopLength: number | null;
  transport: Transport;
};

/** A strip per track showing where its notes fall in the loop, with a playhead. */
export function LoopView({ tracks, armed, loopLength, transport }: Props) {
  const playhead = useRef<HTMLDivElement>(null);
  const moving = loopLength !== null && (transport === "playing" || transport === "recording");

  useEffect(() => {
    const head = playhead.current;
    if (!head || !moving) return;
    // Straight to the DOM every frame, rather than through React state.
    let frame = requestAnimationFrame(function draw() {
      head.style.transform = `translateX(${(getLooper().position() ?? 0) * 100}%)`;
      frame = requestAnimationFrame(draw);
    });
    return () => cancelAnimationFrame(frame);
  }, [moving]);

  let empty: string | null = null;
  if (transport === "waiting") empty = "Waiting for the first note";
  else if (transport === "recording" && loopLength === null) empty = "Recording the first take";
  else if (loopLength === null) empty = "No loop yet. The first take you record sets its length.";

  return (
    <div className="loop" aria-hidden="true">
      <div className="loop-lanes">
        {tracks.map((track, i) => (
          <Lane key={i} number={i + 1} track={track} armed={i === armed} length={loopLength} />
        ))}
        {moving && <div className="playhead" ref={playhead} />}
        {empty && <p className={`loop-empty${loopLength === null && transport !== "stopped" ? " is-live" : ""}`}>{empty}</p>}
      </div>
    </div>
  );
}

function Lane({
  number,
  track,
  armed,
  length,
}: {
  number: number;
  track: Track;
  armed: boolean;
  length: number | null;
}) {
  const classes = ["lane", armed && "is-armed", !track.play && "is-muted"].filter(Boolean).join(" ");
  if (!length || !track.notes.length) {
    return (
      <div className={classes}>
        <span className="lane-number">{number}</span>
        <span className="lane-notes" />
      </div>
    );
  }
  // Fit the lane to the track's range, at least an octave tall.
  const pitches = track.notes.map((n) => n.note);
  const span = Math.max(Math.max(...pitches) - Math.min(...pitches), 11);
  const top = (Math.max(...pitches) + Math.min(...pitches) + span) / 2;
  // Thick enough to see in a strip this short, even when pitches overlap a little.
  const height = Math.max(100 / (span + 1), 20);
  return (
    <div className={classes}>
      <span className="lane-number">{number}</span>
      <svg className="lane-notes" viewBox="0 0 1000 100" preserveAspectRatio="none">
        {track.notes.map((n, i) => (
          <rect
            key={i}
            x={(n.at / length) * 1000}
            y={((top - n.note) / span) * (100 - height)}
            width={Math.max((Math.min(n.duration, length - n.at) / length) * 1000, 5)}
            height={height}
          />
        ))}
      </svg>
    </div>
  );
}
