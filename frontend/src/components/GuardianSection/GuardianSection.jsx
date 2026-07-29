import React from 'react';
import { ShieldCheck, UserCheck, Briefcase, Phone, Mail, CreditCard, AlertCircle } from 'lucide-react';
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

      <h3 className="subsection-title">Guardian 1 Information (Primary)</h3>
      <div className="form-grid">
        {/* 1. Guardian Full Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="guardianName">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <UserCheck size={16} /> Guardian Full Name
            </span>{' '}
            <span className="required-star">*</span>
          </label>
          <input
            id="guardianName"
            name="guardianName"
            type="text"
            className={`form-input ${touched.guardianName && errors.guardianName ? 'input-error' : ''}`}
            placeholder="Enter guardian's full name (alphabetic only)"
            value={values.guardianName}
            onChange={onChange}
            onBlur={onBlur}
            required
            aria-invalid={!!(touched.guardianName && errors.guardianName)}
            aria-describedby={touched.guardianName && errors.guardianName ? 'guardianName-error' : undefined}
          />
          {touched.guardianName && errors.guardianName && (
            <span id="guardianName-error" className="error-text" role="alert">
              <AlertCircle size={14} /> {errors.guardianName}
            </span>
          )}
        </div>

        {/* 2. Guardian Occupation */}
        <div className="form-group">
          <label className="form-label" htmlFor="guardianOccupation">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase size={16} /> Occupation
            </span>{' '}
            <span className="required-star">*</span>
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
            required
            aria-invalid={!!(touched.guardianOccupation && errors.guardianOccupation)}
            aria-describedby={
              touched.guardianOccupation && errors.guardianOccupation ? 'guardianOccupation-error' : undefined
            }
          />
          {touched.guardianOccupation && errors.guardianOccupation && (
            <span id="guardianOccupation-error" className="error-text" role="alert">
              <AlertCircle size={14} /> {errors.guardianOccupation}
            </span>
          )}
        </div>

        {/* 3. Guardian Mobile Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="guardianMobile">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={16} /> Mobile Number
            </span>{' '}
            <span className="required-star">*</span>
          </label>
          <input
            id="guardianMobile"
            name="guardianMobile"
            type="tel"
            inputMode="numeric"
            className={`form-input ${touched.guardianMobile && errors.guardianMobile ? 'input-error' : ''}`}
            placeholder="10-digit mobile number"
            value={values.guardianMobile}
            onChange={(e) => handleNumericInput(e, 10)}
            onBlur={onBlur}
            required
            maxLength={10}
            aria-invalid={!!(touched.guardianMobile && errors.guardianMobile)}
            aria-describedby={touched.guardianMobile && errors.guardianMobile ? 'guardianMobile-error' : undefined}
          />
          {touched.guardianMobile && errors.guardianMobile && (
            <span id="guardianMobile-error" className="error-text" role="alert">
              <AlertCircle size={14} /> {errors.guardianMobile}
            </span>
          )}
        </div>

        {/* 4. Guardian Email Address */}
        <div className="form-group">
          <label className="form-label" htmlFor="guardianEmail">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={16} /> Email Address
            </span>{' '}
            <span className="optional-tag">(Optional)</span>
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
            aria-invalid={!!(touched.guardianEmail && errors.guardianEmail)}
            aria-describedby={touched.guardianEmail && errors.guardianEmail ? 'guardianEmail-error' : undefined}
          />
          {touched.guardianEmail && errors.guardianEmail && (
            <span id="guardianEmail-error" className="error-text" role="alert">
              <AlertCircle size={14} /> {errors.guardianEmail}
            </span>
          )}
        </div>

        {/* 5. Guardian Aadhaar Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="guardianAadhaar">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CreditCard size={16} /> Aadhaar Number
            </span>{' '}
            <span className="required-star">*</span>
          </label>
          <input
            id="guardianAadhaar"
            name="guardianAadhaar"
            type="text"
            inputMode="numeric"
            className={`form-input ${touched.guardianAadhaar && errors.guardianAadhaar ? 'input-error' : ''}`}
            placeholder="12-digit Aadhaar number"
            value={values.guardianAadhaar}
            onChange={(e) => handleNumericInput(e, 12)}
            onBlur={onBlur}
            required
            maxLength={12}
            aria-invalid={!!(touched.guardianAadhaar && errors.guardianAadhaar)}
            aria-describedby={touched.guardianAadhaar && errors.guardianAadhaar ? 'guardianAadhaar-error' : undefined}
          />
          {touched.guardianAadhaar && errors.guardianAadhaar && (
            <span id="guardianAadhaar-error" className="error-text" role="alert">
              <AlertCircle size={14} /> {errors.guardianAadhaar}
            </span>
          )}
        </div>

        {/* 6. Guardian Photo Upload */}
        <div className="form-group">
          <PhotoUpload
            label="Guardian Photo"
            fieldName="guardianPhoto"
            required={true}
            onFileSelect={onFileSelect}
            onFileRemove={onFileRemove}
            previewUrl={previewUrls?.guardianPhoto}
          />
          {touched.guardianPhoto && errors.guardianPhoto && (
            <span className="error-text" role="alert" style={{ marginTop: '4px' }}>
              <AlertCircle size={14} /> {errors.guardianPhoto}
            </span>
          )}
        </div>
      </div>

      {/* --- GUARDIAN 2 INFORMATION (OPTIONAL) --- */}
      <h3 className="subsection-title" style={{ marginTop: '2.5rem' }}>
        Guardian 2 Information (Optional)
      </h3>
      <div className="form-grid">
        {/* 1. Guardian 2 Full Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="guardian2Name">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <UserCheck size={16} /> Guardian 2 Full Name (Optional)
            </span>
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
            aria-invalid={!!(touched.guardian2Name && errors.guardian2Name)}
            aria-describedby={touched.guardian2Name && errors.guardian2Name ? 'guardian2Name-error' : undefined}
          />
          {touched.guardian2Name && errors.guardian2Name && (
            <span id="guardian2Name-error" className="error-text" role="alert">
              <AlertCircle size={14} /> {errors.guardian2Name}
            </span>
          )}
        </div>

        {/* 2. Guardian 2 Occupation */}
        <div className="form-group">
          <label className="form-label" htmlFor="guardian2Occupation">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase size={16} /> Occupation (Optional)
            </span>
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
            <span className="error-text" role="alert">
              <AlertCircle size={14} /> {errors.guardian2Occupation}
            </span>
          )}
        </div>

        {/* 3. Guardian 2 Mobile Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="guardian2Mobile">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={16} /> Mobile Number (Optional)
            </span>
          </label>
          <input
            id="guardian2Mobile"
            name="guardian2Mobile"
            type="text"
            inputMode="numeric"
            className={`form-input ${touched.guardian2Mobile && errors.guardian2Mobile ? 'input-error' : ''}`}
            placeholder="10-digit mobile number"
            value={values.guardian2Mobile || ''}
            onChange={(e) => handleNumericInput(e, 10)}
            onBlur={onBlur}
            maxLength={10}
            aria-invalid={!!(touched.guardian2Mobile && errors.guardian2Mobile)}
            aria-describedby={touched.guardian2Mobile && errors.guardian2Mobile ? 'guardian2Mobile-error' : undefined}
          />
          {touched.guardian2Mobile && errors.guardian2Mobile && (
            <span id="guardian2Mobile-error" className="error-text" role="alert">
              <AlertCircle size={14} /> {errors.guardian2Mobile}
            </span>
          )}
        </div>

        {/* 4. Guardian 2 Email Address */}
        <div className="form-group">
          <label className="form-label" htmlFor="guardian2Email">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={16} /> Email Address (Optional)
            </span>
          </label>
          <input
            id="guardian2Email"
            name="guardian2Email"
            type="email"
            className={`form-input ${touched.guardian2Email && errors.guardian2Email ? 'input-error' : ''}`}
            placeholder="e.g. guardian2@example.com"
            value={values.guardian2Email || ''}
            onChange={onChange}
            onBlur={onBlur}
            aria-invalid={!!(touched.guardian2Email && errors.guardian2Email)}
            aria-describedby={touched.guardian2Email && errors.guardian2Email ? 'guardian2Email-error' : undefined}
          />
          {touched.guardian2Email && errors.guardian2Email && (
            <span id="guardian2Email-error" className="error-text" role="alert">
              <AlertCircle size={14} /> {errors.guardian2Email}
            </span>
          )}
        </div>

        {/* 5. Guardian 2 Aadhaar Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="guardian2Aadhaar">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CreditCard size={16} /> Aadhaar Number (Optional)
            </span>
          </label>
          <input
            id="guardian2Aadhaar"
            name="guardian2Aadhaar"
            type="text"
            inputMode="numeric"
            className={`form-input ${touched.guardian2Aadhaar && errors.guardian2Aadhaar ? 'input-error' : ''}`}
            placeholder="12-digit Aadhaar number"
            value={values.guardian2Aadhaar || ''}
            onChange={(e) => handleNumericInput(e, 12)}
            onBlur={onBlur}
            maxLength={12}
            aria-invalid={!!(touched.guardian2Aadhaar && errors.guardian2Aadhaar)}
            aria-describedby={touched.guardian2Aadhaar && errors.guardian2Aadhaar ? 'guardian2Aadhaar-error' : undefined}
          />
          {touched.guardian2Aadhaar && errors.guardian2Aadhaar && (
            <span id="guardian2Aadhaar-error" className="error-text" role="alert">
              <AlertCircle size={14} /> {errors.guardian2Aadhaar}
            </span>
          )}
        </div>

        {/* 6. Guardian 2 Photo Upload */}
        <div className="form-group">
          <PhotoUpload
            label="Guardian 2 Photo (Optional)"
            fieldName="guardian2Photo"
            required={false}
            onFileSelect={onFileSelect}
            onFileRemove={onFileRemove}
            previewUrl={previewUrls?.guardian2Photo}
          />
          {touched.guardian2Photo && errors.guardian2Photo && (
            <span className="error-text" role="alert" style={{ marginTop: '4px' }}>
              <AlertCircle size={14} /> {errors.guardian2Photo}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default GuardianSection;
