import { useEffect, useState } from 'react';
import { AlertTriangle, Clock, Wrench, ArrowRight, RefreshCw, ShieldAlert, CheckCircle2 } from 'lucide-react';
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
      {/* Official Header */}
      <div className="border-b border-[#203a5c] pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-white uppercase tracking-wider">
              REAL-TIME DISRUPTION RECOVERY &amp; RE-PLANNING CONSOLE
            </h1>
            <span className="px-2 py-0.5 bg-[#0b1a2d] text-amber-400 border border-[#203a5c] text-[10px] font-mono font-bold rounded">
              MODULE: DETECT ➔ RE-SLOT ➔ UPDATE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational disturbance simulation: Train Traffic Delays &amp; Maintenance Execution Overruns
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-[#0b1a2d] px-3 py-1 rounded border border-[#203a5c]">
          Live Controller Console: MAS-CTRL-04
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── SECTION 1: Train Delay ───────────────────────────── */}
        <div className="gov-card p-5 space-y-4 border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between border-b border-[#203a5c] pb-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-amber-400" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                SCENARIO 1: SIMULATE TRAIN TRAFFIC DELAY
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-[#081526] px-2 py-0.5 rounded border border-[#203a5c]">COA Ingress</span>
          </div>

          {/* Input controls */}
          <div className="space-y-3 text-xs">
            <label className="block">
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">SELECT TRAIN IN CORRIDOR</span>
              <select
                value={delayTrain}
                onChange={e => setDelayTrain(e.target.value)}
                className="mt-1 w-full bg-[#081526] border border-[#203a5c] text-slate-200 text-xs rounded px-2.5 py-2 focus:outline-none focus:border-amber-500 font-medium"
              >
                {trains.map(t => <option key={t.id} value={t.id}>{t.name} — {t.section} ({t.type})</option>)}
              </select>
            </label>

            <label className="block">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>INCURRED DELAY QUANTUM:</span>
                <span className="text-amber-400 font-mono text-xs">+{delayMins} minutes</span>
              </div>
              <input
                type="range" min={5} max={60} step={5}
                value={delayMins}
                onChange={e => setDelayMins(+e.target.value)}
                className="mt-1.5 w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                <span>+5 min (Minor)</span>
                <span>+30 min (Medium)</span>
                <span>+60 min (Major)</span>
              </div>
            </label>

            <button
              onClick={handleApplyDelay}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded transition flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wider cursor-pointer"
            >
              <AlertTriangle size={14} /> APPLY DISRUPTION
            </button>
          </div>

          {/* After applying */}
          {delayApplied && !delayResult && (
            <div className="rounded border border-rose-700 bg-rose-950/50 p-3.5 space-y-3">
              <div className="font-extrabold text-rose-400 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle size={15} /> DISRUPTION DETECTED — OVERLAPPING SANCTIONED BLOCK
              </div>
              <div className="text-xs space-y-1.5 bg-[#102136] p-2.5 rounded border border-rose-900/60">
                <div className="flex justify-between">
                  <span className="text-slate-400">Affected Block ID:</span>
                  <span className="text-rose-300 font-mono font-extrabold">M001 (Engineering Track Renewal)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Conflict Detected:</span>
                  <span className="text-rose-400 font-bold font-mono">YES — DIRECT SECTION OCCUPANCY</span>
                </div>
                <div className="text-slate-400 text-[11px] pt-1 border-t border-[#203a5c]">
                  {selectedTrain?.name} delayed by +{delayMins} min into previously cleared slot on {selectedTrain?.section}.
                </div>
              </div>
              <button
                onClick={handleReplanDelay}
                disabled={replanning}
                className="w-full py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-extrabold rounded transition flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wider cursor-pointer"
              >
                <RefreshCw size={13} className={replanning ? 'animate-spin' : ''} />
                {replanning ? 'Re-calculating Optimal Slot…' : 'RE-PLAN BLOCK SCHEDULE'}
              </button>
            </div>
          )}

          {/* After replanning */}
          {delayResult && (
            <div className="rounded border border-sky-600/70 bg-sky-950/40 p-3.5 space-y-2.5">
              <div className="font-extrabold text-sky-300 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 size={15} className="text-sky-400" /> RE-SLOTTED OPERATIONAL WINDOW
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#0b1a2d] rounded p-2 border border-[#203a5c]">
                  <div className="text-slate-400 uppercase text-[9px] font-bold">Original Slot</div>
                  <div className="font-mono text-slate-300 font-bold mt-1 text-[11px]">{delayResult.original_slot}</div>
                </div>
                <div className="flex items-center justify-center text-slate-500"><ArrowRight size={16} /></div>
                <div className="bg-[#0b1a2d] rounded p-2 border border-sky-600">
                  <div className="text-sky-400 uppercase text-[9px] font-bold">Updated Slot</div>
                  <div className="font-mono text-sky-300 font-bold mt-1 text-[11px]">{delayResult.updated_plan?.[0]?.start}–{delayResult.updated_plan?.[0]?.end}</div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#203a5c]">
                <span className="text-xs text-slate-400">Re-plan Feasibility:</span>
                <StatusBadge status="Re-slotted" />
              </div>
            </div>
          )}
        </div>

        {/* ── SECTION 2: Maintenance Overrun ──────────────────── */}
        <div className="gov-card p-5 space-y-4 border-t-4 border-t-violet-500">
          <div className="flex items-center justify-between border-b border-[#203a5c] pb-3">
            <div className="flex items-center gap-2">
              <Wrench size={16} className="text-violet-400" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                SCENARIO 2: SIMULATE WORK EXECUTION OVERRUN
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-[#081526] px-2 py-0.5 rounded border border-[#203a5c]">Field Unit Notice</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="block">
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">SELECT ACTIVE WORK BLOCK</span>
              <select
                value={overrunReq}
                onChange={e => setOverrunReq(e.target.value)}
                className="mt-1 w-full bg-[#081526] border border-[#203a5c] text-slate-200 text-xs rounded px-2.5 py-2 focus:outline-none focus:border-violet-500 font-medium"
              >
                {maintenance.map(m => <option key={m.id} value={m.id}>{m.id} — {m.department} ({m.section} · {m.workType})</option>)}
              </select>
            </label>

            <label className="block">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>ADDITIONAL WORK TIME REQUIRED:</span>
                <span className="text-violet-400 font-mono text-xs">+{overrunMins} minutes</span>
              </div>
              <input
                type="range" min={10} max={60} step={5}
                value={overrunMins}
                onChange={e => setOverrunMins(+e.target.value)}
                className="mt-1.5 w-full accent-violet-500 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-0.5">
                <span>+10 min (Minor)</span>
                <span>+30 min (Medium)</span>
                <span>+60 min (Major)</span>
              </div>
            </label>

            <button
              onClick={handleApplyOverrun}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-extrabold rounded transition flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wider cursor-pointer"
            >
              <Wrench size={14} /> APPLY WORK OVERRUN
            </button>
          </div>

          {/* After applying overrun */}
          {overrunApplied && !overrunResult && (
            <div className="rounded border border-rose-700 bg-rose-950/50 p-3.5 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#0b1a2d] p-2 rounded border border-[#203a5c]">
                  <div className="text-slate-400 uppercase text-[9px] font-bold">Sanctioned Slot</div>
                  <div className="font-mono text-slate-300 font-bold mt-0.5">14:45–15:45</div>
                </div>
                <div className="bg-rose-950/80 p-2 rounded border border-rose-700">
                  <div className="text-rose-300 uppercase text-[9px] font-bold">Actual Projected End</div>
                  <div className="font-mono text-rose-300 font-extrabold mt-0.5">
                    {(() => {
                      const extra = 945 + overrunMins;
                      const h = Math.floor(extra / 60);
                      const m = extra % 60;
                      return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
                    })()}
                  </div>
                </div>
              </div>
              <div className="font-extrabold text-rose-400 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle size={15} /> CONFLICT DETECTED — DOWNSTREAM TRD BLOCK M002 IMPACTED
              </div>
              <button
                onClick={handleReplanOverrun}
                disabled={overrunReplanning}
                className="w-full py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-extrabold rounded transition flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wider cursor-pointer"
              >
                <RefreshCw size={13} className={overrunReplanning ? 'animate-spin' : ''} />
                {overrunReplanning ? 'Re-slotting Downstream Requests…' : 'RE-PLAN DOWNSTREAM BLOCKS'}
              </button>
            </div>
          )}

          {/* After overrun replan */}
          {overrunResult && (
            <div className="rounded border border-sky-600/70 bg-sky-950/40 p-3.5 space-y-2">
              <div className="font-extrabold text-sky-300 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 size={15} className="text-sky-400" /> RE-PLANNED MASTER SCHEDULE
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#203a5c] text-slate-400 text-[10px] uppercase font-bold">
                    <th className="text-left py-1">Block</th>
                    <th className="text-left py-1">Dept</th>
                    <th className="text-left py-1">New Start</th>
                    <th className="text-left py-1">New End</th>
                    <th className="text-left py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {overrunResult.updated_plan?.map(p => (
                    <tr key={p.id} className="border-b border-[#182e49]">
                      <td className="py-1.5 font-mono font-bold text-amber-400">{p.id}</td>
                      <td className="py-1.5 text-slate-300">{p.department}</td>
                      <td className="py-1.5 font-mono text-emerald-400 font-bold">{p.start}</td>
                      <td className="py-1.5 font-mono text-rose-400 font-bold">{p.end}</td>
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
          title="Updated Master Block Timeline — Post Dynamic Re-Planning"
        />
      )}
    </div>
  );
}
