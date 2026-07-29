/**
 * ========================================================
 * HAPPY KIDS SCHOOL - ADMISSION API ROUTES
 * Combines Multer upload middleware, express-validator rules, & Controller
 * ========================================================
 */
const express = require('express');
const router = express.Router();
const { uploadAdmissionPhotos } = require('../middleware/upload');
const { validateAdmissionRules, handleValidationErrors } = require('../middleware/validate');
const {
  createAdmissionHandler,
  getAdmissionByIdHandler,
  updateAdmissionHandler,
  deleteAdmissionHandler,
} = require('../controllers/admissionController');

// POST /api/admission
router.post(
  '/',
  uploadAdmissionPhotos,
  validateAdmissionRules,
  handleValidationErrors,
  createAdmissionHandler
);

// GET /api/admission/:id
router.get('/:id', getAdmissionByIdHandler);

// PUT /api/admission/:id
router.put(
  '/:id',
  uploadAdmissionPhotos,
  validateAdmissionRules,
  handleValidationErrors,
  updateAdmissionHandler
);

// DELETE /api/admission/:id
router.delete('/:id', deleteAdmissionHandler);

module.exports = router;
