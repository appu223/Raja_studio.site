const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware(['Admin', 'Manager']));

router.get('/invoices', financeController.getInvoices);
router.get('/payments', financeController.getPayments);
router.post('/payments', financeController.recordPayment);
router.get('/expenses', financeController.getExpenses);
router.post('/expenses', financeController.createExpense);

module.exports = router;
