/**
 * ========================================================
 * HAPPY KIDS SCHOOL - FORM VALIDATION HOOK
 * Comprehensive Frontend Validation & Progress Calculation
 * ========================================================
 */
import { useState, useCallback } from 'react';

const initialFormValues = {
  // Section 1: Student
  studentName: '',
  dob: '',
  gender: '',
  bloodGroup: '',
  motherTongue: '',
  studentPhoto: null,

  // Section 2: Father
  fatherName: '',
  fatherOccupation: '',
  fatherMobile: '',
  fatherEmail: '',
  fatherAadhaar: '',
  fatherPhoto: null,

  // Section 2: Mother
  motherName: '',
  motherOccupation: '',
  motherMobile: '',
  motherEmail: '',
  motherAadhaar: '',
  motherPhoto: null,

  // Section 3: Guardian Details (Primary / Guardian 1)
  guardianName: '',
  guardianOccupation: '',
  guardianMobile: '',
  guardianEmail: '',
  guardianAadhaar: '',
  guardianPhoto: null,

  // Section 3: Guardian Details 2 (Secondary / Guardian 2 - Optional)
  guardian2Name: '',
  guardian2Occupation: '',
  guardian2Mobile: '',
  guardian2Email: '',
  guardian2Aadhaar: '',
  guardian2Photo: null,

  // Section 4: Residential Address
  houseNumber: '',
  street: '',
  area: '',
  city: '',
  district: '',
  state: '',
  country: 'India',
  pinCode: '',
};

