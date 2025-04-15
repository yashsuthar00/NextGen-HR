import { Router } from 'express';
import JobController from '../controllers/jobController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';
import RoleMiddleware from '../middlewares/roleMiddleware.js';

const router = Router();

router.use(AuthMiddleware.protect);

router.get('/', JobController.getJobs);
router.post('/', RoleMiddleware.hrAndAdminOnly, JobController.createJob);
router.get('/:id', JobController.getJobById);
router.delete('/:id', RoleMiddleware.hrAndAdminOnly, JobController.deleteJob);
router.put('/:id', RoleMiddleware.hrAndAdminOnly, JobController.updateJob);

export default router;