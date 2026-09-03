const editingRepository = require('../repositories/editingRepository');
const shootRepository = require('../repositories/shootRepository');

const editingService = {
  async getQueue(status) {
    return await editingRepository.findAll(status);
  },

  async getTaskById(id) {
    const task = await editingRepository.findById(id);
    if (!task) {
      const err = new Error('Editing task not found');
      err.statusCode = 404;
      throw err;
    }
    return task;
  },

  async getEditors() {
    return await editingRepository.getEditors();
  },

  async createTask(payload) {
    const { session_id, task_name, due_date, priority, assigned_editor_id } = payload;
    if (!session_id || !task_name || !due_date) {
      const err = new Error('Shoot session ID, task title, and due date are required');
      err.statusCode = 400;
      throw err;
    }
    const session = await shootRepository.findById(session_id);
    if (!session) {
      const err = new Error('Shoot session does not exist');
      err.statusCode = 404;
      throw err;
    }
    const taskId = await editingRepository.create({ session_id, task_name, due_date, priority: priority || 'medium', assigned_editor_id: assigned_editor_id || null });
    return await editingRepository.findById(taskId);
  },

  async updateTaskStatus(id, status, qc_notes) {
    const validStatuses = ['queued', 'raw_ingested', 'in_progress', 'qc_review', 'approved', 'revisions_needed'];
    if (!validStatuses.includes(status)) {
      const err = new Error(`Invalid status. Allowed: [${validStatuses.join(', ')}]`);
      err.statusCode = 400;
      throw err;
    }
    await this.getTaskById(id);
    await editingRepository.updateStatus(id, status, qc_notes);
    return await editingRepository.findById(id);
  },
};

module.exports = editingService;
