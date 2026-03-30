export const obligationsData = [
  {
    id: 'SC-PDP-001',
    obligation: 'Privacy and Data Protection Framework',
    status: 'Active',
    module: 'Data Privacy',
    jurisdiction: 'United Kingdom',
    alerts: 2,
    compliance: 'Compliant',
    owner: 'JD',
    ownerColor: '#3b82f6',
    due: '12 Oct 2024'
  },
  {
    id: 'SC-RRK-042',
    obligation: 'Reporting and Record Keeping Standards',
    status: 'Active',
    module: 'Risk Mgmt',
    jurisdiction: 'Global',
    alerts: 0,
    compliance: 'Pending',
    owner: 'MK',
    ownerColor: '#22c55e',
    due: '05 Nov 2024'
  },
  {
    id: 'SC-ABC-119',
    obligation: 'Anti-Bribery and Corruption Policy',
    status: 'Inactive',
    module: 'Legal',
    jurisdiction: 'EU Regs',
    alerts: 0,
    compliance: 'N/A',
    owner: 'TS',
    ownerColor: '#f59e0b',
    due: 'Expired'
  },
  {
    id: 'SC-AIR-009',
    obligation: 'AI Recruitment Ethics Audit',
    status: 'Active',
    module: 'Emerging Tech',
    jurisdiction: 'United States',
    alerts: 14,
    compliance: 'Non-Compliant',
    owner: 'RB',
    ownerColor: '#6366f1',
    due: 'Overdue'
  },
  {
    id: 'SC-ESG-882',
    obligation: 'ESG Transparency Reporting',
    status: 'Active',
    module: 'Sustainability',
    jurisdiction: 'Global',
    alerts: 0,
    compliance: 'Compliant',
    owner: 'AL',
    ownerColor: '#ec4899',
    due: '30 Dec 2024'
  },
  {
    id: 'SC-AML-203',
    obligation: 'Customer Due Diligence Procedures',
    status: 'Active',
    module: 'AML/CTF',
    jurisdiction: 'United States',
    alerts: 5,
    compliance: 'Pending',
    owner: 'CP',
    ownerColor: '#14b8a6',
    due: '15 Jan 2025'
  },
  {
    id: 'SC-AML-204',
    obligation: 'Ongoing Customer Due Diligence',
    status: 'Active',
    module: 'AML/CTF',
    jurisdiction: 'Global',
    alerts: 3,
    compliance: 'Non-Compliant',
    owner: 'DW',
    ownerColor: '#8b5cf6',
    due: '28 Feb 2025'
  },
  {
    id: 'SC-PDP-045',
    obligation: 'Data Subject Access Request Protocol',
    status: 'Pending',
    module: 'Data Privacy',
    jurisdiction: 'European Union',
    alerts: 0,
    compliance: 'Pending',
    owner: 'EF',
    ownerColor: '#f97316',
    due: '10 Mar 2025'
  },
  {
    id: 'SC-ESG-110',
    obligation: 'Carbon Footprint Disclosure',
    status: 'Active',
    module: 'Sustainability',
    jurisdiction: 'United Kingdom',
    alerts: 1,
    compliance: 'Compliant',
    owner: 'GH',
    ownerColor: '#06b6d4',
    due: '22 Apr 2025'
  },
  {
    id: 'SC-ABC-078',
    obligation: 'Third Party Risk Assessment',
    status: 'Inactive',
    module: 'Legal',
    jurisdiction: 'Global',
    alerts: 0,
    compliance: 'N/A',
    owner: 'IJ',
    ownerColor: '#84cc16',
    due: 'Expired'
  },
  {
    id: 'SC-AIR-015',
    obligation: 'Algorithmic Bias Testing',
    status: 'Active',
    module: 'Emerging Tech',
    jurisdiction: 'European Union',
    alerts: 8,
    compliance: 'Non-Compliant',
    owner: 'KL',
    ownerColor: '#ef4444',
    due: 'Overdue'
  },
  {
    id: 'SC-RRK-089',
    obligation: 'Transaction Monitoring Reports',
    status: 'Active',
    module: 'Risk Mgmt',
    jurisdiction: 'United States',
    alerts: 0,
    compliance: 'Compliant',
    owner: 'MN',
    ownerColor: '#a855f7',
    due: '18 May 2025'
  }
];

export const modulesData = [
  { id: 'ai', label: 'AI and Recruitment' },
  { id: 'abc', label: 'Anti-Bribery & Corruption' },
  { id: 'aml', label: 'Anti-Money Laundering' },
  { id: 'pdp', label: 'Privacy & Data Protection' },
  { id: 'esg', label: 'ESG Compliance' }
];

export const statusOptions = [
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Inactive' },
  { id: 'pending', label: 'Pending' }
];
