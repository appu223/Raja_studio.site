const express = require('express');
const router = express.Router();
const staffPortalController = require('../controllers/staffPortalController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/photographer/dashboard', roleMiddleware(['Photographer', 'Admin']), staffPortalController.getPhotographerDashboard);
router.get('/photographer/shoots', roleMiddleware(['Photographer', 'Admin']), staffPortalController.getPhotographerShoots);
router.get('/photographer/gear', roleMiddleware(['Photographer', 'Admin']), staffPortalController.getPhotographerGear);
router.patch('/photographer/shoots/:id/status', roleMiddleware(['Photographer', 'Admin']), staffPortalController.updatePhotographerShoot);
router.get('/editor/dashboard', roleMiddleware(['Editor', 'Admin']), staffPortalController.getEditorDashboard);
router.get('/editor/tasks', roleMiddleware(['Editor', 'Admin']), staffPortalController.getEditorTasks);
router.patch('/editor/tasks/:id/status', roleMiddleware(['Editor', 'Admin']), staffPortalController.updateEditorTask);

module.exports = router;
