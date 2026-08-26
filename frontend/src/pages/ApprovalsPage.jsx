import { CheckCircle2, Clock, ShieldCheck, Printer, FileText } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import useAppStore from '../store/appStore';

export default function ApprovalsPage() {
  const { planApproved, planResult } = useAppStore();
  const plan = planResult?.optimized_plan || [];

  return (
    <div className="space-y-5">
      {/* Official Header */}
      <div className="border-b border-[#203a5c] pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-white uppercase tracking-wider">
              OFFICIALLY SANCTIONED BLOCK ORDERS &amp; CONTROLLER LOG
            </h1>
            <span className="px-2 py-0.5 bg-[#0b1a2d] text-emerald-400 border border-[#203a5c] text-[10px] font-mono font-bold rounded">
              FORM: IR-OPTG-BLK-SANCTION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Final approved block plan for operational execution — authenticated by Section Controller (Chennai Control Office)
          </p>
        </div>
        {planApproved && (
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-[#0b1a2d] hover:bg-[#162b46] text-amber-400 border border-[#203a5c] text-xs font-bold rounded flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer size={13} /> Print Sanction Memo
          </button>
        )}
      </div>

      {planApproved && plan.length > 0 ? (
        <>
          {/* Official Sanction Banner */}
          <div className="gov-card p-4 border-emerald-600/70 bg-[#061d15]/90 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div className="text-sm font-extrabold text-emerald-300 tracking-wide uppercase">
                  MASTER BLOCK PLAN STATUS: APPROVED &amp; SANCTIONED
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Sanctioning Officer: <strong>Section Controller (MAS-CTRL-04)</strong> · Shift: Day (06:00 – 14:00) · Operating Branch, Southern Railway
                </div>
              </div>
            </div>
            <div className="text-right text-xs font-mono text-emerald-400">
              Memo No: <strong>SR/MAS/BLK/2026/084</strong>
            </div>
          </div>

          {/* Approved Schedule Table */}
          <div className="gov-card overflow-hidden">
            <div className="px-4 py-3 bg-[#0b1a2d] border-b border-[#203a5c] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <FileText size={13} className="text-amber-400" />
                Sanctioned Block Working Schedule
              </span>
              <span className="text-[10px] text-slate-400 font-mono">COA Broadcast Active</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#081526] text-slate-300 border-b-2 border-[#203a5c]">
                    {['Block Req ID', 'Executive Dept', 'Corridor Section', 'Sanctioned Start', 'Sanctioned End', 'Duration', 'Sanction Status'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] uppercase font-bold tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {plan.map((p, i) => (
                    <tr key={p.id} className={`border-b border-[#182e49] ${i % 2 === 0 ? 'bg-[#0d1e33]' : 'bg-[#0a1829]'}`}>
                      <td className="px-4 py-3 font-mono font-bold text-amber-400">{p.id}</td>
                      <td className="px-4 py-3 text-slate-200 font-medium">{p.department}</td>
                      <td className="px-4 py-3 font-mono text-slate-300">{p.section}</td>
                      <td className="px-4 py-3 font-mono text-emerald-400 font-bold">{p.start}</td>
                      <td className="px-4 py-3 font-mono text-rose-400 font-bold">{p.end}</td>
                      <td className="px-4 py-3 font-mono text-slate-300">60 min</td>
                      <td className="px-4 py-3"><StatusBadge status="APPROVED" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statutory Railway Notice */}
          <div className="gov-card p-3.5 bg-[#0b1a2d] border-[#203a5c] text-xs text-slate-300 space-y-1">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <ShieldCheck size={14} /> STATUTORY COMPLIANCE &amp; FIELD PROTOCOLS
            </div>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              1. The above block sanction is a binding human controller action. The AI block planner validates mathematical feasibility and safety margins, while executive sanction is vested with Section Controller (MAS-CTRL-04).<br />
              2. Physical block execution commences only after receipt of Track Isolation message from Permanent Way Inspector (PWI) and 25kV OHE Permit to Work (PTW) from TRD Traction Power Controller (TPC).<br />
              3. Caution Orders automatically dispatched to Divisional Loco Sheds and Stations on section.
            </div>
          </div>
        </>
      ) : (
        <div className="gov-card flex flex-col items-center justify-center py-20 gap-3 text-slate-400 text-center p-6">
          <div className="w-14 h-14 rounded-full bg-[#0b1a2d] border border-[#203a5c] flex items-center justify-center text-amber-400">
            <Clock size={28} />
          </div>
          <div className="text-sm font-bold text-slate-200 uppercase tracking-wide">
            NO SANCTIONED BLOCK PLAN RECORDED FOR CURRENT SHIFT
          </div>
          <div className="text-xs text-slate-400 max-w-md">
            Please proceed to <strong className="text-amber-400">Block Planning</strong>, generate an optimized plan, resolve timetable conflicts, complete safety validation, and click <strong>APPROVE BLOCK PLAN</strong>.
          </div>
        </div>
      )}
    </div>
  );
}
