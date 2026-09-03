import api from './api';

export const adminService = {
  getUsers: () => api.get('/admin/users'),
  getRoles: () => api.get('/admin/roles'),
  createUser: (data) => api.post('/admin/users', data),
  toggleStatus: (id) => api.patch(`/admin/users/${id}/toggle`),
  getCalendar: (start = '', end = '') => api.get(`/admin/calendar?start=${start}&end=${end}`),
  getAuditLogs: () => api.get('/admin/audit-logs'),
};