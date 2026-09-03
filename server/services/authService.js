const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const config = require('../config/config');

const authService = {
  /**
   * Authenticate user credentials and issue signed JWT
   */
  async login(email, password) {
    if (!email || !password) {
      const err = new Error('Please provide email and password');
      err.statusCode = 400;
      throw err;
    }

    const user = await userRepository.findByEmail(email.toLowerCase().trim());
    if (!user) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    if (user.status !== 'active') {
      const err = new Error('Account is inactive or suspended. Contact studio administrator.');
      err.statusCode = 403;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    // Sign 24-hour token with user identity and role
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role_name,
      },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role_name,
        phone: user.phone,
      },
    };
  },

  async registerCustomer(payload) {
    const { full_name, email, password, phone, alternate_phone, address, city } = payload;
    if (!full_name || !email || !password || !phone) {
      const error = new Error('Full name, email, password, and phone are required');
      error.statusCode = 400;
      throw error;
    }
    if (password.length < 8) {
      const error = new Error('Password must be at least 8 characters');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingEmail = await userRepository.findByEmail(normalizedEmail);
    if (existingEmail) {
      const error = new Error('An account with this email address already exists');
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    try {
      await userRepository.createCustomerAccount({
        fullName: full_name,
        email: normalizedEmail,
        passwordHash,
        phone,
        alternatePhone: alternate_phone,
        address,
        city,
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        error.statusCode = 409;
        error.message = 'An account with this email or phone already exists';
      }
      throw error;
    }

    return { email: normalizedEmail };
  },

  /**
   * Fetch profile of authenticated user
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const err = new Error('User profile not found');
      err.statusCode = 404;
      throw err;
    }
    return user;
  },
};

module.exports = authService;