export const useFormValidation = () => {
  const [values, setValues] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [previewUrls, setPreviewUrls] = useState({
    studentPhoto: null,
    fatherPhoto: null,
    motherPhoto: null,
    guardianPhoto: null,
    guardian2Photo: null,
  });

  // Calculate age for display: returns "X Years, Y Months"
  const calculateAgeDisplay = useCallback((dobString) => {
    if (!dobString) return 'Select date of birth';
    const dob = new Date(dobString);
    const today = new Date();
    if (dob > today) return 'Invalid future date';

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();

    if (months < 0 || (months === 0 && today.getDate() < dob.getDate())) {
      years--;
      months += 12;
    }
    if (today.getDate() < dob.getDate() && months > 0) {
      months--;
    }

    if (years < 0) return '0 Years, 0 Months';
    return `${years} Years, ${months} Months`;
  }, []);

  // Validate single field
  const validateField = (name, value) => {
    switch (name) {
      case 'studentName':
        if (!value || value.trim().length < 3) {
          return 'Student Name must be at least 3 characters long.';
        }
        return '';

      case 'dob': {
        if (!value) return 'Date of Birth is required.';
        const selectedDate = new Date(value);
        const today = new Date();
        if (selectedDate > today) {
          return 'Date of Birth cannot be in the future.';
        }
        return '';
      }

      case 'gender':
        if (!value) return 'Please select student gender.';
        return '';

      case 'bloodGroup':
        if (!value) return 'Please select a blood group.';
        return '';

      case 'motherTongue':
        if (!value || !value.trim()) return 'Mother tongue is required.';
        return '';

      case 'fatherName':
        if (!value || !value.trim()) return "Father's Full Name is required.";
        return '';

      case 'fatherOccupation':
        if (!value || !value.trim()) return "Father's Occupation is required.";
        return '';

      case 'fatherMobile':
        if (!value || !/^[0-9]{10}$/.test(value)) {
          return 'Father Mobile Number must be exactly 10 digits.';
        }
        return '';

      case 'fatherEmail':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address.';
        }
        return '';

      case 'fatherAadhaar':
        if (!value || !/^[0-9]{12}$/.test(value)) {
          return 'Aadhaar Number must be exactly 12 digits.';
        }
        return '';

      case 'motherName':
        if (!value || !value.trim()) return "Mother's Full Name is required.";
        return '';

      case 'motherOccupation':
        if (!value || !value.trim()) return "Mother's Occupation is required.";
        return '';

      case 'motherMobile':
        if (!value || !/^[0-9]{10}$/.test(value)) {
          return 'Mother Mobile Number must be exactly 10 digits.';
        }
        return '';

      case 'motherEmail':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address.';
        }
        return '';

      case 'motherAadhaar':
        if (!value || !/^[0-9]{12}$/.test(value)) {
          return 'Aadhaar Number must be exactly 12 digits.';
        }
        return '';

      case 'guardianName':
        if (!value || !value.trim()) return 'Guardian Full Name is required.';
        if (value.trim().length < 3) return 'Guardian Full Name must be at least 3 characters.';
        if (!/^[A-Za-z\s]+$/.test(value)) return 'Guardian Full Name can only contain alphabetic characters and spaces.';
        return '';

      case 'guardianOccupation':
        if (!value || !value.trim()) return 'Guardian Occupation is required.';
        return '';

      case 'guardianMobile':
        if (!value || !/^[0-9]{10}$/.test(value)) {
          return 'Guardian Mobile Number must be exactly 10 digits.';
        }
        return '';

      case 'guardianEmail':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address.';
        }
        return '';

      case 'guardianAadhaar':
        if (!value || !/^[0-9]{12}$/.test(value)) {
          return 'Guardian Aadhaar Number must be exactly 12 digits.';
        }
        return '';

      // Guardian 2 (Optional)
      case 'guardian2Name':
        if (value && (value.trim().length < 3 || !/^[A-Za-z\s]+$/.test(value))) {
          return 'Guardian 2 Name must be at least 3 characters and alphabetic.';
        }
        return '';

      case 'guardian2Mobile':
        if (value && !/^[0-9]{10}$/.test(value)) {
          return 'Guardian 2 Mobile Number must be exactly 10 digits.';
        }
        return '';

      case 'guardian2Email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address for Guardian 2.';
        }
        return '';

      case 'guardian2Aadhaar':
        if (value && !/^[0-9]{12}$/.test(value)) {
          return 'Guardian 2 Aadhaar Number must be exactly 12 digits.';
        }
        return '';

      case 'houseNumber':
        if (!value || !value.trim()) return 'House / Flat Number is required.';
        return '';

      case 'street':
        if (!value || !value.trim()) return 'Street Name is required.';
        return '';

      case 'area':
        if (!value || !value.trim()) return 'Area / Locality is required.';
        return '';

      case 'city':
        if (!value || !value.trim()) return 'City is required.';
        return '';

      case 'district':
        if (!value || !value.trim()) return 'District is required.';
        return '';

      case 'state':
        if (!value || !value.trim()) return 'State is required.';
        return '';

      case 'country':
        if (!value || !value.trim()) return 'Country is required.';
        return '';

      case 'pinCode':
        if (!value || !/^[0-9]{6}$/.test(value)) {
          return 'PIN Code must be exactly 6 digits.';
        }
        return '';

      default:
        return '';
    }
  };

  // Handle standard input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const errorMsg = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  // Handle file select (Student, Father, Mother photo)
  const handleFileSelect = (fieldName, file) => {
    setValues((prev) => ({ ...prev, [fieldName]: file }));
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrls((prev) => ({ ...prev, [fieldName]: objectUrl }));
    setErrors((prev) => ({ ...prev, [fieldName]: '' }));
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  // Handle file remove
  const handleFileRemove = (fieldName) => {
    setValues((prev) => ({ ...prev, [fieldName]: null }));
    if (previewUrls[fieldName]) {
      URL.revokeObjectURL(previewUrls[fieldName]);
    }
    setPreviewUrls((prev) => ({ ...prev, [fieldName]: null }));
  };

  // Validate entire form on submit attempt
  const validateAll = () => {
    const newErrors = {};
    const newTouched = {};

    Object.keys(values).forEach((key) => {
      newTouched[key] = true;
      const errorMsg = validateField(key, values[key]);
      if (errorMsg) {
        newErrors[key] = errorMsg;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;
    return { isValid, errors: newErrors };
  };

  // Calculate Form Completion Percentage
  const calculateProgress = () => {
    const requiredFields = [
      'studentName',
      'dob',
      'gender',
      'bloodGroup',
      'motherTongue',
      'fatherName',
      'fatherOccupation',
      'fatherMobile',
      'fatherAadhaar',
      'motherName',
      'motherOccupation',
      'motherMobile',
      'motherAadhaar',
      'guardianName',
      'guardianOccupation',
      'guardianMobile',
      'guardianAadhaar',
      'houseNumber',
      'street',
      'area',
      'city',
      'district',
      'state',
      'country',
      'pinCode',
    ];

    let validCount = 0;
    requiredFields.forEach((field) => {
      const val = values[field];
      if (val && !validateField(field, val)) {
        validCount++;
      }
    });

    // Add bonus points for photos
    if (values.studentPhoto) validCount++;
    if (values.fatherPhoto) validCount++;
    if (values.motherPhoto) validCount++;
    if (values.guardianPhoto) validCount++;

    const totalCheckpoints = requiredFields.length + 4;
    return Math.round((validCount / totalCheckpoints) * 100);
  };

  // Reset entire form
  const resetForm = () => {
    Object.values(previewUrls).forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });
    setValues(initialFormValues);
    setErrors({});
    setTouched({});
    setPreviewUrls({
      studentPhoto: null,
      fatherPhoto: null,
      motherPhoto: null,
      guardianPhoto: null,
    });
  };

  return {
    values,
    errors,
    touched,
    previewUrls,
    handleChange,
    handleBlur,
    handleFileSelect,
    handleFileRemove,
    validateAll,
    calculateProgress,
    calculateAgeDisplay,
    resetForm,
  };
};
