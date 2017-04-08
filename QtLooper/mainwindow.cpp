/***************************************************************
*
*	CS 312
*	Final Project - QtLooper
*	mainwindow.cpp
*	Chris Shoemaker shoemakerc
*	3/12/15
*
***************************************************************/

#include "mainwindow.h"
#include "ui_mainwindow.h"

#include <QMessageBox>
#include <iostream>
#include <cstdlib>
#include <numeric>
#include <unistd.h>
#include <vector>
#include "RtMidi.h"
#define SLEEP(milliseconds) usleep((unsigned long)(milliseconds * 1000.0))

RtMidiOut *midiout = 0;
RtMidiIn *midiin = 0;

// vectors to hold packets of the six tracks in the application
std::vector<CMidiPacket43> play_trk1;
std::vector<CMidiPacket43> play_trk2;
std::vector<CMidiPacket43> play_trk3;
std::vector<CMidiPacket43> play_trk4;
std::vector<CMidiPacket43> play_trk5;
std::vector<CMidiPacket43> play_trk6;

std::vector<CMidiPacket43> play_trk_buffer;  // vector to collect the recording
                                             // of a track
std::vector<CMidiPacket43> play_trk_player;  // vector used to play chosen
                                             // tracks

// vector iterators for QTimer
std::vector<CMidiPacket43>::iterator cur_pkt;
std::vector<CMidiPacket43>::iterator next_pkt;

CMidiPacket43 mp;
uint32_t tm = 0;

// patch messages for each track
CMidiPacket43 mp_patch_1;
CMidiPacket43 mp_patch_2;
CMidiPacket43 mp_patch_3;
CMidiPacket43 mp_patch_4;
CMidiPacket43 mp_patch_5;
CMidiPacket43 mp_patch_6;

const QStringList channel_list = QStringList() << "1"
                                               << "2"
                                               << "3"
                                               << "4"
                                               << "5"
                                               << "6"
                                               << "7"
                                               << "8"
                                               << "9"
                                               << "10"
                                               << "11"
                                               << "12"
                                               << "13"
                                               << "14"
                                               << "15"
                                               << "16";

const QStringList categories = QStringList() << "Piano"
                                             << "Chromatic Percussion"
                                             << "Organ"
                                             << "Guitar"
                                             << "Bass"
                                             << "Strings"
                                             << "Ensemble"
                                             << "Brass"
                                             << "Reed"
                                             << "Pipe"
                                             << "Synth Lead"
                                             << "Synth Pad"
                                             << "Synth Effects"
                                             << "Ethnic"
                                             << "Percussive"
                                             << "Sound Effects";

const QStringList piano_list = QStringList() << "0 Acoustic Grand Piano"
                                             << "1 Bright Acoustic Piano"
                                             << "2 Electric Grand Piano"
                                             << "3 Honky-tonk Piano"
                                             << "4 Electric Piano 1"
                                             << "5 Electric Piano 2"
                                             << "6 Harpsichord"
                                             << "7 Clavinet";

const QStringList chromatic_percussion_list = QStringList()
                                              << "8 Celesta"
                                              << "9 Glockenspiel"
                                              << "10 Music Box"
                                              << "11 Vibraphone"
                                              << "12 Marimba"
                                              << "13 Xylophone"
                                              << "14 Tubular Bells"
                                              << "15 Dulcimer";

const QStringList organ_list = QStringList() << "16 Drawbar Organ"
                                             << "17 Percussive Organ"
                                             << "18 Rock Organ"
                                             << "19 Church Organ"
                                             << "20 Reed Organ"
                                             << "21 Accordion"
                                             << "22 Harmonica"
                                             << "23 Tango Accordion";

const QStringList guitar_list = QStringList() << "24 Acoustic Guitar (nylon)"
                                              << "25 Acoustic Guitar (steel)"
                                              << "26 Electric Guitar (jazz)"
                                              << "27 Electric Guitar (clean)"
                                              << "28 Electric Guitar (muted)"
                                              << "29 Overdriven Guitar"
                                              << "30 Distortion Guitar"
                                              << "31 Guitar harmonics";

