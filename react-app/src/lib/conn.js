import axios from "axios";
import moment from 'moment';

const API_BASE = "http://localhost:8083/api/";

// FOR REACT-BIG-CALENDAR, ALL DATE STRINGS MUST BE CONVERTED TO DATES!
const slotStringsToDates = (slot) => {
  slot.start = moment(slot.start)._d;
  slot.end = moment(slot.end)._d;
  return slot
};

const conn = {
  getSlots: function (cb) {
    axios.get(API_BASE + 'slots').then(res => {
      console.log("response via db for GET /slots: ", res.data);
      const dataAsDates = res.data.map((slot) => {
        return slotStringsToDates(slot);
      })
      cb(dataAsDates);
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
      cb(slotStringsToDates(res.data));
    }).catch((err) => console.log('err deleting slot', err));
  },

  deleteSlot: function (id, cb) {
    axios.delete(API_BASE + 'slots/' + id).then(res => {
      console.log("response via db for DELETE /slots/:id ", res.data);
      const slotsAfterDelete = res.data.map((slot) => (slotStringsToDates(slot)));
      cb(slotStringsToDates(slotsAfterDelete));
    }).catch((err) => console.log('err deleting slot', err));
  },

  sendText: function (body) {
    axios.post(API_BASE + 'sms', body).then(res => {
      console.log("response via db for POST /sms: ", res.data);
    }).catch((err) => console.log('err sending sms', err));
  }
}

export default conn;