const mongoose = require('mongoose');

const Schema = mongoose.Schema,
  model = mongoose.model.bind(mongoose),
  ObjectId = mongoose.Schema.Types.ObjectId;


  const slotSchema = new Schema ({
    // id: ObjectId,
    slot_time: String,
    slot_date: String,
    slot_durationInMinutes: Number,
    slot_time_hour: Number,
    slot_time_minute: Number,
    slot_time_ampm: String,
    created_at: Date
  });

const Slot = model('Slot', slotSchema);

const appointmentSchema = new Schema({
  id: ObjectId,
  name: String,
  phone: Number,
  slot:{type: ObjectId, ref: 'Slot'},
  created_at: Date
});

const Appointment = model('Appointment', appointmentSchema);

module.exports = {
  Appointment, Slot
};
