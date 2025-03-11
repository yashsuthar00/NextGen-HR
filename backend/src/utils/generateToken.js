import jwt from 'jsonwebtoken';
import config from '../config/config.js';

/**
 * Generate a JWT token
 * @param {string} id - User ID
 * @param {string} role - User role
 * @returns {string} JWT token
 */
export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE }
  );
};