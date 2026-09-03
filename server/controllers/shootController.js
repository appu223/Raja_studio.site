const shootService = require('../services/shootService');

const shootController = {
  async getAll(req, res, next) {
    try {
      const sessions = await shootService.getAllSessions(req.query.status);
      res.status(200).json({ success: true, data: sessions });
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      const session = await shootService.getSessionById(req.params.id);
      res.status(200).json({ success: true, data: session });
    } catch (err) {
      next(err);
    }
  },

  async getStaff(req, res, next) {
    try {
      const staff = await shootService.getAvailableStaff();
      res.status(200).json({ success: true, data: staff });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const session = await shootService.scheduleSession(req.body);
      res.status(201).json({ success: true, message: 'Shoot scheduled successfully', data: session });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const updated = await shootService.updateStatus(req.params.id, req.body.status, req.body.notes);
      res.status(200).json({ success: true, message: 'Session status updated', data: updated });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = shootController;
