import { useEffect, useState } from 'react';
import { Zap, CheckCircle2, ShieldCheck, FileCheck, Layers } from 'lucide-react';
import GanttChart from '../components/GanttChart';
import ConflictPanel from '../components/ConflictPanel';
import SafetyPanel from '../components/SafetyPanel';
import StatusBadge from '../components/StatusBadge';
import useAppStore from '../store/appStore';
import { fetchTrains, fetchMaintenance, generatePlan } from '../api/client';

const INFRASTRUCTURE = {
  sections: ['A-B', 'B-C', 'C-D'],
  trackType: { 'A-B': 'double', 'B-C': 'single', 'C-D': 'single' },
};

export default function BlockPlanningPage() {
  const {
    trains, maintenance, planResult, planGenerated, conflictResolved,
    planApproved, setTrains, setMaintenance, setPlanResult,
    setApprovedPlan, setConflictResolved, setSafetyPassed, safetyPassed,
    setLoading, isLoading,
  } = useAppStore();

  const [optimizing, setOptimizing] = useState(false);

  // Load data if needed
  useEffect(() => {
    async function load() {
      setLoading('bp', true);
      const [t, m] = await Promise.all([fetchTrains(), fetchMaintenance()]);
      setTrains(t);
      setMaintenance(m);
      setLoading('bp', false);
    }
    if (!trains.length || !maintenance.length) load();
  }, []);

  async function handleGenerate() {
    setLoading('generate', true);
    const result = await generatePlan({
      trains,
      maintenance_requests: maintenance,
      infrastructure: INFRASTRUCTURE,
    });
    setPlanResult(result);
    setLoading('generate', false);
  }

  async function handleOptimize() {
    setOptimizing(true);
    await new Promise(r => setTimeout(r, 900));
    setConflictResolved(true);
    setSafetyPassed(true);
    setOptimizing(false);
  }

  function handleApprove() {
    setApprovedPlan(planResult?.optimized_plan || []);
  }

  const plan = planResult?.optimized_plan || [];
  const conflicts = planResult?.conflicts || [];
  const safety = planResult?.safety_validation || {};
  const showSafety = conflictResolved && safetyPassed;

  return (
    <div className="space-y-5">
      {/* Official Header */}
      <div className="border-b border-slate-300 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold text-[#0f2744] uppercase tracking-wider">
              AUTOMATIC BLOCK PLANNING &amp; TIMELINE SCHEDULER
            </h1>
            <span className="px-2 py-0.5 bg-slate-100 text-amber-800 border border-slate-300 text-[10px] font-mono font-bold rounded">
              CONTROL CONSOLE MVP
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            AI-assisted collision-free slot allocation for Engineering, TRD, and S&amp;T maintenance blocks
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading('generate')}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 text-xs font-extrabold rounded border border-amber-600 shadow-sm transition uppercase tracking-wider cursor-pointer"
        >
          <Zap size={15} />
          {isLoading('generate') ? 'Computing Schedule…' : 'Generate Optimized Plan'}
        </button>
      </div>

      {/* Gantt Chart (always shows trains; plan blocks appear after generation) */}
      <GanttChart
        trains={trains}
        plan={conflictResolved ? plan : []}
        title="Block Planning Spatio-Temporal Timeline — Chennai Division (07:00 – 18:00)"
      />

      {/* Conflict Panel */}
      {planGenerated && (
        <ConflictPanel
          conflicts={conflicts}
          resolved={conflictResolved}
          onOptimize={handleOptimize}
          loading={optimizing}
        />
      )}

      {/* Safety Validation */}
      {showSafety && (
        <SafetyPanel
          validation={safety}
          onApprove={handleApprove}
          approved={planApproved}
        />
      )}

      {/* Approved Plan Table */}
      {planApproved && (
        <div className="gov-card bg-white border-emerald-500 overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-700" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">
                OFFICIALLY SANCTIONED BLOCK MASTER PLAN
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300 font-bold">
              SANCTION AUTHORITY: SR/MAS/OP/2026/08
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                  {['Request ID', 'Department', 'Section', 'Sanctioned Start', 'Sanctioned End', 'Operating Status'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-[10px] uppercase font-bold tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plan.map((p, i) => (
                  <tr key={p.id} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}>
                    <td className="px-4 py-3 font-mono font-bold text-amber-800">{p.id}</td>
                    <td className="px-4 py-3 text-slate-900 font-semibold">{p.department}</td>
                    <td className="px-4 py-3 font-mono text-slate-700 font-semibold">{p.section}</td>
                    <td className="px-4 py-3 font-mono text-emerald-700 font-bold">{p.start}</td>
                    <td className="px-4 py-3 font-mono text-rose-700 font-bold">{p.end}</td>
                    <td className="px-4 py-3"><StatusBadge status="APPROVED" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 bg-emerald-50 border-t border-emerald-200 text-[11px] text-emerald-900 flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5">
              <FileCheck size={14} className="text-emerald-700" />
              Transmitted to Divisional Control Room, PWI Field Units, and Station Masters on Line.
            </span>
            <span className="font-mono text-[10px] text-emerald-800 font-bold">STATUS: ACTIVE MASTER SCHEDULE</span>
          </div>
        </div>
      )}
    </div>
  );
}