const QStringList bass_list = QStringList() << "32 Acoustic Bass"
                                            << "33 Electric Bass (finger)"
                                            << "34 Electric Bass (pick)"
                                            << "35 Fretless Bass"
                                            << "36 Slap Bass 1"
                                            << "37 Slap Bass 2"
                                            << "38 Synth Bass 1"
                                            << "39 Synth Bass 2";

const QStringList strings_list = QStringList() << "40 Violin"
                                               << "41 Viola"
                                               << "42 Cello"
                                               << "43 Contrabass"
                                               << "44 Tremolo Strings"
                                               << "45 Pizzicato Strings"
                                               << "46 Orchestral Harp"
                                               << "47 Timpani";

const QStringList ensemble_list = QStringList() << "48 String Ensemble 1"
                                                << "49 String Ensemble 2"
                                                << "50 SynthStrings 1"
                                                << "51 SynthStrings 2"
                                                << "52 Choir Aahs"
                                                << "53 Voice Oohs"
                                                << "54 Synth Voice"
                                                << "55 Orchestra Hit";

const QStringList brass_list = QStringList() << "56 Trumpet"
                                             << "57 Trombone"
                                             << "58 Tuba"
                                             << "59 Muted Trumpet"
                                             << "60 French Horn"
                                             << "61 Brass Section"
                                             << "62 SynthBrass 1"
                                             << "63 SynthBrass 2";

const QStringList reed_list = QStringList() << "64 Soprano Sax"
                                            << "65 Alto Sax"
                                            << "66 Tenor Sax"
                                            << "67 Baritone Sax"
                                            << "68 Oboe"
                                            << "69 English Horn"
                                            << "70 Bassoon"
                                            << "71 Clarinet";

const QStringList pipe_list = QStringList() << "72 Piccolo"
                                            << "73 Flute"
                                            << "74 Recorder"
                                            << "75 Pan Flute"
                                            << "76 Blown Bottle"
                                            << "77 Shakuhachi"
                                            << "78 Whistle"
                                            << "79 Ocarina";

const QStringList synth_lead_list = QStringList() << "80 Lead 1 (square)"
                                                  << "81 Lead 2 (sawtooth)"
                                                  << "82 Lead 3 (calliope)"
                                                  << "83 Lead 4 (chiff)"
                                                  << "84 Lead 5 (charang)"
                                                  << "85 Lead 6 (voice)"
                                                  << "86 Lead 7 (fifths)"
                                                  << "87 Lead 8 (bass + lead)";

const QStringList synth_pad_list = QStringList() << "88 Pad 1 (new age)"
                                                 << "89 Pad 2 (warm)"
                                                 << "90 Pad 3 (polysynth)"
                                                 << "91 Pad 4 (choir)"
                                                 << "92 Pad 5 (bowed)"
                                                 << "93 Pad 6 (metallic)"
                                                 << "94 Pad 7 (halo)"
                                                 << "95 Pad 8 (sweep)";

const QStringList synth_effects_list = QStringList() << "96 FX 1 (rain)"
                                                     << "97 FX 2 (soundtrack)"
                                                     << "98 FX 3 (crystal)"
                                                     << "99 FX 4 (atmosphere)"
                                                     << "100 FX 5 (brightness)"
                                                     << "101 FX 6 (goblins)"
                                                     << "102 FX 7 (echoes)"
                                                     << "103 FX 8 (sci-fi)";

const QStringList ethnic_list = QStringList() << "104 Sitar"
                                              << "105 Banjo"
                                              << "106 Shamisen"
                                              << "107 Koto"
                                              << "108 Kalimba"
                                              << "109 Bag pipe"
                                              << "110 Fiddle"
                                              << "111 Shanai";

const QStringList percussive_list = QStringList() << "112 Tinkle Bell"
                                                  << "113 Agogo"
                                                  << "114 Steel Drums"
                                                  << "115 Woodblock"
                                                  << "116 Taiko Drum"
                                                  << "117 Melodic Tom"
                                                  << "118 Synth Drum"
                                                  << "119 Reverse Cymbal";

const QStringList sound_effects_list = QStringList() << "120 Guitar Fret Noise"
                                                     << "121 Breath Noise"
                                                     << "122 Seashore"
                                                     << "123 Bird Tweet"
                                                     << "124 Telephone Ring"
                                                     << "125 Helicopter"
                                                     << "126 Applause"
                                                     << "127 Gunshot";

