const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const galleryUpload = require('../middleware/galleryUpload');

// Public route: Token-based client gallery view (No login required)
router.get('/public/:token', galleryController.getByToken);

// Protected Studio Routes
router.use(authMiddleware);

router.get('/', galleryController.getAll);
router.get('/:id', galleryController.getOne);
router.post('/', roleMiddleware(['Admin', 'Manager', 'Editor']), galleryController.create);
router.post('/:id/photos', roleMiddleware(['Admin', 'Manager', 'Editor']), galleryUpload.array('files', 100), galleryController.addPhotos);
router.delete('/:id/photos/:photoId', roleMiddleware(['Admin', 'Manager', 'Editor']), galleryController.deletePhoto);
router.patch('/:id/cover/:photoId', roleMiddleware(['Admin', 'Manager', 'Editor']), galleryController.setCover);

module.exports = router;
