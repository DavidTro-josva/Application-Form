/**
 * ========================================================
 * HAPPY KIDS SCHOOL - SERVER-SIDE FORM VALIDATION
 * Uses express-validator to enforce all admission rules
 * ========================================================
 */
const { body, validationResult } = require('express-validator');

/**
 * Helper to check validation results and return formatted HTTP 400 response
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errorType: 'VALIDATION_ERROR',
      message: 'One or more required fields are invalid or missing.',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  next();
};

/**
 * Validation rules for POST /api/admission and PUT /api/admission/:id
 */
const validateAdmissionRules = [
  // Section 1: Student Information
  body('studentName')
    .trim()
    .notEmpty().withMessage('Student Full Name is required')
    .isLength({ min: 3 }).withMessage('Student Full Name must be at least 3 characters long'),
  
  body('dob')
    .notEmpty().withMessage('Date of Birth is required')
    .isISO8601().withMessage('Date of Birth must be a valid date')
    .custom((value) => {
      const selectedDate = new Date(value);
      const today = new Date();
      if (selectedDate > today) {
        throw new Error('Date of Birth cannot be in the future');
      }
      return true;
    }),

  body('gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),

  body('bloodGroup')
    .notEmpty().withMessage('Blood Group is required')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid Blood Group selected'),

  body('motherTongue')
    .trim()
    .notEmpty().withMessage('Mother Tongue is required'),

  // Section 2: Father Information
  body('fatherName')
    .trim()
    .notEmpty().withMessage('Father Full Name is required'),
  body('fatherOccupation')
    .trim()
    .notEmpty().withMessage('Father Occupation is required'),
  body('fatherMobile')
    .trim()
    .notEmpty().withMessage('Father Mobile Number is required')
    .matches(/^[0-9]{10}$/).withMessage('Father Mobile Number must be exactly 10 digits'),
  body('fatherEmail')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Father Email Address must be a valid email format'),
  body('fatherAadhaar')
    .trim()
    .notEmpty().withMessage('Father Aadhaar Number is required')
    .matches(/^[0-9]{12}$/).withMessage('Father Aadhaar Number must be exactly 12 digits'),

  // Section 2: Mother Information
  body('motherName')
    .trim()
    .notEmpty().withMessage('Mother Full Name is required'),
  body('motherOccupation')
    .trim()
    .notEmpty().withMessage('Mother Occupation is required'),
  body('motherMobile')
    .trim()
    .notEmpty().withMessage('Mother Mobile Number is required')
    .matches(/^[0-9]{10}$/).withMessage('Mother Mobile Number must be exactly 10 digits'),
  body('motherEmail')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Mother Email Address must be a valid email format'),
  body('motherAadhaar')
    .trim()
    .notEmpty().withMessage('Mother Aadhaar Number is required')
    .matches(/^[0-9]{12}$/).withMessage('Mother Aadhaar Number must be exactly 12 digits'),

  // Section 3: Residential Address
  body('houseNumber')
    .trim()
    .notEmpty().withMessage('House Number is required'),
  body('street')
    .trim()
    .notEmpty().withMessage('Street Name is required'),
  body('area')
    .trim()
    .notEmpty().withMessage('Area is required'),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('district')
    .trim()
    .notEmpty().withMessage('District is required'),
  body('state')
    .trim()
    .notEmpty().withMessage('State is required'),
  body('country')
    .trim()
    .default('India'),
  body('pinCode')
    .trim()
    .notEmpty().withMessage('PIN Code is required')
    .matches(/^[0-9]{6}$/).withMessage('PIN Code must be exactly 6 digits'),
];

module.exports = {
  validateAdmissionRules,
  handleValidationErrors,
};
