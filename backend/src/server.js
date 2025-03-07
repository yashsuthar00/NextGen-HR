import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import validateEnv from './utils/validateEnv.js';
import uploadRoutes from './routes/upload.js';
import cors from 'cors';
import { initProducer } from './utils/kafkaProducer.js';

dotenv.config();

const { port, mongoUri } = validateEnv();

const app = express();

app.use(cors());
app.use(express.json());
// Use the upload route
app.use('/api', uploadRoutes);

initProducer()
  .then(() => {
    console.log('Kafka Producer initialized successfully');
    return connectDB(mongoUri);
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error during initialization:', err);
  });