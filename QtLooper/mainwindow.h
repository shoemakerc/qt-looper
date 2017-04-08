/***************************************************************
*
*	CS 312
*	Final Project - QtLooper
*	mainwindow.h
*	Chris Shoemaker shoemakerc
*	3/12/15
*
***************************************************************/

#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QWidget>
#include <QComboBox>
#include <QAbstractButton>
#include <QTimer>

#ifndef CMIDIPACKET43_H
#include "CMidiPacket43.h"
#endif

#include "RtMidi.h"

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow {
  Q_OBJECT

 public:
  explicit MainWindow(QWidget *parent = 0);
  ~MainWindow();

 private
slots:

  void txTimerAction();

  void on_comboBox_Category1_activated(const QString &arg1);

  void on_comboBox_Category2_activated(const QString &arg1);

  void on_comboBox_Category3_activated(const QString &arg1);

  void on_comboBox_Category4_activated(const QString &arg1);

  void on_comboBox_Category5_activated(const QString &arg1);

  void on_comboBox_Category6_activated(const QString &arg1);

  void on_comboBox_Channel1_activated(const QString &arg1);

  void on_comboBox_Channel2_activated(const QString &arg1);

  void on_comboBox_Channel3_activated(const QString &arg1);

  void on_comboBox_Channel4_activated(const QString &arg1);

  void on_comboBox_Channel5_activated(const QString &arg1);

  void on_comboBox_Channel6_activated(const QString &arg1);

  void on_radioButton_Record1_clicked();

  void on_radioButton_Record2_clicked();

  void on_radioButton_Record3_clicked();

  void on_radioButton_Record4_clicked();

  void on_radioButton_Record5_clicked();

  void on_radioButton_Record6_clicked();

  void on_horizontalSlider_Volume1_valueChanged(int value);

  void on_horizontalSlider_Volume2_valueChanged(int value);

  void on_horizontalSlider_Volume3_valueChanged(int value);

  void on_horizontalSlider_Volume4_valueChanged(int value);

  void on_horizontalSlider_Volume5_valueChanged(int value);

  void on_horizontalSlider_Volume6_valueChanged(int value);

  void on_pushButton_Record_clicked();

  void on_pushButton_Play_clicked();

  void on_pushButton_Stop_clicked();

 private:
  Ui::MainWindow *ui;

  QTimer *timer;

  int get_DLSMusicDevice_port();

  bool chooseMidiOutPort(RtMidiOut *rtmidi);

  bool chooseMidiInPort(RtMidiIn *rtmidi);

  bool chooseMidiOutPort(RtMidiOut *mout, unsigned int dls_port);

  void sendAlllNotesOff();

  void init_controls();

  void choose_instruments(QComboBox *instruments, const QString &arg1);

  void set_categories(QComboBox *instruments, QComboBox *category,
                      const QString &arg1);

  int get_instrument(QComboBox *instruments);
};

#endif  // MAINWINDOW_H
