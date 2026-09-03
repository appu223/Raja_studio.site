const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/', bookingController.getAll);
router.get('/:id', bookingController.getOne);
router.post('/', roleMiddleware(['Admin', 'Manager']), bookingController.create);
router.patch('/:id/status', roleMiddleware(['Admin', 'Manager']), bookingController.updateStatus);

module.exports = router;
