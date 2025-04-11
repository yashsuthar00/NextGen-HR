import Interview from "../models/interviewModel.js";
import { Queue } from "bullmq";
import redis from "../config/redisClient.js";

// Initialize the BullMQ queue for audio uploads
const audioQueue = new Queue('audioQueue', {
    connection: { host: 'localhost', port: 6379 }
  });


  class InterviewController {

    static async uploadInterviewData (req, res) {
        try {
          const { interviewId, questionIndex } = req.body;
          
          // Check required fields
          if (!interviewId || questionIndex === undefined) {
            return res.status(400).json({ message: 'Missing interviewId or questionIndex' });
          }
          
          // Validate file upload
          if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
          }
          if (
            !req.file.mimetype.startsWith('audio/') ||
            (!req.file.originalname.endsWith('.m4a') && !req.file.originalname.endsWith('.wav'))
          ) {
            return res.status(400).json({ message: 'Only .m4a or .wav audio files are allowed.' });
          }
          
          // Validate that the interview document exists and get its question count
          const interviewDoc = await Interview.findById(interviewId);
          if (!interviewDoc) {
            return res.status(404).json({ message: 'Interview document not found.' });
          }
      
        
          const expectedCount = interviewDoc.questions.length;
          
          // Ensure the incoming questionIndex is valid (0-based index within expected count)
          if (questionIndex < 0 || questionIndex >= expectedCount) {
            return res.status(400).json({ message: 'Invalid question index.' });
          }
          
          // Check the status of the interview
          if (interviewDoc.status === 'completed') {
            return res.status(400).json({ message: 'Interview has already been completed.' });
          } else if (interviewDoc.status !== 'scheduled') {
            return res.status(400).json({ message: 'Interview is not in a valid state for uploading.' });
          }
      
          // Check in Redis if this question already has an audio upload
          const alreadyExists = await redis.hexists(`interview:${interviewId}`, questionIndex);
          if (alreadyExists) {
            return res.status(400).json({ message: 'Audio for this question is already uploaded.' });
          }
          
          // Convert the file buffer to a base64 string for serialization in the queue job
          const fileBase64 = req.file.buffer.toString('base64');
          
          // Push the job to the audioQueue with necessary details
          await audioQueue.add('uploadAudio', {
            interviewId,
            questionIndex: parseInt(questionIndex, 10),
            fileBase64,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype
          });
          
          res.status(202).json({ message: 'Audio upload job queued.' });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
  }

    static async getInterviewData (req, res) {
       try {
        const { id } = req.params;
        const interviewDoc = await Interview.findById(id);
        if (!interviewDoc) {
          return res.status(404).json({ message: 'Interview document not found.' });
        }
        res.status(200).json(interviewDoc);
       }
         catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal server error' });
         }
    }
}

export default InterviewController;