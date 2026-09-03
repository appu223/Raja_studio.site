const pool = require('../config/database');

const enquiryRepository = {
  async findAll(status = '') {
    let sql = `
      SELECT e.*, c.full_name AS registered_customer_name
      FROM enquiries e
      LEFT JOIN customers c ON e.customer_id = c.id
    `;
    const params = [];

    if (status) {
      sql += ` WHERE e.status = ? `;
      params.push(status);
    }

    sql += ` ORDER BY e.created_at DESC `;
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT e.*, c.full_name AS registered_customer_name
       FROM enquiries e
       LEFT JOIN customers c ON e.customer_id = c.id
       WHERE e.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create(data) {
    const { customer_id, contact_name, contact_phone, contact_email, event_type, tentative_date, source, notes } = data;
    const [result] = await pool.query(
      `INSERT INTO enquiries (customer_id, contact_name, contact_phone, contact_email, event_type, tentative_date, source, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [customer_id || null, contact_name, contact_phone, contact_email || null, event_type, tentative_date || null, source || 'Walk-in', notes || null]
    );
    return result.insertId;
  },

  async updateStatus(id, status) {
    await pool.query(`UPDATE enquiries SET status = ? WHERE id = ?`, [status, id]);
  },

  async getFollowUps(enquiryId) {
    const [rows] = await pool.query(
      `SELECT * FROM follow_ups WHERE enquiry_id = ? ORDER BY scheduled_date ASC`,
      [enquiryId]
    );
    return rows;
  },

  async createFollowUp(data) {
    const { enquiry_id, scheduled_date, notes } = data;
    const [result] = await pool.query(
      `INSERT INTO follow_ups (enquiry_id, scheduled_date, notes) VALUES (?, ?, ?)`,
      [enquiry_id, scheduled_date, notes]
    );
    return result.insertId;
  }
};

module.exports = enquiryRepository;