import React from 'react';

function TableRow({ row, isSelected, onSelect, onOpenDetails }) {
  const getStatusClass = (status) => {
    return status.toLowerCase();
  };

  const getComplianceClass = (compliance) => {
    if (compliance === 'Compliant') return 'compliant';
    if (compliance === 'Pending') return 'pending';
    if (compliance === 'Non-Compliant') return 'non-compliant';
    return 'na';
  };

  const getDueClass = (due) => {
    if (due === 'Overdue') return 'overdue';
    if (due === 'Expired') return 'expired';
    return '';
  };

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          className="row-checkbox"
          checked={isSelected}
          onChange={() => onSelect(row.id)}
        />
      </td>
      <td>
        <button
          type="button"
          className="customer-link"
          onClick={() => onOpenDetails(row)}
        >
          {row.full_name || 'N/A'}
        </button>
      </td>
      <td>
        <span className={`status-badge ${getStatusClass(row.status)}`}>
          {row.status}
        </span>
      </td>
      <td>{row.id}</td>
      <td>{row.module}</td>
      <td>{row.jurisdiction}</td>
      <td
        className={`alerts-cell ${row.alerts > 0 ? 'has-alerts' : ''}`}
        onClick={() => onOpenDetails(row)}
      >
        {row.alerts > 0 ? `${row.alerts} Alerts` : '0 Alerts'}
      </td>
      <td className="tools-cell">{row.stage || 'N/A'}</td>
      <td>
        <span className={`compliance-badge ${getComplianceClass(row.compliance)}`}>
          {row.compliance}
        </span>
      </td>
      <td>
        <div 
          className="owner-avatar" 
          style={{ backgroundColor: row.ownerColor }}
        >
          {row.owner}
        </div>
      </td>
      <td className={`due-cell ${getDueClass(row.due)}`}>
        {row.due}
      </td>
    </tr>
  );
}

export default TableRow;
