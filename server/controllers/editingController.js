const editingService = require('../services/editingService');

const editingController = {
  async getQueue(req, res, next) {
    try {
      const tasks = await editingService.getQueue(req.query.status);
      res.status(200).json({ success: true, data: tasks });
    } catch (err) { next(err); }
  },

  async getEditors(req, res, next) {
    try {
      const editors = await editingService.getEditors();
      res.status(200).json({ success: true, data: editors });
    } catch (err) { next(err); }
  },

  async getOne(req, res, next) {
    try {
      const task = await editingService.getTaskById(req.params.id);
      res.status(200).json({ success: true, data: task });
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const task = await editingService.createTask(req.body);
      res.status(201).json({ success: true, message: 'Editing task queued successfully', data: task });
    } catch (err) { next(err); }
  },

  async updateStatus(req, res, next) {
    try {
      const updated = await editingService.updateTaskStatus(req.params.id, req.body.status, req.body.qc_notes);
      res.status(200).json({ success: true, message: 'Editing status updated', data: updated });
    } catch (err) { next(err); }
  },
};

module.exports = editingController;
