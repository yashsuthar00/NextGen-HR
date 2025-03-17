// backend/routes/userRoutes.js
import { Router } from 'express';
import { createUser, deleteUser, getUsers } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/roleMiddleware.js';

const router = Router();

// Apply authentication middleware
router.use(protect);
// Apply role-based access middleware (Admins only)
router.use(adminOnly);

// Endpoint to create a new user (HR, recruiter, employee)
router.get('/', getUsers);
router.post('/', adminOnly, createUser);
// Endpoint to delete a user by ID
router.delete('/:id', adminOnly, deleteUser);

export default router;
