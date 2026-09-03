import api from './api';

export const customerPortalService = {
  getDashboard: () => api.get('/customer-portal/dashboard'),
  getBookings: () => api.get('/customer-portal/bookings'),
  getFinance: () => api.get('/customer-portal/finance'),
  getGalleries: () => api.get('/customer-portal/galleries'),
  requestBooking: (data) => api.post('/customer-portal/bookings', data),
  makePayment: (data) => api.post('/customer-portal/pay', data),
  updateProfile: (data) => api.put('/customer-portal/profile', data),
};