const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All customer endpoints require JWT authentication and Admin or Manager role
router.use(authMiddleware);
router.use(roleMiddleware(['Admin', 'Manager']));

router.get('/', customerController.getAll);
router.post('/', customerController.create);
router.get('/:id', customerController.getOne);
router.put('/:id', customerController.update);
router.delete('/:id', customerController.remove);

module.exports = router;