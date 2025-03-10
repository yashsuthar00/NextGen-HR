import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { handleVideoUpload } from '../middleware/uploadMiddleware.js';
import {
  startInterview,
  uploadVideoResponse,
  completeInterview,
  getInterviewStatus
} from '../controllers/videoController.js';

const router = express.Router();

// Set up routes with authentication
router.post('/start-interview', protect, startInterview);
router.post('/upload', protect, handleVideoUpload, uploadVideoResponse);
router.post('/complete-interview', protect, completeInterview);
router.get('/status/:interviewResponseId', protect, getInterviewStatus);

export default router;