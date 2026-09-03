const reportService = require('../services/reportService');

const reportController = {
  async getDashboard(req, res, next) {
    try {
      const data = await reportService.getDashboard();
      res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
  },

  async getRevenue(req, res, next) {
    try {
      const data = await reportService.getRevenueBreakdown();
      res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
  },

  async getNotifications(req, res, next) {
    try {
      const data = await reportService.getNotifications(req.user.id);
      res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
  },

  async markNotificationRead(req, res, next) {
    try {
      await reportService.markRead(req.params.id, req.user.id);
      res.status(200).json({ success: true, message: 'Notification marked as read' });
    } catch (err) { next(err); }
  },
};

module.exports = reportController;
