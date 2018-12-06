const express = require('express');
const router = express.Router();

// const appointmentController = require('../../controllers/appointments');
// const slotController = require('../../controllers/slot');
const slot2Controller = require('../../controllers/slot2');

// router.get('/appointments', appointmentController.all);
router.get('/slots', slot2Controller.all);
router.post('/slots', slot2Controller.create);
router.put('/slots/:slotId', slot2Controller.updateById);
// router.post('/appointmentCreate', appointmentController.create);




module.exports = router;
