import { Router } from 'express';
import JobController from '../controllers/jobController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', JobController.getJobs);
router.post('/', JobController.createJob);
router.get('/:id', JobController.getJobById);
router.delete('/:id', JobController.deleteJob);
router.put('/:id', JobController.updateJob);

export default router;