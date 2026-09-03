const pool = require('../config/database');

const bookingRepository = {
  async findAll(status = '', limit = 50, offset = 0) {
    let sql = `
      SELECT b.*, c.full_name AS customer_name, c.phone AS customer_phone, c.email AS customer_email,
             (SELECT COALESCE(SUM(amount), 0) FROM payments p WHERE p.booking_id = b.id AND p.status = 'successful') AS total_paid
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
    `;
    const params = [];
    if (status) {
      sql += ` WHERE b.status = ? `;
      params.push(status);
    }
    sql += ` ORDER BY b.event_date DESC, b.created_at DESC LIMIT ? OFFSET ? `;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT b.*, c.full_name AS customer_name, c.phone AS customer_phone, c.email AS customer_email,
              c.address AS customer_address, c.city AS customer_city,
              (SELECT COALESCE(SUM(amount), 0) FROM payments p WHERE p.booking_id = b.id AND p.status = 'successful') AS total_paid
       FROM bookings b
       JOIN customers c ON b.customer_id = c.id
       WHERE b.id = ?`,
      [id]
    );
    if (!rows[0]) return null;

    const booking = rows[0];
    const [items] = await pool.query(
      `SELECT bi.* FROM booking_items bi WHERE bi.booking_id = ?`,
      [id]
    );
    booking.items = items;
    return booking;
  },

  /**
   * Atomic Transaction for creating Booking + Line Item Snapshots
   */
  async createWithItems(bookingData, items) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [res] = await connection.query(
        `INSERT INTO bookings (booking_number, customer_id, status, subtotal_amount, discount_amount, total_amount, event_date, event_venue, special_requirements, created_by_user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          bookingData.booking_number,
          bookingData.customer_id,
          bookingData.status || 'draft',
          bookingData.subtotal_amount,
          bookingData.discount_amount,
          bookingData.total_amount,
          bookingData.event_date,
          bookingData.event_venue || null,
          bookingData.special_requirements || null,
          bookingData.created_by_user_id,
        ]
      );

      const bookingId = res.insertId;

      for (const item of items) {
        await connection.query(
          `INSERT INTO booking_items (booking_id, service_id, item_name_snapshot, unit_price_snapshot, quantity, line_total)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            bookingId,
            item.service_id,
            item.item_name_snapshot,
            item.unit_price_snapshot,
            item.quantity,
            item.line_total,
          ]
        );
      }

      await connection.commit();
      return bookingId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  async updateStatus(id, newStatus) {
    await pool.query(`UPDATE bookings SET status = ? WHERE id = ?`, [newStatus, id]);
  },
};

module.exports = bookingRepository;