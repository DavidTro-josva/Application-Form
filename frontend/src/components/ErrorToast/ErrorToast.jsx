import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Error Toast Component
 * Displays user-friendly banners for Network/Database failures, duplicate submissions, and missing fields
 */
const ErrorToast = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="toast-banner" role="alert">
      <div className="toast-content">
        <AlertTriangle size={24} className="toast-icon" />
        <div className="toast-text">
          <h4>{error.title || 'Submission Error'}</h4>
          <p>{error.message}</p>
        </div>
      </div>
      <button
        type="button"
        className="btn-toast-close"
        onClick={onClose}
        aria-label="Close error notice"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default ErrorToast;
