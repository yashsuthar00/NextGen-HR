import Interview from "../models/interviewModel.js";
import { Queue } from "bullmq";
import redis from "../config/redisClient.js";
import cloudinary from "../config/cloudinaryConfig.js";

// Initialize the BullMQ queue for media uploads
const mediaQueue = new Queue('mediaQueue', {
    connection: { host: 'localhost', port: 6379 }
});

class InterviewController {

    static async uploadInterviewData(req, res) {
        try {
            const { interviewId, questionIndex } = req.body;

            // Check required fields
            if (!interviewId || questionIndex === undefined) {
                return res.status(400).json({ success: false, message: 'Missing interviewId or questionIndex' });
            }

            // Validate file uploads
            const audioFile = req.files?.audio?.[0]; // Ensure audio is an array and access the first file
            const videoFile = req.files?.video?.[0]; // Ensure video is an array and access the first file

            if (!audioFile && !videoFile) {
                return res.status(400).json({ success: false, message: 'No files uploaded. Both audio and video are missing.' });
            }

            if (audioFile) {
                if (
                    !audioFile.mimetype?.startsWith('audio/') || 
                    (!audioFile.originalname.endsWith('.m4a') && !audioFile.originalname.endsWith('.wav'))
                ) {
                    return res.status(400).json({ success: false, message: 'Only .m4a or .wav audio files are allowed.' });
                }
            }

            if (videoFile) {
                if (
                    !videoFile.mimetype?.startsWith('video/') || 
                    (!videoFile.originalname.endsWith('.mp4') && !videoFile.originalname.endsWith('.webm'))
                ) {
                    return res.status(400).json({ success: false, message: 'Only .mp4 or .webm video files are allowed.' });
                }
            }

            // Validate that the interview document exists
            const interviewDoc = await Interview.findById(interviewId);
            if (!interviewDoc) {
                return res.status(404).json({ success: false, message: 'Interview document not found.' });
            }

            // Ensure the incoming questionIndex is valid
            const expectedCount = interviewDoc.questions.length;
            if (questionIndex < 0 || questionIndex >= expectedCount) {
                return res.status(400).json({ success: false, message: 'Invalid question index.' });
            }

            // Check in Redis if this question already has an upload
            const audioExists = audioFile
                ? await redis.hexists(`interview:${interviewId}:audio`, questionIndex)
                : false;
            const videoExists = videoFile
                ? await redis.hexists(`interview:${interviewId}:video`, questionIndex)
                : false;

            if (audioExists) {
                return res.status(400).json({ success: false, message: 'Audio for this question is already uploaded.' });
            }
            if (videoExists) {
                return res.status(400).json({ success: false, message: 'Video for this question is already uploaded.' });
            }

            // Prepare job data
            const jobData = {
                interviewId,
                questionIndex: parseInt(questionIndex, 10),
                audioData: audioFile
                    ? {
                          fileBase64: audioFile.buffer.toString('base64'),
                          originalName: audioFile.originalname,
                          mimetype: audioFile.mimetype,
                      }
                    : null,
                videoData: videoFile
                    ? {
                          fileBase64: videoFile.buffer.toString('base64'),
                          originalName: videoFile.originalname,
                          mimetype: videoFile.mimetype,
                      }
                    : null,
            };

            // Push the job to the media queue
            await mediaQueue.add('uploadMedia', jobData);

            res.status(202).json({ success: true, message: 'Media upload job queued successfully.' });
        } catch (error) {
            console.error('Error in uploadInterviewData:', error);
            res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
        }
    }

    static async getInterviewData(req, res) {
        try {
            const { id } = req.params;
            const interviewDoc = await Interview.findById(id);
            if (!interviewDoc) {
                return res.status(404).json({ message: 'Interview document not found.' });
            }
            res.status(200).json(interviewDoc);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getInterviewsByUserId(req, res) {
        try {
            const { id } = req.params;
            const interviews = await Interview.find({ userId: id });
            if (!interviews || interviews.length === 0) {
                return res.status(404).json({ message: 'No interviews found for this user.' });
            }
            res.status(200).json(interviews);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getInterviewsByJobId(req, res) {
        try {
            const { id } = req.params;
            const interviews = await Interview.find({ jobId: id });
            if (!interviews || interviews.length === 0) {
                return res.status(404).json({ message: 'No interviews found for this job.' });
            }
            res.status(200).json(interviews);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default InterviewController;