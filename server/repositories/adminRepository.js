const pool = require('../config/database');

const adminRepository = {
  // --- USERS & ROLES ---
  async findAllUsers() {
    const query = `
      SELECT u.id, u.role_id, u.email, u.first_name, u.last_name, u.phone, u.status, u.created_at,
             r.name AS role_name, sp.designation, sp.skills
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN staff_profiles sp ON u.id = sp.user_id
      ORDER BY u.id ASC
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  async findAllRoles() {
    const [rows] = await pool.query(`SELECT * FROM roles ORDER BY id ASC`);
    return rows;
  },

  async createUserWithProfile(userData, profileData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [uRes] = await connection.query(
        `INSERT INTO users (role_id, email, password_hash, first_name, last_name, phone, status)
         VALUES (?, ?, ?, ?, ?, ?, 'active')`,
        [userData.role_id, userData.email.toLowerCase().trim(), userData.password_hash, userData.first_name, userData.last_name, userData.phone || null]
      );
      const userId = uRes.insertId;

      if (profileData && (profileData.designation || profileData.skills)) {
        await connection.query(
          `INSERT INTO staff_profiles (user_id, designation, skills, is_available) VALUES (?, ?, ?, 1)`,
          [userId, profileData.designation || 'Staff', profileData.skills || null]
        );
      }

      await connection.commit();
      return userId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  async toggleUserStatus(userId) {
    await pool.query(`UPDATE users SET status = IF(status = 'active', 'inactive', 'active') WHERE id = ?`, [userId]);
  },

  // --- CALENDAR EVENTS ---
  async getCalendarEvents(startDate, endDate) {
    const query = `
      SELECT s.id, s.session_code, s.scheduled_start, s.scheduled_end, s.venue, s.session_status,
             b.booking_number, c.full_name AS customer_name, c.phone AS customer_phone
      FROM shoot_sessions s
      JOIN bookings b ON s.booking_id = b.id
      JOIN customers c ON b.customer_id = c.id
      WHERE s.scheduled_start >= ? AND s.scheduled_end <= ? AND s.session_status != 'cancelled'
      ORDER BY s.scheduled_start ASC
    `;
    const [sessions] = await pool.query(query, [startDate, endDate]);

    for (const session of sessions) {
      const [staff] = await pool.query(
        `SELECT u.first_name, u.last_name, ss.role_in_shoot
         FROM session_staff ss JOIN users u ON ss.user_id = u.id WHERE ss.session_id = ?`,
        [session.id]
      );
      session.crew = staff;
    }

    return sessions;
  },

  // --- AUDIT LOGS ---
  async logAction(userId, action, entityName, entityId, details, ipAddress) {
    try {
      await pool.query(
        `INSERT INTO audit_logs (user_id, action, entity_name, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId || null, action, entityName, entityId || null, details || null, ipAddress || null]
      );
    } catch (e) {
      console.error('[Audit Log Error]', e.message);
    }
  },

  async getAuditLogs(limit = 100) {
    const query = `
      SELECT a.*, u.first_name, u.last_name, u.email, r.name AS role_name
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN roles r ON u.role_id = r.id
      ORDER BY a.created_at DESC
      LIMIT ?
    `;
    const [rows] = await pool.query(query, [parseInt(limit, 10)]);
    return rows;
  },
};

module.exports = adminRepository;
