import React from 'react';
import { User, AlertCircle } from 'lucide-react';
import PhotoUpload from '../PhotoUpload/PhotoUpload';

/**
 * Section 1: Student Information Card
 * Includes Full Name, DOB, Auto-calculated Read-only Age, Gender, Blood Group, Mother Tongue & Student Photo
 */
const StudentSection = ({
  values,
  errors,
  touched,
  onChange,
  onBlur,
  onFileSelect,
  onFileRemove,
  previewUrls,
  calculateAgeDisplay,
  maxDate,
}) => {
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genderOptions = ['Male', 'Female', 'Other'];

  return (
    <section className="form-section-card">
      <div className="section-header-banner">
        <div className="section-icon-badge">
          <User size={24} />
        </div>
        <h2>1. Student Information</h2>
      </div>

      <div className="form-grid">
        {/* 1. Student Full Name */}
        <div className="form-group form-grid-full">
          <label className="form-label" htmlFor="studentName">
            Student Full Name <span className="required-star">*</span>
          </label>
          <input
            id="studentName"
            name="studentName"
            type="text"
            className={`form-input ${touched.studentName && errors.studentName ? 'input-error' : ''}`}
            placeholder="Enter student's full name (Minimum 3 characters)"
            value={values.studentName}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.studentName && errors.studentName && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.studentName}
            </span>
          )}
        </div>

        {/* 2. Date of Birth (No future dates) */}
        <div className="form-group">
          <label className="form-label" htmlFor="dob">
            Date of Birth <span className="required-star">*</span>
          </label>
          <input
            id="dob"
            name="dob"
            type="date"
            max={maxDate}
            className={`form-input ${touched.dob && errors.dob ? 'input-error' : ''}`}
            value={values.dob}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.dob && errors.dob && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.dob}
            </span>
          )}
        </div>

        {/* 3. Age (Read Only, automatically calculated from DOB) */}
        <div className="form-group">
          <label className="form-label" htmlFor="ageDisplay">
            Age (Auto Calculated)
          </label>
          <input
            id="ageDisplay"
            name="ageDisplay"
            type="text"
            readOnly
            className="form-input"
            value={calculateAgeDisplay(values.dob)}
            title="Automatically calculated from Date of Birth"
          />
        </div>

        {/* 4. Gender (Radio Buttons: Male, Female, Other) */}
        <div className="form-group form-grid-full">
          <label className="form-label">
            Gender <span className="required-star">*</span>
          </label>
          <div className="radio-group" role="radiogroup" aria-label="Student Gender">
            {genderOptions.map((option) => (
              <label
                key={option}
                className={`radio-option ${values.gender === option ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={values.gender === option}
                  onChange={onChange}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {touched.gender && errors.gender && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.gender}
            </span>
          )}
        </div>

        {/* 5. Blood Group (Dropdown) */}
        <div className="form-group">
          <label className="form-label" htmlFor="bloodGroup">
            Blood Group <span className="required-star">*</span>
          </label>
          <select
            id="bloodGroup"
            name="bloodGroup"
            className={`form-select ${touched.bloodGroup && errors.bloodGroup ? 'input-error' : ''}`}
            value={values.bloodGroup}
            onChange={onChange}
            onBlur={onBlur}
          >
            <option value="">-- Select Blood Group --</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
          {touched.bloodGroup && errors.bloodGroup && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.bloodGroup}
            </span>
          )}
        </div>

        {/* 6. Mother Tongue */}
        <div className="form-group">
          <label className="form-label" htmlFor="motherTongue">
            Mother Tongue <span className="required-star">*</span>
          </label>
          <input
            id="motherTongue"
            name="motherTongue"
            type="text"
            className={`form-input ${touched.motherTongue && errors.motherTongue ? 'input-error' : ''}`}
            placeholder="e.g., Hindi, English, Kannada, Tamil"
            value={values.motherTongue}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.motherTongue && errors.motherTongue && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.motherTongue}
            </span>
          )}
        </div>

        {/* 7. Student Photo Upload */}
        <div className="form-grid-full">
          <PhotoUpload
            label="7. Student Photo (Passport Size)"
            fieldName="studentPhoto"
            file={values.studentPhoto}
            previewUrl={previewUrls.studentPhoto}
            onFileSelect={onFileSelect}
            onFileRemove={onFileRemove}
            error={touched.studentPhoto && errors.studentPhoto}
          />
        </div>
      </div>
    </section>
  );
};

export default StudentSection;
