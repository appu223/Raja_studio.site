const financeService = require('../services/financeService');

const financeController = {
  async getInvoices(req, res, next) {
    try {
      const invoices = await financeService.getInvoices();
      res.status(200).json({ success: true, data: invoices });
    } catch (err) { next(err); }
  },

  async getPayments(req, res, next) {
    try {
      const payments = await financeService.getPayments(req.query.booking_id);
      res.status(200).json({ success: true, data: payments });
    } catch (err) { next(err); }
  },

  async recordPayment(req, res, next) {
    try {
      const result = await financeService.recordPayment(req.body, req.user.id);
      res.status(201).json({ success: true, message: 'Payment recorded successfully', data: result });
    } catch (err) { next(err); }
  },

  async getExpenses(req, res, next) {
    try {
      const expenses = await financeService.getExpenses();
      res.status(200).json({ success: true, data: expenses });
    } catch (err) { next(err); }
  },

  async createExpense(req, res, next) {
    try {
      const id = await financeService.createExpense(req.body, req.user.id);
      res.status(201).json({ success: true, message: 'Expense recorded successfully', data: { id } });
    } catch (err) { next(err); }
  },
};

module.exports = financeController;
