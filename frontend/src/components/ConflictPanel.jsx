import { AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ConflictPanel({ conflicts = [], resolved = false, onOptimize, loading }) {
  if (!conflicts.length) return null;

  return (
    <div className={`rounded border ${resolved ? 'border-emerald-700 bg-emerald-950/30' : 'border-rose-700 bg-rose-950/30'} p-4 space-y-4`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 font-bold text-sm ${resolved ? 'text-emerald-400' : 'text-rose-400'}`}>
          {resolved ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          {resolved ? 'CONFLICTS RESOLVED' : `${conflicts.length} CONFLICT${conflicts.length > 1 ? 'S' : ''} DETECTED`}
        </div>
        {!resolved && (
          <button
            onClick={onOptimize}
            disabled={loading}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 text-xs font-bold rounded border border-amber-600 transition flex items-center gap-1.5"
          >
            {loading ? 'Optimizing…' : '▶ OPTIMIZE PLAN'}
          </button>
        )}
      </div>

      {/* Conflict cards */}
      <div className="space-y-3">
        {conflicts.map((c, i) => (
          <div key={i} className={`rounded border text-xs ${resolved ? 'border-emerald-800 bg-emerald-950/40' : 'border-rose-800 bg-rose-950/40'} p-3 space-y-2`}>
            {resolved ? (
              /* Resolved view */
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-slate-500 uppercase text-[10px] font-bold mb-1">Block {c.request}</div>
                  <div className="font-mono font-bold text-emerald-300">
                    {c.resolvedTime || '14:45–15:45'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 uppercase text-[10px] font-bold mb-1">{c.train}</div>
                  <div className="font-mono text-slate-300">{c.trainTime}</div>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-emerald-400 font-bold">FEASIBLE — No overlap detected</span>
                </div>
              </div>
            ) : (
              /* Conflict view */
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-slate-500 uppercase text-[10px] font-bold mb-1">Maintenance Block {c.request}</div>
                    <div className="font-mono font-bold text-rose-300">{c.requestTime}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 uppercase text-[10px] font-bold mb-1">{c.train}</div>
                    <div className="font-mono text-slate-300">{c.trainTime}</div>
                  </div>
                </div>
                <div className="flex items-start gap-1.5 bg-rose-950/50 rounded p-2 border border-rose-900">
                  <ArrowRight size={10} className="text-rose-400 mt-0.5 shrink-0" />
                  <span className="text-rose-300">{c.reason}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
