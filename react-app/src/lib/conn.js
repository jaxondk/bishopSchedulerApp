import axios from "axios";

const API_BASE = "http://localhost:8083/api/";

const conn = {
  getSlots: function (cb) {
    axios.get(API_BASE + `slots`).then(response => {
      console.log("response via db: ", response.data);
      cb(response.data);
    }).catch((err) => console.log('err retrieving slots', err));
  },

  createSlot: function (slot, cb) {
    axios.post(API_BASE + 'slots', slot).then(response => {
      console.log("response via db: ", response.data);
      cb(response.data);
    }).catch((err) => console.log('err creating slot', err));
  },
}

export default conn;