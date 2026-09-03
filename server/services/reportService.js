const reportRepository = require('../repositories/reportRepository');

const reportService = {
  async getDashboard() {
    return await reportRepository.getDashboardMetrics();
  },

  async getRevenueBreakdown() {
    return await reportRepository.getRevenueReport();
  },

  async getNotifications(userId) {
    return await reportRepository.getUserNotifications(userId);
  },

  async markRead(id, userId) {
    await reportRepository.markNotificationRead(id, userId);
    return true;
  },
};

module.exports = reportService;
