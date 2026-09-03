const bookingRepository = require('../repositories/bookingRepository');
const customerRepository = require('../repositories/customerRepository');
const pool = require('../config/database');

const VALID_TRANSITIONS = {
  draft: ['confirmed', 'cancelled'],
  confirmed: ['staff_assigned', 'cancelled'],
  staff_assigned: ['shoot_scheduled', 'cancelled'],
  shoot_scheduled: ['shoot_completed', 'cancelled'],
  shoot_completed: ['editing', 'cancelled'],
  editing: ['gallery_ready', 'cancelled'],
  gallery_ready: ['delivered', 'cancelled'],
  delivered: ['closed'],
  closed: [],
  cancelled: [],
};

const bookingService = {
  async getBookings(query) {
    const { status, limit = 50, page = 1 } = query;
    const offset = (page - 1) * limit;
    return await bookingRepository.findAll(status, limit, offset);
  },

  async getBookingById(id) {
    const booking = await bookingRepository.findById(id);
    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }
    booking.balance_amount = Math.max(0, Number(booking.total_amount) - Number(booking.total_paid));
    return booking;
  },

  /**
   * Strict server-side recalculation of selected service prices
   */
  async createBooking(payload, createdByUserId) {
    const { customer_id, event_date, event_venue, special_requirements, selected_services, discount_amount = 0 } = payload;

    if (!customer_id || !event_date || !selected_services || selected_services.length === 0) {
      const err = new Error('Customer, event date, and at least one service are required');
      err.statusCode = 400;
      throw err;
    }

    const customer = await customerRepository.findById(customer_id);
    if (!customer) {
      const err = new Error('Customer does not exist');
      err.statusCode = 404;
      throw err;
    }

    // Read current catalog prices from database (never trust client prices)
    const serviceIds = selected_services.map((service) => service.service_id);
    const [dbServices] = await pool.query(
      `SELECT id, name, base_price, is_active FROM services WHERE id IN (?)`,
      [serviceIds]
    );

    if (dbServices.length !== serviceIds.length) {
      const err = new Error('One or more selected services are invalid or no longer exist');
      err.statusCode = 400;
      throw err;
    }

    // Build verified items snapshot and calculate subtotal
    let calculatedSubtotal = 0;
    const itemsToSave = [];

    for (const requestedItem of selected_services) {
      const canonical = dbServices.find((service) => service.id === requestedItem.service_id);
      if (!canonical || !canonical.is_active) {
        const err = new Error(`Service "${canonical?.name || requestedItem.service_id}" is currently inactive`);
        err.statusCode = 400;
        throw err;
      }

      const quantity = Math.max(1, parseInt(requestedItem.quantity, 10) || 1);
      const unitPrice = parseFloat(canonical.base_price);
      const lineTotal = unitPrice * quantity;
      calculatedSubtotal += lineTotal;

      itemsToSave.push({
        service_id: canonical.id,
        item_name_snapshot: canonical.name,
        unit_price_snapshot: unitPrice,
        quantity,
        line_total: lineTotal,
      });
    }

    const discount = Math.max(0, parseFloat(discount_amount) || 0);
    if (discount > calculatedSubtotal) {
      const err = new Error('Discount amount cannot exceed booking subtotal');
      err.statusCode = 400;
      throw err;
    }

    const calculatedTotal = calculatedSubtotal - discount;
    const bookingNumber = `BK-${Date.now().toString().slice(-6)}`;

    const bookingId = await bookingRepository.createWithItems(
      {
        booking_number: bookingNumber,
        customer_id,
        status: 'draft',
        subtotal_amount: calculatedSubtotal,
        discount_amount: discount,
        total_amount: calculatedTotal,
        event_date,
        event_venue,
        special_requirements,
        created_by_user_id: createdByUserId,
      },
      itemsToSave
    );

    return await this.getBookingById(bookingId);
  },

  async updateStatus(id, targetStatus) {
    const booking = await bookingRepository.findById(id);
    if (!booking) {
      const err = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    const allowed = VALID_TRANSITIONS[booking.status] || [];
    if (!allowed.includes(targetStatus)) {
      const err = new Error(
        `Invalid status transition from "${booking.status}" to "${targetStatus}". Allowed: [${allowed.join(', ')}]`
      );
      err.statusCode = 400;
      throw err;
    }

    await bookingRepository.updateStatus(id, targetStatus);
    return await this.getBookingById(id);
  },
};

module.exports = bookingService;
