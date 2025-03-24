import express from 'express';
import upload from '../config/multerConfig.js';
import { uploadFileToGCS } from '../utils/googleCloudStorage.js';

const router = express.Router();

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

   // Validate file type (backend check)
   if (req.file.mimetype !== 'application/pdf') {
    return res.status(400).json({ message: 'Only PDF files are allowed.' });
  }

  try {
    // Upload file to Google Cloud Storage and get a signed URL
    const fileUrl = await uploadFileToGCS(req.file.buffer, req.file.originalname, req.file.mimetype);

    // Send the signed URL to Kafka (topic name can be adjusted as needed)
    // await sendUrlToKafka('resume-uploads', fileUrl);

    res.status(200).json({ message: 'File uploaded successfully.', fileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading file.' });
  }
}
);

export default router;