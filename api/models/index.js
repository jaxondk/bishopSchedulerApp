const mongoose = require('mongoose');

const Schema = mongoose.Schema,
  model = mongoose.model.bind(mongoose);

const slot2Schema = new Schema ({
  start: Date,
  end: Date,
  title: String,
  appointment: {
    phone: Number,
    name: String,
  }
});

const Slot2 = model('Slot2', slot2Schema, 'slots2');

module.exports = {
  Slot2
};
