import React from 'react';
import { Send, RotateCcw, Loader2 } from 'lucide-react';

/**
 * Form Actions Component
 * Features primary Submit button (with loading spinner & disable during submitting) and Reset button
 */
const FormActions = ({ isSubmitting, onReset, onSubmit }) => {
  return (
    <div className="form-actions-bar">
      <button
        type="button"
        className="btn-secondary"
        onClick={onReset}
        disabled={isSubmitting}
      >
        <RotateCcw size={18} />
        Reset Form
      </button>

      <button
        type="button"
        className="btn-primary"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={20} className="spinner-icon" />
            <span>Submitting Application...</span>
          </>
        ) : (
          <>
            <Send size={18} />
            <span>Submit Application</span>
          </>
        )}
      </button>
    </div>
  );
};

export default FormActions;
