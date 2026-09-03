const customerPortalRepository = require('../repositories/customerPortalRepository');
const customerRepository = require('../repositories/customerRepository');
const bookingService = require('./bookingService');
const financeService = require('./financeService');

const customerPortalService = {
  async getResolvedCustomer(userId) {
    const customer = await customerPortalRepository.findCustomerByUserId(userId);
    if (!customer) {
      const err = new Error('No client profile is linked to this login account.');
      err.statusCode = 404;
      throw err;
    }
    return customer;
  },

  async getDashboard(userId) {
    const customer = await this.getResolvedCustomer(userId);
    return { customer, summary: await customerPortalRepository.getCustomerSummary(customer.id) };
  },

  async getBookings(userId) {
    const customer = await this.getResolvedCustomer(userId);
    return await customerPortalRepository.getCustomerBookings(customer.id);
  },

  async getFinance(userId) {
    const customer = await this.getResolvedCustomer(userId);
    return await customerPortalRepository.getCustomerFinance(customer.id);
  },

  async getGalleries(userId) {
    const customer = await this.getResolvedCustomer(userId);
    return await customerPortalRepository.getCustomerGalleries(customer.id);
  },

  async submitBookingRequest(userId, payload) {
    const customer = await this.getResolvedCustomer(userId);
    return await bookingService.createBooking({ ...payload, customer_id: customer.id, discount_amount: 0 }, userId);
  },

  async processOnlinePayment(userId, payload) {
    const customer = await this.getResolvedCustomer(userId);
    const { booking_id, amount, payment_method } = payload;
    const bookings = await customerPortalRepository.getCustomerBookings(customer.id);
    if (!bookings.find((booking) => booking.id === parseInt(booking_id, 10))) {
      const err = new Error('Unauthorized: You can only settle payments for your own bookings.');
      err.statusCode = 403;
      throw err;
    }
    return await financeService.recordPayment(
      { booking_id, amount, payment_type: 'balance', payment_method: payment_method || 'upi', transaction_reference: `ONLINE-${Date.now().toString().slice(-8)}` },
      userId
    );
  },

  async updateProfile(userId, data) {
    const customer = await this.getResolvedCustomer(userId);
    await customerPortalRepository.updateProfile(customer.id, data);
    return await customerRepository.findById(customer.id);
  },
};

module.exports = customerPortalService;
