import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Header Component
 * Displays TN Happy Kids School centered branding and interactive step progress bar
 */
const Header = ({ progressPercentage, currentStepName }) => {
  return (
    <div className="school-header-wrapper">
      {/* Part 1: School Branding Banner Card (Logo Left, School Name Center, Fixed at Top) */}
      <header className="school-brand-card">
        <div className="school-header-top">
          <div className="header-left">
            <div className="school-logo-badge">
              <img src="/logo.png" alt="TN Happy Kids School Logo" />
            </div>
          </div>
          <div className="school-title-group">
            <h1>TN Happy Kids School</h1>
            <p>Learn • Play • Grow</p>
          </div>
          <div className="header-right"></div>
        </div>
      </header>

      {/* Part 2: Interactive Application Progress Card (Sticky / Fixed at Top on Scroll) */}
      <div className="school-progress-card">
        <div className="progress-labels">
          <span>
            <Sparkles size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: '#f59e0b' }} />
            Application Progress: <strong>{currentStepName}</strong>
          </span>
          <span className="progress-percentage">{progressPercentage}% Complete</span>
        </div>
        <div className="progress-bar-track">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Header;