const QStringList drum_list = (QStringList() << "35 Bass Drum 2"
                                             << "36 Bass Drum 1"
                                             << "37 Side Stick"
                                             << "38 Snare Drum 1"
                                             << "39 Hand Clap"
                                             << "40 Snare Drum 2"
                                             << "41 Low Tom 2"
                                             << "42 Closed Hi-hat"
                                             << "43 Low Tom 1"
                                             << "44 Pedal Hi-hat"
                                             << "45 Mid Tom 2"
                                             << "46 Open Hi-hat"
                                             << "47 Mid Tom 1"
                                             << "48 High Tom 2"
                                             << "49 Crash Cymbal 1"
                                             << "50 High Tom 1"
                                             << "51 Ride Cymbal 1"
                                             << "52 Chinese Cymbal"
                                             << "53 Ride Bell"
                                             << "54 Tambourine"
                                             << "55 Splash Cymbal"
                                             << "56 Cowbell"
                                             << "57 Crash Cymbal 2"
                                             << "58 Vibra Slap"
                                             << "59 Ride Cymbal 2"
                                             << "60 High Bongo"
                                             << "61 Low Bongo"
                                             << "62 Mute High Conga"
                                             << "63 Open High Conga"
                                             << "64 Low Conga"
                                             << "65 High Timbale"
                                             << "66 Low Timbale"
                                             << "67 High Agogo"
                                             << "68 Low Agogo"
                                             << "69 Cabasa"
                                             << "70 Maracas"
                                             << "71 Short Whistle"
                                             << "72 Long Whistle"
                                             << "73 Short Guiro"
                                             << "74 Long Guiro"
                                             << "75 Claves"
                                             << "76 High Wood Block"
                                             << "77 Low Wood Block"
                                             << "78 Mute Cuica"
                                             << "79 Open Cuica"
                                             << "80 Mute Triangle"
                                             << "81 Open Triangle");

void show_message(QString qs) {
  QMessageBox msgBox;
  msgBox.setText(qs);
  msgBox.exec();
}

void mycallback(double deltatime, std::vector<unsigned char> *message,
                void * /*userData*/) {
  unsigned int nBytes = message->size();

  // convert every note played into CMidiPacket format, then stuff into
  // play_trk_buffer
  if (nBytes == 2) {
    mp.set_status_length(message->at(0));
    mp.set_data1(message->at(1));
    tm += (deltatime * 1000);
    mp.set_timestamp(tm);
    play_trk_buffer.push_back(mp);
  } else if (nBytes == 3) {
    mp.set_status_length(message->at(0));
    mp.set_data1(message->at(1));
    mp.set_data2(message->at(2));
    tm += (deltatime * 1000);
    mp.set_timestamp(tm);
    play_trk_buffer.push_back(mp);
  } else
    return;
}

std::chrono::time_point<std::chrono::steady_clock> tm_zero;
void set_time_zero() { tm_zero = std::chrono::steady_clock::now(); }

void sendCMidiPacket(const CMidiPacket43 &mp) {
  std::vector<unsigned char> message;
  message.push_back(mp.get_status());
  message.push_back(mp.get_data1());
  if (mp.get_length() == 3) message.push_back(mp.get_data2());
  midiout->sendMessage(&message);
}

void timeDelayToSend(const CMidiPacket43 &mp) {
  std::condition_variable timer;
  std::mutex mtx;
  std::unique_lock<std::mutex> lck(mtx);

  auto delay = tm_zero + std::chrono::milliseconds(mp.get_timestamp()) -
               std::chrono::steady_clock::now();

  timer.wait_for(lck, delay);

  sendCMidiPacket(mp);
}

int MainWindow::get_DLSMusicDevice_port() {
  unsigned int dls_port = 0xBAD;  // define a BAD value
  try {
    // YOU WRITE
    // adapt code from midiprobe
    // open a new RtMidiOut
    // Find the number of output ports
    // Use a for loop to get the name of each port
    // if port name == "DLSMusicDevice" set dls_port number to loop index
    midiout = new RtMidiOut();

    unsigned int nPorts = midiout->getPortCount();

    for (unsigned i = 0; i < nPorts; i++) {
      std::string portName = midiout->getPortName(i);
      if (portName == "DLSMusicDevice") {
        dls_port = i;
      }
    }
  }
  catch (RtMidiError &error) {
    error.printMessage();
  }
  delete midiout;
  return dls_port;
}

