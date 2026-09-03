import api from './api';

export const bookingService = {
  getAll: (status = '') => api.get(`/bookings${status ? `?status=${status}` : ''}`),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
};