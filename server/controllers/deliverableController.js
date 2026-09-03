const deliverableService = require('../services/deliverableService');
const customerPortalRepository = require('../repositories/customerPortalRepository');

const deliverableController = {
  async getByTask(req, res, next) {
    try {
      const data = await deliverableService.getDeliverablesByTask(req.params.taskId);
      res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
  },

  async getMyDeliverables(req, res, next) {
    try {
      const customer = await customerPortalRepository.findCustomerByUserId(req.user.id);
      if (!customer) return res.status(200).json({ success: true, data: [] });
      const data = await deliverableService.getDeliverablesForCustomer(customer.id);
      res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const deliverable = await deliverableService.createDeliverable(req.body, req.user.id);
      res.status(201).json({ success: true, message: 'Deliverable created and ready for dispatch', data: deliverable });
    } catch (err) { next(err); }
  },
};

module.exports = deliverableController;