bool MainWindow::chooseMidiOutPort(RtMidiOut *rtmidi) {
  unsigned int nPorts = rtmidi->getPortCount();
  if (nPorts == 0) {
    show_message("No output ports available!");
    return false;
  }

  const std::string kLOOK_FOR_NAME = "DLSMusicDevice";
  std::string portName;

  uint32_t dls_port = 0xBAD;

  for (unsigned int i = 0; i < nPorts; i++) {
    portName = rtmidi->getPortName(i);
    if (portName == kLOOK_FOR_NAME) dls_port = i;
  }

  if (dls_port == 0xBAD) return false;

  rtmidi->openPort(dls_port);
  return true;
}

bool MainWindow::chooseMidiInPort(RtMidiIn *rtmidi) {
  unsigned int nPorts = rtmidi->getPortCount();
  if (nPorts == 0) {
    show_message("No input ports available!");
    return false;
  }

  const std::string kLOOK_FOR_NAME = "V25 Out";
  std::string portName;

  uint32_t v_port = 0xBAD;

  for (unsigned int i = 0; i < nPorts; i++) {
    portName = rtmidi->getPortName(i);
    if (portName == kLOOK_FOR_NAME) v_port = i;
  }

  if (v_port == 0xBAD) return false;

  rtmidi->openPort(v_port);
  return true;
}

bool MainWindow::chooseMidiOutPort(RtMidiOut *mout, unsigned int dls_port) {
  if (dls_port != 0xBAD) {
    mout->openPort(dls_port);
  }
  return true;
}

void MainWindow::sendAlllNotesOff() {
  std::vector<unsigned char> message = {0, 0, 0};
  for (int ix = 0; ix < 16; ++ix) {
    for (int jx = 0; jx < 128; ++jx) {
      SLEEP(1);
      message[0] = 0x90 + ix;
      message[1] = jx;
      message[2] = 0;
      midiout->sendMessage(&message);
      SLEEP(1);
      message[0] = 0x80 + ix;
      message[1] = jx;
      message[2] = 0;
      midiout->sendMessage(&message);
    }
  }
}

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent), ui(new Ui::MainWindow) {
  ui->setupUi(this);
  init_controls();

  // RtMidi open MIDI output

  try {
    midiout = new RtMidiOut();
  }
  catch (RtMidiError &error) {
    error.printMessage();
    exit(EXIT_FAILURE);
  }

  // Call function to select port.
  try {
    if (chooseMidiOutPort(midiout) == false) {
      delete midiout;
      exit(EXIT_FAILURE);
    }
  }
  catch (RtMidiError &error) {
    error.printMessage();
    delete midiout;
  }

  // end RtMidiOut

  try {
    // RtMidiIn constructor
    midiin = new RtMidiIn();

    // je changed name chooseMidiPort to chooseMidiInPort
    // Call function to select port.
    if (chooseMidiInPort(midiin) == false) {
      delete midiin;
    }

    // Set our callback function.  This should be done immediately after
    // opening the port to avoid having incoming messages written to the
    // queue instead of sent to the callback function.
    midiin->setCallback(&mycallback);

    // Don't ignore sysex, timing, or active sensing messages.
    midiin->ignoreTypes(false, false, false);
  }
  catch (RtMidiError &error) {
    error.printMessage();
  }
  // end RtMidiIn
}

MainWindow::~MainWindow() {
  std::vector<unsigned char> message;
  message.push_back(0xC0);
  message.push_back(0);
  midiout->sendMessage(&message);
  delete ui;
  delete midiin;
  delete midiout;
}

