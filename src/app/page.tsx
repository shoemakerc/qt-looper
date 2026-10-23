import { Staff } from "@/components/chrome";
import { Looper } from "@/components/Looper";
import { site } from "@/lib/site";

const legacy = `${site.source}/tree/legacy-2016`;

export default function Home() {
  return (
    <>
      <section className="page-intro">
        <p className="meta">Projects · Qt-Looper</p>
        <h1 className="page-title">
          Six tracks, <em>looped.</em>
        </h1>
        <p className="lede">
          A MIDI looper I first wrote in C++ and Qt for an audio programming class in 2016,
          rebuilt for the browser. Record a phrase and it becomes the loop, then play five more
          over it.
        </p>
      </section>

      <Looper />

      <Staff label="Notes" />

      <div className="about">
        <section>
          <h2 className="about-title">How it works</h2>
          <ol>
            <li>
              Pick a track with its <b>Record</b> button and choose an instrument. Channel 10 is
              the drum channel, as in General MIDI.
            </li>
            <li>
              Press <b>Record</b> and play. The first take starts on your first note and becomes
              the loop when you press <b>Play</b> or <b>Stop</b>.
            </li>
            <li>
              Pick another track and press <b>Record</b> again to play over the loop. A new take
              replaces what was on that track; <b>Undo</b> brings it back.
            </li>
            <li>
              The <b>Play</b> boxes take tracks in and out of the mix, and <b>Save MIDI</b> exports
              the loop for GarageBand, Logic or anything else, each track on its own channel.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="about-title">Keys</h2>
          <dl className="shortcuts">
            <dt>
              <kbd>A</kbd> to <kbd>&apos;</kbd>
            </dt>
            <dd>Notes, with the black keys on the row above</dd>
            <dt>
              <kbd>Z</kbd> <kbd>X</kbd>
            </dt>
            <dd>Octave down, up</dd>
            <dt>
              <kbd>C</kbd> <kbd>V</kbd>
            </dt>
            <dd>Softer, harder</dd>
            <dt>
              <kbd>R</kbd>
            </dt>
            <dd>Record</dd>
            <dt>
              <kbd>Space</kbd>
            </dt>
            <dd>Play or stop</dd>
            <dt>
              <kbd>1</kbd>–<kbd>6</kbd>
            </dt>
            <dd>Pick a track to record on</dd>
            <dt>
              <kbd>⌘</kbd>
              <kbd>Z</kbd>
            </dt>
            <dd>Undo</dd>
          </dl>
          <p className="about-small">
            A MIDI keyboard works too in Chrome, Edge and Firefox, sustain pedal included.
          </p>
        </section>

        <section>
          <h2 className="about-title">Then and now</h2>
          <p>
            The first version was my final project for CS 312: Audio Programming at Carleton. It
            took notes from the lab&apos;s MIDI keyboard and sent them on to a General MIDI synth,
            and it only ever ran on the lab&apos;s Macs. This one keeps its six tracks and its
            dropdowns, program numbers and all, and adds what it never quite managed: it loops,
            you can hear yourself while you record, and Stop stops.
          </p>
          <p className="about-small">
            The original C++ is at the <a href={legacy}>legacy-2016</a> tag. Instruments are the
            MusyngKite soundfont (CC BY-SA 3.0) from{" "}
            <a href="https://github.com/gleitz/midi-js-soundfonts">midi-js-soundfonts</a>; the
            drum machines are public-domain samples from{" "}
            <a href="https://github.com/smpldsnds/drum-machines">smpldsnds</a>, played with{" "}
            <a href="https://github.com/danigb/smplr">smplr</a>.
          </p>
        </section>
      </div>
    </>
  );
}
