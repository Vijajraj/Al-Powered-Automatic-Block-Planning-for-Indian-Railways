export default function KpiCard({ label, value, icon: Icon, color = 'amber', sub }) {
  const colors = {
    amber:  { text: 'text-amber-400',   border: 'border-t-amber-500',   bg: 'bg-amber-500/10' },
    blue:   { text: 'text-sky-400',     border: 'border-t-sky-500',     bg: 'bg-sky-500/10' },
    emerald:{ text: 'text-emerald-400', border: 'border-t-emerald-500', bg: 'bg-emerald-500/10' },
    rose:   { text: 'text-rose-400',    border: 'border-t-rose-500',    bg: 'bg-rose-500/10' },
    slate:  { text: 'text-slate-300',   border: 'border-t-slate-500',   bg: 'bg-slate-700/30' },
  };
  const c = colors[color] || colors.amber;

  return (
    <div className={`gov-card border-t-4 ${c.border} p-4 flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
        {Icon && (
          <span className={`w-7 h-7 flex items-center justify-center rounded ${c.bg}`}>
            <Icon size={14} className={c.text} />
          </span>
        )}
      </div>
      <div className={`text-3xl font-mono font-extrabold ${c.text}`}>{value ?? '—'}</div>
      {sub && <div className="text-[11px] text-slate-400 font-medium">{sub}</div>}
    </div>
  );
}
