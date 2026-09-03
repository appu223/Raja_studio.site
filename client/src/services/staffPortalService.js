import api from './api';

export const staffPortalService = {
  // Photographer
  getPhotographerDashboard: () => api.get('/staff-portal/photographer/dashboard'),
  getPhotographerShoots: () => api.get('/staff-portal/photographer/shoots'),
  getPhotographerGear: () => api.get('/staff-portal/photographer/gear'),
  updateShootStatus: (id, status, notes = '') => api.patch(`/staff-portal/photographer/shoots/${id}/status`, { status, notes }),

  // Editor
  getEditorDashboard: () => api.get('/staff-portal/editor/dashboard'),
  getEditorTasks: () => api.get('/staff-portal/editor/tasks'),
  updateEditorTask: (id, status, qc_notes = '') => api.patch(`/staff-portal/editor/tasks/${id}/status`, { status, qc_notes }),
};