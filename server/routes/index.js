const express = require('express');
const router = express.Router();

const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const customerRoutes = require('./customerRoutes');
const enquiryRoutes = require('./enquiryRoutes');
const serviceRoutes = require('./serviceRoutes');
const bookingRoutes = require('./bookingRoutes');
const shootRoutes = require('./shootRoutes');
const editingRoutes = require('./editingRoutes');
const galleryRoutes = require('./galleryRoutes');
const financeRoutes = require('./financeRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const reportRoutes = require('./reportRoutes');
const adminRoutes = require('./adminRoutes');
const customerPortalRoutes = require('./customerPortalRoutes');
const staffPortalRoutes = require('./staffPortalRoutes');
const deliverableRoutes = require('./deliverableRoutes');

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/shoot-sessions', shootRoutes);
router.use('/editing', editingRoutes);
router.use('/galleries', galleryRoutes);
router.use('/finance', financeRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);
router.use('/customer-portal', customerPortalRoutes);
router.use('/staff-portal', staffPortalRoutes);
router.use('/deliverables', deliverableRoutes);

module.exports = router;