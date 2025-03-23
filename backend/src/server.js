import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import { env } from './utils/validateEnv.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import oauthRoutes from './routes/oauthRoutes.js';
import jobRoutes from './routes/jobRoutes.js'
import { initializeRoles } from './utils/initRoles.js';
import { initializeAdmin } from './utils/initAdmin.js';
import cors from 'cors';
import passport from './config/passport-config.js';
import session from 'express-session';

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Storage } from '@google-cloud/storage';
import CV from './models/CV.js'; // Assuming CV model exists
import Job from './models/Job.js'; // Assuming Job model exists


dotenv.config();
const app = express();

const { PORT, MONGO_URI, SESSION_SECRET, CLIENT_URL } = env;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

// Session middleware setup
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const mediaType = file.fieldname === 'video' ? 'videos' : 'audios';
    const dir = path.join(__dirname, 'uploads', mediaType);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Use original filename provided by client
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// API endpoint to handle chunk uploads
app.post('/api/upload-chunk', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'audio', maxCount: 1 }
]), (req, res) => {
  try {
    const { questionIndex, questionText } = req.body;
    
    // Store metadata about the chunk
    const metadata = {
      questionIndex,
      questionText,
      videoPath: req.files.video[0].path,
      audioPath: req.files.audio[0].path,
      timestamp: new Date()
    };
    
    // Here you could save metadata to a database if needed
    
    console.log(`Saved chunk for question ${questionIndex}:`, metadata);
    
    res.status(200).json({ 
      success: true, 
      message: 'Chunk uploaded successfully',
      data: metadata
    });
  } catch (error) {
    console.error('Error processing chunk:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing chunk', 
      error: error.message 
    });
  }
});

const gcsStorage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucket = gcsStorage.bucket(process.env.GCS_BUCKET_NAME);

const gcsUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

app.post('/api/upload', gcsUpload.single('pdf'), async (req, res) => {
  try {
    const { name, email, job_id } = req.body;

    if (!name || !email || !job_id || !req.file) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const job = await Job.findById(job_id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const filename = `${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(filename);

    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
    });

    const gsutilUrl = `gs://${process.env.GCS_BUCKET_NAME}/${filename}`;

    const cv = new CV({ name, email, job_id, gsutil_url: gsutilUrl });
    await cv.save();

    res.status(200).json({ gsutil_url: gsutilUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload file', error: error.message });
  }
});

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to profile or dashboard.
    res.redirect('/profile');
  }
);

// GitHub OAuth
app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

// ----------------------
// Protected Routes Example
// ----------------------
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

app.get('/profile', ensureAuthenticated, (req, res) => {
  res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    provider: req.user.provider,
    // Include other fields (like picture) as needed
  });
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return res.status(500).json({ message: "Logout error" });
    }
    res.redirect('/');
  });
});

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/auth', oauthRoutes); 
app.use ('/api/jobs', jobRoutes);

connectDB(MONGO_URI)
  .then(async () => {
    await initializeRoles();
    await initializeAdmin();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
