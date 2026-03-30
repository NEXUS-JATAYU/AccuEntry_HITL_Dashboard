import React from 'react';
import '../styles/Topbar.css';

function Topbar({ selectAll, onSelectAllChange, onExpandAll }) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="select-all">
          <input
            type="checkbox"
            id="select-all"
            checked={selectAll}
            onChange={(e) => onSelectAllChange(e.target.checked)}
          />
          <label htmlFor="select-all">SELECT ALL</label>
        </div>

        <div className="dropdown">
          <button className="dropdown-btn">
            Tracked Obligations
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </button>
        </div>
      </div>

      <div className="topbar-right">
        <button className="action-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export
        </button>
        <button className="action-btn" onClick={onExpandAll}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          Expand All
        </button>
      </div>
    </div>
  );
}

export default Topbar;
