/*
 * General MIDI names and sounds.
 *
 * The categories, instrument names and drum names are the ones the 2016 Qt
 * version listed in its dropdowns (QtLooper/mainwindow.cpp at the
 * legacy-2016 tag), program numbers and all. Melodic instruments play from
 * the MusyngKite soundfont. Channel 10 is the drum channel, as in General
 * MIDI, and plays a sampled drum machine mapped onto the GM drum notes.
 */

export const CATEGORIES = [
  {
    name: "Piano",
    instruments: [
      "Acoustic Grand Piano", "Bright Acoustic Piano", "Electric Grand Piano", "Honky-tonk Piano",
      "Electric Piano 1", "Electric Piano 2", "Harpsichord", "Clavinet",
    ],
  },
  {
    name: "Chromatic Percussion",
    instruments: [
      "Celesta", "Glockenspiel", "Music Box", "Vibraphone", "Marimba", "Xylophone",
      "Tubular Bells", "Dulcimer",
    ],
  },
  {
    name: "Organ",
    instruments: [
      "Drawbar Organ", "Percussive Organ", "Rock Organ", "Church Organ", "Reed Organ",
      "Accordion", "Harmonica", "Tango Accordion",
    ],
  },
  {
    name: "Guitar",
    instruments: [
      "Acoustic Guitar (nylon)", "Acoustic Guitar (steel)", "Electric Guitar (jazz)",
      "Electric Guitar (clean)", "Electric Guitar (muted)", "Overdriven Guitar",
      "Distortion Guitar", "Guitar harmonics",
    ],
  },
  {
    name: "Bass",
    instruments: [
      "Acoustic Bass", "Electric Bass (finger)", "Electric Bass (pick)", "Fretless Bass",
      "Slap Bass 1", "Slap Bass 2", "Synth Bass 1", "Synth Bass 2",
    ],
  },
  {
    name: "Strings",
    instruments: [
      "Violin", "Viola", "Cello", "Contrabass", "Tremolo Strings", "Pizzicato Strings",
      "Orchestral Harp", "Timpani",
    ],
  },
  {
    name: "Ensemble",
    instruments: [
      "String Ensemble 1", "String Ensemble 2", "SynthStrings 1", "SynthStrings 2",
      "Choir Aahs", "Voice Oohs", "Synth Voice", "Orchestra Hit",
    ],
  },
  {
    name: "Brass",
    instruments: [
      "Trumpet", "Trombone", "Tuba", "Muted Trumpet", "French Horn", "Brass Section",
      "SynthBrass 1", "SynthBrass 2",
    ],
  },
  {
    name: "Reed",
    instruments: [
      "Soprano Sax", "Alto Sax", "Tenor Sax", "Baritone Sax", "Oboe", "English Horn",
      "Bassoon", "Clarinet",
    ],
  },
  {
    name: "Pipe",
    instruments: [
      "Piccolo", "Flute", "Recorder", "Pan Flute", "Blown Bottle", "Shakuhachi", "Whistle",
      "Ocarina",
    ],
  },
  {
    name: "Synth Lead",
    instruments: [
      "Lead 1 (square)", "Lead 2 (sawtooth)", "Lead 3 (calliope)", "Lead 4 (chiff)",
      "Lead 5 (charang)", "Lead 6 (voice)", "Lead 7 (fifths)", "Lead 8 (bass + lead)",
    ],
  },
  {
    name: "Synth Pad",
    instruments: [
      "Pad 1 (new age)", "Pad 2 (warm)", "Pad 3 (polysynth)", "Pad 4 (choir)", "Pad 5 (bowed)",
      "Pad 6 (metallic)", "Pad 7 (halo)", "Pad 8 (sweep)",
    ],
  },
  {
    name: "Synth Effects",
    instruments: [
      "FX 1 (rain)", "FX 2 (soundtrack)", "FX 3 (crystal)", "FX 4 (atmosphere)",
      "FX 5 (brightness)", "FX 6 (goblins)", "FX 7 (echoes)", "FX 8 (sci-fi)",
    ],
  },
  {
    name: "Ethnic",
    instruments: [
      "Sitar", "Banjo", "Shamisen", "Koto", "Kalimba", "Bag pipe", "Fiddle", "Shanai",
    ],
  },
  {
    name: "Percussive",
    instruments: [
      "Tinkle Bell", "Agogo", "Steel Drums", "Woodblock", "Taiko Drum", "Melodic Tom",
      "Synth Drum", "Reverse Cymbal",
    ],
  },
  {
    name: "Sound Effects",
    instruments: [
      "Guitar Fret Noise", "Breath Noise", "Seashore", "Bird Tweet", "Telephone Ring",
      "Helicopter", "Applause", "Gunshot",
    ],
  },
] as const;

