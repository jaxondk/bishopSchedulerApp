const express = require('express');
const router = express.Router();

const slot2Controller = require('../../controllers/slot2');

router.get('/slots', slot2Controller.all);
router.post('/slots', slot2Controller.create);
router.put('/slots/:slotId', slot2Controller.updateById);

module.exports = router;
