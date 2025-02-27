import { Router } from 'express';
import upload from '../config/multerConfig.js';

const router = Router();

// @desc    Upload a file
// @route   POST /upload
// @access  Public

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ message: 'File uploaded successfully', file: req.file });
});

export default router;
