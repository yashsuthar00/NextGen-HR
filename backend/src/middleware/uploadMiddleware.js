import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create upload directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'interview-' + uniqueSuffix + ext);
  },
});

// File filter to accept only video files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed (MP4, WebM, QuickTime)'), false);
  }
};

// Configure multer with limits for video uploads
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
});

// Middleware for handling video uploads
const videoUpload = upload.single('video');

// Wrapper to handle errors
export const handleVideoUpload = (req, res, next) => {
  videoUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`,
      });
    } else if (err) {
      // An unknown error occurred
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed',
      });
    }
    // Everything went fine
    next();
  });
};
