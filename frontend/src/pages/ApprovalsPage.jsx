import { CheckCircle2, Clock } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import useAppStore from '../store/appStore';

export default function ApprovalsPage() {
  const { planApproved, planResult } = useAppStore();
  const plan = planResult?.optimized_plan || [];

  return (
    <div className="space-y-5">
      <div className="border-b border-[#334155] pb-3">
        <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">Approvals</h1>
        <p className="text-xs text-slate-500 mt-0.5">Final approved block plan for operational execution — human controller approval retained</p>
      </div>

      {planApproved && plan.length > 0 ? (
        <>
          <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-950/40 border border-emerald-700 rounded">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <div>
              <div className="text-sm font-bold text-emerald-300">PLAN STATUS: APPROVED</div>
              <div className="text-xs text-slate-400 mt-0.5">Approved by Section Controller · MAS-CTRL-04 · 25 Aug 2026</div>
            </div>
          </div>

          <div className="bg-[#1e293b] border border-[#334155] rounded overflow-x-auto">
            <div className="px-4 py-3 border-b border-[#334155]">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Approved Block Schedule</span>
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
                    <td className="px-4 py-3 font-mono font-bold text-amber-400">{p.id}</td>
                    <td className="px-4 py-3 text-slate-300 font-medium">{p.department}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">{p.section}</td>
                    <td className="px-4 py-3 font-mono text-emerald-400">{p.start}</td>
                    <td className="px-4 py-3 font-mono text-rose-400">{p.end}</td>
                    <td className="px-4 py-3"><StatusBadge status="APPROVED" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-slate-600 bg-[#1e293b] border border-[#334155] rounded p-3">
            ⚠ Note: The approval above is a human controller action. The system does not bypass the safety validation result from the planning engine. Block execution requires physical acknowledgement from the Permanent Way Inspector (PWI) and signal clearance from Section Controller.
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-600">
          <Clock size={36} className="text-slate-700" />
          <div className="text-sm font-semibold">No approved plan yet</div>
          <div className="text-xs text-center max-w-sm">
            Go to <strong className="text-amber-400">Block Planning</strong>, generate an optimized plan, resolve conflicts, validate safety, and approve to see the final schedule here.
          </div>
        </div>
      )}
    </div>
  );
}
