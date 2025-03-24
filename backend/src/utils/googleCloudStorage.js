import { Storage } from '@google-cloud/storage';
import { env } from '../utils/validateEnv.js';


const storage = new Storage({
    projectId: env.GCP_PROJECT_ID,
    keyFilename: env.GCLOUD_KEY_FILE,
});

const bucket= storage.bucket(env.GCS_BUCKET_NAME)

/**
 * Uploads a file buffer to Google Cloud Storage and returns a signed URL.
 * @param {Buffer} fileBuffer - The file data.
 * @param {string} fileName - The original file name.
 * @param {string} mimetype - The file's MIME type.
 * @returns {Promise<string>} - A promise that resolves to the signed URL.
 */

export function uploadFileToGCS(fileBuffer, fileName, mimetype) {
    return new Promise((resolve, reject) => {
      const uniqueFileName = `${Date.now()}_${fileName}`;
      const blob = bucket.file(uniqueFileName);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: mimetype,
      });
  
      blobStream.on('error', (err) => {
        reject(err);
      });
  
      blobStream.on('finish', async () => {
        try {
          // Generate a signed URL valid for 1 hour
          const [url] = await blob.getSignedUrl({
            action: 'read',
            expires: Date.now() + 60 * 60 * 1000, // 1 hour
          });
          resolve(url);
        } catch (err) {
          reject(err);
        }
      });
  
      blobStream.end(fileBuffer);
    });
}