/** File names in the soundfont, in program order. */
const SOUNDFONT_NAMES = [
  "acoustic_grand_piano", "bright_acoustic_piano", "electric_grand_piano", "honkytonk_piano",
  "electric_piano_1", "electric_piano_2", "harpsichord", "clavinet", "celesta", "glockenspiel",
  "music_box", "vibraphone", "marimba", "xylophone", "tubular_bells", "dulcimer",
  "drawbar_organ", "percussive_organ", "rock_organ", "church_organ", "reed_organ", "accordion",
  "harmonica", "tango_accordion", "acoustic_guitar_nylon", "acoustic_guitar_steel",
  "electric_guitar_jazz", "electric_guitar_clean", "electric_guitar_muted", "overdriven_guitar",
  "distortion_guitar", "guitar_harmonics", "acoustic_bass", "electric_bass_finger",
  "electric_bass_pick", "fretless_bass", "slap_bass_1", "slap_bass_2", "synth_bass_1",
  "synth_bass_2", "violin", "viola", "cello", "contrabass", "tremolo_strings",
  "pizzicato_strings", "orchestral_harp", "timpani", "string_ensemble_1", "string_ensemble_2",
  "synth_strings_1", "synth_strings_2", "choir_aahs", "voice_oohs", "synth_choir",
  "orchestra_hit", "trumpet", "trombone", "tuba", "muted_trumpet", "french_horn",
  "brass_section", "synth_brass_1", "synth_brass_2", "soprano_sax", "alto_sax", "tenor_sax",
  "baritone_sax", "oboe", "english_horn", "bassoon", "clarinet", "piccolo", "flute", "recorder",
  "pan_flute", "blown_bottle", "shakuhachi", "whistle", "ocarina", "lead_1_square",
  "lead_2_sawtooth", "lead_3_calliope", "lead_4_chiff", "lead_5_charang", "lead_6_voice",
  "lead_7_fifths", "lead_8_bass__lead", "pad_1_new_age", "pad_2_warm", "pad_3_polysynth",
  "pad_4_choir", "pad_5_bowed", "pad_6_metallic", "pad_7_halo", "pad_8_sweep", "fx_1_rain",
  "fx_2_soundtrack", "fx_3_crystal", "fx_4_atmosphere", "fx_5_brightness", "fx_6_goblins",
  "fx_7_echoes", "fx_8_scifi", "sitar", "banjo", "shamisen", "koto", "kalimba", "bagpipe",
  "fiddle", "shanai", "tinkle_bell", "agogo", "steel_drums", "woodblock", "taiko_drum",
  "melodic_tom", "synth_drum", "reverse_cymbal", "guitar_fret_noise", "breath_noise", "seashore",
  "bird_tweet", "telephone_ring", "helicopter", "applause", "gunshot",
];

/** Each category holds eight programs, so program 33 is the second bass. */
export const categoryOf = (program: number) => program >> 3;

/** "33 Electric Bass (finger)", numbered the way the 2016 dropdowns were. */
export const programLabel = (program: number) =>
  `${program} ${CATEGORIES[categoryOf(program)].instruments[program & 7]}`;

