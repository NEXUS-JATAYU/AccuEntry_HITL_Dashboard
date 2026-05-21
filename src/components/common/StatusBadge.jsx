import { cn } from '../../lib/cn';

const statusStyles = {
  active: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  pending: 'bg-amber-50 text-amber-800 ring-amber-200',
  inactive: 'bg-gray-100 text-gray-600 ring-gray-200',
  rejected: 'bg-red-50 text-red-800 ring-red-200',
};

export default function StatusBadge({ status }) {
  const key = String(status || '').toLowerCase();
  const style = statusStyles[key] || statusStyles.inactive;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset',
        style
      )}
    >
      {status}
    </span>
  );
}
