const pool = require('../config/database');

const userRepository = {
  /**
   * Find user by email along with their assigned role name
   */
  async findByEmail(email) {
    const query = `
      SELECT u.id, u.role_id, u.email, u.password_hash, u.first_name, u.last_name, 
             u.phone, u.status, r.name AS role_name
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.email = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(query, [email]);
    return rows[0] || null;
  },

  /**
   * Find user by primary ID without returning the password hash
   */
  async findById(id) {
    const query = `
      SELECT u.id, u.role_id, u.email, u.first_name, u.last_name, 
             u.phone, u.status, r.name AS role_name, u.created_at
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0] || null;
  },

  async createCustomerAccount({ fullName, email, passwordHash, phone, alternatePhone, address, city }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [roleRows] = await connection.query(`SELECT id FROM roles WHERE name = 'Customer' LIMIT 1`);
      if (!roleRows[0]) {
        const error = new Error('Customer role is not configured');
        error.statusCode = 500;
        throw error;
      }

      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts.shift();
      const lastName = nameParts.join(' ') || firstName;
      const [userResult] = await connection.query(
        `INSERT INTO users (role_id, email, password_hash, first_name, last_name, phone, status)
         VALUES (?, ?, ?, ?, ?, ?, 'active')`,
        [roleRows[0].id, email, passwordHash, firstName, lastName, phone]
      );

      await connection.query(
        `INSERT INTO customers (user_id, full_name, email, phone, alternate_phone, address, city)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userResult.insertId, fullName.trim(), email, phone, alternatePhone || null, address || null, city || null]
      );

      await connection.commit();
      return userResult.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};

module.exports = userRepository;