void MainWindow::init_controls() {
  // set initial state of application tools on startup

  ui->comboBox_Category1->addItems(categories);
  choose_instruments(ui->comboBox_Inst1, "Piano");
  ui->comboBox_Category2->addItems(categories);
  choose_instruments(ui->comboBox_Inst2, "Piano");
  ui->comboBox_Category3->addItems(categories);
  choose_instruments(ui->comboBox_Inst3, "Piano");
  ui->comboBox_Category4->addItems(categories);
  choose_instruments(ui->comboBox_Inst4, "Piano");
  ui->comboBox_Category5->addItems(categories);
  choose_instruments(ui->comboBox_Inst5, "Piano");
  ui->comboBox_Category6->addItems(categories);
  choose_instruments(ui->comboBox_Inst6, "Piano");

  ui->comboBox_Channel1->addItems(channel_list);
  ui->comboBox_Channel2->addItems(channel_list);
  ui->comboBox_Channel3->addItems(channel_list);
  ui->comboBox_Channel4->addItems(channel_list);
  ui->comboBox_Channel5->addItems(channel_list);
  ui->comboBox_Channel6->addItems(channel_list);
}

void MainWindow::choose_instruments(QComboBox *instruments,
                                    const QString &arg1) {
  // get list of instruments based on category
  if (arg1 == "Piano") {
    instruments->clear();
    instruments->addItems(piano_list);
  } else if (arg1 == "Chromatic Percussion") {
    instruments->clear();
    instruments->addItems(chromatic_percussion_list);
  } else if (arg1 == "Organ") {
    instruments->clear();
    instruments->addItems(organ_list);
  } else if (arg1 == "Guitar") {
    instruments->clear();
    instruments->addItems(guitar_list);
  } else if (arg1 == "Bass") {
    instruments->clear();
    instruments->addItems(bass_list);
  } else if (arg1 == "Strings") {
    instruments->clear();
    instruments->addItems(strings_list);
  } else if (arg1 == "Ensemble") {
    instruments->clear();
    instruments->addItems(ensemble_list);
  } else if (arg1 == "Brass") {
    instruments->clear();
    instruments->addItems(brass_list);
  } else if (arg1 == "Reed") {
    instruments->clear();
    instruments->addItems(reed_list);
  } else if (arg1 == "Pipe") {
    instruments->clear();
    instruments->addItems(pipe_list);
  } else if (arg1 == "Synth Lead") {
    instruments->clear();
    instruments->addItems(synth_lead_list);
  } else if (arg1 == "Synth Pad") {
    instruments->clear();
    instruments->addItems(synth_pad_list);
  } else if (arg1 == "Synth Effects") {
    instruments->clear();
    instruments->addItems(synth_effects_list);
  } else if (arg1 == "Ethnic") {
    instruments->clear();
    instruments->addItems(ethnic_list);
  } else if (arg1 == "Percussive") {
    instruments->clear();
    instruments->addItems(percussive_list);
  } else if (arg1 == "Sound Effects") {
    instruments->clear();
    instruments->addItems(sound_effects_list);
  } else {
    instruments->clear();
  }
}

void MainWindow::set_categories(QComboBox *instruments, QComboBox *category,
                                const QString &arg1) {
  // if channel 9 is chosen, set instrument list to drums list
  if (arg1 == "10") {
    instruments->clear();
    category->clear();
    instruments->addItems(drum_list);
  } else {
    instruments->clear();
    category->clear();
    category->addItems(categories);
    choose_instruments(instruments, "Piano");
  }
}

int MainWindow::get_instrument(QComboBox *instruments) {
  // get MIDI number of chosen instrument
  int number;
  QString namesub;
  QString name = instruments->currentText();
  if (name.at(1) == ' ') {
    namesub = name.mid(0, 1);
    number = namesub.toInt();
  } else if (name.at(2) == ' ') {
    namesub = name.mid(0, 2);
    number = namesub.toInt();
  } else {
    namesub = name.mid(0, 3);
    number = namesub.toInt();
  }
  return number;
}

void MainWindow::on_comboBox_Category1_activated(const QString &arg1) {
  choose_instruments(ui->comboBox_Inst1, arg1);
}
void MainWindow::on_comboBox_Category2_activated(const QString &arg1) {
  choose_instruments(ui->comboBox_Inst2, arg1);
}
void MainWindow::on_comboBox_Category3_activated(const QString &arg1) {
  choose_instruments(ui->comboBox_Inst3, arg1);
}
void MainWindow::on_comboBox_Category4_activated(const QString &arg1) {
  choose_instruments(ui->comboBox_Inst4, arg1);
}
void MainWindow::on_comboBox_Category5_activated(const QString &arg1) {
  choose_instruments(ui->comboBox_Inst5, arg1);
}
void MainWindow::on_comboBox_Category6_activated(const QString &arg1) {
  choose_instruments(ui->comboBox_Inst6, arg1);
}

