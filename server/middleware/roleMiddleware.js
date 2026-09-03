/**
 * Role-Based Access Control Middleware
 * Example: roleMiddleware(['Admin', 'Manager'])
 */
const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden: missing user role credentials.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: requires one of the following roles: [${allowedRoles.join(', ')}]`,
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
