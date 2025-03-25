import express from 'express';
import upload from '../config/multerConfig.js';
import { uploadFileToGCS } from '../utils/googleCloudStorage.js';
import Application from '../models/applicationModel.js';

const router = express.Router();

router.post('/upload', upload.single('file'), async (req, res) => {

  const {name, email, phone } = req.body;
  // Validate request body
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Name, email, and phone are required.' });
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
    // Upload file to Google Cloud Storage and get a signed URL
    const fileUrl = await uploadFileToGCS(req.file.buffer, req.file.originalname, req.file.mimetype);

    // Convert the signed URL to a gsutil URL
    const convertToGsutilUrl = (signedUrl) => {
      const url = new URL(signedUrl);
      const bucketName = url.hostname === 'storage.googleapis.com' 
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
      resumeURL: gsutilUrl, // Store the signed URL in the database
    };
    // console.log('GSUtil URL:', gsutilUrl);

    const application = await Application.create(applicationData);


    // Send the signed URL to Kafka (topic name can be adjusted as needed)
    // await sendUrlToKafka('resume-uploads', fileUrl);



    res.status(200).json({ message: 'File uploaded successfully.', fileUrl, message: 'gsutil url .', gsutilUrl, application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading file.' });
  }
}
);

export default router;