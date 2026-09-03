const pool = require('../config/database');

const customerRepository = {
  async findAll(search = '', limit = 50, offset = 0) {
    let sql = `
      SELECT c.*, 
             (SELECT COUNT(*) FROM bookings b WHERE b.customer_id = c.id) AS total_bookings
      FROM customers c
    `;
    const params = [];

    if (search) {
      sql += ` WHERE c.full_name LIKE ? OR c.phone LIKE ? OR c.email LIKE ? `;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ` ORDER BY c.created_at DESC LIMIT ? OFFSET ? `;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async countAll(search = '') {
    let sql = `SELECT COUNT(*) AS count FROM customers c`;
    const params = [];
    if (search) {
      sql += ` WHERE c.full_name LIKE ? OR c.phone LIKE ? OR c.email LIKE ? `;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    const [rows] = await pool.query(sql, params);
    return rows[0].count;
  },

  async findById(id) {
    const [rows] = await pool.query(`SELECT * FROM customers WHERE id = ?`, [id]);
    return rows[0] || null;
  },

  async findByPhone(phone) {
    const [rows] = await pool.query(`SELECT * FROM customers WHERE phone = ? LIMIT 1`, [phone]);
    return rows[0] || null;
  },

  async create(data) {
    const { full_name, email, phone, alternate_phone, address, city, notes } = data;
    const [result] = await pool.query(
      `INSERT INTO customers (full_name, email, phone, alternate_phone, address, city, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email || null, phone, alternate_phone || null, address || null, city || null, notes || null]
    );
    return result.insertId;
  },

  async update(id, data) {
    const { full_name, email, phone, alternate_phone, address, city, notes } = data;
    await pool.query(
      `UPDATE customers 
       SET full_name = ?, email = ?, phone = ?, alternate_phone = ?, address = ?, city = ?, notes = ?
       WHERE id = ?`,
      [full_name, email || null, phone, alternate_phone || null, address || null, city || null, notes || null, id]
    );
  },

  async delete(id) {
    await pool.query(`DELETE FROM customers WHERE id = ?`, [id]);
  }
};

module.exports = customerRepository;