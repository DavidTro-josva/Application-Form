/**
 * ========================================================
 * HAPPY KIDS SCHOOL - FRONTEND API SERVICE
 * Connects React frontend to Express backend via /api/admission
 * ========================================================
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/admission';

/**
 * Helper to translate raw errors into user-friendly error objects
 */
const formatApiError = (error) => {
  // 1. Network Failure (Server down or CORS block)
  if (!error.response) {
    return {
      title: 'Network Connection Failure',
      message: 'Unable to connect to the TN Happy Kids School server. Please check your internet connection or verify that the backend server is running.',
    };
  }

  const { status, data } = error.response;
  const errorType = data?.errorType || '';

  // 2. Duplicate Submission (MySQL Duplicate Entry)
  if (status === 409 || errorType === 'DUPLICATE_SUBMISSION') {
    return {
      title: 'Duplicate Application Found',
      message: 'An application with this Aadhaar number or reference already exists in our database. Please check your details.',
    };
  }

  // 3. Database Failure (MySQL Query / Connection Error)
  if (status === 503 || errorType === 'DATABASE_FAILURE') {
    return {
      title: 'Database Service Unavailable',
      message: 'The admissions database is temporarily unavailable. Please try submitting your application again in a few minutes.',
    };
  }

  // 4. Invalid Image or File Too Large
  if (errorType === 'FILE_TOO_LARGE' || errorType === 'INVALID_IMAGE_FORMAT' || errorType === 'UPLOAD_ERROR') {
    return {
      title: 'Invalid Image Upload',
      message: data.message || 'Please ensure photos are JPG, JPEG, or PNG formats and do not exceed 5 MB.',
    };
  }

  // 5. Required Field Missing or Validation Error
  if (status === 400 || errorType === 'VALIDATION_ERROR') {
    return {
      title: 'Required Field Missing or Invalid',
      message: data.message || 'Please check all required fields highlighted in red and try again.',
    };
  }

  // General Error
  return {
    title: 'Application Error',
    message: data?.message || 'An unexpected error occurred while submitting your application.',
  };
};

/**
 * Submit New Admission Application (POST /api/admission)
 */
export const submitAdmissionApplication = async (formData) => {
  try {
    const response = await axios.post(API_BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw formatApiError(error);
  }
};

/**
 * Get Admission Application by ID or Application Number (GET /api/admission/:id)
 */
export const getAdmissionApplication = async (idOrNumber) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${idOrNumber}`);
    return response.data;
  } catch (error) {
    throw formatApiError(error);
  }
};

/**
 * Update Admission Application (PUT /api/admission/:id)
 */
export const updateAdmissionApplication = async (id, formData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw formatApiError(error);
  }
};

/**
 * Delete Admission Application (DELETE /api/admission/:id)
 */
export const deleteAdmissionApplication = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw formatApiError(error);
  }
};
