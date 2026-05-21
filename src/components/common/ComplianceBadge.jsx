import { cn } from '../../lib/cn';

const complianceStyles = {
  compliant: 'bg-emerald-50 text-emerald-700 ring-emerald-200/60',
  pending: 'bg-amber-50 text-amber-700 ring-amber-200/60',
  'non-compliant': 'bg-red-50 text-red-700 ring-red-200/60',
  na: 'bg-slate-100 text-slate-500 ring-slate-200/60',
};

export default function ComplianceBadge({ compliance }) {
  let key = 'na';
  if (compliance === 'Compliant') key = 'compliant';
  else if (compliance === 'Pending') key = 'pending';
  else if (compliance === 'Non-Compliant') key = 'non-compliant';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset',
        complianceStyles[key]
      )}
    >
      {compliance}
    </span>
  );
}
