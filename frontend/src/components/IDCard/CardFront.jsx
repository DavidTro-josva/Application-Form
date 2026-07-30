import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

/**
 * CR80 Card Front – 85.60mm × 53.98mm (rendered at 323px × 204px)
 * Premium RFID family access card front side template.
 */

const RELATIONSHIP_CONFIG = {
  FATHER:   { label: 'Father',    gradient: 'linear-gradient(135deg,#1e3a8a 0%,#3730a3 100%)', accent: '#60a5fa', badge: '#2563eb' },
  MOTHER:   { label: 'Mother',    gradient: 'linear-gradient(135deg,#9d174d 0%,#be185d 100%)', accent: '#f9a8d4', badge: '#db2777' },
  GUARDIAN: { label: 'Guardian 1',gradient: 'linear-gradient(135deg,#065f46 0%,#047857 100%)', accent: '#6ee7b7', badge: '#059669' },
  GUARDIAN2:{ label: 'Guardian 2',gradient: 'linear-gradient(135deg,#92400e 0%,#b45309 100%)', accent: '#fcd34d', badge: '#d97706' },
};

const CardFront = ({ card, studentName, logoUrl }) => {
  const qrRef = useRef(null);
  const config = RELATIONSHIP_CONFIG[card.relationship] || RELATIONSHIP_CONFIG.FATHER;

  useEffect(() => {
    if (qrRef.current && card.qr_payload) {
      QRCode.toCanvas(qrRef.current, card.qr_payload, {
        width: 64,
        margin: 1,
        color: { dark: '#ffffff', light: 'transparent' },
      }).catch(() => {});
    }
  }, [card.qr_payload]);

  const photoSrc = card.holder_photo
    ? `/uploads/${card.holder_photo.split('/').pop()}`
    : null;

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  };

  return (
    <div className="id-card-front" style={{ background: config.gradient }}>
      {/* Decorative circles */}
      <div className="card-deco-circle card-deco-1" />
      <div className="card-deco-circle card-deco-2" />
      <div className="card-deco-stripe" style={{ background: config.badge }} />

      {/* Header row */}
      <div className="card-header-row">
        <div className="card-logo-wrap">
          {logoUrl
            ? <img src={logoUrl} alt="School Logo" className="card-logo-img" />
            : <div className="card-logo-placeholder">🎒</div>}
        </div>
        <div className="card-school-info">
          <div className="card-school-name">TN Happy Kids School</div>
          <div className="card-school-sub">RFID Family Access Card</div>
        </div>
        <div className="card-status-chip" style={{
          background: card.status === 'ACTIVE' ? '#22c55e' : card.status === 'BLOCKED' ? '#ef4444' : '#94a3b8'
        }}>
          {card.status || 'ACTIVE'}
        </div>
      </div>

      {/* Main content */}
      <div className="card-main-row">
        {/* Photo */}
        <div className="card-photo-wrap">
          {photoSrc
            ? <img src={photoSrc} alt="Holder" className="card-holder-photo" />
            : <div className="card-photo-placeholder">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>}
        </div>

        {/* Info */}
        <div className="card-info-col">
          <div className="card-relation-badge" style={{ background: config.badge }}>
            {config.label}
          </div>
          <div className="card-holder-name">{card.holder_name || '—'}</div>
          <div className="card-student-label">
            Student: <span>{studentName || '—'}</span>
            {card.application_number && (
              <span style={{ fontSize: '0.55rem', opacity: 0.8, marginLeft: '4px' }}>
                ({card.application_number})
              </span>
            )}
          </div>
          <div className="card-meta-row">
            <div className="card-meta-item">
              <span className="card-meta-label">Card No</span>
              <span className="card-meta-val">{card.card_number}</span>
            </div>
          </div>
          <div className="card-meta-row">
            <div className="card-meta-item">
              <span className="card-meta-label">Valid</span>
              <span className="card-meta-val">{formatDate(card.issue_date)} – {formatDate(card.expiry_date)}</span>
            </div>
          </div>
          <div className="card-rfid-row">
            <span className="card-rfid-icon">📡</span>
            <span className="card-rfid-serial">{card.rfid_serial || '—'}</span>
          </div>
        </div>

        {/* QR Code */}
        <div className="card-qr-wrap">
          <canvas ref={qrRef} className="card-qr-canvas" />
          <div className="card-qr-label">Scan to Verify</div>
        </div>
      </div>
    </div>
  );
};

export default CardFront;