void MainWindow::on_comboBox_Channel1_activated(const QString &arg1) {
  set_categories(ui->comboBox_Inst1, ui->comboBox_Category1, arg1);
}
void MainWindow::on_comboBox_Channel2_activated(const QString &arg1) {
  set_categories(ui->comboBox_Inst2, ui->comboBox_Category2, arg1);
}
void MainWindow::on_comboBox_Channel3_activated(const QString &arg1) {
  set_categories(ui->comboBox_Inst3, ui->comboBox_Category3, arg1);
}
void MainWindow::on_comboBox_Channel4_activated(const QString &arg1) {
  set_categories(ui->comboBox_Inst4, ui->comboBox_Category4, arg1);
}
void MainWindow::on_comboBox_Channel5_activated(const QString &arg1) {
  set_categories(ui->comboBox_Inst5, ui->comboBox_Category5, arg1);
}
void MainWindow::on_comboBox_Channel6_activated(const QString &arg1) {
  set_categories(ui->comboBox_Inst6, ui->comboBox_Category6, arg1);
}

void MainWindow::on_radioButton_Record1_clicked() {
  // record only one track at a time
  if (ui->radioButton_Record1->isChecked()) {
    ui->radioButton_Record1->setChecked(false);
  } else {
    ui->radioButton_Record1->setChecked(true);
  }
}

void MainWindow::on_radioButton_Record2_clicked() {
  if (ui->radioButton_Record2->isChecked()) {
    ui->radioButton_Record2->setChecked(false);
  } else {
    ui->radioButton_Record2->setChecked(true);
  }
}

void MainWindow::on_radioButton_Record3_clicked() {
  if (ui->radioButton_Record3->isChecked()) {
    ui->radioButton_Record3->setChecked(false);
  } else {
    ui->radioButton_Record3->setChecked(true);
  }
}

void MainWindow::on_radioButton_Record4_clicked() {
  if (ui->radioButton_Record4->isChecked()) {
    ui->radioButton_Record4->setChecked(false);
  } else {
    ui->radioButton_Record4->setChecked(true);
  }
}

void MainWindow::on_radioButton_Record5_clicked() {
  if (ui->radioButton_Record5->isChecked()) {
    ui->radioButton_Record5->setChecked(false);
  } else {
    ui->radioButton_Record5->setChecked(true);
  }
}

void MainWindow::on_radioButton_Record6_clicked() {
  if (ui->radioButton_Record6->isChecked()) {
    ui->radioButton_Record6->setChecked(false);
  } else {
    ui->radioButton_Record6->setChecked(true);
  }
}

void MainWindow::on_horizontalSlider_Volume1_valueChanged(int value) {
  // set volume of track to be played
  ui->label_Volume1->setNum(value);
}

void MainWindow::on_horizontalSlider_Volume2_valueChanged(int value) {
  ui->label_Volume2->setNum(value);
}

void MainWindow::on_horizontalSlider_Volume3_valueChanged(int value) {
  ui->label_Volume3->setNum(value);
}

void MainWindow::on_horizontalSlider_Volume4_valueChanged(int value) {
  ui->label_Volume4->setNum(value);
}

void MainWindow::on_horizontalSlider_Volume5_valueChanged(int value) {
  ui->label_Volume5->setNum(value);
}

void MainWindow::on_horizontalSlider_Volume6_valueChanged(int value) {
  ui->label_Volume6->setNum(value);
}

