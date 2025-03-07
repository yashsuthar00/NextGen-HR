import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: 'nextgen-hr', // Replace with your project ID
  keyFilename: './src/temp/nextgen-hr-bc45ed808e53.json' // Replace with your service account key path
});

const bucketName = 'bucket_nextgen-hr'; // Replace with your bucket name
const bucket = storage.bucket(bucketName);

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
