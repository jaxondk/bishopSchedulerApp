const express = require('express');
const router = express.Router();

const slot2Controller = require('../../controllers/slot2');
const sendSms = require('../../controllers/sms')

// SLOTS
router.get('/slots', slot2Controller.all);
router.post('/slots', slot2Controller.create);
router.put('/slots/:slotId', slot2Controller.updateById);
router.delete('/slots/:slotId', slot2Controller.delete);

// SMS
router.post('/sms', sendSms);

module.exports = router;
