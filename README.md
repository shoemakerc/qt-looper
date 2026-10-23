# Qt-Looper

A six-track MIDI looper in the browser:
**[shoemakerc.github.io/qt-looper](https://shoemakerc.github.io/qt-looper/)**

It started as my final project for CS 312: Audio Programming at Carleton in 2016, a C++ and Qt app that recorded from the lab's MIDI keyboard and played back through a General MIDI synth. This is a rebuild for the web that keeps its six-track layout and its dropdowns.

- **Six tracks:** each with a channel, a General MIDI category and instrument (numbered the way the 2016 dropdowns were), a Record button, a Play box and a volume. Channel 10 is drums: five sampled drum machines mapped onto the General MIDI drum notes.
- **Looping:** the first take starts on your first note and becomes the loop when you press Play or Stop. Later takes record over the playing loop, each replacing what its track had, and Undo steps back through them.
- **Ways to play:** the computer keyboard (A to ', with the black keys on the row above), the on-screen keys (mouse or touch), or a MIDI keyboard through Web MIDI in Chrome, Edge or Firefox, sustain pedal included.
- **Save MIDI:** exports the loop as a Standard MIDI File, each track on its own channel with its program.
- **Sessions:** kept in your browser's localStorage. No accounts, no server.

It's a companion to [shoemakerc.github.io](https://github.com/shoemakerc/shoemakerc.github.io) and borrows that site's look.

## Development

```bash
npm install
npm run dev     # http://localhost:3000/qt-looper/
npm test        # unit tests for the loop timing, the looper and the MIDI export (Vitest)
npm run lint
npm run build   # static export to out/
```

The app is served at `/qt-looper/`, so `basePath` is set in `next.config.ts`. Locally, open `/qt-looper/` rather than `/`.

## How it's organized

| Path | What's there |
| --- | --- |
| `src/lib/gm.ts` | General MIDI names (the 2016 lists), soundfont file names, the drum machine mapping, and the computer-keyboard layouts. |
| `src/lib/loop.ts` | Loop timing and takes. Pure functions with tests. |
| `src/lib/looper.ts` | The looper: tracks, transport, the scheduler, undo, saved sessions. It reaches audio through a small `Engine` interface, so the tests run it on a fake clock. |
| `src/lib/engine.ts` | Web Audio and [smplr](https://github.com/danigb/smplr): an instrument per track, a limiter, and the output latency that recordings are lined up against. |
| `src/lib/input.ts` | The computer keyboard, the on-screen keys, and Web MIDI. |
| `src/lib/midi-file.ts` | Standard MIDI File export. |
| `src/components/` | The looper window, the loop overview, the on-screen keys, and the header and footer shared with the main site. |
| `src/app/globals.css` | The looper's own styles. |
| `scripts/sync-site.mjs` | Runs before `dev` and `build`. Pulls the main site's nav, footer links and base styles from its `/shared/` files into `src/lib/site-shared.json` and `src/app/site-base.css`. Don't edit those two by hand; change the site instead. |

## Sounds

Instruments are the MusyngKite soundfont (CC BY-SA 3.0) from [gleitz/midi-js-soundfonts](https://github.com/gleitz/midi-js-soundfonts), and the drum machines are public-domain samples from [smpldsnds/drum-machines](https://github.com/smpldsnds/drum-machines). Both are fetched from their GitHub Pages sites the first time a track needs them.

## Deploying

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds the static export and publishes it to GitHub Pages. In the repo's **Settings → Pages**, the source must be set to **GitHub Actions**.

## The 2016 version

The original C++ and Qt code (Qt 5.5, RtMidi, CoreMIDI) is tagged [`legacy-2016`](https://github.com/shoemakerc/qt-looper/tree/legacy-2016). It still builds against Qt 6 once you delete the `QMAKE_MAC_SDK` line from `QtLooper.pro`, but it expects the lab's exact MIDI setup: an output port named `DLSMusicDevice` and a keyboard named `V25 Out`.
