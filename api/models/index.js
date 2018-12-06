const mongoose = require('mongoose');

const Schema = mongoose.Schema,
  model = mongoose.model.bind(mongoose),
  ObjectId = mongoose.Schema.Types.ObjectId;


const slotSchema = new Schema ({
  slot_time: String,
  slot_date: String,
  created_at: Date
});

const Slot = model('Slot', slotSchema);

const appointmentSchema = new Schema({
  id: ObjectId,
  name: String,
  phone: Number,
  slots:{type: ObjectId, ref: 'Slot'},
  created_at: Date
});

const Appointment = model('Appointment', appointmentSchema);

const slot2Schema = new Schema ({
  start: Date,
  end: Date,
  appointment: {
    title: String,
    name: String,
    phone: Number,
  }
});

const Slot2 = model('Slot2', slot2Schema, 'slots2');

module.exports = {
  Appointment, Slot, Slot2
};
