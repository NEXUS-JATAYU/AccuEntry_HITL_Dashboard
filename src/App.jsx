import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Topbar from './components/Topbar.jsx';
import MainSidebar from './components/Main-sidebar.jsx';
import AccuEntryNavbar from './components/AccuEntryNavbar.jsx';
import Table from './components/Table.jsx';
import './styles/App.css';
import './styles/dashboard.css';
import keycloak from './keycloak.js';

const STAGE_LABELS = {
  data_capture: 'Data Capture',
  doc_verification: 'Document Verification',
  kyc_approval: 'KYC Approval',
  aml_screening: 'AML Screening',
  fraud_check: 'Fraud Check',
  manual_review: 'Manual Review',
  pending_docs: 'Pending Documents',
  escalated: 'Compliance Escalation',
  otp_verification: 'OTP Verification',
  complete: 'Completed',
  rejected: 'Rejected',
};

const toLabel = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const stageLabel = (value) => STAGE_LABELS[value] || toLabel(value) || 'Unknown';

const auditPoints = (log) => {
  const output = log?.output_payload || {};
  const points = [];
  points.push(log?.friendly_text || 'No friendly explanation available.');
  if (log?.stage) {
    points.push(`Stage: ${stageLabel(log.stage)}`);
  }
  if (log?.decision_source && String(log.decision_source).toLowerCase() !== 'llm') {
    points.push(`Source: ${toLabel(log.decision_source)}`);
  }
  if (output?.action) {
    points.push(`Action: ${toLabel(output.action)}`);
  }
  if (output?.reason) {
    points.push(`Reason: ${output.reason}`);
  }
  return points;
};

