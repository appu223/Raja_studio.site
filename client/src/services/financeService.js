import api from './api';

export const financeService = {
  getInvoices: () => api.get('/finance/invoices'),
  getPayments: (bookingId = '') => api.get(`/finance/payments${bookingId ? `?booking_id=${bookingId}` : ''}`),
  recordPayment: (data) => api.post('/finance/payments', data),
  getExpenses: () => api.get('/finance/expenses'),
  createExpense: (data) => api.post('/finance/expenses', data),
};