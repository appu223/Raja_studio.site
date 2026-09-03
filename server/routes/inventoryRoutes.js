const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/equipment', inventoryController.getAll);
router.post('/equipment', roleMiddleware(['Admin', 'Manager']), inventoryController.create);
router.post('/checkout', roleMiddleware(['Admin', 'Manager', 'Photographer']), inventoryController.checkout);
router.post('/checkin', roleMiddleware(['Admin', 'Manager', 'Photographer']), inventoryController.checkin);
router.get('/transactions', inventoryController.getTransactions);

module.exports = router;
