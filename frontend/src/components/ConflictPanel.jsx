import { AlertTriangle, CheckCircle2, RefreshCw, ShieldAlert } from 'lucide-react';

export default function ConflictPanel({ conflicts = [], resolved = false, onOptimize, loading }) {
  if (!conflicts.length) return null;

  return (
    <div className={`gov-card p-4 space-y-4 ${resolved ? 'border-emerald-300 bg-emerald-50/70' : 'border-rose-300 bg-rose-50/70'}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className={`flex items-center gap-2 font-extrabold text-sm ${resolved ? 'text-emerald-800' : 'text-rose-800'}`}>
          {resolved ? <CheckCircle2 size={18} className="text-emerald-600" /> : <AlertTriangle size={18} className="text-rose-600" />}
          <span className="uppercase tracking-wider">
            {resolved ? 'CONFLICTS RESOLVED — SAFE SEPARATION ACHIEVED' : `${conflicts.length} CONFLICT DETECTED IN TIMETABLE`}
          </span>
        </div>
        {!resolved && (
          <button
            onClick={onOptimize}
            disabled={loading}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-extrabold rounded border border-amber-600 transition flex items-center gap-1.5 shadow-sm uppercase tracking-wider cursor-pointer"
          >
            {loading ? <RefreshCw size={13} className="animate-spin" /> : null}
            {loading ? 'Optimizing…' : '▶ OPTIMIZE PLAN'}
          </button>
        )}
      </div>

      {/* Conflict cards */}
      <div className="space-y-3">
        {conflicts.map((c, i) => (
          <div key={i} className={`rounded border text-xs ${resolved ? 'border-emerald-200 bg-white' : 'border-rose-200 bg-white'} p-3.5 space-y-2.5 shadow-sm`}>
            {resolved ? (
              /* Resolved view */
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="text-slate-500 uppercase text-[10px] font-bold mb-1">Sanctioned Block {c.request}</div>
                  <div className="font-mono font-extrabold text-emerald-800 text-sm">
                    {c.resolvedTime || '14:45–15:45'}
                  </div>
                  <div className="text-[10px] text-slate-600 mt-0.5">Engineering Track Renewal</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="text-slate-500 uppercase text-[10px] font-bold mb-1">Scheduled Movement: {c.train}</div>
                  <div className="font-mono text-sky-800 font-extrabold text-sm">{c.trainTime}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">Cheran Express (Down Line)</div>
                </div>
                <div className="col-span-2 flex items-center justify-between bg-emerald-100/90 px-3 py-1.5 rounded border border-emerald-300">
                  <span className="text-emerald-900 text-xs font-medium">Interlocking Feasibility:</span>
                  <span className="text-emerald-900 font-bold font-mono">STATUS: FEASIBLE — Safe Buffer Maintained</span>
                </div>
              </div>
            ) : (
              /* Conflict view */
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-rose-50/60 p-2.5 rounded border border-rose-200">
                    <div className="text-rose-800 uppercase text-[10px] font-bold mb-1">Requested Maintenance Block {c.request}</div>
                    <div className="font-mono font-extrabold text-rose-800 text-sm">{c.requestTime}</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">Engineering (Section A-B)</div>
                  </div>
                  <div className="bg-rose-50/60 p-2.5 rounded border border-rose-200">
                    <div className="text-rose-800 uppercase text-[10px] font-bold mb-1">Conflicting Movement: {c.train}</div>
                    <div className="font-mono text-slate-900 font-extrabold text-sm">{c.trainTime}</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">Passenger Service (Section A-B)</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-rose-100 rounded p-2.5 border border-rose-300 text-xs text-rose-900 font-medium">
                  <ShieldAlert size={15} className="text-rose-700 mt-0.5 shrink-0" />
                  <span>{c.reason}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
