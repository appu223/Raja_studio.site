const inventoryService = require('../services/inventoryService');

const inventoryController = {
  async getAll(req, res, next) {
    try {
      const items = await inventoryService.getAllEquipment();
      res.status(200).json({ success: true, data: items });
    } catch (err) { next(err); }
  },

  async create(req, res, next) {
    try {
      const item = await inventoryService.createEquipment(req.body);
      res.status(201).json({ success: true, message: 'Equipment added to inventory', data: item });
    } catch (err) { next(err); }
  },

  async checkout(req, res, next) {
    try {
      const item = await inventoryService.checkoutGear(req.body);
      res.status(200).json({ success: true, message: 'Equipment checked out successfully', data: item });
    } catch (err) { next(err); }
  },

  async checkin(req, res, next) {
    try {
      const item = await inventoryService.checkinGear(req.body);
      res.status(200).json({ success: true, message: 'Equipment returned and checked in', data: item });
    } catch (err) { next(err); }
  },

  async getTransactions(req, res, next) {
    try {
      const logs = await inventoryService.getTransactions();
      res.status(200).json({ success: true, data: logs });
    } catch (err) { next(err); }
  }
};

module.exports = inventoryController;
