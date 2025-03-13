import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import validateEnv from './utils/validateEnv.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { initializeRoles } from './utils/initRoles.js';
import { initializeAdmin } from './utils/initAdmin.js';


dotenv.config();
const app = express();

const { PORT, MONGO_URI } = validateEnv();

// Middleware to parse JSON requests
app.use(express.json());

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

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
