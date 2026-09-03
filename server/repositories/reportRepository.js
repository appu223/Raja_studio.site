const pool = require('../config/database');

const reportRepository = {
  /**
   * Real-time dashboard KPI cards
   */
  async getDashboardMetrics() {
    const [[customersCount]] = await pool.query(`SELECT COUNT(*) AS total FROM customers`);
    const [[bookingsCount]] = await pool.query(`SELECT COUNT(*) AS total FROM bookings WHERE status != 'cancelled'`);
    const [[shootsToday]] = await pool.query(
      `SELECT COUNT(*) AS total FROM shoot_sessions WHERE DATE(scheduled_start) = CURDATE() AND session_status != 'cancelled'`
    );
    const [[editingDepth]] = await pool.query(
      `SELECT COUNT(*) AS total FROM editing_tasks WHERE status NOT IN ('approved')`
    );
    const [[revenueTotal]] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE status = 'successful'`
    );
    const [[receivablesTotal]] = await pool.query(
      `SELECT COALESCE(SUM(balance_amount), 0) AS total FROM invoices WHERE status != 'paid'`
    );

    const [statusDistribution] = await pool.query(
      `SELECT status, COUNT(*) AS count FROM bookings GROUP BY status`
    );

    const [popularServices] = await pool.query(
      `SELECT bi.item_name_snapshot AS name, COUNT(*) AS count, SUM(bi.line_total) AS total_revenue
       FROM booking_items bi
       GROUP BY bi.item_name_snapshot
       ORDER BY count DESC
       LIMIT 5`
    );

    const [upcomingShoots] = await pool.query(
      `SELECT s.id, s.session_code, s.scheduled_start, s.venue, s.session_status,
              c.full_name AS customer_name, b.booking_number
       FROM shoot_sessions s
       JOIN bookings b ON s.booking_id = b.id
       JOIN customers c ON b.customer_id = c.id
       WHERE s.scheduled_start >= NOW() AND s.session_status != 'cancelled'
       ORDER BY s.scheduled_start ASC
       LIMIT 5`
    );

    const [recentPayments] = await pool.query(
      `SELECT p.payment_number, p.amount, p.payment_method, p.paid_at, c.full_name AS customer_name
       FROM payments p
       JOIN bookings b ON p.booking_id = b.id
       JOIN customers c ON b.customer_id = c.id
       WHERE p.status = 'successful'
       ORDER BY p.paid_at DESC
       LIMIT 5`
    );

    return {
      kpis: {
        total_customers: customersCount.total,
        total_bookings: bookingsCount.total,
        shoots_today: shootsToday.total,
        editing_queue_depth: editingDepth.total,
        total_revenue: parseFloat(revenueTotal.total),
        outstanding_receivables: parseFloat(receivablesTotal.total),
      },
      status_distribution: statusDistribution,
      popular_services: popularServices,
      upcoming_shoots: upcomingShoots,
      recent_payments: recentPayments,
    };
  },

  async getRevenueReport() {
    const query = `
      SELECT DATE_FORMAT(paid_at, '%Y-%m') AS month,
             SUM(amount) AS revenue,
             COUNT(*) AS transactions
      FROM payments
      WHERE status = 'successful'
      GROUP BY DATE_FORMAT(paid_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  async getUserNotifications(userId) {
    const [rows] = await pool.query(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
      [userId]
    );
    return rows;
  },

  async markNotificationRead(id, userId) {
    await pool.query(`UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`, [id, userId]);
  },
};

module.exports = reportRepository;
