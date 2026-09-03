import api from './api';

export const editingService = {
  getQueue: (status = '') => api.get(`/editing/queue${status ? `?status=${status}` : ''}`),
  getEditors: () => api.get('/editing/editors'),
  getById: (id) => api.get(`/editing/${id}`),
  create: (data) => api.post('/editing', data),
  updateStatus: (id, status, qc_notes = '') => api.patch(`/editing/${id}/status`, { status, qc_notes }),
};