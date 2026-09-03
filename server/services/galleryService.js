const crypto = require('crypto');
const galleryRepository = require('../repositories/galleryRepository');
const bookingRepository = require('../repositories/bookingRepository');

const galleryService = {
  async getAllGalleries() {
    return await galleryRepository.findAll();
  },

  async getGalleryById(id) {
    const gallery = await galleryRepository.findById(id);
    if (!gallery) {
      const err = new Error('Gallery collection not found');
      err.statusCode = 404;
      throw err;
    }
    return gallery;
  },

  async getPublicGallery(token) {
    const gallery = await galleryRepository.findByToken(token);
    if (!gallery) {
      const err = new Error('Gallery not found or link has expired');
      err.statusCode = 404;
      throw err;
    }
    return gallery;
  },

  async createGallery(payload) {
    const { booking_id, title } = payload;
    if (!booking_id || !title) {
      const err = new Error('Booking selection and album title are required');
      err.statusCode = 400;
      throw err;
    }

    const booking = await bookingRepository.findById(booking_id);
    if (!booking) {
      const err = new Error('Booking does not exist');
      err.statusCode = 404;
      throw err;
    }

    const accessToken = crypto.randomBytes(32).toString('hex');
    const galleryId = await galleryRepository.create({
      booking_id,
      title,
      access_token: accessToken,
      is_public: 1,
    });

    return await galleryRepository.findById(galleryId);
  },

  async addPhotos(galleryId, photos) {
    const gallery = await this.getGalleryById(galleryId);
    if (!photos || photos.length === 0) {
      const err = new Error('Please provide at least one photo URL payload');
      err.statusCode = 400;
      throw err;
    }
    const hasExistingPhotos = gallery.photos && gallery.photos.length > 0;
    const photosWithCover = photos.map((photo, index) => ({
      ...photo,
      is_cover: !hasExistingPhotos && index === 0 ? 1 : photo.is_cover,
    }));
    await galleryRepository.addPhotos(galleryId, photosWithCover);
    return await galleryRepository.findById(galleryId);
  },

  async deletePhoto(photoId) {
    await galleryRepository.deletePhoto(photoId);
    return true;
  },

  async setCover(galleryId, photoId) {
    await this.getGalleryById(galleryId);
    await galleryRepository.setCoverPhoto(galleryId, photoId);
    return true;
  },
};

module.exports = galleryService;
