import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

export default function TrendBar({ label, count, percent, variant = 'blue' }) {
  const fillClass =
    variant === 'gold'
      ? 'bg-nexus-gold'
      : variant === 'blue'
        ? 'bg-citi-blue'
        : 'bg-amber-400';

  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-semibold text-nexus-navy">{count}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className={cn('h-full rounded-full', fillClass)}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
