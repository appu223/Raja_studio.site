const customerPortalService = require('../services/customerPortalService');

const customerPortalController = {
  async getDashboard(req, res, next) {
    try { res.status(200).json({ success: true, data: await customerPortalService.getDashboard(req.user.id) }); } catch (err) { next(err); }
  },
  async getBookings(req, res, next) {
    try { res.status(200).json({ success: true, data: await customerPortalService.getBookings(req.user.id) }); } catch (err) { next(err); }
  },
  async getFinance(req, res, next) {
    try { res.status(200).json({ success: true, data: await customerPortalService.getFinance(req.user.id) }); } catch (err) { next(err); }
  },
  async getGalleries(req, res, next) {
    try { res.status(200).json({ success: true, data: await customerPortalService.getGalleries(req.user.id) }); } catch (err) { next(err); }
  },
  async createBookingRequest(req, res, next) {
    try { res.status(201).json({ success: true, message: 'Booking requested successfully', data: await customerPortalService.submitBookingRequest(req.user.id, req.body) }); } catch (err) { next(err); }
  },
  async submitOnlinePayment(req, res, next) {
    try { res.status(200).json({ success: true, message: 'Payment processed successfully', data: await customerPortalService.processOnlinePayment(req.user.id, req.body) }); } catch (err) { next(err); }
  },
  async updateProfile(req, res, next) {
    try { res.status(200).json({ success: true, message: 'Profile updated successfully', data: await customerPortalService.updateProfile(req.user.id, req.body) }); } catch (err) { next(err); }
  },
};

module.exports = customerPortalController;