void MainWindow::on_pushButton_Record_clicked() {
  ui->pushButton_Record->setEnabled(false);
  int data1 = 0;
  if (ui->radioButton_Record1->isChecked()) {
    play_trk1.clear();
    // set the patch message (instrument)
    mp_patch_1.set_timestamp(0);
    mp_patch_1.set_status_length(
        0xC0 + ui->comboBox_Channel1->currentText().toInt() - 1);
    data1 = get_instrument(ui->comboBox_Inst1);
    mp_patch_1.set_data1(static_cast<uint32_t>(data1));
  } else if (ui->radioButton_Record2->isChecked()) {
    play_trk2.clear();
    mp_patch_2.set_timestamp(0);
    mp_patch_2.set_status_length(
        0xC0 + ui->comboBox_Channel2->currentText().toInt() - 1);
    data1 = get_instrument(ui->comboBox_Inst2);
    mp_patch_2.set_data1(static_cast<uint32_t>(data1));
  } else if (ui->radioButton_Record3->isChecked()) {
    play_trk3.clear();
    mp_patch_3.set_timestamp(0);
    mp_patch_3.set_status_length(
        0xC0 + ui->comboBox_Channel3->currentText().toInt() - 1);
    data1 = get_instrument(ui->comboBox_Inst3);
    mp_patch_3.set_data1(static_cast<uint32_t>(data1));
  } else if (ui->radioButton_Record4->isChecked()) {
    play_trk4.clear();
    mp_patch_4.set_timestamp(0);
    mp_patch_4.set_status_length(
        0xC0 + ui->comboBox_Channel4->currentText().toInt() - 1);
    data1 = get_instrument(ui->comboBox_Inst4);
    mp_patch_4.set_data1(static_cast<uint32_t>(data1));
  } else if (ui->radioButton_Record5->isChecked()) {
    play_trk5.clear();
    mp_patch_5.set_timestamp(0);
    mp_patch_5.set_status_length(
        0xC0 + ui->comboBox_Channel5->currentText().toInt() - 1);
    data1 = get_instrument(ui->comboBox_Inst5);
    mp_patch_5.set_data1(static_cast<uint32_t>(data1));
  } else if (ui->radioButton_Record6->isChecked()) {
    play_trk6.clear();
    mp_patch_6.set_timestamp(0);
    mp_patch_6.set_status_length(
        0xC0 + ui->comboBox_Channel6->currentText().toInt() - 1);
    data1 = get_instrument(ui->comboBox_Inst6);
    mp_patch_6.set_data1(static_cast<uint32_t>(data1));
  }
}

void MainWindow::on_pushButton_Play_clicked() {
  ui->pushButton_Play->setEnabled(false);
  // clear play_trk_player and then re-stuff with chosen tracks
  play_trk_player.clear();
  uint32_t ts_setter;
  if (ui->checkBox_Play1->isChecked()) {
    ts_setter = play_trk1.at(1).get_timestamp();
    for (auto itr : play_trk1) {
      if (itr.is_status_8n() || itr.is_status_9n()) {
        itr.set_timestamp(itr.get_timestamp() - ts_setter);
        itr.set_status_length(itr.get_status() +
                              ui->comboBox_Channel1->currentText().toInt() - 1);
        itr.set_data2(ui->horizontalSlider_Volume1->value());
      }
      play_trk_player.push_back(itr);
    }
  }
  if (ui->checkBox_Play2->isChecked()) {
    ts_setter = play_trk2.at(1).get_timestamp();
    for (auto itr : play_trk2) {
      if (itr.is_status_8n() || itr.is_status_9n()) {
        itr.set_timestamp(itr.get_timestamp() - ts_setter);
        itr.set_status_length(itr.get_status() +
                              ui->comboBox_Channel2->currentText().toInt() - 1);
        itr.set_data2(ui->horizontalSlider_Volume2->value());
      }
      play_trk_player.push_back(itr);
    }
  }
  if (ui->checkBox_Play3->isChecked()) {
    ts_setter = play_trk3.at(1).get_timestamp();
    for (auto itr : play_trk3) {
      if (itr.is_status_8n() || itr.is_status_9n()) {
        itr.set_timestamp(itr.get_timestamp() - ts_setter);
        itr.set_status_length(itr.get_status() +
                              ui->comboBox_Channel3->currentText().toInt() - 1);
        itr.set_data2(ui->horizontalSlider_Volume3->value());
      }
      play_trk_player.push_back(itr);
    }
  }
  if (ui->checkBox_Play4->isChecked()) {
    ts_setter = play_trk4.at(1).get_timestamp();
    for (auto itr : play_trk4) {
      if (itr.is_status_8n() || itr.is_status_9n()) {
        itr.set_timestamp(itr.get_timestamp() - ts_setter);
        itr.set_status_length(itr.get_status() +
                              ui->comboBox_Channel4->currentText().toInt() - 1);
        itr.set_data2(ui->horizontalSlider_Volume4->value());
      }
      play_trk_player.push_back(itr);
    }
  }
  if (ui->checkBox_Play5->isChecked()) {
    ts_setter = play_trk5.at(1).get_timestamp();
    for (auto itr : play_trk5) {
      if (itr.is_status_8n() || itr.is_status_9n()) {
        itr.set_timestamp(itr.get_timestamp() - ts_setter);
        itr.set_status_length(itr.get_status() +
                              ui->comboBox_Channel5->currentText().toInt() - 1);
        itr.set_data2(ui->horizontalSlider_Volume5->value());
      }
      play_trk_player.push_back(itr);
    }
  }
  if (ui->checkBox_Play6->isChecked()) {
    ts_setter = play_trk6.at(1).get_timestamp();
    for (auto itr : play_trk6) {
      if (itr.is_status_8n() || itr.is_status_9n()) {
        itr.set_timestamp(itr.get_timestamp() - ts_setter);
        itr.set_status_length(itr.get_status() +
                              ui->comboBox_Channel6->currentText().toInt() - 1);
        itr.set_data2(ui->horizontalSlider_Volume6->value());
      }
      play_trk_player.push_back(itr);
    }
  }
  // sort play_trk_player, which contains all messages of the tracks to be
  // played
  std::sort(play_trk_player.begin(), play_trk_player.end());

  cur_pkt = play_trk_player.begin();
  next_pkt = play_trk_player.begin();

  set_time_zero();

  timer = new QTimer(this);
  connect(timer, SIGNAL(timeout()), this, SLOT(txTimerAction()));
  timer->start();

  // reset play button functionality after playback
  ui->pushButton_Play->setEnabled(true);
}

