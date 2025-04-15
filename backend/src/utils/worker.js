// worker.js
import { Worker } from 'bullmq';
import { uploadAudioToGCS } from './googleCloudStorage.js';
import Interview from '../models/interviewModel.js';
import redis from '../config/redisClient.js';
import { env } from '../utils/validateEnv.js';
import connectDB from '../config/connectDB.js';
import { connectRabbitMQ, closeRabbitMQ, sendMessage } from '../utils/rabbitMQ.js';
import cloudinary from '../config/cloudinaryConfig.js';

connectDB(env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected successfully");
    await connectRabbitMQ(); // Connect to RabbitMQ
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });

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

/**
 * Helper function to check if all jobs (audio and video) are completed.
 */
async function areAllJobsCompleted(interviewId, expectedCount) {
    const audioUploadedCount = await redis.hlen(`interview:${interviewId}:audio`);
    const videoUploadedCount = await redis.hlen(`interview:${interviewId}:video`);
    return audioUploadedCount === expectedCount && videoUploadedCount === expectedCount;
}

// Create a BullMQ worker that processes jobs from the "mediaQueue"
const mediaWorker = new Worker('mediaQueue', async job => {
    console.log(`Processing media job ${job.id}...`);
    const { interviewId, questionIndex, audioData, videoData } = job.data;

    let audioUrl = null;
    let videoUrl = null;

    try {
        // Process audio if audioData is provided
        if (audioData) {
            const { fileBase64, originalName, mimetype } = audioData;
            const fileBuffer = Buffer.from(fileBase64, 'base64');

            // Upload the audio file to Google Cloud Storage
            const signedUrl = await uploadAudioToGCS(fileBuffer, originalName, mimetype);
            audioUrl = convertToGsutilUrl(signedUrl);

            // Save the resulting audio URL in a Redis hash
            await redis.hset(`interview:${interviewId}:audio`, questionIndex, audioUrl);

            // Log success message for audio upload
            console.log(`Audio uploaded successfully for questionIndex ${questionIndex}: ${audioUrl}`);
        }

        // Process video if videoData is provided
        if (videoData) {
            const { fileBase64, originalName, mimetype } = videoData;
            const fileBuffer = Buffer.from(fileBase64, 'base64');

            // Upload the video file to Cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: 'video' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(fileBuffer);
            });

            videoUrl = uploadResult.secure_url;

            // Save the resulting video URL in a Redis hash
            await redis.hset(`interview:${interviewId}:video`, questionIndex, videoUrl);

            // Log success message for video upload
            console.log(`Video uploaded successfully for questionIndex ${questionIndex}: ${videoUrl}`);
        }

        // Fetch the interview document to determine the expected number of questions
        const interviewDoc = await Interview.findById(interviewId);
        if (!interviewDoc) {
            throw new Error('Interview document not found');
        }
        const expectedCount = interviewDoc.questions.length;

        // Check if all jobs (audio and video) are completed
        if (await areAllJobsCompleted(interviewId, expectedCount)) {
            const audioUrls = await redis.hgetall(`interview:${interviewId}:audio`);
            const videoUrls = await redis.hgetall(`interview:${interviewId}:video`);

            // Update the MongoDB document in one batch
            const updatedQuestions = interviewDoc.questions.map((q, idx) => {
                return {
                    ...q.toObject(),
                    answerAudioUrl: audioUrls[idx] || q.answerAudioUrl,
                    videoUrl: videoUrls[idx] || q.videoUrl,
                };
            });

            interviewDoc.questions = updatedQuestions;
            interviewDoc.status = 'completed';
            await interviewDoc.save();

            // Send the updated interviewDoc to RabbitMQ
            await sendMessage('interview_completed_queue', interviewDoc._id);

            // Clear the temporary Redis hashes for this interview
            await redis.del(`interview:${interviewId}:audio`);
            await redis.del(`interview:${interviewId}:video`);
            console.log(`Interview ${interviewId} updated with all audio and video URLs.`);
        }

        return { audioUrl, videoUrl };
    } catch (error) {
        console.error(`Error processing media job ${job.id}:`, error);
        throw error; // Ensure the job is marked as failed
    }
}, { connection: { host: 'localhost', port: 6379 } });

mediaWorker.on('completed', job => {
    const { audioUrl, videoUrl } = job.returnvalue || {};
    console.log(`Media job ${job.id} completed successfully.`);
    if (audioUrl) console.log(`Audio upload success: ${audioUrl}`);
    if (videoUrl) console.log(`Video upload success: ${videoUrl}`);
});

mediaWorker.on('failed', (job, err) => {
    console.error(`Media job ${job.id} failed: ${err.message}`);
});

// Gracefully handle shutdown
process.on('SIGINT', async () => {
    await closeRabbitMQ(); // Close RabbitMQ connection on shutdown
    process.exit(0);
});

// Added log to confirm the worker is running
console.log('Media worker is running and listening for jobs on the "mediaQueue".');
