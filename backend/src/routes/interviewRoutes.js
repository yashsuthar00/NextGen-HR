import { Router } from 'express';
import upload from '../config/multerConfig.js';
import InterviewController from '../controllers/interviewController.js'

const router = Router();



/**
 * Route: POST /api/interview/upload
 * Expected form-data fields:
 *   - interviewId: The MongoDB ID of the existing interview document
 *   - questionIndex: The index (0-based) of the question being answered
 *   - audio: The audio file (.m4a, .wav)
 *   - video: The video file (.mp4, .webm)
 */
router.post('/upload', upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'video', maxCount: 1 }]), InterviewController.uploadInterviewData);
router.get('/:id', InterviewController.getInterviewData);
router.get('/user/:id', InterviewController.getInterviewsByUserId);
router.get('/job/:id', InterviewController.getInterviewsByJobId);


export default router;
