"use client";

import { useEffect } from "react";
import {
  CATEGORIES,
  DRUM_CHANNEL,
  DRUM_KITS,
  categoryOf,
  isDrumKit,
  programLabel,
} from "@/lib/gm";
import { connectMidi, listenToKeyboard, reconnectMidi } from "@/lib/input";
import { soundName, type MidiState, type Snapshot, type Track } from "@/lib/looper";
import { midiFile } from "@/lib/midi-file";
import { exposeForDebugging, getLooper, useLooper } from "@/lib/use-looper";
import { Keys } from "./Keys";
import { LoopView } from "./LoopView";

const CHANNELS = Array.from({ length: 16 }, (_, i) => i + 1);

const formatSeconds = (s: number) => `${s.toFixed(2)} s`;

/** What the status bar says (the 2016 window had one; it just never said anything). */
function status(s: Snapshot) {
  if (s.notice) return s.notice;
  const track = `track ${s.armed + 1}`;
  const loading = s.tracks.filter((t) => t.loading).map(soundName);
  switch (s.transport) {
    case "waiting":
      return `Recording on ${track}. The loop starts with your first note.`;
    case "recording":
      return s.loopLength === null
        ? `Recording on ${track}. Press Play to loop it, or Stop.`
        : `Recording on ${track} over the loop. Press Play to keep going, or Stop.`;
  }
  if (loading.length) return `Loading ${loading.join(", ")}…`;
  if (s.transport === "playing") return `Playing. Press Record to play over the loop on ${track}.`;
  if (s.loopLength !== null) return `Stopped. Press Play, or Record to play over the loop on ${track}.`;
  return "Ready. Press Record and play something; the first take sets the loop.";
}

