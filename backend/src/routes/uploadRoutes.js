import multer from 'multer';
import express from 'express';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Or any other Multer configuration

router.post('/upload', upload.single('profileImage'), (req, res) => {
  // ... your upload logic ...
});

export default router;
