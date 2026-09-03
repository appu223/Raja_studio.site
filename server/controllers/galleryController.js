const galleryService = require('../services/galleryService');

const galleryController = {
  async getAll(req, res, next) {
    try {
      const galleries = await galleryService.getAllGalleries();
      res.status(200).json({ success: true, data: galleries });
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      const gallery = await galleryService.getGalleryById(req.params.id);
      res.status(200).json({ success: true, data: gallery });
    } catch (err) {
      next(err);
    }
  },

  async getByToken(req, res, next) {
    try {
      const gallery = await galleryService.getPublicGallery(req.params.token);
      res.status(200).json({ success: true, data: gallery });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const gallery = await galleryService.createGallery(req.body);
      res.status(201).json({ success: true, message: 'Gallery created successfully', data: gallery });
    } catch (err) {
      next(err);
    }
  },

  async addPhotos(req, res, next) {
    try {
      const uploadedPhotos = (req.files || []).map((file) => ({
        original_filename: file.originalname,
        storage_url: `/uploads/galleries/${file.filename}`,
        thumbnail_url: `/uploads/galleries/${file.filename}`,
      }));
      const linkedPhotos = Array.isArray(req.body.photos) ? req.body.photos : [];
      const updated = await galleryService.addPhotos(req.params.id, [...uploadedPhotos, ...linkedPhotos]);
      res.status(200).json({ success: true, message: 'Photos added successfully', data: updated });
    } catch (err) {
      next(err);
    }
  },

  async deletePhoto(req, res, next) {
    try {
      await galleryService.deletePhoto(req.params.photoId);
      res.status(200).json({ success: true, message: 'Photo deleted' });
    } catch (err) {
      next(err);
    }
  },

  async setCover(req, res, next) {
    try {
      await galleryService.setCover(req.params.id, req.params.photoId);
      res.status(200).json({ success: true, message: 'Cover updated' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = galleryController;
