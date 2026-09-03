const pool = require('../config/database');

const inventoryRepository = {
  async findAllEquipment() {
    const query = `
      SELECT e.*,
             (SELECT u.first_name FROM equipment_transactions et
              JOIN users u ON et.issued_to_user_id = u.id
              WHERE et.equipment_id = e.id AND et.checkin_time IS NULL LIMIT 1) AS checked_out_to
      FROM equipment e
      ORDER BY e.category ASC, e.name ASC
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  async findEquipmentById(id) {
    const [rows] = await pool.query(`SELECT * FROM equipment WHERE id = ?`, [id]);
    return rows[0] || null;
  },

  async createEquipment(data) {
    const { asset_tag, name, category, serial_number, condition_status } = data;
    const [res] = await pool.query(
      `INSERT INTO equipment (asset_tag, name, category, serial_number, condition_status, is_checked_out)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [asset_tag, name, category, serial_number || null, condition_status || 'operational']
    );
    return res.insertId;
  },

  async checkoutEquipment(equipmentId, sessionId, issuedToUserId, conditionNote) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(
        `INSERT INTO equipment_transactions (equipment_id, session_id, issued_to_user_id, condition_on_checkout)
         VALUES (?, ?, ?, ?)`,
        [equipmentId, sessionId || null, issuedToUserId, conditionNote || 'Good condition']
      );
      await connection.query(`UPDATE equipment SET is_checked_out = 1 WHERE id = ?`, [equipmentId]);
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  async checkinEquipment(equipmentId, checkinConditionNote, conditionStatus) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [trans] = await connection.query(
        `SELECT id FROM equipment_transactions WHERE equipment_id = ? AND checkin_time IS NULL ORDER BY checkout_time DESC LIMIT 1`,
        [equipmentId]
      );
      if (trans.length > 0) {
        await connection.query(
          `UPDATE equipment_transactions SET checkin_time = CURRENT_TIMESTAMP, condition_on_checkin = ? WHERE id = ?`,
          [checkinConditionNote || 'Normal wear', trans[0].id]
        );
      }
      await connection.query(
        `UPDATE equipment SET is_checked_out = 0, condition_status = ? WHERE id = ?`,
        [conditionStatus || 'operational', equipmentId]
      );
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  async getRecentTransactions(limit = 50) {
    const query = `
      SELECT et.*, e.name AS equipment_name, e.asset_tag, u.first_name, u.last_name, s.session_code
      FROM equipment_transactions et
      JOIN equipment e ON et.equipment_id = e.id
      JOIN users u ON et.issued_to_user_id = u.id
      LEFT JOIN shoot_sessions s ON et.session_id = s.id
      ORDER BY et.checkout_time DESC
      LIMIT ?
    `;
    const [rows] = await pool.query(query, [parseInt(limit, 10)]);
    return rows;
  }
};

module.exports = inventoryRepository;
