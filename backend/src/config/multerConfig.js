import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100000 * 1024 }, // 100MB limit
});

export default upload;