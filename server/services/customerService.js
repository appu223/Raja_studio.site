const customerRepository = require('../repositories/customerRepository');

const customerService = {
  async getCustomers(query) {
    const { search = '', limit = 50, page = 1 } = query;
    const offset = (page - 1) * limit;
    const [customers, total] = await Promise.all([
      customerRepository.findAll(search, limit, offset),
      customerRepository.countAll(search),
    ]);
    return { customers, total, page: parseInt(page, 10), limit: parseInt(limit, 10) };
  },

  async getCustomerById(id) {
    const customer = await customerRepository.findById(id);
    if (!customer) {
      const error = new Error('Customer record not found');
      error.statusCode = 404;
      throw error;
    }
    return customer;
  },

  async createCustomer(data) {
    if (!data.full_name || !data.phone) {
      const error = new Error('Customer full name and phone number are required');
      error.statusCode = 400;
      throw error;
    }

    const existing = await customerRepository.findByPhone(data.phone.trim());
    if (existing) {
      const error = new Error('A customer with this phone number already exists');
      error.statusCode = 409;
      throw error;
    }

    const id = await customerRepository.create(data);
    return await customerRepository.findById(id);
  },

  async updateCustomer(id, data) {
    await this.getCustomerById(id);
    await customerRepository.update(id, data);
    return await customerRepository.findById(id);
  },

  async deleteCustomer(id) {
    await this.getCustomerById(id);
    await customerRepository.delete(id);
    return true;
  }
};

module.exports = customerService;