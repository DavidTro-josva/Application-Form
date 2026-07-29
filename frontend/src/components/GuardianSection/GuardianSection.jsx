import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import PhotoUpload from '../PhotoUpload/PhotoUpload';

/**
 * Section 3: Guardian Details Card
 * Displays a dedicated modern card for Guardian Information with complete field validation & photo upload
 */
const GuardianSection = ({
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
          <ShieldCheck size={24} />
        </div>
        <h2>3. Guardian Details</h2>
      </div>

      {/* --- GUARDIAN 1 INFORMATION (PRIMARY) --- */}
      <h3 className="subsection-title">Guardian 1 Information (Primary)</h3>
      <div className="form-grid">
        {/* Guardian Full Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="guardianName">
            Guardian Full Name <span className="required-star">*</span>
          </label>
          <input
            id="guardianName"
            name="guardianName"
            type="text"
            className={`form-input ${touched.guardianName && errors.guardianName ? 'input-error' : ''}`}
            placeholder="Enter guardian's full name"
            value={values.guardianName}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.guardianName && errors.guardianName && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.guardianName}
            </span>
          )}
        </div>

        {/* Guardian Occupation */}
        <div className="form-group">
          <label className="form-label" htmlFor="guardianOccupation">
            Occupation <span className="required-star">*</span>
          </label>
          <input
            id="guardianOccupation"
            name="guardianOccupation"
            type="text"
            className={`form-input ${touched.guardianOccupation && errors.guardianOccupation ? 'input-error' : ''}`}
            placeholder="e.g. Business, Doctor, Teacher"
            value={values.guardianOccupation}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.guardianOccupation && errors.guardianOccupation && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.guardianOccupation}
            </span>
          )}
        </div>

        {/* Guardian Mobile Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="guardianMobile">
            Mobile Number <span className="required-star">*</span>
          </label>
          <input
            id="guardianMobile"
            name="guardianMobile"
            type="text"
            inputMode="numeric"
            maxLength={10}
            className={`form-input ${touched.guardianMobile && errors.guardianMobile ? 'input-error' : ''}`}
            placeholder="10-digit mobile number"
            value={values.guardianMobile}
            onChange={(e) => handleNumericInput(e, 10)}
            onBlur={onBlur}
          />
          {touched.guardianMobile && errors.guardianMobile && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.guardianMobile}
            </span>
          )}
        </div>

        {/* Guardian Email Address (Optional) */}
        <div className="form-group">
          <label className="form-label" htmlFor="guardianEmail">
            Email Address (Optional)
          </label>
          <input
            id="guardianEmail"
            name="guardianEmail"
            type="email"
            className={`form-input ${touched.guardianEmail && errors.guardianEmail ? 'input-error' : ''}`}
            placeholder="guardian@example.com"
            value={values.guardianEmail}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.guardianEmail && errors.guardianEmail && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.guardianEmail}
            </span>
          )}
        </div>

        {/* Guardian Aadhaar Number (Exactly 12 digits) */}
        <div className="form-group form-grid-full">
          <label className="form-label" htmlFor="guardianAadhaar">
            Aadhaar Number (12 Digits) <span className="required-star">*</span>
          </label>
          <input
            id="guardianAadhaar"
            name="guardianAadhaar"
            type="text"
            maxLength={12}
            className={`form-input ${touched.guardianAadhaar && errors.guardianAadhaar ? 'input-error' : ''}`}
            placeholder="12-digit Aadhaar identification number"
            value={values.guardianAadhaar}
            onChange={(e) => handleNumericInput(e, 12)}
            onBlur={onBlur}
          />
          {touched.guardianAadhaar && errors.guardianAadhaar && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.guardianAadhaar}
            </span>
          )}
        </div>

        {/* Guardian Photo Upload */}
        <div className="form-grid-full">
          <PhotoUpload
            label="Guardian's Photo (Passport Size)"
            fieldName="guardianPhoto"
            file={values.guardianPhoto}
            previewUrl={previewUrls.guardianPhoto}
            onFileSelect={onFileSelect}
            onFileRemove={onFileRemove}
            error={touched.guardianPhoto && errors.guardianPhoto}
          />
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)', margin: '16px 0' }} />

      {/* --- GUARDIAN 2 INFORMATION (OPTIONAL) --- */}
      <h3 className="subsection-title">Guardian 2 Information (Optional)</h3>
      <div className="form-grid">
        {/* Guardian 2 Full Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="guardian2Name">
            Guardian 2 Full Name (Optional)
          </label>
          <input
            id="guardian2Name"
            name="guardian2Name"
            type="text"
            className={`form-input ${touched.guardian2Name && errors.guardian2Name ? 'input-error' : ''}`}
            placeholder="Enter second guardian's full name"
            value={values.guardian2Name || ''}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.guardian2Name && errors.guardian2Name && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.guardian2Name}
            </span>
          )}
        </div>

        {/* Guardian 2 Occupation */}
        <div className="form-group">
          <label className="form-label" htmlFor="guardian2Occupation">
            Occupation (Optional)
          </label>
          <input
            id="guardian2Occupation"
            name="guardian2Occupation"
            type="text"
            className={`form-input ${touched.guardian2Occupation && errors.guardian2Occupation ? 'input-error' : ''}`}
            placeholder="e.g. Business, Doctor, Teacher"
            value={values.guardian2Occupation || ''}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.guardian2Occupation && errors.guardian2Occupation && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.guardian2Occupation}
            </span>
          )}
        </div>

        {/* Guardian 2 Mobile Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="guardian2Mobile">
            Mobile Number (Optional)
          </label>
          <input
            id="guardian2Mobile"
            name="guardian2Mobile"
            type="text"
            inputMode="numeric"
            maxLength={10}
            className={`form-input ${touched.guardian2Mobile && errors.guardian2Mobile ? 'input-error' : ''}`}
            placeholder="10-digit mobile number"
            value={values.guardian2Mobile || ''}
            onChange={(e) => handleNumericInput(e, 10)}
            onBlur={onBlur}
          />
          {touched.guardian2Mobile && errors.guardian2Mobile && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.guardian2Mobile}
            </span>
          )}
        </div>

        {/* Guardian 2 Email Address */}
        <div className="form-group">
          <label className="form-label" htmlFor="guardian2Email">
            Email Address (Optional)
          </label>
          <input
            id="guardian2Email"
            name="guardian2Email"
            type="email"
            className={`form-input ${touched.guardian2Email && errors.guardian2Email ? 'input-error' : ''}`}
            placeholder="guardian2@example.com"
            value={values.guardian2Email || ''}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.guardian2Email && errors.guardian2Email && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.guardian2Email}
            </span>
          )}
        </div>

        {/* Guardian 2 Aadhaar Number */}
        <div className="form-group form-grid-full">
          <label className="form-label" htmlFor="guardian2Aadhaar">
            Aadhaar Number (12 Digits) (Optional)
          </label>
          <input
            id="guardian2Aadhaar"
            name="guardian2Aadhaar"
            type="text"
            maxLength={12}
            className={`form-input ${touched.guardian2Aadhaar && errors.guardian2Aadhaar ? 'input-error' : ''}`}
            placeholder="12-digit Aadhaar identification number"
            value={values.guardian2Aadhaar || ''}
            onChange={(e) => handleNumericInput(e, 12)}
            onBlur={onBlur}
          />
          {touched.guardian2Aadhaar && errors.guardian2Aadhaar && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.guardian2Aadhaar}
            </span>
          )}
        </div>

        {/* Guardian 2 Photo Upload */}
        <div className="form-grid-full">
          <PhotoUpload
            label="Guardian 2's Photo (Passport Size) (Optional)"
            fieldName="guardian2Photo"
            file={values.guardian2Photo}
            previewUrl={previewUrls.guardian2Photo}
            onFileSelect={onFileSelect}
            onFileRemove={onFileRemove}
            error={touched.guardian2Photo && errors.guardian2Photo}
          />
        </div>
      </div>
    </section>
  );
};

export default GuardianSection;
