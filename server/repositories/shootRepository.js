const pool = require('../config/database');

const shootRepository = {
  async findAll(status = '') {
    let sql = `
      SELECT s.*, b.booking_number, c.full_name AS customer_name, c.phone AS customer_phone
      FROM shoot_sessions s
      JOIN bookings b ON s.booking_id = b.id
      JOIN customers c ON b.customer_id = c.id
    `;
    const params = [];
    if (status) {
      sql += ` WHERE s.session_status = ? `;
      params.push(status);
    }
    sql += ` ORDER BY s.scheduled_start ASC `;
    const [sessions] = await pool.query(sql, params);

    // Fetch assigned staff for each session
    for (const session of sessions) {
      const [staff] = await pool.query(
        `SELECT u.id, u.first_name, u.last_name, ss.role_in_shoot
         FROM session_staff ss
         JOIN users u ON ss.user_id = u.id
         WHERE ss.session_id = ?`,
        [session.id]
      );
      session.assigned_staff = staff;
    }
    return sessions;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT s.*, b.booking_number, c.full_name AS customer_name, c.phone AS customer_phone
       FROM shoot_sessions s
       JOIN bookings b ON s.booking_id = b.id
       JOIN customers c ON b.customer_id = c.id
       WHERE s.id = ?`,
      [id]
    );
    if (!rows[0]) return null;

    const session = rows[0];
    const [staff] = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.phone, ss.role_in_shoot
       FROM session_staff ss
       JOIN users u ON ss.user_id = u.id
       WHERE ss.session_id = ?`,
      [id]
    );
    session.assigned_staff = staff;
    return session;
  },

  /**
   * Conflict Detection: checks if a specific staff member is already assigned to any overlapping session
   */
  async checkStaffConflict(userId, startTime, endTime, excludeSessionId = null) {
    let sql = `
      SELECT s.id, s.session_code, s.scheduled_start, s.scheduled_end, u.first_name, u.last_name
      FROM session_staff ss
      JOIN shoot_sessions s ON ss.session_id = s.id
      JOIN users u ON ss.user_id = u.id
      WHERE ss.user_id = ?
        AND s.session_status NOT IN ('completed', 'cancelled')
        AND (? < s.scheduled_end AND ? > s.scheduled_start)
    `;
    const params = [userId, startTime, endTime];
    if (excludeSessionId) {
      sql += ` AND s.id != ? `;
      params.push(excludeSessionId);
    }
    const [conflicts] = await pool.query(sql, params);
    return conflicts;
  },

  async createSession(sessionData, staffAssignments) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [res] = await connection.query(
        `INSERT INTO shoot_sessions (booking_id, session_code, scheduled_start, scheduled_end, venue, session_status, completion_notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          sessionData.booking_id,
          sessionData.session_code,
          sessionData.scheduled_start,
          sessionData.scheduled_end,
          sessionData.venue,
          'scheduled',
          sessionData.completion_notes || null,
        ]
      );
      const sessionId = res.insertId;

      for (const st of staffAssignments) {
        await connection.query(
          `INSERT INTO session_staff (session_id, user_id, role_in_shoot) VALUES (?, ?, ?)`,
          [sessionId, st.user_id, st.role_in_shoot || 'Lead Photographer']
        );
      }

      // Automatically update the booking status to shoot_scheduled
      await connection.query(
        `UPDATE bookings SET status = 'shoot_scheduled' WHERE id = ? AND status IN ('confirmed', 'staff_assigned')`,
        [sessionData.booking_id]
      );

      await connection.commit();
      return sessionId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  async updateStatus(id, status, notes = '') {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        `UPDATE shoot_sessions SET session_status = ?, completion_notes = COALESCE(?, completion_notes) WHERE id = ?`,
        [status, notes || null, id]
      );

      if (status === 'completed') {
        const [rows] = await connection.query(`SELECT booking_id FROM shoot_sessions WHERE id = ?`, [id]);
        if (rows[0]) {
          await connection.query(
            `UPDATE bookings SET status = 'shoot_completed' WHERE id = ? AND status = 'shoot_scheduled'`,
            [rows[0].booking_id]
          );
        }
      }

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },
};

module.exports = shootRepository;
