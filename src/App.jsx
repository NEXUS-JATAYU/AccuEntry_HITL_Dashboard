import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar.jsx';
import DashboardHeader from './components/DashboardHeader.jsx';
import Topbar from './components/Topbar.jsx';
import Table from './components/Table.jsx';
import MetricsPanel from './components/MetricsPanel.jsx';
import ComplianceTrendsCard from './components/ComplianceTrendsCard.jsx';
import CaseDetailsModal from './components/CaseDetailsModal.jsx';
import keycloak from './keycloak.js';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 28 },
  },
};

function App() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
  const HITL_API_KEY = import.meta.env.VITE_HITL_API_KEY || '';

  const hitlHeaders = async () => {
    await keycloak.updateToken(30);
    const headers = { Authorization: `Bearer ${keycloak.token}` };
    if (HITL_API_KEY) headers['X-HITL-API-Key'] = HITL_API_KEY;
    return headers;
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [navbarSearch, setNavbarSearch] = useState('');
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
      const headers = await hitlHeaders();

      // Register employee
      if (keycloak.tokenParsed) {
        try {
          await fetch(`${BACKEND_URL}/hitl/employee/login`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: keycloak.tokenParsed.email || keycloak.tokenParsed.preferred_username || 'manager@accuentry.com',
              name: keycloak.tokenParsed.name || keycloak.tokenParsed.preferred_username || 'Compliance Manager',
            })
          });
        } catch (e) {
          console.error('Employee registration failed:', e);
        }
      }

      const [casesResp, summaryResp] = await Promise.all([
        fetch(`${BACKEND_URL}/hitl/cases?include_in_progress=true`, { headers }),
        fetch(`${BACKEND_URL}/hitl/summary?include_in_progress=true`, { headers }),
      ]);

      if (!casesResp.ok) throw new Error(`HITL cases API failed (${casesResp.status})`);
      if (!summaryResp.ok) throw new Error(`HITL summary API failed (${summaryResp.status})`);

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
    const combinedSearch = [searchTerm, navbarSearch].filter(Boolean).join(' ').toLowerCase() || '';

    return cases.filter((row) => {
      const matchesSearch =
        !combinedSearch ||
        String(row.obligation || '').toLowerCase().includes(combinedSearch) ||
        String(row.id || '').toLowerCase().includes(combinedSearch) ||
        String(row.module || '').toLowerCase().includes(combinedSearch) ||
        String(row.jurisdiction || '').toLowerCase().includes(combinedSearch) ||
        String(row.decision_action || '').toLowerCase().includes(combinedSearch) ||
        String(row.full_name || '').toLowerCase().includes(combinedSearch);

      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(String(row.status || '').toLowerCase());

      const matchesModule =
        selectedModules.length === 0 ||
        selectedModules.includes(toModuleId(row.module));

      return matchesSearch && matchesStatus && matchesModule;
    });
  }, [cases, searchTerm, navbarSearch, selectedStatuses, selectedModules]);

  useEffect(() => {
    if (selectAll) {
      setSelectedRows(filteredData.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  }, [selectAll, filteredData]);

  const handleNavbarSearch = (term) => {
    setNavbarSearch(term);
  };

  const handleStatusChange = (statusId) => {
    setSelectedStatuses((prev) =>
      prev.includes(statusId) ? prev.filter((s) => s !== statusId) : [...prev, statusId]
    );
  };

  const handleModuleChange = (moduleId) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((m) => m !== moduleId) : [...prev, moduleId]
    );
  };

  const handleSelectRow = (rowId) => {
    setSelectAll(false);
    setSelectedRows((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  };

  const handleSelectAllChange = (checked) => {
    setSelectAll(checked);
  };

  const handleOpenDetails = async (row) => {
    const sessionId = row?.session_id;
    if (!sessionId) return;

    setSelectedCase(row);
    setCaseLoading(true);
    setCaseError('');
    try {
      const headers = await hitlHeaders();
      const resp = await fetch(
        `${BACKEND_URL}/hitl/cases/${encodeURIComponent(sessionId)}/details`,
        { headers }
      );
      if (!resp.ok) throw new Error(`Failed to load details (${resp.status})`);
      setCaseDetails(await resp.json());
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
    <div className="min-h-screen bg-nexus-surface-warm">
      <DashboardHeader
        searchValue={navbarSearch}
        onSearchChange={setNavbarSearch}
        onSearch={handleNavbarSearch}
      />

      <motion.div
        className="w-full px-3 py-4 lg:px-5"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Metrics */}
        <motion.div
          variants={sectionVariants}
          className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-2"
        >
          <MetricsPanel summary={summary} loading={loading} />
          <ComplianceTrendsCard summary={summary} onRefresh={fetchDashboardData} />
        </motion.div>

        {/* Main workspace card */}
        <motion.div
          variants={sectionVariants}
          className="flex min-h-[520px] overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xl shadow-nexus-navy/5"
        >
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

          <main className="flex min-w-0 flex-1 flex-col bg-nexus-surface/40">
            <div className="border-b border-gray-200/60 bg-white px-4 py-3">
              <Topbar
                selectAll={selectAll}
                onSelectAllChange={handleSelectAllChange}
                onExpandAll={fetchDashboardData}
                totalCount={filteredData.length}
              />
            </div>

            <div className="flex-1 overflow-auto p-4">
              {loadError && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {loadError}
                </motion.div>
              )}
              <Table
                data={filteredData}
                selectedRows={selectedRows}
                onSelectRow={handleSelectRow}
                selectAll={selectAll}
                onOpenDetails={handleOpenDetails}
                loading={loading}
              />
            </div>
          </main>
        </motion.div>
      </motion.div>

      <CaseDetailsModal
        isOpen={Boolean(selectedCase)}
        onClose={handleCloseDetails}
        loading={caseLoading}
        error={caseError}
        details={caseDetails || { case: selectedCase }}
      />
    </div>
  );
}

export default App;

