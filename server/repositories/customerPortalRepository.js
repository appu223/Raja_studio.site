const pool = require('../config/database');

const customerPortalRepository = {
  async findCustomerByUserId(userId) {
    const [rows] = await pool.query(`SELECT * FROM customers WHERE user_id = ? LIMIT 1`, [userId]);
    return rows[0] || null;
  },

  async getCustomerSummary(customerId) {
    const [[bookingCount]] = await pool.query(
      `SELECT COUNT(*) AS total FROM bookings WHERE customer_id = ? AND status != 'cancelled'`,
      [customerId]
    );
    const [[upcomingShoot]] = await pool.query(
      `SELECT s.id, s.session_code, s.scheduled_start, s.scheduled_end, s.venue, s.session_status, b.booking_number
       FROM shoot_sessions s JOIN bookings b ON s.booking_id = b.id
       WHERE b.customer_id = ? AND s.scheduled_start >= NOW() AND s.session_status != 'cancelled'
       ORDER BY s.scheduled_start ASC LIMIT 1`,
      [customerId]
    );
    const [[financials]] = await pool.query(
      `SELECT COALESCE(SUM(b.total_amount), 0) AS total_billed,
              COALESCE((SELECT SUM(p.amount) FROM payments p JOIN bookings b2 ON p.booking_id = b2.id
                        WHERE b2.customer_id = ? AND p.status = 'successful'), 0) AS total_paid
       FROM bookings b WHERE b.customer_id = ? AND b.status != 'cancelled'`,
      [customerId, customerId]
    );
    const [[galleryCount]] = await pool.query(
      `SELECT COUNT(*) AS total FROM galleries g JOIN bookings b ON g.booking_id = b.id
       WHERE b.customer_id = ? AND g.status = 'active'`,
      [customerId]
    );

    const totalBilled = parseFloat(financials.total_billed || 0);
    const totalPaid = parseFloat(financials.total_paid || 0);
    return {
      total_bookings: bookingCount.total,
      upcoming_shoot: upcomingShoot || null,
      total_billed: totalBilled,
      total_paid: totalPaid,
      outstanding_balance: Math.max(0, totalBilled - totalPaid),
      ready_galleries: galleryCount.total,
    };
  },

  async getCustomerBookings(customerId) {
    const [bookings] = await pool.query(
      `SELECT b.*, (SELECT COALESCE(SUM(amount), 0) FROM payments p
       WHERE p.booking_id = b.id AND p.status = 'successful') AS total_paid
       FROM bookings b WHERE b.customer_id = ? ORDER BY b.event_date DESC, b.created_at DESC`,
      [customerId]
    );
    for (const booking of bookings) {
      const [items] = await pool.query(`SELECT * FROM booking_items WHERE booking_id = ?`, [booking.id]);
      const [sessions] = await pool.query(`SELECT * FROM shoot_sessions WHERE booking_id = ?`, [booking.id]);
      booking.items = items;
      booking.sessions = sessions;
      booking.balance_amount = Math.max(0, Number(booking.total_amount) - Number(booking.total_paid));
    }
    return bookings;
  },

  async getCustomerFinance(customerId) {
    const [invoices] = await pool.query(
      `SELECT i.*, b.booking_number, b.event_date FROM invoices i JOIN bookings b ON i.booking_id = b.id
       WHERE b.customer_id = ? ORDER BY i.issued_at DESC`,
      [customerId]
    );
    const [payments] = await pool.query(
      `SELECT p.*, b.booking_number FROM payments p JOIN bookings b ON p.booking_id = b.id
       WHERE b.customer_id = ? AND p.status = 'successful' ORDER BY p.paid_at DESC`,
      [customerId]
    );
    return { invoices, payments };
  },

  async getCustomerGalleries(customerId) {
    const [galleries] = await pool.query(
      `SELECT g.*, b.booking_number,
              (SELECT COUNT(*) FROM photos p WHERE p.gallery_id = g.id) AS photo_count,
              (SELECT storage_url FROM photos p WHERE p.gallery_id = g.id AND p.is_cover = 1 LIMIT 1) AS cover_url
       FROM galleries g JOIN bookings b ON g.booking_id = b.id
       WHERE b.customer_id = ? AND g.status = 'active' ORDER BY g.created_at DESC`,
      [customerId]
    );
    for (const gallery of galleries) {
      const [photos] = await pool.query(
        `SELECT id, original_filename, storage_url, thumbnail_url, is_cover FROM photos
         WHERE gallery_id = ? ORDER BY is_cover DESC, id ASC`,
        [gallery.id]
      );
      gallery.photos = photos;
    }
    return galleries;
  },

  async updateProfile(customerId, data) {
    const { full_name, email, alternate_phone, address, city } = data;
    await pool.query(
      `UPDATE customers SET full_name = ?, email = ?, alternate_phone = ?, address = ?, city = ? WHERE id = ?`,
      [full_name, email || null, alternate_phone || null, address || null, city || null, customerId]
    );
  },
};

module.exports = customerPortalRepository;
