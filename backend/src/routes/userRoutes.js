// backend/routes/userRoutes.js
import { Router } from 'express';
import { createUser, deleteUser } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/roleMiddleware.js';

const router = Router();

// Apply authentication middleware
router.use(protect);
// Apply role-based access middleware (Admins only)
router.use(adminOnly);

// Endpoint to create a new user (HR, recruiter, employee)
router.post('/', createUser);
// Endpoint to delete a user by ID
router.delete('/:id', deleteUser);

export default router;
