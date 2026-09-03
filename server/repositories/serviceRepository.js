const pool = require('../config/database');

const serviceRepository = {
  // --- SERVICES ---
  async findAllServices(onlyActive = false) {
    let sql = `SELECT * FROM services`;
    if (onlyActive) {
      sql += ` WHERE is_active = 1`;
    }
    sql += ` ORDER BY name ASC`;
    const [rows] = await pool.query(sql);
    return rows;
  },

  async findServiceById(id) {
    const [rows] = await pool.query(`SELECT * FROM services WHERE id = ?`, [id]);
    return rows[0] || null;
  },

  async findServiceByCode(code) {
    const [rows] = await pool.query(`SELECT * FROM services WHERE code = ?`, [code]);
    return rows[0] || null;
  },

  async createService(data) {
    const { name, code, description, base_price, duration_minutes, is_active } = data;
    const [res] = await pool.query(
      `INSERT INTO services (name, code, description, base_price, duration_minutes, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, code, description || null, base_price, duration_minutes || 60, is_active !== undefined ? is_active : 1]
    );
    return res.insertId;
  },

  async updateService(id, data) {
    const { name, description, base_price, duration_minutes, is_active } = data;
    await pool.query(
      `UPDATE services 
       SET name = ?, description = ?, base_price = ?, duration_minutes = ?, is_active = ?
       WHERE id = ?`,
      [name, description || null, base_price, duration_minutes, is_active, id]
    );
  },

  async toggleServiceActive(id) {
    await pool.query(`UPDATE services SET is_active = 1 - is_active WHERE id = ?`, [id]);
  },

  // --- PACKAGES ---
  async findAllPackages(onlyActive = false) {
    let sql = `SELECT * FROM packages`;
    if (onlyActive) {
      sql += ` WHERE is_active = 1`;
    }
    sql += ` ORDER BY name ASC`;
    const [packages] = await pool.query(sql);

    // Attach included items to each package
    for (const pkg of packages) {
      const [items] = await pool.query(
        `SELECT pi.quantity, s.id as service_id, s.name, s.base_price, s.code
         FROM package_items pi
         JOIN services s ON pi.service_id = s.id
         WHERE pi.package_id = ?`,
        [pkg.id]
      );
      pkg.items = items;
    }
    return packages;
  },

  async createPackage(data, items = []) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const { name, code, description, package_price, is_active } = data;
      const [pkgResult] = await connection.query(
        `INSERT INTO packages (name, code, description, package_price, is_active) VALUES (?, ?, ?, ?, ?)`,
        [name, code, description || null, package_price, is_active !== undefined ? is_active : 1]
      );
      const pkgId = pkgResult.insertId;

      for (const item of items) {
        await connection.query(
          `INSERT INTO package_items (package_id, service_id, quantity) VALUES (?, ?, ?)`,
          [pkgId, item.service_id, item.quantity || 1]
        );
      }

      await connection.commit();
      return pkgId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },
};

module.exports = serviceRepository;
