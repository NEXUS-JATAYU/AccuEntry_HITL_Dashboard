import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

const colorMap = {
  blue: 'text-citi-blue',
  green: 'text-nexus-emerald',
  gold: 'text-nexus-gold',
  slate: 'text-citi-dark-blue',
};

export default function MetricCard({ label, value, icon: Icon, color = 'slate' }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
      }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(5,109,174,0.12)' }}
      className="rounded-xl border border-gray-100 bg-nexus-surface p-4 text-center transition-shadow"
    >
      {Icon && <Icon className="mx-auto mb-2 h-4 w-4 text-gray-400" aria-hidden />}
      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</div>
      <motion.div
        key={value}
        layout
        initial={{ scale: 0.9, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={cn('mt-1 text-2xl font-bold', colorMap[color] || colorMap.slate)}
      >
        {value}
      </motion.div>
    </motion.div>
  );
}
