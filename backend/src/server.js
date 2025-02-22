import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';

dotenv.config();
connectDB();

const app = express();

const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
