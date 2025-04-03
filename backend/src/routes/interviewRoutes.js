import { Router } from 'express';
import upload from '../config/multerConfig.js';
import { uploadAudioToGCS } from '../utils/googleCloudStorage.js';
import Interview from '../models/interviewModel.js';
import Job from '../models/jobModel.js';
import User from '../models/userModel.js'
import { sendMessage } from '../utils/rabbitMQ.js';

const router = Router();

router.post('/upload', upload.single('file'), async (req, res) => {
    
    const { jobId, userId, status, question } = req.body;

    if (!jobId) {
        return res.status(400).json({ message: 'Job ID is required.' });
    }

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
    }

    if (!question) {
        return res.status(400).json({ message: 'Question is required.' });
    }

        // Validate file uploads
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!req.file.mimetype.startsWith('audio/') || (!req.file.originalname.endsWith('.m4a') && !req.file.originalname.endsWith('.wav'))) {
        return res.status(400).json({ message: 'Only .m4a or .wav audio files are allowed.' });
    }
    const convertToGsutilUrl = (signedUrl) => {
        const url = new URL(signedUrl);
        const bucketName =
          url.hostname === 'storage.googleapis.com'
            ? url.pathname.split('/')[1]
            : url.hostname.split('.')[0];
        const objectName = decodeURIComponent(url.pathname.split('/').slice(2).join('/'));
        return `gs://${bucketName}/${objectName}`;
      };

      
    try {
        
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const fileUrl = await uploadAudioToGCS(req.file.buffer, req.file.originalname, req.file.mimetype);
        const gsutilUrl = convertToGsutilUrl(fileUrl);

        const interviewData = {
            jobId,
            userId,
            status,
            questions: [
                {
                    question,
                    answerAudioUrl: gsutilUrl,
                },
            ],
            
        };

        const interview = await Interview.create(interviewData);

        // Send a message to RabbitMQ
        await sendMessage('interview_queue', {interviewId: interview._id});
        res.status(200).json({ interviewData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
