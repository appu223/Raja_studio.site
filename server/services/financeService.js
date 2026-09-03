const financeRepository = require('../repositories/financeRepository');
const bookingRepository = require('../repositories/bookingRepository');

const financeService = {
  async getInvoices() {
    return await financeRepository.getAllInvoices();
  },

  async getPayments(bookingId) {
    if (bookingId) return await financeRepository.getPaymentsByBooking(bookingId);
    return await financeRepository.getAllPayments();
  },

  async recordPayment(payload, receivedByUserId) {
    const { booking_id, amount, payment_type, payment_method, transaction_reference } = payload;
    if (!booking_id || !amount || parseFloat(amount) <= 0) {
      const err = new Error('Valid booking ID and positive payment amount are required');
      err.statusCode = 400;
      throw err;
    }

    const booking = await bookingRepository.findById(booking_id);
    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    const outstandingBalance = Math.max(0, Number(booking.total_amount) - Number(booking.total_paid));
    const payAmount = parseFloat(amount);
    if (payAmount > outstandingBalance) {
      const err = new Error(`Payment of ₹${payAmount} exceeds remaining balance of ₹${outstandingBalance.toFixed(2)}`);
      err.statusCode = 400;
      throw err;
    }

    const paymentNumber = `REC-${Date.now().toString().slice(-6)}`;
    const paymentId = await financeRepository.recordPayment({
      payment_number: paymentNumber,
      booking_id,
      amount: payAmount,
      payment_type: payment_type || (payAmount >= outstandingBalance ? 'full' : 'advance'),
      payment_method: payment_method || 'cash',
      transaction_reference,
      received_by_user_id: receivedByUserId,
    });

    return { payment_id: paymentId, payment_number: paymentNumber, amount: payAmount };
  },

  async getExpenses() {
    return await financeRepository.getAllExpenses();
  },

  async createExpense(payload, userId) {
    const { category, description, amount, expense_date, receipt_url } = payload;
    if (!category || !description || !amount || !expense_date || parseFloat(amount) <= 0) {
      const err = new Error('Category, description, date, and positive amount are required');
      err.statusCode = 400;
      throw err;
    }

    const id = await financeRepository.createExpense({
      category,
      description,
      amount: parseFloat(amount),
      expense_date,
      recorded_by_user_id: userId,
      receipt_url,
    });
    return id;
  },
};

module.exports = financeService;
