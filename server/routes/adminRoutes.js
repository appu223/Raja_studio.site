const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

// Calendar timeline accessible to all active studio staff
router.get('/calendar', adminController.getCalendar);

// Strict Super Admin controls
router.get('/users', roleMiddleware(['Admin']), adminController.getUsers);
router.get('/roles', roleMiddleware(['Admin']), adminController.getRoles);
router.post('/users', roleMiddleware(['Admin']), adminController.createUser);
router.patch('/users/:id/toggle', roleMiddleware(['Admin']), adminController.toggleUserStatus);
router.get('/audit-logs', roleMiddleware(['Admin']), adminController.getAuditLogs);

module.exports = router;
