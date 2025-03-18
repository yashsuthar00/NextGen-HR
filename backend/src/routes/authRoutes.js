// backend/routes/authRoutes.js
import { Router } from 'express';
import { login, register } from '../controllers/authController.js';

const router = Router();

// Route for user login
router.post('/login', login);
router.post('/register', register);

export default router;
