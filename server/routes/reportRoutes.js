const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/dashboard', roleMiddleware(['Admin', 'Manager']), reportController.getDashboard);
router.get('/revenue', roleMiddleware(['Admin', 'Manager']), reportController.getRevenue);
router.get('/notifications', reportController.getNotifications);
router.patch('/notifications/:id/read', reportController.markNotificationRead);

module.exports = router;
