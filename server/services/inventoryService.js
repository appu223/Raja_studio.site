const inventoryRepository = require('../repositories/inventoryRepository');

const inventoryService = {
  async getAllEquipment() {
    return await inventoryRepository.findAllEquipment();
  },

  async createEquipment(data) {
    if (!data.name || !data.category) {
      const err = new Error('Equipment name and category are required');
      err.statusCode = 400;
      throw err;
    }
    const assetTag = data.asset_tag ? data.asset_tag.toUpperCase().trim() : `EQ-${Date.now().toString().slice(-6)}`;
    const id = await inventoryRepository.createEquipment({ ...data, asset_tag: assetTag });
    return await inventoryRepository.findEquipmentById(id);
  },

  async checkoutGear(payload) {
    const { equipment_id, session_id, issued_to_user_id, condition_note } = payload;
    if (!equipment_id || !issued_to_user_id) {
      const err = new Error('Equipment and recipient staff user are required');
      err.statusCode = 400;
      throw err;
    }
    const item = await inventoryRepository.findEquipmentById(equipment_id);
    if (!item) {
      const err = new Error('Equipment item not found');
      err.statusCode = 404;
      throw err;
    }
    if (item.is_checked_out) {
      const err = new Error(`Item "${item.name}" is already checked out to another crew member`);
      err.statusCode = 409;
      throw err;
    }
    if (item.condition_status === 'retired') {
      const err = new Error(`Item "${item.name}" is retired from service`);
      err.statusCode = 400;
      throw err;
    }
    await inventoryRepository.checkoutEquipment(equipment_id, session_id, issued_to_user_id, condition_note);
    return await inventoryRepository.findEquipmentById(equipment_id);
  },

  async checkinGear(payload) {
    const { equipment_id, condition_on_checkin, condition_status } = payload;
    if (!equipment_id) {
      const err = new Error('Equipment ID is required');
      err.statusCode = 400;
      throw err;
    }
    const item = await inventoryRepository.findEquipmentById(equipment_id);
    if (!item) {
      const err = new Error('Equipment item not found');
      err.statusCode = 404;
      throw err;
    }
    await inventoryRepository.checkinEquipment(equipment_id, condition_on_checkin, condition_status);
    return await inventoryRepository.findEquipmentById(equipment_id);
  },

  async getTransactions() {
    return await inventoryRepository.getRecentTransactions();
  }
};

module.exports = inventoryService;
