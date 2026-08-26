const cfg = {
  Critical: 'bg-rose-900/60 text-rose-300 border border-rose-700',
  High:     'bg-amber-900/60 text-amber-300 border border-amber-700',
  Medium:   'bg-blue-900/60 text-blue-300 border border-blue-700',
  Low:      'bg-slate-700/60 text-slate-300 border border-slate-600',
  Pending:  'bg-amber-900/40 text-amber-300 border border-amber-700',
  Planned:  'bg-blue-900/40 text-blue-300 border border-blue-700',
  APPROVED: 'bg-emerald-900/60 text-emerald-300 border border-emerald-700',
  Approved: 'bg-emerald-900/60 text-emerald-300 border border-emerald-700',
  Feasible: 'bg-emerald-900/40 text-emerald-300 border border-emerald-700',
  'Re-slotted': 'bg-blue-900/60 text-blue-300 border border-blue-700',
  Overrun:  'bg-rose-900/60 text-rose-300 border border-rose-700',
  ONLINE:   'bg-emerald-900/60 text-emerald-300 border border-emerald-700',
  PASSED:   'bg-emerald-900/60 text-emerald-300 border border-emerald-700',
  FAILED:   'bg-rose-900/60 text-rose-300 border border-rose-700',
};

export default function StatusBadge({ status }) {
  const cls = cfg[status] || 'bg-slate-700/60 text-slate-300 border border-slate-600';
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-bold uppercase tracking-wide ${cls}`}>
      {status}
    </span>
  );
}
