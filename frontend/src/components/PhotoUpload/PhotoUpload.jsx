import React, { useRef, useState } from 'react';
import { UploadCloud, RefreshCw, Trash2, AlertCircle } from 'lucide-react';

/**
 * Reusable Photo Upload Component
 * - Accepted formats: JPG, JPEG, PNG
 * - Maximum Size: 5MB
 * - Features image preview, remove button, replace button, and dropzone
 */
const PhotoUpload = ({ label, fieldName, file, previewUrl, onFileSelect, onFileRemove, error }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState('');

  // Validate format and size
  const validateAndSelectFile = (selectedFile) => {
    setLocalError('');
    if (!selectedFile) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const validExtensions = ['.jpg', '.jpeg', '.png'];
    const fileName = selectedFile.name.toLowerCase();
    const isExtensionValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!validTypes.includes(selectedFile.type) && !isExtensionValid) {
      setLocalError('Only JPG, JPEG, and PNG image formats are accepted.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setLocalError('Image size exceeds 5 MB limit. Please select a smaller photo.');
      return;
    }

    onFileSelect(fieldName, selectedFile);
  };

  const handleInputChange = (e) => {
    const selectedFile = e.target.files?.[0];
    validateAndSelectFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    validateAndSelectFile(droppedFile);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {label} <span className="required-star">*</span>
      </label>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        style={{ display: 'none' }}
      />

      <div
        className={`photo-uploader-box ${previewUrl ? 'has-image' : ''} ${dragActive ? 'drag-active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!previewUrl ? triggerFileInput : undefined}
      >
        {previewUrl ? (
          <div className="upload-preview-wrapper">
            <img
              src={previewUrl}
              alt={`${label} Preview`}
              className="upload-preview-img"
            />
            <div className="upload-preview-actions">
              <button
                type="button"
                className="btn-upload-replace"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileInput();
                }}
              >
                <RefreshCw size={14} />
                Replace Image
              </button>
              <button
                type="button"
                className="btn-upload-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileRemove(fieldName);
                }}
              >
                <Trash2 size={14} />
                Remove Image
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="upload-icon-circle">
              <UploadCloud size={28} />
            </div>
            <p className="upload-text">Click or drag photo to upload</p>
            <p className="upload-subtext">Accepted: JPG, JPEG, PNG (Max 5 MB)</p>
          </>
        )}
      </div>

      {(localError || error) && (
        <span className="error-text">
          <AlertCircle size={14} />
          {localError || error}
        </span>
      )}
    </div>
  );
};

export default PhotoUpload;
