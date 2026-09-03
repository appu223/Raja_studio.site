import api from './api';

export const inventoryService = {
  getEquipment: () => api.get('/inventory/equipment'),
  createEquipment: (data) => api.post('/inventory/equipment', data),
  checkout: (data) => api.post('/inventory/checkout', data),
  checkin: (data) => api.post('/inventory/checkin', data),
  getTransactions: () => api.get('/inventory/transactions'),
};