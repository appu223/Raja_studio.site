const express = require('express');
const router = express.Router();
const customerPortalController = require('../controllers/customerPortalController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware(['Customer', 'Admin']));

router.get('/dashboard', customerPortalController.getDashboard);
router.get('/bookings', customerPortalController.getBookings);
router.get('/finance', customerPortalController.getFinance);
router.get('/galleries', customerPortalController.getGalleries);
router.post('/bookings', customerPortalController.createBookingRequest);
router.post('/pay', customerPortalController.submitOnlinePayment);
router.put('/profile', customerPortalController.updateProfile);

module.exports = router;
