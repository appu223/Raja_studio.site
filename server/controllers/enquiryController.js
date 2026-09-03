const enquiryService = require('../services/enquiryService');

const enquiryController = {
  async getAll(req, res, next) {
    try {
      const data = await enquiryService.getEnquiries(req.query.status);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      const data = await enquiryService.getEnquiryById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const data = await enquiryService.createEnquiry(req.body);
      res.status(201).json({ success: true, message: 'Enquiry captured successfully', data });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const data = await enquiryService.updateStatus(req.params.id, req.body.status);
      res.status(200).json({ success: true, message: 'Enquiry status updated', data });
    } catch (err) {
      next(err);
    }
  },

  async addFollowUp(req, res, next) {
    try {
      await enquiryService.addFollowUp(req.params.id, req.body);
      res.status(201).json({ success: true, message: 'Follow-up scheduled' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = enquiryController;