export const programName = (program: number) =>
  CATEGORIES[categoryOf(program)].instruments[program & 7];

export const soundfontName = (program: number) => SOUNDFONT_NAMES[program];

/** Channel 10 plays drums, as in General MIDI. */
export const DRUM_CHANNEL = 10;

/** Basses sit two octaves down on the computer keyboard; everything else starts at middle C. */
export const defaultOctave = (program: number) =>
  CATEGORIES[categoryOf(program)].name === "Bass" ? 2 : 4;

export const DRUM_KITS = [
  { id: "TR-808", name: "Roland TR-808" },
  { id: "Roland CR-8000", name: "Roland CR-8000" },
  { id: "LM-2", name: "LinnDrum LM-2" },
  { id: "Casio-RZ1", name: "Casio RZ-1" },
  { id: "MFB-512", name: "MFB-512" },
] as const;

export type DrumKitId = (typeof DRUM_KITS)[number]["id"];

export const isDrumKit = (id: unknown): id is DrumKitId => DRUM_KITS.some((kit) => kit.id === id);

/** The General MIDI drum notes, named as in the 2016 version. */
export const DRUM_NAMES: Record<number, string> = {
  35: "Bass Drum 2", 36: "Bass Drum 1", 37: "Side Stick", 38: "Snare Drum 1", 39: "Hand Clap",
  40: "Snare Drum 2", 41: "Low Tom 2", 42: "Closed Hi-hat", 43: "Low Tom 1", 44: "Pedal Hi-hat",
  45: "Mid Tom 2", 46: "Open Hi-hat", 47: "Mid Tom 1", 48: "High Tom 2", 49: "Crash Cymbal 1",
  50: "High Tom 1", 51: "Ride Cymbal 1", 52: "Chinese Cymbal", 53: "Ride Bell", 54: "Tambourine",
  55: "Splash Cymbal", 56: "Cowbell", 57: "Crash Cymbal 2", 58: "Vibra Slap",
  59: "Ride Cymbal 2", 60: "High Bongo", 61: "Low Bongo", 62: "Mute High Conga",
  63: "Open High Conga", 64: "Low Conga", 65: "High Timbale", 66: "Low Timbale",
  67: "High Agogo", 68: "Low Agogo", 69: "Cabasa", 70: "Maracas", 71: "Short Whistle",
  72: "Long Whistle", 73: "Short Guiro", 74: "Long Guiro", 75: "Claves", 76: "High Wood Block",
  77: "Low Wood Block", 78: "Mute Cuica", 79: "Open Cuica", 80: "Mute Triangle",
  81: "Open Triangle",
};

/*
 * Which drum machine sound plays each GM drum note. The machines name their
 * sounds a little differently ("hihat-close", "hihat-closed", "hhclosed"), so
 * each note lists a few spellings in order of preference. Notes a machine has
 * nothing for (whistles, guiros, triangles...) stay silent.
 */
const CLOSED_HAT = ["hihat-closed", "hihat-close", "hhclosed"];
const CRASH = ["crash", "cymbal", "cymball"];
const RIDE = ["ride", "cymbal", "cymball"];
const LOW_TOM = ["tom-low", "tom-l", "tom-3"];
const MID_TOM = ["tom-mid", "mid-tom", "tom-m", "tom-2"];
const HIGH_TOM = ["tom-hi", "tom-high", "tom-h", "tom-1"];
const HIGH_CONGA = ["conga-hi", "conga-high", "conga-h"];

