import jwt from 'jsonwebtoken';
import { PERMISSIONS, hasPermission } from '../config/roles.js';
import config from '../config/config.js';

/**
 * Middleware to protect routes that require authentication
 */
export const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET);

      // Add user info to request object
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

/**
 * Middleware to restrict access based on user role
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user?.role || 'unknown'} is not authorized to access this resource`,
      });
    }
    next();
  };
};

/**
 * Middleware to check permission for a specific action
 */
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || !hasPermission(req.user.role, permission)) {
      return res.status(403).json({
        success: false,
        message: `You don't have permission to perform this action`,
      });
    }
    next();
  };
};

/**
 * Export permissions for route configuration
 */
export { PERMISSIONS };