import React from 'react';

/**
 * CR80 Card Back – Premium RFID Family Access Card back side.
 * Contains school contact info, emergency number, terms, barcode strip.
 */
const CardBack = ({ card, studentName }) => {
  const SCHOOL = {
    name: 'TN Happy Kids School',
    address: 'No. 20, Kalianna Gounder Street, K.K. Pudur, Saibaba Colony, Coimbatore – 641 011, Tamil Nadu, India',
    phone: '+91 44 2345 6789',
    mobile: '+91 98765 43210',
    email: 'info@tnhappykids.school',
    website: 'www.tnhappykids.school',
  };

  // Generate a simple barcode visual from card_number
  const barPattern = (card.card_number || 'HKS-CARD')
    .split('')
    .map((c) => (c.charCodeAt(0) % 3 === 0 ? 'wide' : c.charCodeAt(0) % 2 === 0 ? 'mid' : 'thin'));

  return (
    <div className="id-card-back">
      {/* Top accent bar */}
      <div className="card-back-topbar" />

      {/* School branding */}
      <div className="card-back-header">
        <div className="card-back-school-name">{SCHOOL.name}</div>
        <div className="card-back-tagline">Nurturing Minds, Building Futures</div>
      </div>

      {/* Card holder summary */}
      <div className="card-back-holder-strip">
        <span className="cbh-label">Card Holder:</span>
        <span className="cbh-name">{card.holder_name || '—'}</span>
        <span className="cbh-divider">|</span>
        <span className="cbh-relation">{card.relationship?.replace('GUARDIAN2','Guardian 2').replace('GUARDIAN','Guardian 1')}</span>
      </div>

      {/* Emergency contact */}
      <div className="card-back-section">
        <div className="cbs-title">🚨 Emergency Contact</div>
        <div className="cbs-content">{SCHOOL.mobile} &nbsp;|&nbsp; {SCHOOL.phone}</div>
      </div>

      {/* School contact */}
      <div className="card-back-contact-grid">
        <div className="cbc-item">
          <span className="cbc-icon">📍</span>
          <span className="cbc-text">{SCHOOL.address}</span>
        </div>
        <div className="cbc-item">
          <span className="cbc-icon">🌐</span>
          <span className="cbc-text">{SCHOOL.website}</span>
        </div>
        <div className="cbc-item">
          <span className="cbc-icon">✉️</span>
          <span className="cbc-text">{SCHOOL.email}</span>
        </div>
      </div>

      {/* Barcode visual */}
      <div className="card-back-barcode">
        <div className="barcode-bars">
          {barPattern.map((type, i) => (
            <div key={i} className={`bar bar-${type}`} />
          ))}
        </div>
        <div className="barcode-number">{card.rfid_serial || '—'}</div>
      </div>

      {/* Terms */}
      <div className="card-back-terms">
        This card is the property of TN Happy Kids School. Unauthorized use is prohibited.
        If found, please return to the school office immediately.
      </div>

      {/* Footer found notice */}
      <div className="card-back-found">
        📌 If Found, Please Return to TN Happy Kids School
      </div>
    </div>
  );
};

export default CardBack;
