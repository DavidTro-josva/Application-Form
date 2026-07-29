/**
 * ========================================================
 * HAPPY KIDS SCHOOL - MULTER FILE UPLOAD MIDDLEWARE
 * Configures secure storage, 5MB limit, & JPG/JPEG/PNG filter
 * ========================================================
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists (use /tmp in Netlify serverless mode)
const uploadDir = process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.NETLIFY
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate secure unique filename: timestamp + random alphanumeric + ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File Filter for accepted MIME types (jpg, jpeg, png only)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('INVALID_IMAGE_FORMAT: Only JPG, JPEG, and PNG image formats are allowed.'), false);
  }
};

// Multer Upload Configuration (Max 5MB)
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 megabytes in bytes
  },
  fileFilter: fileFilter,
});

/**
 * Configure upload for the four required photo fields:
 * - studentPhoto
 * - fatherPhoto
 * - motherPhoto
 * - guardianPhoto
 */
const uploadAdmissionPhotos = upload.fields([
  { name: 'studentPhoto', maxCount: 1 },
  { name: 'fatherPhoto', maxCount: 1 },
  { name: 'motherPhoto', maxCount: 1 },
  { name: 'guardianPhoto', maxCount: 1 },
  { name: 'guardian2Photo', maxCount: 1 },
]);

module.exports = {
  uploadAdmissionPhotos,
  uploadDir,
};
