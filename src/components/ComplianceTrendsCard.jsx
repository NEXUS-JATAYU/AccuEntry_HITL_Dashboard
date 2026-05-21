import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, TrendingUp } from 'lucide-react';
import TrendBar from './common/TrendBar';
import { cn } from '../lib/cn';

export default function ComplianceTrendsCard({ summary, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false);
  const total = summary.total || 0;
  const normalPct = total ? Math.round(((summary.normal || 0) / total) * 100) : 0;
  const inProgressPct = total ? Math.round(((summary.in_progress || 0) / total) * 100) : 0;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      setTimeout(() => setRefreshing(false), 600);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.05 }}
      className="flex flex-col rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg shadow-gray-200/50"
    >
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-citi-light-blue">
          <TrendingUp className="h-5 w-5 text-citi-blue" aria-hidden />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-citi-dark-blue">Compliance Trends</h3>
          <p className="text-xs text-gray-500">Activation pipeline health</p>
        </div>
      </div>

      <TrendBar
        label="Normal Activations"
        count={summary.normal ?? 0}
        percent={normalPct}
        variant="blue"
      />
      <TrendBar
        label="In Progress"
        count={summary.in_progress ?? 0}
        percent={inProgressPct}
        variant="gold"
      />

      <motion.button
        type="button"
        onClick={handleRefresh}
        disabled={refreshing}
        whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(10,22,40,0.15)' }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-nexus-navy px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-nexus-navy-light disabled:opacity-70'
        )}
      >
        <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} aria-hidden />
        Refresh Live Data
      </motion.button>
    </motion.div>
  );
}
