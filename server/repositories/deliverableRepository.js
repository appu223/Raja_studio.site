const pool = require('../config/database');

const deliverableRepository = {
  async findByTaskId(taskId) {
    const query = `
      SELECT d.*, c.full_name AS customer_name, c.phone AS customer_phone, b.booking_number
      FROM editing_deliverables d
      JOIN customers c ON d.customer_id = c.id
      JOIN bookings b ON d.booking_id = b.id
      WHERE d.task_id = ?
      ORDER BY d.created_at DESC
    `;
    const [rows] = await pool.query(query, [taskId]);
    return rows;
  },

  async findByCustomerId(customerId) {
    const query = `
      SELECT d.*, b.booking_number
      FROM editing_deliverables d
      JOIN bookings b ON d.booking_id = b.id
      WHERE d.customer_id = ?
      ORDER BY d.created_at DESC
    `;
    const [rows] = await pool.query(query, [customerId]);
    return rows;
  },

  async create(data) {
    const { task_id, booking_id, customer_id, title, asset_type, file_url, file_size, editor_notes, created_by_user_id } = data;
    const [res] = await pool.query(
      `INSERT INTO editing_deliverables (task_id, booking_id, customer_id, title, asset_type, file_url, file_size, editor_notes, created_by_user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [task_id || null, booking_id, customer_id, title, asset_type, file_url, file_size || 'High-Res Export', editor_notes || null, created_by_user_id || null]
    );
    return res.insertId;
  },

  async findById(id) {
    const query = `
      SELECT d.*, c.full_name AS customer_name, c.phone AS customer_phone, b.booking_number
      FROM editing_deliverables d
      JOIN customers c ON d.customer_id = c.id
      JOIN bookings b ON d.booking_id = b.id
      WHERE d.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0] || null;
  },
};

module.exports = deliverableRepository;
