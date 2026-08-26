export default function KpiCard({ label, value, icon: Icon, color = 'amber', sub }) {
  const colors = {
    amber:  { text: 'text-amber-400',   border: 'border-t-amber-400',  bg: 'bg-amber-400/10' },
    blue:   { text: 'text-blue-400',    border: 'border-t-blue-400',   bg: 'bg-blue-400/10' },
    emerald:{ text: 'text-emerald-400', border: 'border-t-emerald-400',bg: 'bg-emerald-400/10' },
    rose:   { text: 'text-rose-400',    border: 'border-t-rose-400',   bg: 'bg-rose-400/10' },
    slate:  { text: 'text-slate-300',   border: 'border-t-slate-400',  bg: 'bg-slate-700/30' },
  };
  const c = colors[color] || colors.amber;

  return (
    <div className={`bg-[#1e293b] border border-[#334155] border-t-2 ${c.border} rounded p-4 flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</span>
        {Icon && (
          <span className={`w-7 h-7 flex items-center justify-center rounded ${c.bg}`}>
            <Icon size={14} className={c.text} />
          </span>
        )}
      </div>
      <div className={`text-3xl font-mono font-bold ${c.text}`}>{value ?? '—'}</div>
      {sub && <div className="text-[11px] text-slate-500">{sub}</div>}
    </div>
  );
}
