const express = require('express');
const router = express.Router();
const deliverableController = require('../controllers/deliverableController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/task/:taskId', roleMiddleware(['Editor', 'Admin', 'Manager']), deliverableController.getByTask);
router.post('/', roleMiddleware(['Editor', 'Admin', 'Manager']), deliverableController.create);
router.get('/my-files', roleMiddleware(['Customer', 'Admin']), deliverableController.getMyDeliverables);

module.exports = router;
