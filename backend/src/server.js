import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import validateEnv from './utils/validateEnv.js';
import multer from 'multer';
import path from 'path';

dotenv.config();

const { port, mongoUri } = validateEnv();
connectDB(mongoUri);

const app = express();

// set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: pdf Only!');
    }
  }
});

// @desc    Upload a file
// @route   POST /upload
// @access  Public

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ message: "File uploaded successfully", file: req.file });
}
);
// // @desc    Get all files
// // @route   GET /files
// // @access  Public
// app.get('/files', (req, res) => {
//   const files = fs.readdirSync('./uploads').map(file => `/${file}`);
//   res.json(files);
// }
// );
// // @desc    Delete a file
// // @route   DELETE /files/:filename
// // @access  Public
// app.delete('/files/:filename', (req, res) => {
//   const filePath = path.join(__dirname, 'uploads', req.params.filename);
//   fs.unlink(filePath, err => {
//     if (err) {
//       return res.status(500).send('Error deleting file');
//     }
//     res.send('File deleted');
//   }
// );
// });


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
