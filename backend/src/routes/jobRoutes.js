import { Router } from 'express';
import JobController from '../controllers/jobController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';
import RoleMiddleware from '../middlewares/roleMiddleware.js';

const router = Router();

router.use(AuthMiddleware.protect);
router.use(RoleMiddleware.hrAndAdminOnly)

router.get('/', JobController.getJobs);
router.post('/', JobController.createJob);
router.get('/:id', JobController.getJobById);
router.delete('/:id', JobController.deleteJob);
router.put('/:id', JobController.updateJob);

export default router;