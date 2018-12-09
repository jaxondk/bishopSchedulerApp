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
    axios.get(API_BASE + 'slots').then(response => {
      console.log("response via db for GET /slots: ", response.data);
      const dataAsDates = response.data.map((slot) => {
        return slotStringsToDates(slot);
      })
      cb(dataAsDates);
    }).catch((err) => console.log('err retrieving slots', err));
  },

  createSlot: function (slot, cb) {
    axios.post(API_BASE + 'slots', slot).then(response => {
      console.log("response via db for POST /slots: ", response.data);
      cb(slotStringsToDates(response.data));
    }).catch((err) => console.log('err creating slot', err));
  },

  deleteSlot: function (id, cb) {
    axios.delete(API_BASE + 'slots/' + id).then(response => {
      console.log("response via db for DELETE /slots/:id ", response.data);
      const slotsAfterDelete = response.data.map((slot) => (slotStringsToDates(slot)));
      cb(slotStringsToDates(slotsAfterDelete));
    }).catch((err) => console.log('err deleting slot', err));
  },

  sendText: function (body, cb) {
    axios.post(API_BASE + 'sms', body).then(response => {
      console.log("response via db for POST /sms: ", response.data);
      cb();
    }).catch((err) => console.log('err sending sms', err));
  }
}

export default conn;