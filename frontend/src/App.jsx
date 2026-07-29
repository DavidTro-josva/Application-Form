import React, { useState } from 'react';
import Header from './components/Header/Header';
import StudentSection from './components/StudentSection/StudentSection';
import ParentSection from './components/ParentSection/ParentSection';
import GuardianSection from './components/GuardianSection/GuardianSection';
import AddressSection from './components/AddressSection/AddressSection';
import FormActions from './components/FormActions/FormActions';
import SuccessModal from './components/SuccessModal/SuccessModal';
import ErrorToast from './components/ErrorToast/ErrorToast';
import RFIDDashboard from './pages/RFIDDashboard/RFIDDashboard';
import { useFormValidation } from './hooks/useFormValidation';
import { submitAdmissionApplication } from './services/api';
import './styles/App.css';

/**
 * Happy Kids School – Main Application
 * Supports two pages: Admission Form | RFID Card Management
 */
const App = () => {
  const [activePage, setActivePage] = useState('admission'); // 'admission' | 'rfid'

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

  const todayString = new Date().toISOString().split('T')[0];
  const progressPercentage = calculateProgress();
  let currentStepName = '1. Student Info';
  if (progressPercentage > 80)      currentStepName = 'Ready to Submit';
  else if (progressPercentage > 60) currentStepName = '4. Address Details';
  else if (progressPercentage > 40) currentStepName = '3. Guardian Details';
  else if (progressPercentage > 20) currentStepName = '2. Parent Details';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorNotice(null);
    const { isValid } = validateAll();
    if (!isValid) {
      setErrorNotice({
        title: 'Required Fields Missing or Invalid',
        message: 'Please check the highlighted fields below and ensure all required information is provided.',
      });
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (val !== null && val !== undefined) formData.append(key, val);
    });
    setIsSubmitting(true);
    try {
      const result = await submitAdmissionApplication(formData);
      setIsSubmitting(false);
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

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the admission form? All entered data and photos will be cleared.')) {
      resetForm();
      setErrorNotice(null);
      setSuccessData(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReturnHome = () => {
    resetForm();
    setSuccessData(null);
    setErrorNotice(null);
  };

  return (
    <div>
      {/* ─── Top Navigation Tabs ─────────────────────────── */}
      <nav className="page-nav">
        <div className="page-nav-inner">
          <button
            id="tab-admission"
            className={`page-nav-tab ${activePage === 'admission' ? 'active' : ''}`}
            onClick={() => setActivePage('admission')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>
            Admission Form
          </button>
          <button
            id="tab-rfid"
            className={`page-nav-tab ${activePage === 'rfid' ? 'active' : ''}`}
            onClick={() => setActivePage('rfid')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
            RFID ID Cards
            <span className="nav-badge">NEW</span>
          </button>
        </div>
      </nav>

      {/* ─── Admission Form Page ─────────────────────────── */}
      {activePage === 'admission' && (
        <div className="app-container">
          <Header progressPercentage={progressPercentage} currentStepName={currentStepName} />
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <StudentSection
                values={values} errors={errors} touched={touched}
                onChange={handleChange} onBlur={handleBlur}
                onFileSelect={handleFileSelect} onFileRemove={handleFileRemove}
                previewUrls={previewUrls} calculateAgeDisplay={calculateAgeDisplay}
                maxDate={todayString}
              />
              <ParentSection
                values={values} errors={errors} touched={touched}
                onChange={handleChange} onBlur={handleBlur}
                onFileSelect={handleFileSelect} onFileRemove={handleFileRemove}
                previewUrls={previewUrls}
              />
              <GuardianSection
                values={values} errors={errors} touched={touched}
                onChange={handleChange} onBlur={handleBlur}
                onFileSelect={handleFileSelect} onFileRemove={handleFileRemove}
                previewUrls={previewUrls}
              />
              <AddressSection
                values={values} errors={errors} touched={touched}
                onChange={handleChange} onBlur={handleBlur}
              />
              <FormActions
                isSubmitting={isSubmitting}
                onReset={handleReset}
                onSubmit={handleSubmit}
              />
            </div>
          </form>

          {successData && (
            <SuccessModal
              applicationNumber={successData.applicationNumber}
              studentName={successData.studentName}
              onReturnHome={handleReturnHome}
            />
          )}
          <ErrorToast error={errorNotice} onClose={() => setErrorNotice(null)} />
        </div>
      )}

      {/* ─── RFID Dashboard Page ─────────────────────────── */}
      {activePage === 'rfid' && <RFIDDashboard />}
    </div>
  );
};

export default App;
