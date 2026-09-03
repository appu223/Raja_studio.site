import api from './api';

export const serviceCatalogService = {
  getServices: (activeOnly = false) => api.get(`/services${activeOnly ? '?active=true' : ''}`),
  createService: (data) => api.post('/services', data),
  updateService: (id, data) => api.put(`/services/${id}`, data),
  toggleService: (id) => api.patch(`/services/${id}/toggle`),

  getPackages: (activeOnly = false) => api.get(`/services/packages${activeOnly ? '?active=true' : ''}`),
  createPackage: (data) => api.post('/services/packages', data),
};