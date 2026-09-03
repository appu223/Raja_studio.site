const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware(['Admin', 'Manager']));

router.get('/', enquiryController.getAll);
router.post('/', enquiryController.create);
router.get('/:id', enquiryController.getOne);
router.patch('/:id/status', enquiryController.updateStatus);
router.post('/:id/follow-ups', enquiryController.addFollowUp);

module.exports = router;