import React from 'react';
import { Users, AlertCircle } from 'lucide-react';
import PhotoUpload from '../PhotoUpload/PhotoUpload';

/**
 * Section 2: Parent / Guardian Details Card
 * Separates Father and Mother sections with complete validation and photo uploads
 */
const ParentSection = ({
  values,
  errors,
  touched,
  onChange,
  onBlur,
  onFileSelect,
  onFileRemove,
  previewUrls,
}) => {
  // Helper to restrict number inputs to digits only
  const handleNumericInput = (e, maxLength) => {
    const { name, value } = e.target;
    const cleanValue = value.replace(/\D/g, '').slice(0, maxLength);
    onChange({ target: { name, value: cleanValue } });
  };

  return (
    <section className="form-section-card">
      <div className="section-header-banner">
        <div className="section-icon-badge">
          <Users size={24} />
        </div>
        <h2>2. Parent / Guardian Details</h2>
      </div>

      {/* --- FATHER INFORMATION --- */}
      <h3 className="subsection-title">Father's Information</h3>
      <div className="form-grid">
        {/* Father Full Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="fatherName">
            Father Full Name <span className="required-star">*</span>
          </label>
          <input
            id="fatherName"
            name="fatherName"
            type="text"
            className={`form-input ${touched.fatherName && errors.fatherName ? 'input-error' : ''}`}
            placeholder="Enter father's full name"
            value={values.fatherName}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.fatherName && errors.fatherName && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.fatherName}
            </span>
          )}
        </div>

        {/* Father Occupation */}
        <div className="form-group">
          <label className="form-label" htmlFor="fatherOccupation">
            Occupation <span className="required-star">*</span>
          </label>
          <input
            id="fatherOccupation"
            name="fatherOccupation"
            type="text"
            className={`form-input ${touched.fatherOccupation && errors.fatherOccupation ? 'input-error' : ''}`}
            placeholder="e.g., Software Engineer, Business, Doctor"
            value={values.fatherOccupation}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.fatherOccupation && errors.fatherOccupation && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.fatherOccupation}
            </span>
          )}
        </div>

        {/* Father Mobile Number (Exactly 10 digits) */}
        <div className="form-group">
          <label className="form-label" htmlFor="fatherMobile">
            Mobile Number (10 Digits) <span className="required-star">*</span>
          </label>
          <input
            id="fatherMobile"
            name="fatherMobile"
            type="tel"
            maxLength={10}
            className={`form-input ${touched.fatherMobile && errors.fatherMobile ? 'input-error' : ''}`}
            placeholder="10-digit mobile number"
            value={values.fatherMobile}
            onChange={(e) => handleNumericInput(e, 10)}
            onBlur={onBlur}
          />
          {touched.fatherMobile && errors.fatherMobile && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.fatherMobile}
            </span>
          )}
        </div>

        {/* Father Email Address (Optional) */}
        <div className="form-group">
          <label className="form-label" htmlFor="fatherEmail">
            Email Address (Optional)
          </label>
          <input
            id="fatherEmail"
            name="fatherEmail"
            type="email"
            className={`form-input ${touched.fatherEmail && errors.fatherEmail ? 'input-error' : ''}`}
            placeholder="father@example.com"
            value={values.fatherEmail}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.fatherEmail && errors.fatherEmail && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.fatherEmail}
            </span>
          )}
        </div>

        {/* Father Aadhaar Number (Exactly 12 digits) */}
        <div className="form-group form-grid-full">
          <label className="form-label" htmlFor="fatherAadhaar">
            Aadhaar Number (12 Digits) <span className="required-star">*</span>
          </label>
          <input
            id="fatherAadhaar"
            name="fatherAadhaar"
            type="text"
            maxLength={12}
            className={`form-input ${touched.fatherAadhaar && errors.fatherAadhaar ? 'input-error' : ''}`}
            placeholder="12-digit Aadhaar identification number"
            value={values.fatherAadhaar}
            onChange={(e) => handleNumericInput(e, 12)}
            onBlur={onBlur}
          />
          {touched.fatherAadhaar && errors.fatherAadhaar && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.fatherAadhaar}
            </span>
          )}
        </div>

        {/* Father Photo Upload */}
        <div className="form-grid-full">
          <PhotoUpload
            label="Father's Photo (Passport Size)"
            fieldName="fatherPhoto"
            file={values.fatherPhoto}
            previewUrl={previewUrls.fatherPhoto}
            onFileSelect={onFileSelect}
            onFileRemove={onFileRemove}
            error={touched.fatherPhoto && errors.fatherPhoto}
          />
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)', margin: '16px 0' }} />

      {/* --- MOTHER INFORMATION --- */}
      <h3 className="subsection-title">Mother's Information</h3>
      <div className="form-grid">
        {/* Mother Full Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="motherName">
            Mother Full Name <span className="required-star">*</span>
          </label>
          <input
            id="motherName"
            name="motherName"
            type="text"
            className={`form-input ${touched.motherName && errors.motherName ? 'input-error' : ''}`}
            placeholder="Enter mother's full name"
            value={values.motherName}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.motherName && errors.motherName && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.motherName}
            </span>
          )}
        </div>

        {/* Mother Occupation */}
        <div className="form-group">
          <label className="form-label" htmlFor="motherOccupation">
            Occupation <span className="required-star">*</span>
          </label>
          <input
            id="motherOccupation"
            name="motherOccupation"
            type="text"
            className={`form-input ${touched.motherOccupation && errors.motherOccupation ? 'input-error' : ''}`}
            placeholder="e.g., Doctor, Teacher, Business, Homemaker"
            value={values.motherOccupation}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.motherOccupation && errors.motherOccupation && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.motherOccupation}
            </span>
          )}
        </div>

        {/* Mother Mobile Number (Exactly 10 digits) */}
        <div className="form-group">
          <label className="form-label" htmlFor="motherMobile">
            Mobile Number (10 Digits) <span className="required-star">*</span>
          </label>
          <input
            id="motherMobile"
            name="motherMobile"
            type="tel"
            maxLength={10}
            className={`form-input ${touched.motherMobile && errors.motherMobile ? 'input-error' : ''}`}
            placeholder="10-digit mobile number"
            value={values.motherMobile}
            onChange={(e) => handleNumericInput(e, 10)}
            onBlur={onBlur}
          />
          {touched.motherMobile && errors.motherMobile && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.motherMobile}
            </span>
          )}
        </div>

        {/* Mother Email Address (Optional) */}
        <div className="form-group">
          <label className="form-label" htmlFor="motherEmail">
            Email Address (Optional)
          </label>
          <input
            id="motherEmail"
            name="motherEmail"
            type="email"
            className={`form-input ${touched.motherEmail && errors.motherEmail ? 'input-error' : ''}`}
            placeholder="mother@example.com"
            value={values.motherEmail}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.motherEmail && errors.motherEmail && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.motherEmail}
            </span>
          )}
        </div>

        {/* Mother Aadhaar Number (Exactly 12 digits) */}
        <div className="form-group form-grid-full">
          <label className="form-label" htmlFor="motherAadhaar">
            Aadhaar Number (12 Digits) <span className="required-star">*</span>
          </label>
          <input
            id="motherAadhaar"
            name="motherAadhaar"
            type="text"
            maxLength={12}
            className={`form-input ${touched.motherAadhaar && errors.motherAadhaar ? 'input-error' : ''}`}
            placeholder="12-digit Aadhaar identification number"
            value={values.motherAadhaar}
            onChange={(e) => handleNumericInput(e, 12)}
            onBlur={onBlur}
          />
          {touched.motherAadhaar && errors.motherAadhaar && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.motherAadhaar}
            </span>
          )}
        </div>

        {/* Mother Photo Upload */}
        <div className="form-grid-full">
          <PhotoUpload
            label="Mother's Photo (Passport Size)"
            fieldName="motherPhoto"
            file={values.motherPhoto}
            previewUrl={previewUrls.motherPhoto}
            onFileSelect={onFileSelect}
            onFileRemove={onFileRemove}
            error={touched.motherPhoto && errors.motherPhoto}
          />
        </div>
      </div>
    </section>
  );
};

export default ParentSection;
