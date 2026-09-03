const pool = require('../config/database');

const staffRepository = {
  /**
   * Fetch all staff members (Photographers & Editors) with their operational profile
   */
  async findAllStaff() {
    const query = `
      SELECT u.id, u.first_name, u.last_name, u.email, u.phone, r.name AS role_name,
             sp.designation, sp.skills, sp.is_available
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN staff_profiles sp ON u.id = sp.user_id
      WHERE r.name IN ('Photographer', 'Editor', 'Manager', 'Admin') AND u.status = 'active'
      ORDER BY u.first_name ASC
    `;
    const [rows] = await pool.query(query);
    return rows;
  },
};

module.exports = staffRepository;
