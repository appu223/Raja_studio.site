const pool = require('../config/database');

const staffPortalRepository = {
  // ================= PHOTOGRAPHER QUERIES =================
  async getPhotographerDashboard(userId) {
    const [[shootsToday]] = await pool.query(
      `SELECT COUNT(*) AS count FROM session_staff ss
       JOIN shoot_sessions s ON ss.session_id = s.id
       WHERE ss.user_id = ? AND DATE(s.scheduled_start) = CURDATE() AND s.session_status != 'cancelled'`,
      [userId]
    );
    const [[upcomingShoots]] = await pool.query(
      `SELECT COUNT(*) AS count FROM session_staff ss
       JOIN shoot_sessions s ON ss.session_id = s.id
       WHERE ss.user_id = ? AND s.scheduled_start >= NOW() AND s.session_status = 'scheduled'`,
      [userId]
    );
    const [[completedShoots]] = await pool.query(
      `SELECT COUNT(*) AS count FROM session_staff ss
       JOIN shoot_sessions s ON ss.session_id = s.id
       WHERE ss.user_id = ? AND s.session_status = 'completed'`,
      [userId]
    );
    const [[checkedOutGear]] = await pool.query(
      `SELECT COUNT(*) AS count FROM equipment_transactions WHERE issued_to_user_id = ? AND checkin_time IS NULL`,
      [userId]
    );
    return {
      shoots_today: shootsToday.count,
      upcoming_shoots: upcomingShoots.count,
      completed_shoots: completedShoots.count,
      checked_out_gear: checkedOutGear.count,
    };
  },

  async getPhotographerShoots(userId) {
    const query = `
      SELECT s.*, b.booking_number, b.special_requirements,
             c.full_name AS customer_name, c.phone AS customer_phone, c.email AS customer_email,
             ss.role_in_shoot
      FROM session_staff ss
      JOIN shoot_sessions s ON ss.session_id = s.id
      JOIN bookings b ON s.booking_id = b.id
      JOIN customers c ON b.customer_id = c.id
      WHERE ss.user_id = ?
      ORDER BY s.scheduled_start ASC
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows;
  },

  async getPhotographerGear(userId) {
    const query = `
      SELECT et.*, e.name AS equipment_name, e.asset_tag, e.category
      FROM equipment_transactions et
      JOIN equipment e ON et.equipment_id = e.id
      WHERE et.issued_to_user_id = ? AND et.checkin_time IS NULL
      ORDER BY et.checkout_time DESC
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows;
  },

  // ================= EDITOR QUERIES =================
  async getEditorDashboard(userId) {
    const [[pendingTasks]] = await pool.query(
      `SELECT COUNT(*) AS count FROM editing_tasks
       WHERE (assigned_editor_id = ? OR assigned_editor_id IS NULL) AND status IN ('queued', 'in_progress', 'raw_ingested')`,
      [userId]
    );
    const [[urgentTasks]] = await pool.query(
      `SELECT COUNT(*) AS count FROM editing_tasks
       WHERE (assigned_editor_id = ? OR assigned_editor_id IS NULL) AND priority = 'urgent' AND status != 'approved'`,
      [userId]
    );
    const [[readyForQC]] = await pool.query(
      `SELECT COUNT(*) AS count FROM editing_tasks
       WHERE (assigned_editor_id = ? OR assigned_editor_id IS NULL) AND status = 'qc_review'`,
      [userId]
    );
    const [[approvedTasks]] = await pool.query(
      `SELECT COUNT(*) AS count FROM editing_tasks WHERE assigned_editor_id = ? AND status = 'approved'`,
      [userId]
    );
    return {
      pending_tasks: pendingTasks.count,
      urgent_tasks: urgentTasks.count,
      ready_for_qc: readyForQC.count,
      approved_tasks: approvedTasks.count,
    };
  },

  async getEditorTasks(userId) {
    const query = `
      SELECT t.*, s.session_code, s.venue, b.id AS booking_id, b.booking_number, c.full_name AS customer_name
      FROM editing_tasks t
      JOIN shoot_sessions s ON t.session_id = s.id
      JOIN bookings b ON s.booking_id = b.id
      JOIN customers c ON b.customer_id = c.id
      WHERE t.assigned_editor_id = ? OR t.assigned_editor_id IS NULL
      ORDER BY FIELD(t.priority, 'urgent', 'high', 'medium', 'low'), t.due_date ASC
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows;
  },
};

module.exports = staffPortalRepository;
