import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a video file to Cloudinary
 * @param {string} filePath - Path to the video file
 * @param {string} folder - Cloudinary folder to organize uploads
 * @returns {Promise} - Cloudinary upload result
 */
export const uploadVideo = async (filePath, folder = 'interview-videos') => {
  try {
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video',
      folder: folder,
      transformation: [
        { quality: 'auto' }, // Auto-optimize video quality
      ],
    });

    // Delete the local file after successful upload
    fs.unlinkSync(filePath);

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      duration: result.duration,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Delete a video from Cloudinary by public ID
 * @param {string} publicId - Cloudinary public ID of the video
 * @returns {Promise} - Cloudinary deletion result
 */
export const deleteVideo = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video',
    });

    return {
      success: result.result === 'ok',
      result: result,
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
