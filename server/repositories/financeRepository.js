const pool = require('../config/database');

const financeRepository = {
  // --- PAYMENTS ---
  async getPaymentsByBooking(bookingId) {
    const query = `
      SELECT p.*, u.first_name AS received_by_name
      FROM payments p
      LEFT JOIN users u ON p.received_by_user_id = u.id
      WHERE p.booking_id = ?
      ORDER BY p.paid_at DESC
    `;
    const [rows] = await pool.query(query, [bookingId]);
    return rows;
  },

  async getAllPayments(limit = 50) {
    const query = `
      SELECT p.*, b.booking_number, c.full_name AS customer_name
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN customers c ON b.customer_id = c.id
      ORDER BY p.paid_at DESC
      LIMIT ?
    `;
    const [rows] = await pool.query(query, [parseInt(limit, 10)]);
    return rows;
  },

  async recordPayment(paymentData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [res] = await connection.query(
        `INSERT INTO payments (payment_number, booking_id, amount, payment_type, payment_method, transaction_reference, status, received_by_user_id)
         VALUES (?, ?, ?, ?, ?, ?, 'successful', ?)`,
        [
          paymentData.payment_number,
          paymentData.booking_id,
          paymentData.amount,
          paymentData.payment_type || 'advance',
          paymentData.payment_method || 'cash',
          paymentData.transaction_reference || null,
          paymentData.received_by_user_id,
        ]
      );
      const paymentId = res.insertId;

      const [bRows] = await connection.query(`SELECT total_amount FROM bookings WHERE id = ?`, [paymentData.booking_id]);
      const totalAmount = parseFloat(bRows[0].total_amount);
      const [pRows] = await connection.query(
        `SELECT COALESCE(SUM(amount), 0) AS total_paid FROM payments WHERE booking_id = ? AND status = 'successful'`,
        [paymentData.booking_id]
      );
      const totalPaid = parseFloat(pRows[0].total_paid);
      const balance = Math.max(0, totalAmount - totalPaid);
      const invoiceStatus = balance <= 0 ? 'paid' : totalPaid > 0 ? 'partial' : 'unpaid';

      const [invRows] = await connection.query(`SELECT id FROM invoices WHERE booking_id = ?`, [paymentData.booking_id]);
      if (invRows.length > 0) {
        await connection.query(
          `UPDATE invoices SET paid_amount = ?, balance_amount = ?, status = ? WHERE booking_id = ?`,
          [totalPaid, balance, invoiceStatus, paymentData.booking_id]
        );
      } else {
        const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
        await connection.query(
          `INSERT INTO invoices (invoice_number, booking_id, total_amount, paid_amount, balance_amount, due_date, status)
           VALUES (?, ?, ?, ?, ?, CURDATE() + INTERVAL 7 DAY, ?)`,
          [invoiceNumber, paymentData.booking_id, totalAmount, totalPaid, balance, invoiceStatus]
        );
      }

      await connection.commit();
      return paymentId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  // --- INVOICES ---
  async getAllInvoices() {
    const query = `
      SELECT i.*, b.booking_number, c.full_name AS customer_name, c.phone AS customer_phone
      FROM invoices i
      JOIN bookings b ON i.booking_id = b.id
      JOIN customers c ON b.customer_id = c.id
      ORDER BY i.issued_at DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  // --- EXPENSES ---
  async getAllExpenses() {
    const query = `
      SELECT e.*, u.first_name AS recorded_by_name
      FROM expenses e
      LEFT JOIN users u ON e.recorded_by_user_id = u.id
      ORDER BY e.expense_date DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  async createExpense(data) {
    const { category, description, amount, expense_date, recorded_by_user_id, receipt_url } = data;
    const [res] = await pool.query(
      `INSERT INTO expenses (category, description, amount, expense_date, recorded_by_user_id, receipt_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [category, description, amount, expense_date, recorded_by_user_id, receipt_url || null]
    );
    return res.insertId;
  },
};

module.exports = financeRepository;
