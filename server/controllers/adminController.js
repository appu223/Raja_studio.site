const adminService = require('../services/adminService');

const adminController = {
  async getUsers(req, res, next) {
    try {
      const users = await adminService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (err) { next(err); }
  },

  async getRoles(req, res, next) {
    try {
      const roles = await adminService.getAllRoles();
      res.status(200).json({ success: true, data: roles });
    } catch (err) { next(err); }
  },

  async createUser(req, res, next) {
    try {
      const clientIp = req.ip || req.headers['x-forwarded-for'];
      const user = await adminService.createUser(req.body, req.user.id, clientIp);
      res.status(201).json({ success: true, message: 'User account created successfully', data: user });
    } catch (err) { next(err); }
  },

  async toggleUserStatus(req, res, next) {
    try {
      const clientIp = req.ip || req.headers['x-forwarded-for'];
      await adminService.toggleStatus(req.params.id, req.user.id, clientIp);
      res.status(200).json({ success: true, message: 'Account status toggled successfully' });
    } catch (err) { next(err); }
  },

  async getCalendar(req, res, next) {
    try {
      const { start, end } = req.query;
      const events = await adminService.getCalendar(start, end);
      res.status(200).json({ success: true, data: events });
    } catch (err) { next(err); }
  },

  async getAuditLogs(req, res, next) {
    try {
      const logs = await adminService.getAuditLogs();
      res.status(200).json({ success: true, data: logs });
    } catch (err) { next(err); }
  },
};

module.exports = adminController;
