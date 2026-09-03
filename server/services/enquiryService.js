const enquiryRepository = require('../repositories/enquiryRepository');

const enquiryService = {
  async getEnquiries(status) {
    return await enquiryRepository.findAll(status);
  },

  async getEnquiryById(id) {
    const enquiry = await enquiryRepository.findById(id);
    if (!enquiry) {
      const error = new Error('Enquiry record not found');
      error.statusCode = 404;
      throw error;
    }
    const followUps = await enquiryRepository.getFollowUps(id);
    return { ...enquiry, followUps };
  },

  async createEnquiry(data) {
    if (!data.contact_name || !data.contact_phone || !data.event_type) {
      const error = new Error('Name, phone, and event type are mandatory fields');
      error.statusCode = 400;
      throw error;
    }
    const id = await enquiryRepository.create(data);
    return await enquiryRepository.findById(id);
  },

  async updateStatus(id, status) {
    const validStatuses = ['new', 'in_progress', 'quoted', 'converted', 'lost'];
    if (!validStatuses.includes(status)) {
      const error = new Error(`Invalid status. Allowed values: ${validStatuses.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }
    await enquiryRepository.updateStatus(id, status);
    return await enquiryRepository.findById(id);
  },

  async addFollowUp(enquiryId, data) {
    if (!data.scheduled_date || !data.notes) {
      const error = new Error('Scheduled follow-up date and notes are required');
      error.statusCode = 400;
      throw error;
    }
    const followUpId = await enquiryRepository.createFollowUp({
      enquiry_id: enquiryId,
      scheduled_date: data.scheduled_date,
      notes: data.notes
    });
    return followUpId;
  }
};

module.exports = enquiryService;