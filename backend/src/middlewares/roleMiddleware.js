// backend/middlewares/roleMiddleware.js
class RoleMiddleware {
  static adminOnly(req, res, next) {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied: Admins only' });
    }
  }

  static hrOnly(req, res, next) {
    if (req.user && req.user.role === 'hr') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied: HR only' });
    }
  }

  static hrAndAdminOnly(req, res, next) {
    if (req.user && (req.user.role === 'hr' || req.user.role === 'admin')) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied: HR and Admins only' });
    }
  }
}

export default RoleMiddleware;
