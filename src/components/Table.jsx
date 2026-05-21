import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TableRow from './TableRow.jsx';
import { cn } from '../lib/cn';

const tbodyVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.02 },
  },
};

function TableSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1 }}
          className="h-12 rounded-lg bg-gray-100"
        />
      ))}
    </div>
  );
}

function Table({ data, selectedRows, onSelectRow, selectAll, onOpenDetails, loading }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    return start + i;
  });

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white">
        <TableSkeleton />
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse">
          <thead>
            <tr className="bg-nexus-navy">
              <th className="w-10 px-5 py-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/30 accent-nexus-gold"
                  checked={selectAll}
                  readOnly
                />
              </th>
              {[
                'Customer Name',
                'Status',
                'ID',
                'Module',
                'Jurisdiction',
                'Alerts',
                'Tools',
                'Compliance',
                'Owner',
                'Due',
              ].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-white/90"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <AnimatePresence mode="wait">
            <motion.tbody
              key={`page-${currentPage}-${data.length}`}
              variants={tbodyVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-16 text-center">
                    <p className="text-sm font-medium text-gray-500">No customers match your filters</p>
                    <p className="mt-1 text-xs text-gray-400">Adjust sidebar filters or search terms</p>
                  </td>
                </tr>
              ) : (
                currentData.map((row) => (
                  <TableRow
                    key={row.id}
                    row={row}
                    isSelected={selectedRows.includes(row.id)}
                    onSelect={onSelectRow}
                    onOpenDetails={onOpenDetails}
                  />
                ))
              )}
            </motion.tbody>
          </AnimatePresence>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/50 px-5 py-3">
        <span className="text-xs font-medium text-gray-500">
          Showing {data.length === 0 ? 0 : startIndex + 1}–{Math.min(endIndex, data.length)} of{' '}
          {data.length} customers
        </span>
        <div className="flex items-center gap-1">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg p-2 text-gray-500 hover:bg-white disabled:opacity-40"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
          {pageNumbers.map((page) => (
            <motion.button
              key={page}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'min-w-[2rem] rounded-lg px-2 py-1.5 text-sm font-medium',
                currentPage === page
                  ? 'bg-citi-blue text-white shadow-sm'
                  : 'text-gray-600 hover:bg-white'
              )}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </motion.button>
          ))}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg p-2 text-gray-500 hover:bg-white disabled:opacity-40"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || data.length === 0}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default Table;
