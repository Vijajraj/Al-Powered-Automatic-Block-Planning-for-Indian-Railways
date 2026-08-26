export default function KpiCard({ label, value, icon: Icon, color = 'amber', sub }) {
  const colors = {
    amber:  { text: 'text-amber-700',   border: 'border-t-amber-500',   bg: 'bg-amber-100 text-amber-800' },
    blue:   { text: 'text-sky-800',     border: 'border-t-sky-600',     bg: 'bg-sky-100 text-sky-800' },
    emerald:{ text: 'text-emerald-700', border: 'border-t-emerald-600', bg: 'bg-emerald-100 text-emerald-800' },
    rose:   { text: 'text-rose-700',    border: 'border-t-rose-600',    bg: 'bg-rose-100 text-rose-800' },
    slate:  { text: 'text-slate-800',   border: 'border-t-slate-600',   bg: 'bg-slate-100 text-slate-700' },
  };
  const c = colors[color] || colors.amber;

  return (
    <div className={`gov-card border-t-4 ${c.border} p-4 flex flex-col gap-2 bg-white`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
        {Icon && (
          <span className={`w-8 h-8 flex items-center justify-center rounded ${c.bg}`}>
            <Icon size={16} />
          </span>
        )}
      </div>
      <div className={`text-3xl font-mono font-extrabold ${c.text}`}>{value ?? '—'}</div>
      {sub && <div className="text-[11px] text-slate-500 font-medium">{sub}</div>}
    </div>
  );
}
