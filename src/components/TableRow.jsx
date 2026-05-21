import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import StatusBadge from './common/StatusBadge';
import ComplianceBadge from './common/ComplianceBadge';
import { cn } from '../lib/cn';

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 30 },
  },
};

function TableRow({ row, isSelected, onSelect, onOpenDetails }) {
  const getDueClass = (due) => {
    if (due === 'Overdue') return 'text-citi-red font-semibold';
    if (due === 'Expired') return 'text-amber-600 font-semibold';
    return 'text-gray-600';
  };

  return (
    <motion.tr
      variants={rowVariants}
      whileHover={{ backgroundColor: 'rgba(232, 244, 253, 0.5)' }}
      className={cn(
        'border-b border-gray-100 transition-colors',
        isSelected && 'bg-citi-light-blue/60'
      )}
    >
      <td className="px-4 py-3.5 pl-5">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-citi-blue focus:ring-citi-blue/30"
          checked={isSelected}
          onChange={() => onSelect(row.id)}
        />
      </td>
      <td className="px-4 py-3.5">
        <motion.button
          type="button"
          whileHover={{ x: 2 }}
          className="font-semibold text-citi-blue transition-colors hover:text-citi-dark-blue hover:underline"
          onClick={() => onOpenDetails(row)}
        >
          {row.full_name || 'N/A'}
        </motion.button>
      </td>
      <td className="px-4 py-3.5">
        <StatusBadge status={row.status} />
      </td>
      <td className="px-4 py-3.5 font-mono text-xs text-gray-500">{row.id}</td>
      <td className="px-4 py-3.5 text-sm text-gray-600">{row.module}</td>
      <td className="px-4 py-3.5 text-sm text-gray-600">{row.jurisdiction}</td>
      <td className="px-4 py-3.5">
        <button
          type="button"
          onClick={() => onOpenDetails(row)}
          className={cn(
            'flex items-center gap-1 text-sm transition-colors',
            row.alerts > 0
              ? 'font-medium text-citi-red hover:text-red-700'
              : 'text-gray-400'
          )}
        >
          {row.alerts > 0 && <AlertTriangle className="h-3.5 w-3.5" aria-hidden />}
          {row.alerts > 0 ? `${row.alerts} Alerts` : '0 Alerts'}
        </button>
      </td>
      <td className="px-4 py-3.5 text-sm text-gray-600">{row.stage || 'N/A'}</td>
      <td className="px-4 py-3.5">
        <ComplianceBadge compliance={row.compliance} />
      </td>
      <td className="px-4 py-3.5">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
          style={{ backgroundColor: row.ownerColor || '#056dae' }}
        >
          {row.owner}
        </div>
      </td>
      <td className={cn('px-4 py-3.5 text-sm', getDueClass(row.due))}>{row.due}</td>
    </motion.tr>
  );
}

export default TableRow;
