import { useEffect, useState } from 'react';
import { Zap, CheckCircle2 } from 'lucide-react';
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
    await new Promise(r => setTimeout(r, 900)); // simulate optimization
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
      {/* Header */}
      <div className="border-b border-[#334155] pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">Block Planning</h1>
          <p className="text-xs text-slate-500 mt-0.5">Generate, review, and approve optimized maintenance block plans</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading('generate')}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-900 text-sm font-bold rounded border border-amber-600 transition"
        >
          <Zap size={14} />
          {isLoading('generate') ? 'Generating…' : 'Generate Optimized Plan'}
        </button>
      </div>

      {/* Gantt Chart (always shows trains; plan blocks appear after generation) */}
      <GanttChart
        trains={trains}
        plan={conflictResolved ? plan : []}
        title="Block Planning Timeline — MAS–AJJ Line"
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
        <div className="bg-[#1e293b] border border-emerald-800 rounded">
          <div className="px-4 py-3 border-b border-emerald-800 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Approved Block Plan</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#334155]">
                {['Request', 'Department', 'Section', 'Start', 'End', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plan.map((p, i) => (
                <tr key={p.id} className={`border-b border-[#263348] ${i % 2 === 0 ? '' : 'bg-[#172033]'}`}>
                  <td className="px-4 py-2.5 font-mono font-bold text-amber-400">{p.id}</td>
                  <td className="px-4 py-2.5 text-slate-300">{p.department}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">{p.section}</td>
                  <td className="px-4 py-2.5 font-mono text-emerald-400">{p.start}</td>
                  <td className="px-4 py-2.5 font-mono text-rose-400">{p.end}</td>
                  <td className="px-4 py-2.5"><StatusBadge status="APPROVED" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
