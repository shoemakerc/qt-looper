#-------------------------------------------------
#
# Project created by QtCreator 2016-03-03T21:39:19
#
#-------------------------------------------------

QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = QtLooper
TEMPLATE = app


SOURCES += main.cpp\
        mainwindow.cpp \
    RtMidi.cpp \
    CMidiPacket43.cpp

HEADERS  += mainwindow.h \
    RtMidi.h \
    CMidiPacket43.h

FORMS    += mainwindow.ui

CONFIG += C++11

macx {
    INCLUDEPATH += /Library/Frameworks/
    QMAKE_LFLAGS += -F/Library/Frameworks
    QMAKE_CXXFLAGS += -D__MACOSX_CORE__
    LIBS += -framework CoreFoundation \
        -framework CoreMIDI \
        -framework CoreAudio
    QMAKE_CXXFLAGS_WARN_ON += -Wno-unknown-pragmas
    QMAKE_MAC_SDK = macosx10.10
}
