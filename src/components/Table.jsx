import React, { useState } from 'react';
import TableRow from './TableRow.jsx';
import '../styles/Table.css';

function Table({ data, selectedRows, onSelectRow, selectAll, onOpenDetails }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                className="row-checkbox"
                checked={selectAll}
                readOnly
              />
            </th>
            <th>CUSTOMER NAME</th>
            <th>STATUS</th>
            <th>ID</th>
            <th>MODULE</th>
            <th>JURISDICTION</th>
            <th>ALERTS</th>
            <th>TOOLS</th>
            <th>COMPLIANCE</th>
            <th>OWNER</th>
            <th>DUE</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row) => (
            <TableRow
              key={row.id}
              row={row}
              isSelected={selectedRows.includes(row.id)}
              onSelect={onSelectRow}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <span className="showing-text">
          SHOWING {startIndex + 1} TO {Math.min(endIndex, data.length)} OF {data.length} CUSTOMERS
        </span>
        <div className="pagination">
          <button 
            className="pagination-btn" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {'<'}
          </button>
          {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button 
            className="pagination-btn" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Table;