const DRUM_SOUNDS: Record<number, string[]> = {
  35: ["kick-alt", "kick"],
  36: ["kick"],
  37: ["rimshot", "stick-m", "stick-h", "clave"],
  38: ["snare", "snare-m", "snare-h"],
  39: ["clap"],
  40: ["snare-h", "snare", "snare-m"],
  41: ["tom-ll", ...LOW_TOM],
  42: CLOSED_HAT,
  43: LOW_TOM,
  44: ["hhclosed-short", ...CLOSED_HAT],
  45: [...MID_TOM, ...LOW_TOM],
  46: ["hihat-open", "hhopen"],
  47: MID_TOM,
  48: [...HIGH_TOM, ...MID_TOM],
  49: CRASH,
  50: ["tom-hh", ...HIGH_TOM],
  51: RIDE,
  52: CRASH,
  53: ["ride", "cowbell"],
  54: ["tambourine", "maraca", "cabasa"],
  55: CRASH,
  56: ["cowbell"],
  57: CRASH,
  59: RIDE,
  60: ["conga-hh", ...HIGH_CONGA],
  61: ["conga-mid", "conga-m", "conga-low", "conga-l"],
  62: HIGH_CONGA,
  63: HIGH_CONGA,
  64: ["conga-low", "conga-l", "conga-ll"],
  65: HIGH_TOM,
  66: LOW_TOM,
  67: ["cowbell"],
  68: ["cowbell"],
  69: ["cabasa", "maraca", "tambourine"],
  70: ["maraca", "cabasa", "tambourine"],
  75: ["clave"],
  76: ["clave", "stick-h", "rimshot"],
  77: ["clave", "stick-l", "rimshot"],
};

/** The sound a drum machine plays for a GM drum note, given the sounds it has. */
export const drumSound = (note: number, sounds: readonly string[]) =>
  DRUM_SOUNDS[note]?.find((name) => sounds.includes(name));

/*
 * Computer-keyboard layouts, by physical key (KeyboardEvent.code) so they sit
 * in the same place on any keyboard layout. For instruments, the home row is
 * the white keys from C and the row above has the black keys, like
 * GarageBand's musical typing. Drum tracks use the same keys for a kit.
 */
export const PIANO_KEYS: readonly { code: string; offset: number }[] = [
  { code: "KeyA", offset: 0 }, { code: "KeyW", offset: 1 }, { code: "KeyS", offset: 2 },
  { code: "KeyE", offset: 3 }, { code: "KeyD", offset: 4 }, { code: "KeyF", offset: 5 },
  { code: "KeyT", offset: 6 }, { code: "KeyG", offset: 7 }, { code: "KeyY", offset: 8 },
  { code: "KeyH", offset: 9 }, { code: "KeyU", offset: 10 }, { code: "KeyJ", offset: 11 },
  { code: "KeyK", offset: 12 }, { code: "KeyO", offset: 13 }, { code: "KeyL", offset: 14 },
  { code: "KeyP", offset: 15 }, { code: "Semicolon", offset: 16 }, { code: "Quote", offset: 17 },
];

export const DRUM_KEYS: readonly { code: string; note: number }[] = [
  // Top row
  { code: "KeyW", note: 37 }, { code: "KeyE", note: 40 }, { code: "KeyT", note: 70 },
  { code: "KeyY", note: 54 }, { code: "KeyU", note: 56 }, { code: "KeyO", note: 63 },
  { code: "KeyP", note: 64 },
  // Home row
  { code: "KeyA", note: 36 }, { code: "KeyS", note: 38 }, { code: "KeyD", note: 42 },
  { code: "KeyF", note: 46 }, { code: "KeyG", note: 39 }, { code: "KeyH", note: 41 },
  { code: "KeyJ", note: 45 }, { code: "KeyK", note: 48 }, { code: "KeyL", note: 49 },
  { code: "Semicolon", note: 51 }, { code: "Quote", note: 53 },
];

/** What's printed on each key on a US keyboard. */
export const KEY_LABELS: Record<string, string> = Object.fromEntries(
  PIANO_KEYS.map(({ code }) => [
    code,
    code.startsWith("Key") ? code.slice(3) : code === "Semicolon" ? ";" : "'",
  ]),
);

const NOTE_NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];

/** 60 → "C4". */
export const noteName = (note: number) => `${NOTE_NAMES[note % 12]}${Math.floor(note / 12) - 1}`;
