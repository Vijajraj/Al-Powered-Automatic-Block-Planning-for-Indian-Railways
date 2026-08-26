const cfg = {
  Critical: 'bg-rose-100 text-rose-800 border border-rose-300',
  High:     'bg-amber-100 text-amber-900 border border-amber-300',
  Medium:   'bg-sky-100 text-sky-900 border border-sky-300',
  Low:      'bg-slate-100 text-slate-700 border border-slate-300',
  Pending:  'bg-amber-50 text-amber-800 border border-amber-300',
  Planned:  'bg-sky-50 text-sky-800 border border-sky-300',
  APPROVED: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold',
  Approved: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold',
  Feasible: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
  'Re-slotted': 'bg-sky-100 text-sky-900 border border-sky-300 font-bold',
  Overrun:  'bg-rose-100 text-rose-800 border border-rose-300 font-bold',
  ONLINE:   'bg-emerald-100 text-emerald-800 border border-emerald-300',
  PASSED:   'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold',
  FAILED:   'bg-rose-100 text-rose-800 border border-rose-300 font-bold',
};

export default function StatusBadge({ status }) {
  const cls = cfg[status] || 'bg-slate-100 text-slate-700 border border-slate-300';
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded text-[10.5px] font-bold uppercase tracking-wide ${cls}`}>
      {status}
    </span>
  );
}
