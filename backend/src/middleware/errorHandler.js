/**
 * ========================================================
 * HAPPY KIDS SCHOOL - CENTRALIZED ERROR HANDLER
 * Provides clean HTTP status codes & user-friendly messages
 * ========================================================
 */
const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  console.error('🔴 [Server Error]:', err);

  // 1. Handle Multer Upload Errors (e.g. File too large)
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        errorType: 'FILE_TOO_LARGE',
        message: 'One or more uploaded images exceed the maximum limit of 5 MB.',
      });
    }
    return res.status(400).json({
      success: false,
      errorType: 'UPLOAD_ERROR',
      message: err.message || 'File upload failed.',
    });
  }

  // 2. Handle Custom Image Format Error
  if (err && err.message && err.message.startsWith('INVALID_IMAGE_FORMAT:')) {
    return res.status(400).json({
      success: false,
      errorType: 'INVALID_IMAGE_FORMAT',
      message: err.message.replace('INVALID_IMAGE_FORMAT: ', ''),
    });
  }

  // 3. Handle MySQL Duplicate Entry Errors (e.g., Duplicate Aadhaar or application number)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      errorType: 'DUPLICATE_SUBMISSION',
      message: 'A duplicate entry was detected. An application with this reference or identifier already exists in our system.',
    });
  }

  // 4. Handle Database Connection / Query Failures
  const isDbErr = (e) => {
    if (!e) return false;
    const code = e.code || '';
    if (
      code === 'ECONNREFUSED' ||
      code === 'ENOTFOUND' ||
      code === 'EHOSTUNREACH' ||
      code === 'ETIMEDOUT' ||
      code.startsWith('ER_')
    ) return true;
    if (e.errors && Array.isArray(e.errors)) {
      return e.errors.some(isDbErr);
    }
    const m = (e.message || '').toUpperCase();
    return m.includes('ECONNREFUSED') || m.includes('ENOTFOUND') || m.includes('ETIMEDOUT') || m.includes('MYSQL') || e.name === 'AggregateError';
  };

  if (isDbErr(err)) {
    return res.status(503).json({
      success: false,
      errorType: 'DATABASE_FAILURE',
      message: 'Unable to connect to the MySQL database server. Please ensure MySQL is running on port 3306 and the database is configured.',
    });
  }

  // 5. Default General Server Error
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    success: false,
    errorType: 'SERVER_ERROR',
    message: err.message || 'An unexpected server error occurred.',
  });
};

module.exports = errorHandler;
