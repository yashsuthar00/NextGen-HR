import { Router } from 'express';
import upload from '../config/multerConfig.js';
import InterviewController from '../controllers/interviewController.js'

const router = Router();



/**
 * Route: POST /api/interview/upload
 * Expected form-data fields:
 *   - interviewId: The MongoDB ID of the existing interview document
 *   - questionIndex: The index (0-based) of the question being answered
 *   - file: The audio file (.m4a or .wav)
 */
router.post('/upload', upload.single('file'), InterviewController.uploadInterviewData);
router.get('/:id', InterviewController.getInterviewData);


export default router;
