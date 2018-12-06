const Model = require('../models/index');
const Slot2 = Model.Slot2;

const slot2Controller = {
  all (req, res) {
    // Returns all Slots
    Slot2.find({})
      .exec((err, slots) => res.json(slots))
  },
  create (req, res) {
    var body = req.body;

    var newSlot = new Slot2({
      start: body.start,
      end: body.end,
      appointment: body.appointment
    });
    newSlot.save((err, saved) => {
      //Returns the new Slot2
      //after a successful save
      Slot2
        .findOne({ _id: saved._id })
        .exec((err, savedSlot) => res.json(savedSlot));
    })
  },
  updateById (req, res) {
    const id = req.params.slotId
    const update = req.body;
    Slot2.findByIdAndUpdate(id, update, { new: true }, (err, slotToUpdate) => {
      if (err) return res.status(500).send(err);
      return res.send(slotToUpdate);
    });
  }

  //TODO
  // findByDate (req, res) { 
  //   var slot_date = req.params.slot_date;
  //   console.log('Slot2 date: ', slot_date);
  //   //slot_date = '2017-11-09';

  //   //Returns all Slot2 with present date
  //   Slot2.find({})
  //     .where('slot_date').equals(slot_date)
  //     .exec((err, slots) => res.json(slots));
  // }
};

module.exports = slot2Controller;