void MainWindow::txTimerAction() {
  // get time now() for the zero reference
  timeDelayToSend(*cur_pkt);
  next_pkt = cur_pkt;
  next_pkt++;
  int msec = next_pkt->get_timestamp() - cur_pkt->get_timestamp();
  timer->start(msec);
  std::cout << msec << std::endl;
  if (next_pkt != play_trk_player.end()) cur_pkt++;
}

void MainWindow::on_pushButton_Stop_clicked() {
  if (ui->pushButton_Record->isEnabled() == false) {
    if (ui->radioButton_Record1->isChecked()) {
      // clear any existing track with the just-recorded track
      play_trk1.clear();
      // stuff the patch message into track vector (will be sorted to the front on playback)
      play_trk1.push_back(mp_patch_1);
      for (auto itr : play_trk_buffer) {
        play_trk1.push_back(itr);
      }
    } else if (ui->radioButton_Record2->isChecked()) {
        play_trk2.clear();
        play_trk2.push_back(mp_patch_2);
      for (auto itr : play_trk_buffer) {
        play_trk2.push_back(itr);
      }
    } else if (ui->radioButton_Record3->isChecked()) {
        play_trk3.clear();
        play_trk3.push_back(mp_patch_3);
      for (auto itr : play_trk_buffer) {
        play_trk3.push_back(itr);
      }
    } else if (ui->radioButton_Record4->isChecked()) {
        play_trk4.clear();
        play_trk4.push_back(mp_patch_4);
      for (auto itr : play_trk_buffer) {
        play_trk4.push_back(itr);
      }
    } else if (ui->radioButton_Record5->isChecked()) {
        play_trk5.clear();
        play_trk5.push_back(mp_patch_5);
      for (auto itr : play_trk_buffer) {
        play_trk5.push_back(itr);
      }
    } else if (ui->radioButton_Record6->isChecked()) {
        play_trk6.clear();
        play_trk6.push_back(mp_patch_6);
      for (auto itr : play_trk_buffer) {
        play_trk6.push_back(itr);
      }
    }
    play_trk_buffer.clear();
    ui->pushButton_Record->setEnabled(true);
  }
  if (ui->pushButton_Play->isEnabled() == false) {
    sendAlllNotesOff();
    ui->pushButton_Play->setEnabled(true);
  }
}
