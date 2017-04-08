// cmiditrack.h
#ifndef CMIDITRACK_H_
#define CMIDITRACK_H_

#ifndef CMIDIPACKET32_H_
#include "CMidiPacket43.h"
#endif

#include <vector>

class CMidiTrack {
  uint16_t channel_;
  uint16_t patch_;
  uint16_t volume_;
  uint16_t pan_;

 public:
  std::vector<CMidiPacket43> m_trk;

  CMidiTrack();
  CMidiTrack(uint16_t channel, uint16_t patch, uint16_t volume, uint16_t pan);

  ~CMidiTrack() = default;
  CMidiTrack(const CMidiTrack& other) = default;
  CMidiTrack(CMidiTrack&& other) = default;
  CMidiTrack& operator=(const CMidiTrack& other) = default;
  CMidiTrack& operator=(CMidiTrack&& other) = default;

  // Getters
  uint16_t get_channel() { return channel_; }
  uint16_t get_patch() { return patch_; }
  uint16_t get_volume() { return volume_; }
  uint16_t get_pan() { return pan_; }

  // Setters
  void set_channel(const uint16_t& chan);
  void set_patch(const uint16_t& patch);
  void set_volume(const uint16_t& vol);
  void set_pan(const uint16_t& pan);

  // Midi Message create functions
  void note_on(uint32_t tm, uint16_t chan, uint16_t note, uint16_t vel);

  void note_off(uint32_t tm, uint16_t chan, uint16_t note);

  void patch_change(uint32_t tm, uint16_t chan, uint16_t patch);

  void control_volume(uint32_t tm, uint16_t chan, uint16_t vol);

  void control_pan(uint32_t tm, uint16_t chan, uint16_t pan);

  void control_expression(uint32_t tm, uint16_t chan, uint16_t expr);

  // pure virtual function
  virtual void write_track() = 0;
};

#endif  // CMIDITRACK_H
