import React, { useState } from 'react';
import Header from './components/Header/Header';
import StudentSection from './components/StudentSection/StudentSection';
import ParentSection from './components/ParentSection/ParentSection';
import AddressSection from './components/AddressSection/AddressSection';
import FormActions from './components/FormActions/FormActions';
import SuccessModal from './components/SuccessModal/SuccessModal';
import ErrorToast from './components/ErrorToast/ErrorToast';
import { useFormValidation } from './hooks/useFormValidation';
import { submitAdmissionApplication } from './services/api';
import './styles/App.css';

/**
 * Happy Kids School - Student Admission Application Form
 * Main Application Component
 */
const App = () => {
  const {
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
  } = useFormValidation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorNotice, setErrorNotice] = useState(null);

  // Today string YYYY-MM-DD for max DOB date picker
  const todayString = new Date().toISOString().split('T')[0];

  // Progress percentage
  const progressPercentage = calculateProgress();
  let currentStepName = '1. Student Info';
  if (progressPercentage > 75) {
    currentStepName = 'Ready to Submit';
  } else if (progressPercentage > 45) {
    currentStepName = '3. Address Details';
  } else if (progressPercentage > 20) {
    currentStepName = '2. Parent Details';
  }

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorNotice(null);

    // 1. Frontend validation check
    const { isValid, errors: formErrors } = validateAll();
    if (!isValid) {
      setErrorNotice({
        title: 'Required Fields Missing or Invalid',
        message: 'Please check the highlighted fields below and ensure all required information is provided.',
      });

      // Scroll smoothly to top card with error
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    // 2. Prepare FormData for file uploads
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (val !== null && val !== undefined) {
        formData.append(key, val);
      }
    });

    // 3. Send to Express Backend API
    setIsSubmitting(true);
    try {
      const result = await submitAdmissionApplication(formData);
      setIsSubmitting(false);

      // Show Success Modal
      setSuccessData({
        applicationNumber: result.applicationNumber || 'HKS-2026-0001',
        studentName: values.studentName,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (apiError) {
      setIsSubmitting(false);
      setErrorNotice(apiError);
    }
  };

  // Reset Form with smooth confirm
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the admission form? All entered data and photos will be cleared.')) {
      resetForm();
      setErrorNotice(null);
      setSuccessData(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Return Home from Success screen
  const handleReturnHome = () => {
    resetForm();
    setSuccessData(null);
    setErrorNotice(null);
  };

  return (
    <div className="app-container">
      {/* 1. Header with Logo, Academic Year & Progress Bar */}
      <Header
        progressPercentage={progressPercentage}
        currentStepName={currentStepName}
      />

      {/* 2. Main Form Layout */}
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Section 1: Student Information */}
          <StudentSection
            values={values}
            errors={errors}
            touched={touched}
            onChange={handleChange}
            onBlur={handleBlur}
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            previewUrls={previewUrls}
            calculateAgeDisplay={calculateAgeDisplay}
            maxDate={todayString}
          />

          {/* Section 2: Parent / Guardian Details */}
          <ParentSection
            values={values}
            errors={errors}
            touched={touched}
            onChange={handleChange}
            onBlur={handleBlur}
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            previewUrls={previewUrls}
          />

          {/* Section 3: Residential Address */}
          <AddressSection
            values={values}
            errors={errors}
            touched={touched}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {/* Bottom Form Action Buttons */}
          <FormActions
            isSubmitting={isSubmitting}
            onReset={handleReset}
            onSubmit={handleSubmit}
          />
        </div>
      </form>

      {/* 3. Success Modal (Shown after successful submission) */}
      {successData && (
        <SuccessModal
          applicationNumber={successData.applicationNumber}
          studentName={successData.studentName}
          onReturnHome={handleReturnHome}
        />
      )}

      {/* 4. Error Toast (Network, Database, Validation, Duplicate, Image Error) */}
      <ErrorToast
        error={errorNotice}
        onClose={() => setErrorNotice(null)}
      />
    </div>
  );
};

export default App;
