import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import validateEnv from './utils/validateEnv.js';

dotenv.config();

const { port, mongoUri } = validateEnv();
connectDB(mongoUri);

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from docker via docker-compose!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
