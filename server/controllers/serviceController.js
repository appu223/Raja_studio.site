const serviceService = require('../services/serviceService');

const serviceController = {
  async getServices(req, res, next) {
    try {
      const onlyActive = req.query.active === 'true';
      const services = await serviceService.getAllServices(onlyActive);
      res.status(200).json({ success: true, data: services });
    } catch (err) {
      next(err);
    }
  },

  async createService(req, res, next) {
    try {
      const service = await serviceService.createService(req.body);
      res.status(201).json({ success: true, message: 'Service created successfully', data: service });
    } catch (err) {
      next(err);
    }
  },

  async updateService(req, res, next) {
    try {
      const updated = await serviceService.updateService(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Service updated successfully', data: updated });
    } catch (err) {
      next(err);
    }
  },

  async toggleService(req, res, next) {
    try {
      const updated = await serviceService.toggleActive(req.params.id);
      res.status(200).json({ success: true, message: 'Service status toggled', data: updated });
    } catch (err) {
      next(err);
    }
  },

  async getPackages(req, res, next) {
    try {
      const onlyActive = req.query.active === 'true';
      const packages = await serviceService.getAllPackages(onlyActive);
      res.status(200).json({ success: true, data: packages });
    } catch (err) {
      next(err);
    }
  },

  async createPackage(req, res, next) {
    try {
      const pkgId = await serviceService.createPackage(req.body);
      res.status(201).json({ success: true, message: 'Package created successfully', data: { id: pkgId } });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = serviceController;
