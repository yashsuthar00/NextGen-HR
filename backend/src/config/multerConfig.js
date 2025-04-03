import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50000 * 1024 }, // 5MB limit
});

export default upload;