import express from 'express';
const router = express.Router();
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  createInterview,
  getInterviews,
  getInterview,
  updateInterview,
  deleteInterview
} from '../controllers/interviewController.js';

// Set up routes with authentication
router.route('/')
  .post(protect, authorize('admin', 'recruiter'), createInterview)
  .get(protect, getInterviews);

router.route('/:id')
  .get(protect, getInterview)
  .put(protect, authorize('admin', 'recruiter'), updateInterview)
  .delete(protect, authorize('admin', 'recruiter'), deleteInterview);

export default router;