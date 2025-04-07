// backend/middlewares/roleMiddleware.js
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') { // Use role from req.user
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};
