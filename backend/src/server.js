import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import validateEnv from './utils/validateEnv.js';
import cors from 'cors';
import interviewRoutes from './routes/interviewRoutes.js';
import videoRoutes from './routes/videoRoutes.js';

dotenv.config();

const { PORT, MONGO_URI } = validateEnv();
connectDB(MONGO_URI);

const app = express();

// middleware
app.use(cors())
app.use(express.json())

// Serve uploads directory as static (for development only)
if (process.env.NODE_ENV === 'development') {
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
}

// API Routes
app.use('/api/interviews', interviewRoutes);
app.use('/api/videos', videoRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

app.get('/', (req, res) => {
  res.send('Hello from docker via docker-compose!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
