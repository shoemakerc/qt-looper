// Copyright 2015 John Ellinger - free open source
/***************************************************************
*
*	CS 312
*	Homework 3.3
*	CMidiPacket43.cpp
*	Chris_Shoemaker shoemakerc
*	1/24/16
*
***************************************************************/

#include <iostream>
#include <string>

#ifndef CMIDIPACKET43_H_
#include "CMidiPacket43.h"
#endif

#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <stdexcept>

// the C++ method of initializing constructors is to use a colon
// after the function declaration followed by a comma separated list
// of class data members using curly brace initialization
// the body of the constructor is often empty
// DO NOT CHANGE
CMidiPacket43::CMidiPacket43()
    : timestamp_{0}, length_{3}, status_{0x80}, data1_{0}, data2_{0} {
  invariant_check();
  // empty body
}

// YOU WRITE
// use colon - curly braces - parameters inside curlies
CMidiPacket43::CMidiPacket43(uint32_t ts, uint16_t st, uint16_t d1)
    : timestamp_{ts}, length_{2}, status_{st}, data1_{d1} {
  invariant_check();
}

// YOU WRITE
// use colon - curly braces - parameters inside curlies
CMidiPacket43::CMidiPacket43(uint32_t ts, uint16_t st, uint16_t d1, uint16_t d2)
    : timestamp_{ts}, length_{3}, status_{st}, data1_{d1}, data2_{d2} {
  invariant_check();
}

// YOU WRITE
// Initialize the CMidiPacket43 data from a string parameter.
// The string is valid MIDIDisplay format.
// Convert the string elements to numbers.
// Remember status_ is hex in the string.
// Assign the numbers to the MIDIPacket data members.
// Assign the length_ at the same time as the status_.
CMidiPacket43::CMidiPacket43(const std::string& str) {
  std::istringstream iss(str);
  std::string token;

  iss >> token;
  timestamp_ = std::stoi(token);

  iss >> token;
  status_ = std::stoi(token, 0, 16);

  iss >> token;
  data1_ = std::stoi(token);

  if (iss >> token) {
    length_ = 3;
    data2_ = std::stoi(token);
  } else {
    length_ = 2;
  }
  invariant_check();
}

// YOU WRITE
// Convert the CMidiPacket43 data to a string.
// Account for 1 data byte message or 2 data byte messages.
// Separate numbers with a single tab char.
// Status is hex number without 0x prefix.
// Length should be set at the same time as statu.
// Length will never be displayed in MIDIDisplay.
// timestamp_, data1_, and data2_ (if used) are decimal numbers.
std::string CMidiPacket43::to_string() const {
  const char kTAB = '\t';

  std::ostringstream oss;
  oss << std::hex << status_;

  if (length_ == 2) {
    return std::to_string(timestamp_) + kTAB + oss.str() + kTAB +
           std::to_string(data1_);
  } else {
    return std::to_string(timestamp_) + kTAB + oss.str() + kTAB +
           std::to_string(data1_) + kTAB + std::to_string(data2_);
  }
}

void CMidiPacket43::print() const { std::cout << *this; }

uint32_t CMidiPacket43::get_timestamp() const {
  invariant_check();
  return timestamp_;
}
uint16_t CMidiPacket43::get_length() const {
  invariant_check();
  return length_;
}
uint16_t CMidiPacket43::get_status() const {
  invariant_check();
  return status_;
}
uint16_t CMidiPacket43::get_data1() const {
  invariant_check();
  return data1_;
}
uint16_t CMidiPacket43::get_data2() const {
  invariant_check();
  return data2_;
}

void CMidiPacket43::set_timestamp(const uint32_t& ts) {
  timestamp_ = ts;
  invariant_check();
}
void CMidiPacket43::set_status_length(const uint16_t& st) {
  if (st >= 0xD0 && st <= 0xDF) {
    length_ = 2;
  } else if (st >= 0xC0 && st <= 0xCF) {
    length_ = 2;
  } else {
    length_ = 3;
  }
  status_ = st;
  invariant_check();
}
void CMidiPacket43::set_data1(const uint16_t& d1) {
  data1_ = d1;
  invariant_check();
}
void CMidiPacket43::set_data2(const uint16_t& d2) {
  data2_ = d2;
  invariant_check();
}

