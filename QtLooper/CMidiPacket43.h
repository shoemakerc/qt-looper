// Copyright 2015 John Ellinger - free open source
/***************************************************************
*
*	CS 312
*	Homework 4.2
*	CMidiPacket43.h
*	Chris_Shoemaker shoemakerc
*	1/28/16
*
***************************************************************/

#ifndef CMIDIPACKET43_H_
#define CMIDIPACKET43_H_

#include <iostream>
#include <string>

class CMidiPacket43 {
 private:  // not really needed because they're private by default
  uint32_t timestamp_;
  uint16_t length_;
  uint16_t status_;
  uint16_t data1_;
  uint16_t data2_;

 public:
  // constructors
  CMidiPacket43();  // default
  CMidiPacket43(uint32_t ts, uint16_t st, uint16_t d1);
  CMidiPacket43(uint32_t ts, uint16_t st, uint16_t d1, uint16_t d2);
  CMidiPacket43(const std::string& str);

  // return a string fromc this CMidiPacket43's data
  std::string to_string() const;

  // print this CMidiPacket data to std::cout
  // in MIDIDisplay format accounting for message lengths of 2 or 3
  void print() const;

  // getters
  uint32_t get_timestamp() const;
  uint16_t get_length() const;
  uint16_t get_status() const;
  uint16_t get_data1() const;
  uint16_t get_data2() const;

  // setters
  void set_timestamp(const uint32_t& ts);
  // status determines the length
  // length cannot be set independently of status
  // but you doe have to set it inside this function
  void set_status_length(const uint16_t& st);
  void set_data1(const uint16_t& d1);
  void set_data2(const uint16_t& d2);

  // Utility functions
  bool is_note_off() const;
  // is_status_8n() returns true if status is between 0x80-0x8F
  // similar returns for other status messages
  bool is_status_8n() const;
  bool is_status_9n() const;
  bool is_status_An() const;
  bool is_status_Bn() const;
  bool is_status_Cn() const;
  bool is_status_Dn() const;
  bool is_status_En() const;
  bool is_status_Fn() const;

  ////////// NEW 43 ///////////
  // No 2-6 of the Big 6
  // destructor
  // default lets the compiler implement it
  ~CMidiPacket43() = default;
  // copy constructor
  // default lets the compiler implement it
  CMidiPacket43(const CMidiPacket43& rhs) = default;
  // move constructor
  // default lets the compiler implement it
  CMidiPacket43(CMidiPacket43&& rhs) = default;
  // assignement operator
  // default lets the compiler implement it
  CMidiPacket43& operator=(const CMidiPacket43& rhs) = default;
  // move assignment operator
  // default lets the compiler implement it
  CMidiPacket43& operator=(CMidiPacket43&& rhs) = default;

  // operator<< and operator>> for input and output
  friend std::istream& operator>>(std::istream& is, CMidiPacket43& mp);
  friend std::ostream& operator<<(std::ostream& os, const CMidiPacket43& mp);

  ////////// NEW  43 ///////////
  // operator== for testing equality
  friend bool operator==(const CMidiPacket43& a, const CMidiPacket43& b);
  // operator< for testing less_than for MidiPackets
  friend bool operator<(const CMidiPacket43& a, const CMidiPacket43& b);

  // helper functions for operator<
  friend bool is_timestamp_equal(const CMidiPacket43& a,
                                 const CMidiPacket43& b);
  friend bool is_status_equal(const CMidiPacket43& a, const CMidiPacket43& b);
  friend bool is_status_category_equal(const CMidiPacket43& a,
                                       const CMidiPacket43& b);
  ////////// END NEW 43 ///////////

  //////////  NEW 43 Invariant checks ///////////
 private:
  void ERROR(const std::string& msg) const;  // helper
  void invariant_check() const;
};  // end of CMidiPacket43 class

const std::string kERR_STATUS_OUT_OF_RANGE =
    "Status out of range. Must be 0x80 - 0xFF\n";
const std::string kERR_DATA1_OUT_OF_RANGE =
    "Data1 out of range. Must be 0 - 127\n";
const std::string kERR_DATA2_OUT_OF_RANGE =
    "Data2 out of range. Must be 0 - 127\n";
const std::string kERR_BAD_8n_MIDIPACKET_LENGTH = "Bad 8n MidiPacket length\n";
const std::string kERR_BAD_9n_MIDIPACKET_LENGTH = "Bad 9n MidiPacket length\n";
const std::string kERR_BAD_An_MIDIPACKET_LENGTH = "Bad An MidiPacket length\n";
const std::string kERR_BAD_Bn_MIDIPACKET_LENGTH = "Bad Bn MidiPacket length\n";
const std::string kERR_BAD_Cn_MIDIPACKET_LENGTH = "Bad Cn MidiPacket length\n";
const std::string kERR_BAD_Dn_MIDIPACKET_LENGTH = "Bad Dn MidiPacket length\n";
const std::string kERR_BAD_En_MIDIPACKET_LENGTH = "Bad En MidiPacket length\n";
const std::string kERR_Fn_MESSAGES_NOT_SUPPORTED =
    "0xFn messages not supported\n";
////////// END NEW 43 Invariant checks ///////////

#endif  // CMIDIPACKET43_H_
