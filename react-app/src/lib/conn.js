import axios from "axios";
import moment from 'moment';

const API_BASE = "http://localhost:8083/api/";
// const API_BASE = "http://178.128.68.128:8083/api/";

// FOR REACT-BIG-CALENDAR, ALL DATE STRINGS MUST BE CONVERTED TO DATES!
const slotStringsToDates = (slot) => {
  slot.start = moment(slot.start)._d;
  slot.end = moment(slot.end)._d;
  return slot
};

const dataAsDates = (data) => {
  return data.map((slot) => {
    return slotStringsToDates(slot);
  });
}

const conn = {
  getSlots: function (cb) {
    axios.get(API_BASE + 'slots').then(res => {
      console.log("response via db for GET /slots: ", res.data);
      cb(dataAsDates(res.data));
    }).catch((err) => console.log('err retrieving slots', err));
  },

  createSlot: function (slot, cb) {
    axios.post(API_BASE + 'slots', slot).then(res => {
      console.log("response via db for POST /slots: ", res.data);
      cb(slotStringsToDates(res.data));
    }).catch((err) => console.log('err creating slot', err));
  },

  updateSlot: function (id, slot, cb) {
    axios.put(API_BASE + 'slots/' + id, slot).then(res => {
      console.log("response via db for PUT /slots/:id ", res.data);
      cb(dataAsDates(res.data));
    }).catch((err) => console.log('err updating slot', err));
  },

  deleteSlot: function (id, cb) {
    axios.delete(API_BASE + 'slots/' + id).then(res => {
      console.log("response via db for DELETE /slots/:id ", res.data);
      cb(dataAsDates(res.data));
    }).catch((err) => console.log('err deleting slot', err));
  },

  sendText: function (body, cb) {
    axios.post(API_BASE + 'sms', body).then(res => {
      console.log("response via db for POST /sms: ", res.data);
      if(cb) cb(true);
    }).catch((err) => {
      console.log('err sending sms', err);
      if(cb) cb(false);
    });
  }
}

export default conn;
