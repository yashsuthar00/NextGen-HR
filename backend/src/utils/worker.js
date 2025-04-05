// worker.js
import { Worker } from 'bullmq';
import { uploadAudioToGCS } from './googleCloudStorage.js';
import Interview from '../models/interviewModel.js';
import redis from '../config/redisClient.js';
import { env } from '../utils/validateEnv.js'
import connectDB from '../config/connectDB.js';

connectDB(env.MONGO_URI)
.then(async () => {
    console.log("mognodb connected successfully")
})

/**
 * Helper function to convert the signed URL to a gsutil URL.
 */
function convertToGsutilUrl(signedUrl) {
    const url = new URL(signedUrl);
    const bucketName =
        url.hostname === 'storage.googleapis.com'
            ? url.pathname.split('/')[1]
            : url.hostname.split('.')[0];
    const objectName = decodeURIComponent(url.pathname.split('/').slice(2).join('/'));
    return `gs://${bucketName}/${objectName}`;
}

// Create a BullMQ worker that processes jobs from the "audioQueue"
const worker = new Worker('audioQueue', async job => {
    console.log(`Processing job ${job.id}...`); // Added log to indicate job processing
    const { interviewId, questionIndex, fileBase64, originalName, mimetype } = job.data;
    // Decode the base64-encoded file buffer
    const fileBuffer = Buffer.from(fileBase64, 'base64');
    
    // Upload the audio file to Google Cloud Storage
    const signedUrl = await uploadAudioToGCS(fileBuffer, originalName, mimetype);
    const gsutilUrl = convertToGsutilUrl(signedUrl);
    
    // Save the resulting gsutil URL in a Redis hash with key "interview:<interviewId>"
    // The field name is the question index.
    await redis.hset(`interview:${interviewId}`, questionIndex, gsutilUrl);
    
    // Fetch the interview document from MongoDB to determine the expected number of questions.
    const interviewDoc = await Interview.findById(interviewId);
    if (!interviewDoc) {
        throw new Error('Interview document not found');
    }
    const expectedCount = interviewDoc.questions.length;
    
    // Check how many questions have been processed (uploaded) so far
    const uploadedCount = await redis.hlen(`interview:${interviewId}`);
    
    // If all questions have been processed, update the MongoDB document in one batch
    if (uploadedCount === expectedCount) {
        const audioUrls = await redis.hgetall(`interview:${interviewId}`);
        // Convert the audioUrls object keys (strings) to numbers and update questions in order
        const updatedQuestions = interviewDoc.questions.map((q, idx) => {
            return { ...q.toObject(), answerAudioUrl: audioUrls[idx] || q.answerAudioUrl };
        });
        
        interviewDoc.questions = updatedQuestions;
        interviewDoc.status = 'completed';
        await interviewDoc.save();
        
        // Clear the temporary Redis hash for this interview
        await redis.del(`interview:${interviewId}`);
        console.log(`Interview ${interviewId} updated with all audio URLs.`);
    }
    
    return gsutilUrl;
}, { connection: { host: 'localhost', port: 6379 } });

worker.on('completed', job => {
    console.log(`Job ${job.id} completed successfully.`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed: ${err.message}`);
});

// Added log to confirm the worker is running
console.log('Worker is running and listening for jobs on the "audioQueue".');
