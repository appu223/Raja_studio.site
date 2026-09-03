const customerService = require('../services/customerService');

const customerController = {
  async getAll(req, res, next) {
    try {
      const result = await customerService.getCustomers(req.query);
      res.status(200).json({ success: true, data: result.customers, meta: { total: result.total } });
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      const customer = await customerService.getCustomerById(req.params.id);
      res.status(200).json({ success: true, data: customer });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const newCustomer = await customerService.createCustomer(req.body);
      res.status(201).json({ success: true, message: 'Customer created successfully', data: newCustomer });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await customerService.updateCustomer(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Customer updated successfully', data: updated });
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await customerService.deleteCustomer(req.params.id);
      res.status(200).json({ success: true, message: 'Customer deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = customerController;