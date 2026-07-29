import React from 'react';
import { Home, AlertCircle } from 'lucide-react';

/**
 * Section 3: Residential Address Card
 * All fields required. Country defaults to India. PIN Code exactly 6 digits.
 */
const AddressSection = ({
  values,
  errors,
  touched,
  onChange,
  onBlur,
}) => {
  const handlePinInput = (e) => {
    const { name, value } = e.target;
    const cleanValue = value.replace(/\D/g, '').slice(0, 6);
    onChange({ target: { name, value: cleanValue } });
  };

  return (
    <section className="form-section-card">
      <div className="section-header-banner">
        <div className="section-icon-badge">
          <Home size={24} />
        </div>
        <h2>4. Residential Address</h2>
      </div>

      <div className="form-grid-3">
        {/* House Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="houseNumber">
            House / Flat Number <span className="required-star">*</span>
          </label>
          <input
            id="houseNumber"
            name="houseNumber"
            type="text"
            className={`form-input ${touched.houseNumber && errors.houseNumber ? 'input-error' : ''}`}
            placeholder="e.g., 42-B or Flat 301"
            value={values.houseNumber}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.houseNumber && errors.houseNumber && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.houseNumber}
            </span>
          )}
        </div>

        {/* Street */}
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label" htmlFor="street">
            Street / Road Name <span className="required-star">*</span>
          </label>
          <input
            id="street"
            name="street"
            type="text"
            className={`form-input ${touched.street && errors.street ? 'input-error' : ''}`}
            placeholder="e.g., Green Valley Boulevard, Main Road"
            value={values.street}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.street && errors.street && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.street}
            </span>
          )}
        </div>

        {/* Area */}
        <div className="form-group">
          <label className="form-label" htmlFor="area">
            Area / Locality <span className="required-star">*</span>
          </label>
          <input
            id="area"
            name="area"
            type="text"
            className={`form-input ${touched.area && errors.area ? 'input-error' : ''}`}
            placeholder="e.g., Indiranagar"
            value={values.area}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.area && errors.area && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.area}
            </span>
          )}
        </div>

        {/* City */}
        <div className="form-group">
          <label className="form-label" htmlFor="city">
            City / Town <span className="required-star">*</span>
          </label>
          <input
            id="city"
            name="city"
            type="text"
            className={`form-input ${touched.city && errors.city ? 'input-error' : ''}`}
            placeholder="e.g., Bengaluru"
            value={values.city}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.city && errors.city && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.city}
            </span>
          )}
        </div>

        {/* District */}
        <div className="form-group">
          <label className="form-label" htmlFor="district">
            District <span className="required-star">*</span>
          </label>
          <input
            id="district"
            name="district"
            type="text"
            className={`form-input ${touched.district && errors.district ? 'input-error' : ''}`}
            placeholder="e.g., Bengaluru Urban"
            value={values.district}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.district && errors.district && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.district}
            </span>
          )}
        </div>

        {/* State */}
        <div className="form-group">
          <label className="form-label" htmlFor="state">
            State <span className="required-star">*</span>
          </label>
          <input
            id="state"
            name="state"
            type="text"
            className={`form-input ${touched.state && errors.state ? 'input-error' : ''}`}
            placeholder="e.g., Karnataka"
            value={values.state}
            onChange={onChange}
            onBlur={onBlur}
          />
          {touched.state && errors.state && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.state}
            </span>
          )}
        </div>

        {/* Country (Default: India) */}
        <div className="form-group">
          <label className="form-label" htmlFor="country">
            Country <span className="required-star">*</span>
          </label>
          <input
            id="country"
            name="country"
            type="text"
            className="form-input"
            value={values.country}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="India"
          />
          {touched.country && errors.country && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.country}
            </span>
          )}
        </div>

        {/* PIN Code (Exactly 6 digits) */}
        <div className="form-group">
          <label className="form-label" htmlFor="pinCode">
            PIN Code (6 Digits) <span className="required-star">*</span>
          </label>
          <input
            id="pinCode"
            name="pinCode"
            type="text"
            maxLength={6}
            className={`form-input ${touched.pinCode && errors.pinCode ? 'input-error' : ''}`}
            placeholder="6-digit PIN"
            value={values.pinCode}
            onChange={handlePinInput}
            onBlur={onBlur}
          />
          {touched.pinCode && errors.pinCode && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.pinCode}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default AddressSection;
