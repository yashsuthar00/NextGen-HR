import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import validateEnv from './utils/validateEnv.js';
import fileRoutes from './routes/fileRoutes.js';

dotenv.config();

const { port, mongoUri } = validateEnv();
connectDB(mongoUri);

const app = express();

app.use(express.json());
app.use('/api/files', fileRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
