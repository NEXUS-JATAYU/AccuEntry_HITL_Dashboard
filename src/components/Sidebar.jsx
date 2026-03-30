import React from 'react';
import '../styles/Sidebar.css';

function Sidebar({ 
  searchTerm, 
  onSearchChange, 
  selectedStatuses, 
  onStatusChange, 
  selectedModules, 
  onModuleChange,
  statusOptions,
  modulesData,
}) {
  return (
    <aside className="sidebar">
      <nav className="nav-section">
        <button className="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          OVERVIEW
        </button>
        <button className="nav-item active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
          </svg>
          OBLIGATIONS
        </button>
        <button className="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          CONTROLS
        </button>
        <button className="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14,2 14,8 20,8" />
          </svg>
          EVIDENCE
        </button>
      </nav>

      <div className="filter-section">
        <input
          type="text"
          className="search-input"
          placeholder="Enter search terms or ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <div className="filter-group">
          <div className="filter-header">
            <span className="filter-title">Obligation Status</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </div>
          <div className="filter-options">
            {statusOptions.map((status) => (
              <div className="filter-option" key={status.id}>
                <input
                  type="checkbox"
                  id={`status-${status.id}`}
                  checked={selectedStatuses.includes(status.id)}
                  onChange={() => onStatusChange(status.id)}
                />
                <label htmlFor={`status-${status.id}`}>{status.label}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-header">
            <span className="filter-title">Modules</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </div>
          <div className="filter-options">
            {modulesData.map((module) => (
              <div className="filter-option" key={module.id}>
                <input
                  type="checkbox"
                  id={`module-${module.id}`}
                  checked={selectedModules.includes(module.id)}
                  onChange={() => onModuleChange(module.id)}
                />
                <label htmlFor={`module-${module.id}`}>{module.label}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="new-assessment-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New Assessment
      </button>
    </aside>
  );
}

export default Sidebar;
