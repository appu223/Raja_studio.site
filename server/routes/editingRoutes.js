const express = require('express');
const router = express.Router();
const editingController = require('../controllers/editingController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/queue', editingController.getQueue);
router.get('/editors', editingController.getEditors);
router.get('/:id', editingController.getOne);
router.post('/', roleMiddleware(['Admin', 'Manager']), editingController.create);
router.patch('/:id/status', roleMiddleware(['Admin', 'Manager', 'Editor']), editingController.updateStatus);

module.exports = router;
