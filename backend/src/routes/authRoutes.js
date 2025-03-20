// backend/routes/authRoutes.js
import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';

const router = Router();

// Route for user login
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

export default router;