function downloadMidi(s: Snapshot) {
  if (s.loopLength === null) return;
  const bytes = midiFile(s.tracks, s.loopLength);
  const url = URL.createObjectURL(new Blob([bytes], { type: "audio/midi" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "qt-looper.mid";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function Looper() {
  const s = useLooper();
  const busy = s.transport === "waiting" || s.transport === "recording";

  useEffect(() => {
    const looper = getLooper();
    exposeForDebugging();
    void reconnectMidi(looper);
    // Browsers only let audio start from a click, tap or key press. Any one on
    // the page will do, and it starts the sounds loading before the first note.
    const wake = () => looper.wake();
    const events = ["pointerdown", "pointerup", "keydown"] as const;
    for (const type of events) document.addEventListener(type, wake, true);
    const stopKeys = listenToKeyboard(looper);
    return () => {
      for (const type of events) document.removeEventListener(type, wake, true);
      stopKeys();
    };
  }, []);

  return (
    // After a mouse click, let go of focus so Space means play or stop again
    // instead of pressing that button a second time. A click from the keyboard
    // (detail 0) keeps its focus.
    <div
      className="looper"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (e.detail > 0 && target.matches("button, input[type=checkbox], input[type=radio]")) {
          target.blur();
        }
      }}
    >
      <section className="window" aria-label="Looper">
        <div className="window-title" aria-hidden="true">
          <span className="window-lights">
            <i />
            <i />
            <i />
          </span>
          QtLooper
        </div>

        <div className="window-toolbar">
          <span className="meta">
            {s.loopLength === null ? "No loop yet" : `Loop · ${formatSeconds(s.loopLength)}`}
          </span>
          <Midi state={s.midi} />
        </div>

        <div className="tracks">
          <div className="tracks-head meta" aria-hidden="true">
            <span>Track</span>
            <span>Channel</span>
            <span>Category</span>
            <span>Instrument</span>
            <span>Record</span>
            <span>Play</span>
            <span>Volume</span>
          </div>
          {s.tracks.map((track, i) => (
            <TrackRow
              key={i}
              index={i}
              track={track}
              armed={s.armed === i}
              recording={busy && s.armed === i}
              locked={busy}
            />
          ))}
        </div>

        <LoopView
          tracks={s.tracks}
          armed={s.armed}
          loopLength={s.loopLength}
          transport={s.transport}
        />

        <div className="transport">
          <div className="transport-edit">
            <button
              type="button"
              className="button button-quiet"
              onClick={() => getLooper().undo()}
              disabled={busy || !s.canUndo}
            >
              Undo
            </button>
            <button
              type="button"
              className="button button-quiet"
              onClick={() => getLooper().clearTrack()}
              disabled={busy || !s.tracks[s.armed].notes.length}
            >
              Clear track {s.armed + 1}
            </button>
            <button
              type="button"
              className="button button-quiet"
              onClick={() => getLooper().clearAll()}
              disabled={busy || s.loopLength === null}
            >
              Clear all
            </button>
            <button
              type="button"
              className="button button-quiet"
              onClick={() => downloadMidi(s)}
              disabled={s.loopLength === null}
            >
              Save MIDI
            </button>
          </div>
          <div className="transport-main">
            <button
              type="button"
              className={`button button-record${busy ? " is-on" : ""}`}
              aria-pressed={busy}
              onClick={() => getLooper().record()}
            >
              Record
            </button>
            <button
              type="button"
              className={`button button-play${s.transport === "playing" ? " is-on" : ""}`}
              aria-pressed={s.transport === "playing"}
              onClick={() => getLooper().play()}
            >
              Play
            </button>
            <button type="button" className="button button-stop" onClick={() => getLooper().stop()}>
              Stop
            </button>
          </div>
        </div>

        <p className="window-status" role="status">
          {status(s)}
        </p>
      </section>

      <Keys
        track={s.tracks[s.armed]}
        armed={s.armed}
        held={s.held}
        velocity={s.velocity}
      />
    </div>
  );
}

type RowProps = {
  index: number;
  track: Track;
  armed: boolean;
  recording: boolean;
  /** No switching tracks mid-take. */
  locked: boolean;
};

function TrackRow({ index, track, armed, recording, locked }: RowProps) {
  const n = index + 1;
  const drums = track.channel === DRUM_CHANNEL;
  const category = categoryOf(track.program);
  const classes = [
    "track",
    armed && "is-armed",
    recording && "is-recording",
    track.loading && "is-loading",
    !track.play && "is-muted",
  ];

  return (
    <div className={classes.filter(Boolean).join(" ")} role="group" aria-label={`Track ${n}`}>
      <span className="track-number">{n}</span>

      <label className="cell cell-channel">
        <span className="cell-label" aria-hidden="true">
          Channel
        </span>
        <select
          aria-label={`Track ${n} channel`}
          value={track.channel}
          onChange={(e) => getLooper().setChannel(index, Number(e.target.value))}
        >
          {CHANNELS.map((channel) => (
            <option key={channel} value={channel}>
              {channel}
            </option>
          ))}
        </select>
      </label>

      <label className="cell cell-category">
        <span className="cell-label" aria-hidden="true">
          Category
        </span>
        {drums ? (
          <select aria-label={`Track ${n} category`} value="drums" disabled>
            <option value="drums">Drum Kit</option>
          </select>
        ) : (
          <select
            aria-label={`Track ${n} category`}
            value={category}
            onChange={(e) => getLooper().setCategory(index, Number(e.target.value))}
          >
            {CATEGORIES.map((c, i) => (
              <option key={c.name} value={i}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </label>

      <label className="cell cell-instrument">
        <span className="cell-label" aria-hidden="true">
          Instrument
        </span>
        {drums ? (
          <select
            aria-label={`Track ${n} drum machine`}
            value={track.kit}
            onChange={(e) => isDrumKit(e.target.value) && getLooper().setKit(index, e.target.value)}
          >
            {DRUM_KITS.map((kit) => (
              <option key={kit.id} value={kit.id}>
                {kit.name}
              </option>
            ))}
          </select>
        ) : (
          <select
            aria-label={`Track ${n} instrument`}
            value={track.program}
            onChange={(e) => getLooper().setProgram(index, Number(e.target.value))}
          >
            {CATEGORIES[category].instruments.map((_, i) => (
              <option key={i} value={category * 8 + i}>
                {programLabel(category * 8 + i)}
              </option>
            ))}
          </select>
        )}
      </label>

      <label className="cell cell-record">
        <span className="cell-label" aria-hidden="true">
          Record
        </span>
        <input
          type="radio"
          name="record-track"
          aria-label={`Record on track ${n}`}
          checked={armed}
          disabled={locked && !armed}
          onChange={() => getLooper().arm(index)}
        />
      </label>

      <label className="cell cell-play">
        <span className="cell-label" aria-hidden="true">
          Play
        </span>
        <input
          type="checkbox"
          aria-label={`Play track ${n}`}
          checked={track.play}
          onChange={(e) => getLooper().setPlay(index, e.target.checked)}
        />
      </label>

      <label className="cell cell-volume">
        <span className="cell-label" aria-hidden="true">
          Volume
        </span>
        <input
          type="range"
          min={0}
          max={127}
          aria-label={`Track ${n} volume`}
          value={track.volume}
          onChange={(e) => getLooper().setVolume(index, Number(e.target.value))}
        />
        <output className="volume-value">{track.volume}</output>
      </label>
    </div>
  );
}

function Midi({ state }: { state: MidiState }) {
  switch (state.status) {
    case "on":
      return (
        <span className="meta midi-status">
          {state.inputs.length ? `MIDI · ${state.inputs.join(", ")}` : "MIDI · plug in a keyboard"}
        </span>
      );
    case "connecting":
      return <span className="meta midi-status">MIDI · connecting…</span>;
    case "unsupported":
      return (
        <span className="meta midi-status">No Web MIDI here; try Chrome, Edge or Firefox</span>
      );
    default:
      return (
        <button
          type="button"
          className="button button-small"
          onClick={() => void connectMidi(getLooper())}
        >
          {state.status === "denied" ? "MIDI was blocked · Try again" : "Connect a MIDI keyboard"}
        </button>
      );
  }
}
