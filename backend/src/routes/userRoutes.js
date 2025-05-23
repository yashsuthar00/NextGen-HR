import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';
import RoleMiddleware from '../middlewares/roleMiddleware.js';

const router = Router();

router.use(AuthMiddleware.protect);
router.use(RoleMiddleware.adminOnly);

router.get('/', UserController.getUsers);
router.post('/', UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;
