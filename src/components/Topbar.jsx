import { motion } from 'framer-motion';
import { ChevronDown, Download, Maximize2, ListChecks } from 'lucide-react';

function Topbar({ selectAll, onSelectAllChange, onExpandAll, totalCount = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-citi-blue focus:ring-citi-blue/30"
            checked={selectAll}
            onChange={(e) => onSelectAllChange(e.target.checked)}
          />
          Select All
        </label>

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm transition-colors hover:border-citi-blue/30 hover:text-citi-blue"
        >
          <ListChecks className="h-3.5 w-3.5" aria-hidden />
          Tracked Obligations
          <ChevronDown className="h-3.5 w-3.5" aria-hidden />
        </button>

        <span className="text-xs text-gray-400">
          {totalCount} {totalCount === 1 ? 'record' : 'records'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-citi-blue"
        >
          <Download className="h-4 w-4" aria-hidden />
          Export
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          onClick={onExpandAll}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-citi-blue"
        >
          <Maximize2 className="h-4 w-4" aria-hidden />
          Refresh Table
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Topbar;
