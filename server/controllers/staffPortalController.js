const staffPortalService = require('../services/staffPortalService');

const staffPortalController = {
  async getPhotographerDashboard(req, res, next) {
    try { res.status(200).json({ success: true, data: await staffPortalService.getPhotographerDashboard(req.user.id) }); } catch (err) { next(err); }
  },
  async getPhotographerShoots(req, res, next) {
    try { res.status(200).json({ success: true, data: await staffPortalService.getPhotographerShoots(req.user.id) }); } catch (err) { next(err); }
  },
  async getPhotographerGear(req, res, next) {
    try { res.status(200).json({ success: true, data: await staffPortalService.getPhotographerGear(req.user.id) }); } catch (err) { next(err); }
  },
  async updatePhotographerShoot(req, res, next) {
    try {
      const updated = await staffPortalService.updateShootStatus(req.user.id, req.params.id, req.body.status, req.body.notes);
      res.status(200).json({ success: true, message: 'Shoot status updated', data: updated });
    } catch (err) { next(err); }
  },
  async getEditorDashboard(req, res, next) {
    try { res.status(200).json({ success: true, data: await staffPortalService.getEditorDashboard(req.user.id) }); } catch (err) { next(err); }
  },
  async getEditorTasks(req, res, next) {
    try { res.status(200).json({ success: true, data: await staffPortalService.getEditorTasks(req.user.id) }); } catch (err) { next(err); }
  },
  async updateEditorTask(req, res, next) {
    try {
      const updated = await staffPortalService.updateEditorTaskStatus(req.user.id, req.params.id, req.body.status, req.body.qc_notes);
      res.status(200).json({ success: true, message: 'Editing status updated', data: updated });
    } catch (err) { next(err); }
  },
};

module.exports = staffPortalController;
