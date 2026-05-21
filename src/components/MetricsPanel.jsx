import { motion } from 'framer-motion';
import { BarChart3, Briefcase, Flag, Gauge, CheckCircle2 } from 'lucide-react';
import MetricCard from './common/MetricCard';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

export default function MetricsPanel({ summary, loading }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg shadow-gray-200/50"
    >
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-citi-light-blue">
          <BarChart3 className="h-5 w-5 text-citi-blue" aria-hidden />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-citi-dark-blue">System Reliability Index</h3>
          <p className="text-xs text-gray-500">Real-time compliance metrics</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-4"
        >
          <MetricCard label="Total Cases" value={summary.total ?? 0} icon={Briefcase} color="blue" />
          <MetricCard label="Flagged Cases" value={summary.flagged ?? 0} icon={Flag} color="green" />
          <MetricCard label="Avg Risk" value={summary.avg_risk ?? 0} icon={Gauge} color="slate" />
          <MetricCard label="Completed" value={summary.completed ?? 0} icon={CheckCircle2} color="gold" />
        </motion.div>
      )}
    </motion.div>
  );
}
