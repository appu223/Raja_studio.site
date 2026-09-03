const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route: Login
router.post('/login', authController.login);
router.post('/register-customer', authController.registerCustomer);

// Protected route: Current user session details
router.get('/me', authMiddleware, authController.me);

module.exports = router;
