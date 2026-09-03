const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Services
router.get('/', authMiddleware, serviceController.getServices);
router.post('/', authMiddleware, roleMiddleware(['Admin', 'Manager']), serviceController.createService);
router.put('/:id', authMiddleware, roleMiddleware(['Admin', 'Manager']), serviceController.updateService);
router.patch('/:id/toggle', authMiddleware, roleMiddleware(['Admin', 'Manager']), serviceController.toggleService);

// Packages
router.get('/packages', authMiddleware, serviceController.getPackages);
router.post('/packages', authMiddleware, roleMiddleware(['Admin', 'Manager']), serviceController.createPackage);

module.exports = router;
