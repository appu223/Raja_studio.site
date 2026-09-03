const authService = require('../services/authService');

const authController = {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async registerCustomer(req, res, next) {
    try {
      const result = await authService.registerCustomer(req.body);
      res.status(201).json({
        success: true,
        message: 'Customer account created successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async me(req, res, next) {
    try {
      const profile = await authService.getProfile(req.user.id);
      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
