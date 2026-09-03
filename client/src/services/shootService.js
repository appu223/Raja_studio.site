import api from './api';

export const shootService = {
  getAll: (status = '') => api.get(`/shoot-sessions${status ? `?status=${status}` : ''}`),
  getStaff: () => api.get('/shoot-sessions/staff-list'),
  getById: (id) => api.get(`/shoot-sessions/${id}`),
  create: (data) => api.post('/shoot-sessions', data),
  updateStatus: (id, status, notes = '') => api.patch(`/shoot-sessions/${id}/status`, { status, notes }),
};