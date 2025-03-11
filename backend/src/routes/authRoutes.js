import express from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.put('/me', protect, updateUserProfile);

// Admin only routes
router.route('/users')
  .get(protect, authorize('admin'), getUsers);

router.route('/users/:id')
  .get(protect, authorize('admin'), getUserById)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

export default router;