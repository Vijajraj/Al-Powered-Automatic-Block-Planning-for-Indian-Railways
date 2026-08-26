import { useEffect, useState } from 'react';
import { AlertTriangle, Clock, Wrench, ArrowRight, RefreshCw } from 'lucide-react';
import GanttChart from '../components/GanttChart';
import StatusBadge from '../components/StatusBadge';
import useAppStore from '../store/appStore';
import { fetchTrains, fetchMaintenance, applyDisruption } from '../api/client';

export default function DisruptionsPage() {
  const { trains, maintenance, disruptionResult, setTrains, setMaintenance, setDisruptionResult, setLoading, isLoading } = useAppStore();

  // Delay simulation state
  const [delayTrain, setDelayTrain] = useState('');
  const [delayMins, setDelayMins] = useState(20);
  const [delayApplied, setDelayApplied] = useState(false);
  const [delayResult, setDelayResult] = useState(null);
  const [replanning, setReplanning] = useState(false);

  // Overrun simulation state
  const [overrunReq, setOverrunReq] = useState('');
  const [overrunMins, setOverrunMins] = useState(30);
  const [overrunApplied, setOverrunApplied] = useState(false);
  const [overrunResult, setOverrunResult] = useState(null);
  const [overrunReplanning, setOverrunReplanning] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading('dis', true);
      const [t, m] = await Promise.all([fetchTrains(), fetchMaintenance()]);
      setTrains(t);
      setMaintenance(m);
      if (!delayTrain && t.length) setDelayTrain(t[0].id);
      if (!overrunReq && m.length) setOverrunReq(m[0].id);
      setLoading('dis', false);
    }
    if (!trains.length || !maintenance.length) load();
    else {
      if (!delayTrain && trains.length) setDelayTrain(trains[0].id);
      if (!overrunReq && maintenance.length) setOverrunReq(maintenance[0].id);
    }
  }, [trains.length, maintenance.length]);

  // ── Train Delay handlers ──────────────────────────────────────────────────
  async function handleApplyDelay() {
    setDelayApplied(true);
    setDelayResult(null);
  }

  async function handleReplanDelay() {
    setReplanning(true);
    const result = await applyDisruption({
      current_plan: [],
      disruption: { type: 'delay', train: delayTrain, minutes: delayMins },
    });
    setDelayResult(result);
    setReplanning(false);
  }

  // ── Overrun handlers ──────────────────────────────────────────────────────
  async function handleApplyOverrun() {
    setOverrunApplied(true);
    setOverrunResult(null);
  }

  async function handleReplanOverrun() {
    setOverrunReplanning(true);
    const result = await applyDisruption({
      current_plan: [],
      disruption: { type: 'overrun', request: overrunReq, minutes: overrunMins },
    });
    setOverrunResult(result);
    setOverrunReplanning(false);
  }

  const selectedTrain = trains.find(t => t.id === delayTrain);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#334155] pb-3">
        <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">Disruption Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">Simulate real-world disruptions and demonstrate Detect → Re-slot → Update flow</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── SECTION 1: Train Delay ───────────────────────────── */}
        <div className="bg-[#1e293b] border border-[#334155] rounded p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#334155] pb-3">
            <Clock size={14} className="text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Simulate Train Delay</span>
          </div>

          {/* Input controls */}
          <div className="space-y-3 text-xs">
            <label className="block">
              <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Select Train</span>
              <select
                value={delayTrain}
                onChange={e => setDelayTrain(e.target.value)}
                className="mt-1 w-full bg-[#0f172a] border border-[#334155] text-slate-200 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-amber-500"
              >
                {trains.map(t => <option key={t.id} value={t.id}>{t.name} ({t.section})</option>)}
              </select>
            </label>

            <label className="block">
              <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                Delay: <span className="text-amber-400 font-mono">+{delayMins} minutes</span>
              </span>
              <input
                type="range" min={5} max={60} step={5}
                value={delayMins}
                onChange={e => setDelayMins(+e.target.value)}
                className="mt-1 w-full accent-amber-500"
              />
              <div className="flex justify-between text-[9px] text-slate-600 mt-0.5">
                <span>5 min</span><span>60 min</span>
              </div>
            </label>

            <button
              onClick={handleApplyDelay}
              className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold rounded transition flex items-center justify-center gap-1.5"
            >
              <AlertTriangle size={13} /> APPLY DISRUPTION
            </button>
          </div>

          {/* After applying */}
          {delayApplied && !delayResult && (
            <div className="rounded border border-rose-700 bg-rose-950/40 p-3 space-y-3">
              <div className="font-bold text-rose-400 text-xs flex items-center gap-1.5">
                <AlertTriangle size={13} /> DISRUPTION DETECTED
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Affected Block:</span>
                  <span className="text-rose-300 font-mono font-bold">M001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Conflict:</span>
                  <span className="text-rose-400 font-bold">YES</span>
                </div>
                <div className="text-slate-500 text-[10px]">
                  {selectedTrain?.name} delayed +{delayMins} min → overlaps Engineering block M001 on {selectedTrain?.section}
                </div>
              </div>
              <button
                onClick={handleReplanDelay}
                disabled={replanning}
                className="w-full py-1.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-bold rounded transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={12} className={replanning ? 'animate-spin' : ''} />
                {replanning ? 'Re-planning…' : 'RE-PLAN'}
              </button>
            </div>
          )}

          {/* After replanning */}
          {delayResult && (
            <div className="rounded border border-blue-700 bg-blue-950/30 p-3 space-y-2">
              <div className="font-bold text-blue-400 text-xs">RE-PLAN RESULT</div>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="bg-[#1e293b] rounded p-2 border border-[#334155]">
                  <div className="text-slate-500 uppercase font-bold">Original</div>
                  <div className="font-mono text-slate-300 font-bold mt-1">{delayResult.original_slot}</div>
                </div>
                <div className="flex items-center justify-center"><ArrowRight size={14} className="text-slate-500" /></div>
                <div className="bg-[#1e293b] rounded p-2 border border-blue-700">
                  <div className="text-slate-500 uppercase font-bold">Updated</div>
                  <div className="font-mono text-blue-300 font-bold mt-1">{delayResult.updated_plan?.[0]?.start}–{delayResult.updated_plan?.[0]?.end}</div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-[#334155]">
                <span className="text-xs text-slate-500">Status:</span>
                <StatusBadge status="Re-slotted" />
              </div>
            </div>
          )}
        </div>

        {/* ── SECTION 2: Maintenance Overrun ──────────────────── */}
        <div className="bg-[#1e293b] border border-[#334155] rounded p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#334155] pb-3">
            <Wrench size={14} className="text-violet-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Simulate Maintenance Overrun</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="block">
              <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Select Request</span>
              <select
                value={overrunReq}
                onChange={e => setOverrunReq(e.target.value)}
                className="mt-1 w-full bg-[#0f172a] border border-[#334155] text-slate-200 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-amber-500"
              >
                {maintenance.map(m => <option key={m.id} value={m.id}>{m.id} — {m.department} ({m.section})</option>)}
              </select>
            </label>

            <label className="block">
              <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                Additional Time: <span className="text-violet-400 font-mono">+{overrunMins} minutes</span>
              </span>
              <input
                type="range" min={10} max={60} step={5}
                value={overrunMins}
                onChange={e => setOverrunMins(+e.target.value)}
                className="mt-1 w-full accent-violet-500"
              />
              <div className="flex justify-between text-[9px] text-slate-600 mt-0.5">
                <span>10 min</span><span>60 min</span>
              </div>
            </label>

            <button
              onClick={handleApplyOverrun}
              className="w-full py-2 bg-violet-700 hover:bg-violet-600 text-white font-bold rounded transition flex items-center justify-center gap-1.5"
            >
              <Wrench size={13} /> APPLY
            </button>
          </div>

          {/* After applying overrun */}
          {overrunApplied && !overrunResult && (
            <div className="rounded border border-rose-700 bg-rose-950/40 p-3 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-[#1e293b] p-2 rounded border border-[#334155]">
                  <div className="text-slate-500 uppercase font-bold">Original</div>
                  <div className="font-mono text-slate-300 mt-1">14:45–15:45</div>
                </div>
                <div className="bg-rose-950/60 p-2 rounded border border-rose-700">
                  <div className="text-slate-500 uppercase font-bold">Actual End</div>
                  <div className="font-mono text-rose-300 font-bold mt-1">
                    {/* Compute actual end from overrun */}
                    {(() => {
                      const base = 45 + 60; // 15:45 = 945 min
                      const extra = 945 + overrunMins;
                      const h = Math.floor(extra / 60);
                      const m = extra % 60;
                      return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
                    })()}
                  </div>
                </div>
              </div>
              <div className="font-bold text-rose-400 text-xs flex items-center gap-1.5">
                <AlertTriangle size={13} /> CONFLICT DETECTED — Downstream train affected
              </div>
              <button
                onClick={handleReplanOverrun}
                disabled={overrunReplanning}
                className="w-full py-1.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-bold rounded transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={12} className={overrunReplanning ? 'animate-spin' : ''} />
                {overrunReplanning ? 'Re-planning…' : 'RE-PLAN'}
              </button>
            </div>
          )}

          {/* After overrun replan */}
          {overrunResult && (
            <div className="rounded border border-blue-700 bg-blue-950/30 p-3 space-y-2">
              <div className="font-bold text-blue-400 text-xs">UPDATED PLAN</div>
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-[#334155]">
                    {['Block', 'Dept', 'New Start', 'New End', 'Status'].map(h => (
                      <th key={h} className="text-left py-1 text-slate-500 font-bold uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {overrunResult.updated_plan?.map(p => (
                    <tr key={p.id} className="border-b border-[#263348]">
                      <td className="py-1.5 font-mono font-bold text-amber-400">{p.id}</td>
                      <td className="py-1.5 text-slate-400">{p.department}</td>
                      <td className="py-1.5 font-mono text-emerald-400">{p.start}</td>
                      <td className="py-1.5 font-mono text-rose-400">{p.end}</td>
                      <td className="py-1.5"><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Updated Gantt after any replan */}
      {(delayResult || overrunResult) && (
        <GanttChart
          trains={trains}
          plan={(delayResult?.updated_plan || overrunResult?.updated_plan || [])}
          title="Updated Block Timeline — Post Re-plan"
        />
      )}
    </div>
  );
}
