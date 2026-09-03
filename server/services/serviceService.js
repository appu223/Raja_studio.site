const serviceRepository = require('../repositories/serviceRepository');

const serviceService = {
  async getAllServices(onlyActive = false) {
    return await serviceRepository.findAllServices(onlyActive);
  },

  async createService(data) {
    if (!data.name || data.base_price === undefined) {
      const err = new Error('Service name and base price are required');
      err.statusCode = 400;
      throw err;
    }

    // Auto-generate unique code if not provided
    const code = data.code ? data.code.toUpperCase().trim() : `SRV-${Date.now().toString().slice(-5)}`;
    const existing = await serviceRepository.findServiceByCode(code);
    if (existing) {
      const err = new Error('A service with this code already exists');
      err.statusCode = 409;
      throw err;
    }

    const id = await serviceRepository.createService({
      ...data,
      code,
      base_price: parseFloat(data.base_price) || 0,
    });
    return await serviceRepository.findServiceById(id);
  },

  async updateService(id, data) {
    const existing = await serviceRepository.findServiceById(id);
    if (!existing) {
      const err = new Error('Service not found');
      err.statusCode = 404;
      throw err;
    }

    await serviceRepository.updateService(id, {
      name: data.name || existing.name,
      description: data.description !== undefined ? data.description : existing.description,
      base_price: data.base_price !== undefined ? parseFloat(data.base_price) : existing.base_price,
      duration_minutes: data.duration_minutes || existing.duration_minutes,
      is_active: data.is_active !== undefined ? (data.is_active ? 1 : 0) : existing.is_active,
    });
    return await serviceRepository.findServiceById(id);
  },

  async toggleActive(id) {
    const existing = await serviceRepository.findServiceById(id);
    if (!existing) {
      const err = new Error('Service not found');
      err.statusCode = 404;
      throw err;
    }
    await serviceRepository.toggleServiceActive(id);
    return await serviceRepository.findServiceById(id);
  },

  // Packages
  async getAllPackages(onlyActive = false) {
    return await serviceRepository.findAllPackages(onlyActive);
  },

  async createPackage(data) {
    if (!data.name || data.package_price === undefined) {
      const err = new Error('Package name and price are required');
      err.statusCode = 400;
      throw err;
    }
    const code = data.code ? data.code.toUpperCase().trim() : `PKG-${Date.now().toString().slice(-5)}`;
    const pkgId = await serviceRepository.createPackage(
      { ...data, code, package_price: parseFloat(data.package_price) || 0 },
      data.items || []
    );
    return pkgId;
  },
};

module.exports = serviceService;
