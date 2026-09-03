const staffPortalRepository = require('../repositories/staffPortalRepository');
const shootRepository = require('../repositories/shootRepository');
const editingRepository = require('../repositories/editingRepository');

const staffPortalService = {
  async getPhotographerDashboard(userId) {
    return await staffPortalRepository.getPhotographerDashboard(userId);
  },

  async getPhotographerShoots(userId) {
    return await staffPortalRepository.getPhotographerShoots(userId);
  },

  async getPhotographerGear(userId) {
    return await staffPortalRepository.getPhotographerGear(userId);
  },

  async updateShootStatus(userId, sessionId, status, notes) {
    const shoots = await staffPortalRepository.getPhotographerShoots(userId);
    if (!shoots.some((shoot) => shoot.id === parseInt(sessionId, 10))) {
      const err = new Error('Unauthorized: You are not assigned to this shoot session.');
      err.statusCode = 403;
      throw err;
    }
    const validStatuses = ['scheduled', 'in_progress', 'completed', 'postponed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      const err = new Error(`Invalid session status. Allowed: [${validStatuses.join(', ')}]`);
      err.statusCode = 400;
      throw err;
    }
    await shootRepository.updateStatus(sessionId, status, notes);
    return await shootRepository.findById(sessionId);
  },

  async getEditorDashboard(userId) {
    return await staffPortalRepository.getEditorDashboard(userId);
  },

  async getEditorTasks(userId) {
    return await staffPortalRepository.getEditorTasks(userId);
  },

  async updateEditorTaskStatus(userId, taskId, status, notes) {
    const tasks = await staffPortalRepository.getEditorTasks(userId);
    if (!tasks.some((task) => task.id === parseInt(taskId, 10))) {
      const err = new Error('Unauthorized: This editing task is not assigned to you.');
      err.statusCode = 403;
      throw err;
    }
    const validStatuses = ['queued', 'raw_ingested', 'in_progress', 'qc_review', 'approved', 'revisions_needed'];
    if (!validStatuses.includes(status)) {
      const err = new Error(`Invalid editing status. Allowed: [${validStatuses.join(', ')}]`);
      err.statusCode = 400;
      throw err;
    }
    await editingRepository.updateStatus(taskId, status, notes);
    return await editingRepository.findById(taskId);
  },
};

module.exports = staffPortalService;
