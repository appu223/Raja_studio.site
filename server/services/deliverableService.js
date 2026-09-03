const deliverableRepository = require('../repositories/deliverableRepository');
const bookingRepository = require('../repositories/bookingRepository');

const deliverableService = {
  async getDeliverablesByTask(taskId) {
    return await deliverableRepository.findByTaskId(taskId);
  },

  async getDeliverablesForCustomer(customerId) {
    return await deliverableRepository.findByCustomerId(customerId);
  },

  async createDeliverable(payload, editorUserId) {
    const { task_id, booking_id, title, asset_type, file_url, file_size, editor_notes } = payload;
    if (!booking_id || !title || !file_url) {
      const err = new Error('Booking ID, title, and file link/URL are required');
      err.statusCode = 400;
      throw err;
    }

    const booking = await bookingRepository.findById(booking_id);
    if (!booking) {
      const err = new Error('Associated booking not found');
      err.statusCode = 404;
      throw err;
    }

    const deliverableId = await deliverableRepository.create({
      task_id: task_id ? parseInt(task_id, 10) : null,
      booking_id: parseInt(booking_id, 10),
      customer_id: booking.customer_id,
      title,
      asset_type: asset_type || 'JPG Image',
      file_url,
      file_size,
      editor_notes,
      created_by_user_id: editorUserId,
    });

    const deliverable = await deliverableRepository.findById(deliverableId);
    let rawPhone = deliverable.customer_phone ? deliverable.customer_phone.replace(/\D/g, '') : '';
    if (rawPhone.length === 10) rawPhone = `91${rawPhone}`;

    const message = encodeURIComponent(
      `Hello ${deliverable.customer_name}! Your edited deliverable "${deliverable.title}" (${deliverable.asset_type}) from Raja Studio is ready for download!\n\nAccess link: ${deliverable.file_url}\n\nThank you for choosing Raja Studio!`
    );
    deliverable.whatsapp_url = rawPhone ? `https://api.whatsapp.com/send?phone=${rawPhone}&text=${message}` : null;
    return deliverable;
  },
};

module.exports = deliverableService;
