import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token
 * @param {string} id - User ID
 * @param {string} role - User role
 * @returns {string} JWT token
 */
export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};