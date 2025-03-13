// backend/middlewares/roleMiddleware.js
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role && req.user.role.name === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied: Admins only' });
    }
  };
  