import api from './api';

export const deliverableService = {
  getByTask: (taskId) => api.get(`/deliverables/task/${taskId}`),
  create: (data) => api.post('/deliverables', data),
  getMyFiles: () => api.get('/deliverables/my-files'),
};