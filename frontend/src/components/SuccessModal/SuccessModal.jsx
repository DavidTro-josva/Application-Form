import React from 'react';
import { Check, Download, Home, Sparkles } from 'lucide-react';

/**
 * Success Page / Modal Component
 * Displays after successful submission with Generated Application Number and placeholder actions
 */
const SuccessModal = ({ applicationNumber, studentName, onReturnHome }) => {
  const handleDownloadPdf = () => {
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>TN Happy Kids School - Admission Receipt - ${applicationNumber}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 40px;
            color: #1e293b;
            background: #ffffff;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #6366f1;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #4f46e5;
            margin: 0;
            font-size: 28px;
            letter-spacing: 0.5px;
          }
          .header p {
            color: #64748b;
            margin: 6px 0 0;
            font-size: 14px;
          }
          .card {
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            background: #f8fafc;
            margin-bottom: 24px;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 14px;
            padding-bottom: 14px;
            border-bottom: 1px dashed #e2e8f0;
          }
          .row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
          }
          .label {
            font-weight: 600;
            color: #64748b;
            font-size: 15px;
          }
          .value {
            font-weight: 700;
            color: #0f172a;
            font-size: 15px;
          }
          .badge {
            display: inline-block;
            background: #10b981;
            color: #ffffff;
            padding: 4px 14px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 13px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
          }
          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            body { 
              margin: 0;
              padding: 20mm 15mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="/logo.png" alt="TN Happy Kids Logo" style="width: 76px; height: 76px; object-fit: contain; margin-bottom: 8px;" />
          <h1>🏫 TN HAPPY KIDS SCHOOL</h1>
          <p>TN Happy Kids • International Kindergarten & Primary Campus • Excellence in Early Learning</p>
        </div>
        
        <div class="card">
          <div class="row">
            <span class="label">Application Reference Number:</span>
            <span class="value" style="color: #4f46e5; font-size: 19px;">${applicationNumber}</span>
          </div>
          <div class="row">
            <span class="label">Student Full Name:</span>
            <span class="value">${studentName || 'N/A'}</span>
          </div>
          <div class="row">
            <span class="label">Application Status:</span>
            <span class="badge">SUBMITTED (PROVISIONAL)</span>
          </div>
          <div class="row">
            <span class="label">Submission Date:</span>
            <span class="value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <div class="footer">
          <p>TN Happy Kids School Admissions Office • +91 (80) 1234-5678 • admissions@tnhappykids.edu</p>
          <p>This is an electronically generated receipt. No physical signature is required.</p>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(receiptHtml);
      printWindow.document.close();
    } else {
      window.print();
    }
  };

  return (
    <div className="success-modal-overlay">
      <div className="success-modal-card" role="dialog" aria-labelledby="successTitle">
        <div className="success-icon-badge">
          <Check size={44} strokeWidth={3} />
        </div>

        <h2 id="successTitle">Application Submitted Successfully</h2>
        <p>
          Thank you for applying to <strong>TN Happy Kids School</strong>! We have received the admission application for <strong>{studentName}</strong>.
        </p>

        <div className="application-number-box">
          <div className="application-number-label">
            <Sparkles size={12} style={{ display: 'inline', marginRight: 4, color: '#10b981' }} />
            Generated Application Number
          </div>
          <div className="application-number-value">{applicationNumber}</div>
        </div>

        <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
          Please keep this reference number for future tracking and correspondence with the school admissions office.
        </p>

        <div className="success-modal-actions">
          <button type="button" className="btn-pdf" onClick={handleDownloadPdf}>
            <Download size={16} />
            Download PDF
          </button>

          <button type="button" className="btn-home" onClick={onReturnHome}>
            <Home size={18} />
            Return Home (New Application)
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