bool CMidiPacket43::is_note_off() const {
  if (status_ >= 0x80 && status_ <= 0x8F) {
    return true;
  } else if (status_ >= 0x90 && status_ <= 0x9F) {
    if (data2_ == 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
bool CMidiPacket43::is_status_8n() const {
  if (status_ >= 0x80 && status_ <= 0x8F) {
    return true;
  } else {
    return false;
  }
}
bool CMidiPacket43::is_status_9n() const {
  if (status_ >= 0x90 && status_ <= 0x9F) {
    return true;
  } else {
    return false;
  }
}
bool CMidiPacket43::is_status_An() const {
  if (status_ >= 0xA0 && status_ <= 0xAF) {
    return true;
  } else {
    return false;
  }
}
bool CMidiPacket43::is_status_Bn() const {
  if (status_ >= 0xB0 && status_ <= 0xBF) {
    return true;
  } else {
    return false;
  }
}
bool CMidiPacket43::is_status_Cn() const {
  if (status_ >= 0xC0 && status_ <= 0xCF) {
    return true;
  } else {
    return false;
  }
}
bool CMidiPacket43::is_status_Dn() const {
  if (status_ >= 0xD0 && status_ <= 0xDF) {
    return true;
  } else {
    return false;
  }
}
bool CMidiPacket43::is_status_En() const {
  if (status_ >= 0xE0 && status_ <= 0xEF) {
    return true;
  } else {
    return false;
  }
}
bool CMidiPacket43::is_status_Fn() const {
  if (status_ >= 0xF0 && status_ <= 0xFF) {
    return true;
  } else {
    return false;
  }
}

// const ref parameter because mp will not be changed
std::ostream& operator<<(std::ostream& os, const CMidiPacket43& mp) {
  // use the ostream os the same as you would std::cout for example
  // os << mp.status_; etc.
  // you must return os
  mp.invariant_check();
  if (mp.length_ == 2) {
    os << mp.timestamp_ << '\t' << std::hex << mp.status_ << '\t' << std::dec
       << mp.data1_ << '\n';
  } else {
    os << mp.timestamp_ << '\t' << std::hex << mp.status_ << '\t' << std::dec
       << mp.data1_ << '\t' << mp.data2_ << '\n';
  }
  return os;
}

// removed const from mp because mp will be changed when reading from input
// stream
std::istream& operator>>(std::istream& is, CMidiPacket43& mp) {
  // use the istream os the same as you would std::cin for example
  // Hint: checkout is.getline...
  is >> mp.timestamp_;
  is >> std::hex >> mp.status_;
  if (mp.status_ >= 0xC0 && mp.status_ <= 0xDF) {
    mp.length_ = 2;
    is >> std::dec >> mp.data1_;
  } else {
    mp.length_ = 3;
    is >> std::dec >> mp.data1_;
    is >> mp.data2_;
  }
  // you must return istrm
  return is;
  mp.invariant_check();
}

// the most complicated overload in CMidiPacket43
bool operator<(const CMidiPacket43& a, const CMidiPacket43& b) {
  a.invariant_check();
  b.invariant_check();
  if (a == b) {
    return false;
  }
  if (a.timestamp_ < b.timestamp_) {
    return true;
  } else if (a.timestamp_ == b.timestamp_ && a.is_status_8n()) {
    return true;
  } else if (a.timestamp_ == b.timestamp_ && a.is_status_9n() &&
             a.data2_ == 0) {
    return true;
  } else if (a.timestamp_ == b.timestamp_ && a.status_ == b.status_ &&
             a.data1_ == b.data1_ && a.data2_ < b.data2_) {
    return true;
  } else if (a.timestamp_ == b.timestamp_ && a.status_ == b.status_ &&
             a.data1_ < b.data1_) {
    return true;
  } else if (a.timestamp_ == b.timestamp_ && is_status_category_equal(a, b) &&
             a.status_ < b.status_) {
    return true;
  } else if (a.timestamp_ == b.timestamp_ && !(a.is_status_8n()) &&
             !(a.is_status_9n())) {
    if (a.status_ < b.status_) {
      return false;
    } else {
      return true;
    }
  }
  return false;
}

// every member of a must be equal to its counterpart in b
bool operator==(const CMidiPacket43& a, const CMidiPacket43& b) {
  // a == b if and only if every data member is equal
  a.invariant_check();
  b.invariant_check();
  return a.timestamp_ == b.timestamp_ && a.status_ == b.status_ &&
         a.length_ == b.length_ && a.data1_ == b.data1_ && a.data2_ == b.data2_;
}

bool is_timestamp_equal(const CMidiPacket43& a, const CMidiPacket43& b) {
  return a.timestamp_ == b.timestamp_;
}
bool is_status_equal(const CMidiPacket43& a, const CMidiPacket43& b) {
  return a.status_ == b.status_;
}
bool is_status_category_equal(const CMidiPacket43& a, const CMidiPacket43& b) {
  if (a.is_status_8n() && b.is_status_8n()) {
    return true;
  } else if (a.is_status_9n() && b.is_status_9n()) {
    return true;
  } else if (a.is_status_An() && b.is_status_An()) {
    return true;
  } else if (a.is_status_Bn() && b.is_status_Bn()) {
    return true;
  } else if (a.is_status_Cn() && b.is_status_Cn()) {
    return true;
  } else if (a.is_status_Dn() && b.is_status_Dn()) {
    return true;
  } else if (a.is_status_En() && b.is_status_En()) {
    return true;
  } else if (a.is_status_Fn() && b.is_status_Fn()) {
    return true;
  } else {
    return false;
  }
}

////////// NEW 43 Invariant checks ///////////
void CMidiPacket43::ERROR(const std::string& msg) const {
  if (true) {
    std::cout << "ERROR: " << msg << std::endl;
  } else {
    throw std::logic_error(msg);
  }
}

void CMidiPacket43::invariant_check() const {
  // range check
  if ((status_ < 0x80) || (status_ >= 0xFF)) ERROR(kERR_STATUS_OUT_OF_RANGE);
  // data 1 and 2 range check
  else if (data1_ > 0x7F)
    ERROR(kERR_DATA1_OUT_OF_RANGE);
  else if ((data2_ > 0x7F) && length_ == 3)
    ERROR(kERR_DATA2_OUT_OF_RANGE);

  //  status length check
  else if (is_status_8n() && length_ != 3)
    ERROR(kERR_BAD_8n_MIDIPACKET_LENGTH);
  else if (is_status_9n() && length_ != 3)
    ERROR(kERR_BAD_9n_MIDIPACKET_LENGTH);
  else if (is_status_An() && length_ != 3)
    ERROR(kERR_BAD_An_MIDIPACKET_LENGTH);
  else if (is_status_Bn() && length_ != 3)
    ERROR(kERR_BAD_Bn_MIDIPACKET_LENGTH);
  else if (is_status_Cn() && length_ != 2)
    ERROR(kERR_BAD_Cn_MIDIPACKET_LENGTH);
  else if (is_status_Dn() && length_ != 2)
    ERROR(kERR_BAD_Dn_MIDIPACKET_LENGTH);
  else if (is_status_En() && length_ != 3)
    ERROR(kERR_BAD_En_MIDIPACKET_LENGTH);

  //  unsupported check
  else if (is_status_Fn())
    ERROR(kERR_Fn_MESSAGES_NOT_SUPPORTED);
}
////////// END NEW 43 Invariant checks ///////////
