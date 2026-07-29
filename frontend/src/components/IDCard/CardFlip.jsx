import React, { useState } from 'react';
import CardFront from './CardFront';
import CardBack from './CardBack';

/**
 * CardFlip – 3D CSS flip card wrapper.
 * Shows front by default, flips to back on hover or button click.
 */
const CardFlip = ({ card, studentName, logoUrl, forPrint = false }) => {
  const [flipped, setFlipped] = useState(false);

  if (forPrint) {
    return (
      <div className="card-print-pair">
        <div className="id-card-wrapper">
          <CardFront card={card} studentName={studentName} logoUrl={logoUrl} />
        </div>
        <div className="id-card-wrapper">
          <CardBack card={card} studentName={studentName} />
        </div>
      </div>
    );
  }

  return (
    <div className="card-flip-scene">
      <div className={`card-flip-inner ${flipped ? 'is-flipped' : ''}`}>
        {/* Front */}
        <div className="card-flip-face card-flip-front">
          <CardFront card={card} studentName={studentName} logoUrl={logoUrl} />
        </div>
        {/* Back */}
        <div className="card-flip-face card-flip-back">
          <CardBack card={card} studentName={studentName} />
        </div>
      </div>

      {/* Flip toggle button */}
      <button
        className="card-flip-btn"
        onClick={() => setFlipped((f) => !f)}
        title={flipped ? 'View Front' : 'View Back'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 1l4 4-4 4"/>
          <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
          <path d="M7 23l-4-4 4-4"/>
          <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
        </svg>
        {flipped ? 'Front' : 'Back'}
      </button>
    </div>
  );
};

export default CardFlip;
