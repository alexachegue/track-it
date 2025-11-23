const express = require('express');
const router = express.Router();
const ShiftController = require('../controllers/shiftController');
const authToken = require('../middleware/auth');

router.use(authToken);

router.get('/', ShiftController.getAllShifts);
router.get('/:id', ShiftController.getShiftById);
router.post('/', ShiftController.createShift);
router.put('/:id', ShiftController.updateShift);
router.delete('/:id', ShiftController.deleteShift);

module.exports = router;