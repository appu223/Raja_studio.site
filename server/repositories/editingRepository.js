const pool = require('../config/database');

const editingRepository = {
  async findAll(status = '') {
    let sql = `
      SELECT t.*, s.session_code, s.venue, b.id AS booking_id, b.booking_number, c.full_name AS customer_name,
             u.first_name AS editor_first_name, u.last_name AS editor_last_name
      FROM editing_tasks t
      JOIN shoot_sessions s ON t.session_id = s.id
      JOIN bookings b ON s.booking_id = b.id
      JOIN customers c ON b.customer_id = c.id
      LEFT JOIN users u ON t.assigned_editor_id = u.id
    `;
    const params = [];
    if (status) {
      sql += ` WHERE t.status = ? `;
      params.push(status);
    }
    sql += ` ORDER BY t.due_date ASC, t.created_at DESC `;
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT t.*, s.session_code, b.id AS booking_id, b.booking_number, c.full_name AS customer_name,
              u.first_name AS editor_first_name, u.last_name AS editor_last_name
       FROM editing_tasks t
       JOIN shoot_sessions s ON t.session_id = s.id
       JOIN bookings b ON s.booking_id = b.id
       JOIN customers c ON b.customer_id = c.id
       LEFT JOIN users u ON t.assigned_editor_id = u.id
       WHERE t.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create(data) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [res] = await connection.query(
        `INSERT INTO editing_tasks (session_id, assigned_editor_id, task_name, priority, due_date, status, qc_notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [data.session_id, data.assigned_editor_id || null, data.task_name, data.priority || 'medium', data.due_date, 'queued', data.qc_notes || null]
      );
      const taskId = res.insertId;
      const [sess] = await connection.query(`SELECT booking_id FROM shoot_sessions WHERE id = ?`, [data.session_id]);
      if (sess[0]) {
        await connection.query(
          `UPDATE bookings SET status = 'editing' WHERE id = ? AND status IN ('shoot_completed', 'staff_assigned', 'shoot_scheduled')`,
          [sess[0].booking_id]
        );
      }
      await connection.commit();
      return taskId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  async updateStatus(id, status, qc_notes = null) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(
        `UPDATE editing_tasks SET status = ?, qc_notes = COALESCE(?, qc_notes) WHERE id = ?`,
        [status, qc_notes, id]
      );
      if (status === 'approved') {
        const [task] = await connection.query(
          `SELECT s.booking_id FROM editing_tasks t JOIN shoot_sessions s ON t.session_id = s.id WHERE t.id = ?`,
          [id]
        );
        if (task[0]) {
          await connection.query(`UPDATE bookings SET status = 'gallery_ready' WHERE id = ? AND status = 'editing'`, [task[0].booking_id]);
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

  async getEditors() {
    const [rows] = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, sp.skills
       FROM users u JOIN roles r ON u.role_id = r.id
       LEFT JOIN staff_profiles sp ON u.id = sp.user_id
       WHERE r.name IN ('Editor', 'Admin', 'Manager') AND u.status = 'active'`
    );
    return rows;
  },
};

module.exports = editingRepository;
