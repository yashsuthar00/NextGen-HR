import jwt from 'jsonwebtoken';
import { env } from '../utils/validateEnv.js';

class AuthMiddleware {
  static async protect(req, res, next) {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET || 'NextGenHR');
      req.user = { id: decoded.id, role: decoded.role }; // Use role from decoded token
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
}

export default AuthMiddleware;