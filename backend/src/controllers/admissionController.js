/**
 * ========================================================
 * HAPPY KIDS SCHOOL - ADMISSION REST CONTROLLER
 * Handles HTTP requests, responses, and status codes
 * ========================================================
 */
const AdmissionModel = require('../models/Admission');

/**
 * @route   POST /api/admission
 * @desc    Submit a new student admission application with photos
 * @access  Public
 */
const createAdmissionHandler = async (req, res, next) => {
  try {
    const result = await AdmissionModel.createAdmission(req.body, req.files);
    
    // Fetch full created application to return in response
    const createdAdmission = await AdmissionModel.getAdmissionById(result.studentId);

    return res.status(201).json({
      success: true,
      message: 'Student admission application submitted successfully.',
      applicationNumber: result.applicationNumber,
      data: createdAdmission,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admission/:id
 * @desc    Fetch application details by student ID or application reference number
 * @access  Public
 */
const getAdmissionByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admission = await AdmissionModel.getAdmissionById(id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        errorType: 'APPLICATION_NOT_FOUND',
        message: `No admission application found with identifier: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: admission,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/admission/:id
 * @desc    Update an existing admission application
 * @access  Public
 */
const updateAdmissionHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedAdmission = await AdmissionModel.updateAdmission(id, req.body, req.files);

    if (!updatedAdmission) {
      return res.status(404).json({
        success: false,
        errorType: 'APPLICATION_NOT_FOUND',
        message: `No admission application found with identifier: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Admission application updated successfully.',
      data: updatedAdmission,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/admission/:id
 * @desc    Delete an admission application and associated photos
 * @access  Public
 */
const deleteAdmissionHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isDeleted = await AdmissionModel.deleteAdmission(id);

    if (!isDeleted) {
      return res.status(404).json({
        success: false,
        errorType: 'APPLICATION_NOT_FOUND',
        message: `No admission application found with identifier: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Admission application (${id}) has been successfully removed.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAdmissionHandler,
  getAdmissionByIdHandler,
  updateAdmissionHandler,
  deleteAdmissionHandler,
};
