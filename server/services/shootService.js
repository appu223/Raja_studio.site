const shootRepository = require('../repositories/shootRepository');
const staffRepository = require('../repositories/staffRepository');
const bookingRepository = require('../repositories/bookingRepository');

const shootService = {
  async getAllSessions(status) {
    return await shootRepository.findAll(status);
  },

  async getSessionById(id) {
    const session = await shootRepository.findById(id);
    if (!session) {
      const err = new Error('Shoot session not found');
      err.statusCode = 404;
      throw err;
    }
    return session;
  },

  async getAvailableStaff() {
    return await staffRepository.findAllStaff();
  },

  async scheduleSession(payload) {
    const { booking_id, scheduled_start, scheduled_end, venue, staff_assignments } = payload;

    if (!booking_id || !scheduled_start || !scheduled_end) {
      const err = new Error('Booking ID, start time, and end time are required');
      err.statusCode = 400;
      throw err;
    }

    if (new Date(scheduled_end) <= new Date(scheduled_start)) {
      const err = new Error('End time must be after start time');
      err.statusCode = 400;
      throw err;
    }

    const booking = await bookingRepository.findById(booking_id);
    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    // Double-Booking Conflict Detection
    if (staff_assignments && staff_assignments.length > 0) {
      for (const st of staff_assignments) {
        const conflicts = await shootRepository.checkStaffConflict(st.user_id, scheduled_start, scheduled_end);
        if (conflicts.length > 0) {
          const conflicting = conflicts[0];
          const err = new Error(
            `Staff Conflict: ${conflicting.first_name} ${conflicting.last_name} is already assigned to session "${conflicting.session_code}" from ${new Date(conflicting.scheduled_start).toLocaleTimeString()} to ${new Date(conflicting.scheduled_end).toLocaleTimeString()}`
          );
          err.statusCode = 409;
          throw err;
        }
      }
    }

    const sessionCode = `SHT-${Date.now().toString().slice(-6)}`;
    const sessionId = await shootRepository.createSession(
      {
        booking_id,
        session_code: sessionCode,
        scheduled_start,
        scheduled_end,
        venue: venue || booking.event_venue || 'Studio Main Stage',
      },
      staff_assignments || []
    );

    return await shootRepository.findById(sessionId);
  },

  async updateStatus(id, status, notes) {
    const valid = ['scheduled', 'in_progress', 'completed', 'postponed', 'cancelled'];
    if (!valid.includes(status)) {
      const err = new Error(`Invalid session status. Allowed: [${valid.join(', ')}]`);
      err.statusCode = 400;
      throw err;
    }

    await this.getSessionById(id);
    await shootRepository.updateStatus(id, status, notes);
    return await shootRepository.findById(id);
  },
};

module.exports = shootService;
