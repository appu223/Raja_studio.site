import api from './api';

export const getMediaUrl = (url) => {
  if (!url || /^(data:|blob:|https?:\/\/)/i.test(url)) return url;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return `${apiUrl.replace(/\/api\/?$/, '')}${url}`;
};

export const galleryService = {
  getAll: () => api.get('/galleries'),
  getById: (id) => api.get(`/galleries/${id}`),
  getByToken: (token) => api.get(`/galleries/public/${token}`),
  create: (data) => api.post('/galleries', data),
  addPhotos: (id, photos) => api.post(`/galleries/${id}/photos`, { photos }),
  uploadFiles: (id, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return api.post(`/galleries/${id}/photos`, formData);
  },
  deletePhoto: (galleryId, photoId) => api.delete(`/galleries/${galleryId}/photos/${photoId}`),
  setCover: (galleryId, photoId) => api.patch(`/galleries/${galleryId}/cover/${photoId}`),
};