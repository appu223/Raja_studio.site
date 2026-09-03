import api from './api';

export const reportService = {
  getDashboard: () => api.get('/reports/dashboard'),
  getRevenueReport: () => api.get('/reports/revenue'),
  getNotifications: () => api.get('/reports/notifications'),
  markNotificationRead: (id) => api.patch(`/reports/notifications/${id}/read`),
};
