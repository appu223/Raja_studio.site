const bcrypt = require('bcryptjs');
const adminRepository = require('../repositories/adminRepository');
const userRepository = require('../repositories/userRepository');

const adminService = {
  async getAllUsers() {
    return await adminRepository.findAllUsers();
  },

  async getAllRoles() {
    return await adminRepository.findAllRoles();
  },

  async createUser(payload, actorUserId, clientIp) {
    const { role_id, email, password, first_name, last_name, phone, designation, skills } = payload;
    if (!role_id || !email || !password || !first_name || !last_name) {
      const err = new Error('Role, email, password, first name, and last name are required');
      err.statusCode = 400;
      throw err;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await userRepository.findByEmail(normalizedEmail);
    if (existing) {
      const err = new Error('An account with this email address already exists');
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUserId = await adminRepository.createUserWithProfile(
      { role_id: parseInt(role_id, 10), email: normalizedEmail, password_hash: passwordHash, first_name, last_name, phone },
      { designation, skills }
    );

    await adminRepository.logAction(actorUserId, 'USER_CREATE', 'users', newUserId, `Created user ${normalizedEmail} with role ID ${role_id}`, clientIp);
    return await userRepository.findById(newUserId);
  },

  async toggleStatus(targetUserId, actorUserId, clientIp) {
    if (parseInt(targetUserId, 10) === parseInt(actorUserId, 10)) {
      const err = new Error('Security violation: administrators cannot deactivate their own active session');
      err.statusCode = 400;
      throw err;
    }

    const target = await userRepository.findById(targetUserId);
    if (!target) {
      const err = new Error('User account not found');
      err.statusCode = 404;
      throw err;
    }

    await adminRepository.toggleUserStatus(targetUserId);
    await adminRepository.logAction(actorUserId, 'USER_STATUS_TOGGLE', 'users', targetUserId, `Toggled status for user ID ${targetUserId}`, clientIp);
    return true;
  },

  async getCalendar(startDate, endDate) {
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const end = endDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return await adminRepository.getCalendarEvents(start, end);
  },

  async getAuditLogs() {
    return await adminRepository.getAuditLogs();
  },
};

module.exports = adminService;
