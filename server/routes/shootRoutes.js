const express = require('express');
const router = express.Router();
const shootController = require('../controllers/shootController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/', shootController.getAll);
router.get('/staff-list', shootController.getStaff);
router.get('/:id', shootController.getOne);
router.post('/', roleMiddleware(['Admin', 'Manager']), shootController.create);
router.patch('/:id/status', roleMiddleware(['Admin', 'Manager', 'Photographer']), shootController.updateStatus);

module.exports = router;
