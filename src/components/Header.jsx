import React from 'react';
import '../styles/Header.css';

function Header() {
  const handleNexusClick = () => {
    // Redirect to home page
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-container">
          {/* Left: Nexus Logo */}
          <div className="header-left">
            <button 
              className="nexus-logo"
              onClick={handleNexusClick}
              aria-label="Go to home page"
            >
              nexus
            </button>
          </div>

          {/* Center: FDIC Information */}
          <div className="header-center">
            <span className="fdic-text">FDIC FDIC-Insured - Backed by the full faith and credit of the U.S. Government</span>
          </div>

          {/* Right: ATM/BRANCH and ESPANOL */}
          <div className="header-right">
            <a href="#" className="header-link atm-branch">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z" />
                <rect x="9" y="3" width="6" height="6" />
                <rect x="6" y="14" width="3" height="4" />
                <rect x="15" y="14" width="3" height="4" />
              </svg>
              ATM / BRANCH
            </a>
            <a href="#" className="header-link espanol">ESPANOL</a>
          </div>
        </div>
      </div>

    </header>
  );
}

export default Header;