function CaseDetailsModal({ isOpen, onClose, loading, error, details }) {
  if (!isOpen) {
    return null;
  }

  const caseData = details?.case || {};
  const overall = details?.overall || {};
  const auditLogs = details?.audit_logs || [];
  const amlChecks = details?.aml_checks || [];
  const complianceFlagged = Boolean(caseData?.flagged || caseData?.compliance === 'Non-Compliant' || caseData?.stage === 'rejected');

  return (
    <div className="case-modal-overlay" onClick={onClose}>
      <div className="case-modal" onClick={(e) => e.stopPropagation()}>
        <div className="case-modal-header">
          <h3>Customer Compliance Details</h3>
          <button type="button" className="case-modal-close" onClick={onClose}>X</button>
        </div>

        {loading && <div className="case-modal-loading">Loading details...</div>}
        {!loading && error && <div className="case-modal-error">{error}</div>}

        {!loading && !error && (
          <div className="case-modal-content">
            <div className="case-summary-grid">
              <div>
                <span className="label">Customer</span>
                <div>{caseData.full_name || 'N/A'}</div>
              </div>
              <div>
                <span className="label">Session</span>
                <div>{caseData.session_id || 'N/A'}</div>
              </div>
              <div>
                <span className="label">Stage</span>
                <div>{stageLabel(caseData.stage)}</div>
              </div>
              <div>
                <span className="label">Overall Alerts</span>
                <div>{overall.total_alerts ?? 0}</div>
              </div>
              <div>
                <span className="label">Compliance</span>
                <div className={complianceFlagged ? 'important-text' : ''}>
                  {complianceFlagged ? 'Flagged / Non-Compliant' : 'Normal'}
                </div>
              </div>
            </div>

            <div className="case-section">
              <h4>AML Screening Checks</h4>
              {amlChecks.length === 0 && <div className="empty">No AML checks found.</div>}
              {amlChecks.map((check, idx) => (
                <div key={`${check.check}-${idx}`} className={`aml-check-card ${check.important ? 'important-card' : ''}`}>
                  <div className="stage-alert-head">
                    <strong>{check.check}</strong>
                    <span className={check.important ? 'important-text' : ''}>{toLabel(check.status)}</span>
                  </div>
                  <ul className="point-list">
                    <li>{check.detail || 'No details available.'}</li>
                  </ul>
                </div>
              ))}
            </div>

            <div className="case-section">
              <h4>Decision Audit Logs</h4>
              {auditLogs.length === 0 && <div className="empty">No decision logs found.</div>}
              {auditLogs.map((log) => (
                <div key={log.id} className="audit-log-card">
                  <div className="audit-log-head">
                    <strong>{toLabel(log.event_type)}</strong>
                    <span>{log.created_at ? new Date(log.created_at).toLocaleString() : 'n/a'}</span>
                  </div>
                  <ul className="point-list">
                    {auditPoints(log).map((point, pIdx) => (
                      <li key={`${log.id}-${pIdx}`}>{point}</li>
                    ))}
                  </ul>
                  <div className="audit-log-meta">
                    <span className="hash">Hash: {log.log_hash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [cases, setCases] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    flagged: 0,
    normal: 0,
    completed: 0,
    in_progress: 0,
    avg_risk: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseDetails, setCaseDetails] = useState(null);
  const [caseLoading, setCaseLoading] = useState(false);
  const [caseError, setCaseError] = useState('');

  const toModuleId = (moduleName) =>
    String(moduleName || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const fetchDashboardData = async () => {
    try {
      // Ensure the token is valid, refreshing if it expires in less than 30 seconds
      await keycloak.updateToken(30);
      
      const headers = {
        'Authorization': `Bearer ${keycloak.token}`
      };

      const [casesResp, summaryResp] = await Promise.all([
        fetch(`${BACKEND_URL}/hitl/cases?include_in_progress=true`, { headers }),
        fetch(`${BACKEND_URL}/hitl/summary?include_in_progress=true`, { headers }),
      ]);

      if (!casesResp.ok) {
        throw new Error(`HITL cases API failed (${casesResp.status})`);
      }
      if (!summaryResp.ok) {
        throw new Error(`HITL summary API failed (${summaryResp.status})`);
      }

      const casesPayload = await casesResp.json();
      const summaryPayload = await summaryResp.json();

      setCases(Array.isArray(casesPayload?.cases) ? casesPayload.cases : []);
      setSummary(summaryPayload || {});
      setLoadError('');
    } catch (err) {
      console.error('HITL dashboard load error:', err);
      setLoadError(err?.message || 'Unable to load HITL dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const timer = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(timer);
  }, []);

  const moduleOptions = useMemo(() => {
    const names = Array.from(new Set(cases.map((row) => row.module).filter(Boolean)));
    return names.map((label) => ({ id: toModuleId(label), label }));
  }, [cases]);

  const statusOptions = useMemo(() => {
    const statuses = Array.from(new Set(cases.map((row) => row.status).filter(Boolean)));
    return statuses.map((label) => ({ id: label.toLowerCase(), label }));
  }, [cases]);

  const filteredData = useMemo(() => {
    return cases.filter((row) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        String(row.obligation || '').toLowerCase().includes(searchLower) ||
        String(row.id || '').toLowerCase().includes(searchLower) ||
        String(row.module || '').toLowerCase().includes(searchLower) ||
        String(row.jurisdiction || '').toLowerCase().includes(searchLower) ||
        String(row.decision_action || '').toLowerCase().includes(searchLower) ||
        String(row.full_name || '').toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = selectedStatuses.length === 0 ||
        selectedStatuses.includes(String(row.status || '').toLowerCase());

      // Module filter
      const matchesModule = selectedModules.length === 0 ||
        selectedModules.includes(toModuleId(row.module));

      return matchesSearch && matchesStatus && matchesModule;
    });
  }, [cases, searchTerm, selectedStatuses, selectedModules]);

  useEffect(() => {
    if (selectAll) {
      setSelectedRows(filteredData.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  }, [selectAll, filteredData]);

  const handleStatusChange = (statusId) => {
    setSelectedStatuses((prev) =>
      prev.includes(statusId)
        ? prev.filter((s) => s !== statusId)
        : [...prev, statusId]
    );
  };

  const handleModuleChange = (moduleId) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((m) => m !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSelectRow = (rowId) => {
    setSelectedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  const handleSelectAllChange = (checked) => {
    setSelectAll(checked);
  };

  const handleOpenDetails = async (row) => {
    const sessionId = row?.session_id;
    if (!sessionId) {
      return;
    }

    setSelectedCase(row);
    setCaseLoading(true);
    setCaseError('');
    try {
      await keycloak.updateToken(30);
      const headers = {
        'Authorization': `Bearer ${keycloak.token}`
      };
      const resp = await fetch(`${BACKEND_URL}/hitl/cases/${encodeURIComponent(sessionId)}/details`, { headers });
      if (!resp.ok) {
        throw new Error(`Failed to load details (${resp.status})`);
      }
      const payload = await resp.json();
      setCaseDetails(payload);
    } catch (err) {
      console.error('Case details load error:', err);
      setCaseError(err?.message || 'Unable to fetch case details.');
      setCaseDetails(null);
    } finally {
      setCaseLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedCase(null);
    setCaseDetails(null);
    setCaseError('');
    setCaseLoading(false);
  };

  return (
    <div className="app-header">
      <div style={{ position: 'relative' }}>
        <Header />
        <button 
          onClick={() => keycloak.logout()}
          style={{ position: 'absolute', top: '16px', right: '16px', padding: '6px 12px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', zIndex: 100 }}
        >
          Logout
        </button>
      </div>
      <AccuEntryNavbar />
      <div className="bottom-section">
            <div className="metrics-card">
              <div className="card-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18" />
                  <path d="M18 17V9" />
                  <path d="M13 17V5" />
                  <path d="M8 17v-3" />
                </svg>
                <h3>System Reliability Index</h3>
              </div>
              <div className="metrics-grid">
                <div className="metric-item">
                  <div className="metric-label">Total Cases</div>
                  <div className="metric-value blue">{summary.total ?? 0}</div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">Flagged Cases</div>
                  <div className="metric-value green">{summary.flagged ?? 0}</div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">Avg Risk</div>
                  <div className="metric-value">{summary.avg_risk ?? 0}</div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">Completed</div>
                  <div className="metric-value">{summary.completed ?? 0}</div>
                </div>
              </div>
            </div>

            <div className="trends-card">
              <h3 className="card-header" style={{ marginBottom: '16px' }}>Compliance Trends</h3>
              <div className="trend-item">
                <div className="trend-header">
                  <span className="trend-label">Normal Activations</span>
                  <span className="trend-value positive">{summary.normal ?? 0}</span>
                </div>
                <div className="trend-bar">
                  <div
                    className="trend-fill blue"
                    style={{ width: `${summary.total ? Math.round(((summary.normal || 0) / summary.total) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>
              <div className="trend-item">
                <div className="trend-header">
                  <span className="trend-label">In Progress</span>
                  <span className="trend-value positive">{summary.in_progress ?? 0}</span>
                </div>
                <div className="trend-bar">
                  <div
                    className="trend-fill yellow"
                    style={{ width: `${summary.total ? Math.round(((summary.in_progress || 0) / summary.total) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>
              <button className="view-analytics-btn" onClick={fetchDashboardData}>REFRESH LIVE DATA</button>
            </div>
          </div>
    <div className="app">
      <Sidebar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatuses={selectedStatuses}
        onStatusChange={handleStatusChange}
        selectedModules={selectedModules}
        onModuleChange={handleModuleChange}
        statusOptions={statusOptions}
        modulesData={moduleOptions}
      />
      <main className="main-content">
        <Topbar
          selectAll={selectAll}
          onSelectAllChange={handleSelectAllChange}
          onExpandAll={fetchDashboardData}
        />
        <div className="content-area">
          {loadError && (
            <div style={{ color: '#dc2626', marginBottom: '12px', fontWeight: 600 }}>
              {loadError}
            </div>
          )}
          {loading && (
            <div style={{ color: '#334155', marginBottom: '12px' }}>
              Loading HITL dashboard data...
            </div>
          )}
          <Table
            data={filteredData}
            selectedRows={selectedRows}
            onSelectRow={handleSelectRow}
            selectAll={selectAll}
            onOpenDetails={handleOpenDetails}
          />

          <CaseDetailsModal
            isOpen={Boolean(selectedCase)}
            onClose={handleCloseDetails}
            loading={caseLoading}
            error={caseError}
            details={caseDetails || { case: selectedCase }}
          />
        </div>
      </main>
    </div>
    </div>

  );
}

export default App;
