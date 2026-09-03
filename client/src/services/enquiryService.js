import api from './api';

export const enquiryService = {
  getAll: (status = '') => api.get(`/enquiries${status ? `?status=${status}` : ''}`),
  getById: (id) => api.get(`/enquiries/${id}`),
  create: (data) => api.post('/enquiries', data),
  updateStatus: (id, status) => api.patch(`/enquiries/${id}/status`, { status }),
  addFollowUp: (id, data) => api.post(`/enquiries/${id}/follow-ups`, data),
};
