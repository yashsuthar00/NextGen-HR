import express from 'express';
import upload from '../config/multerConfig.js';
import { uploadFileToGCS } from '../utils/googleCloudStorage.js';
import Application from '../models/applicationModel.js';
import Job from '../models/jobModel.js'; 
import { sendMessage } from '../utils/rabbitMQ.js';

const router = express.Router();

router.post('/upload', upload.single('file'), async (req, res) => {
  const { name, email, phone, jobId } = req.body;

  // Validate request body
  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }
  if (!phone) {
    return res.status(400).json({ message: 'Phone is required.' });
  }
  if (!jobId) {
    return res.status(400).json({ message: 'Job ID is required.' });
  }

  // Validate file uploads
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Validate file type (backend check)
  if (req.file.mimetype !== 'application/pdf') {
    return res.status(400).json({ message: 'Only PDF files are allowed.' });
  }

  try {
    // Validate jobId
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    // Upload file to Google Cloud Storage and get a signed URL
    const fileUrl = await uploadFileToGCS(req.file.buffer, req.file.originalname, req.file.mimetype);

    // Convert the signed URL to a gsutil URL
    const convertToGsutilUrl = (signedUrl) => {
      const url = new URL(signedUrl);
      const bucketName =
        url.hostname === 'storage.googleapis.com'
          ? url.pathname.split('/')[1]
          : url.hostname.split('.')[0];
      const objectName = decodeURIComponent(url.pathname.split('/').slice(2).join('/'));
      return `gs://${bucketName}/${objectName}`;
    };

    const gsutilUrl = convertToGsutilUrl(fileUrl);

    const applicationData = {
      name,
      email,
      phone,
      jobId, 
      resumeURL: gsutilUrl, // Store the signed URL in the database
    };

    const application = await Application.create(applicationData);

    // Send application data to RabbitMQ
    await sendMessage('new_job_application_queue', application._id);

    res.status(200).json({ message: 'File uploaded successfully.', fileUrl, gsutilUrl, application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading file.' });
  }
});

export default router;