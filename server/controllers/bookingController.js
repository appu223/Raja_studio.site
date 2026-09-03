const bookingService = require('../services/bookingService');

const bookingController = {
  async getAll(req, res, next) {
    try {
      const bookings = await bookingService.getBookings(req.query);
      res.status(200).json({ success: true, data: bookings });
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      res.status(200).json({ success: true, data: booking });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const booking = await bookingService.createBooking(req.body, req.user.id);
      res.status(201).json({ success: true, message: 'Booking created successfully', data: booking });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const updated = await bookingService.updateStatus(req.params.id, req.body.status);
      res.status(200).json({ success: true, message: 'Booking status updated successfully', data: updated });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = bookingController;
