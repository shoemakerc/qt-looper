// cmiditrack.cpp
#ifndef CMIDITRACK_H_
#include "CMidiTrack.h"
#endif

#include <iostream>
#include <cstdlib>

CMidiTrack::CMidiTrack() : channel_(0), patch_(0), volume_(100), pan_(64) {}
CMidiTrack::CMidiTrack(uint16_t channel, uint16_t patch, uint16_t volume,
                       uint16_t pan)
    : channel_(channel), patch_(patch), volume_(volume), pan_(pan) {}

// Setters
void CMidiTrack::set_channel(const uint16_t& chan) { channel_ = chan; }
void CMidiTrack::set_patch(const uint16_t& patch) { patch_ = patch; }
void CMidiTrack::set_volume(const uint16_t& vol) { volume_ = vol; }
void CMidiTrack::set_pan(const uint16_t& pan) { pan_ = pan; }

void CMidiTrack::note_on(uint32_t tm, uint16_t chan, uint16_t note,
                         uint16_t vel) {
  chan += 0x90;
  CMidiPacket43 mp{tm, chan, note, vel};
  m_trk.push_back(mp);
}

void CMidiTrack::note_off(uint32_t tm, uint16_t chan, uint16_t note) {
  chan += 0x80;
  CMidiPacket43 mp{tm, chan, note, 0};
  m_trk.push_back(mp);
}

void CMidiTrack::patch_change(uint32_t tm, uint16_t chan, uint16_t patch) {
  chan += 0xC0;
  CMidiPacket43 mp{tm, chan, patch};
  m_trk.push_back(mp);
}

void CMidiTrack::control_volume(uint32_t tm, uint16_t chan, uint16_t vol) {
  chan += 0xB0;
  CMidiPacket43 mp{tm, chan, 7, vol};
  m_trk.push_back(mp);
}

void CMidiTrack::control_pan(uint32_t tm, uint16_t chan, uint16_t pan) {
  chan += 0xB0;
  CMidiPacket43 mp{tm, chan, 10, pan};
  m_trk.push_back(mp);
}

void CMidiTrack::control_expression(uint32_t tm, uint16_t chan, uint16_t expr) {
  chan += 0xB0;
  CMidiPacket43 mp{tm, chan, 11, expr};
  m_trk.push_back(mp);
}
