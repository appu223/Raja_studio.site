import api from './api';

export const customerService = {
  getAll: (search = '') => api.get(`/customers${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};