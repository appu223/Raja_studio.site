const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDirectory = path.join(__dirname, '../uploads/galleries');
fs.mkdirSync(uploadDirectory, { recursive: true });

const MAX_FILE_SIZE = 200 * 1024 * 1024 * 1024;
const allowedMediaTypes = /^(image|video)\//;

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = path.basename(file.originalname, extension)
      .replace(/[^a-z0-9_-]/gi, '-')
      .replace(/-+/g, '-')
      .slice(0, 80) || 'asset';
    callback(null, `${Date.now()}-${safeName}${extension}`);
  },
});

const fileFilter = (_req, file, callback) => {
  if (!allowedMediaTypes.test(file.mimetype)) {
    return callback(new Error('Only image and video files are supported'));
  }
  callback(null, true);
};

const galleryUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 100,
  },
});

module.exports = galleryUpload;
