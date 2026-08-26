import { CheckCircle2, Clock, ShieldCheck, Printer, FileText } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import useAppStore from '../store/appStore';

export default function ApprovalsPage() {
  const { planApproved, planResult } = useAppStore();
  const plan = planResult?.optimized_plan || [];

  return (
    <div className="space-y-5">
      {/* Official Header */}
      <div className="border-b border-slate-300 pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold text-[#0f2744] uppercase tracking-wider">
              OFFICIALLY SANCTIONED BLOCK ORDERS &amp; CONTROLLER LOG
            </h1>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-bold rounded">
              FORM: IR-OPTG-BLK-SANCTION
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            Final approved block plan for operational execution — authenticated by Section Controller (Chennai Control Office)
          </p>
        </div>
        {planApproved && (
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold rounded flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <Printer size={13} className="text-amber-600" /> Print Sanction Memo
          </button>
        )}
      </div>

      {planApproved && plan.length > 0 ? (
        <>
          {/* Official Sanction Banner */}
          <div className="gov-card p-4 border-emerald-400 bg-emerald-50/80 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-400 flex items-center justify-center text-emerald-700 shrink-0 shadow-sm">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div className="text-sm font-extrabold text-emerald-900 tracking-wide uppercase">
                  MASTER BLOCK PLAN STATUS: APPROVED &amp; SANCTIONED
                </div>
                <div className="text-xs text-slate-700 mt-0.5 font-medium">
                  Sanctioning Officer: <strong>Section Controller (MAS-CTRL-04)</strong> · Shift: Day (06:00 – 14:00) · Operating Branch, Southern Railway
                </div>
              </div>
            </div>
            <div className="text-right text-xs font-mono text-emerald-800 bg-white px-3 py-1.5 rounded border border-emerald-300 font-bold shadow-sm">
              Memo No: <strong>SR/MAS/BLK/2026/084</strong>
            </div>
          </div>

          {/* Approved Schedule Table */}
          <div className="gov-card bg-white overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <FileText size={14} className="text-amber-600" />
                Sanctioned Block Working Schedule
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-semibold">COA Broadcast Active</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b-2 border-slate-300">
                    {['Block Req ID', 'Executive Dept', 'Corridor Section', 'Sanctioned Start', 'Sanctioned End', 'Duration', 'Sanction Status'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] uppercase font-bold tracking-wider">{h}</th>
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
                      <td className="px-4 py-3 font-mono text-slate-700 font-medium">60 min</td>
                      <td className="px-4 py-3"><StatusBadge status="APPROVED" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statutory Railway Notice */}
          <div className="gov-card p-4 bg-slate-50 border-slate-300 text-xs text-slate-700 space-y-1.5 shadow-sm">
            <div className="font-bold text-amber-800 flex items-center gap-1.5 text-xs">
              <ShieldCheck size={15} className="text-amber-700" /> STATUTORY COMPLIANCE &amp; FIELD PROTOCOLS
            </div>
            <div className="text-[11px] text-slate-600 leading-relaxed font-medium">
              1. The above block sanction is a binding human controller action. The AI block planner validates mathematical feasibility and safety margins, while executive sanction is vested with Section Controller (MAS-CTRL-04).<br />
              2. Physical block execution commences only after receipt of Track Isolation message from Permanent Way Inspector (PWI) and 25kV OHE Permit to Work (PTW) from TRD Traction Power Controller (TPC).<br />
              3. Caution Orders automatically dispatched to Divisional Loco Sheds and Stations on section.
            </div>
          </div>
        </>
      ) : (
        <div className="gov-card bg-white flex flex-col items-center justify-center py-20 gap-3 text-slate-500 text-center p-6 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-amber-600">
            <Clock size={28} />
          </div>
          <div className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            NO SANCTIONED BLOCK PLAN RECORDED FOR CURRENT SHIFT
          </div>
          <div className="text-xs text-slate-600 max-w-md font-medium">
            Please proceed to <strong className="text-amber-700 font-bold">Block Planning</strong>, generate an optimized plan, resolve timetable conflicts, complete safety validation, and click <strong>APPROVE BLOCK PLAN</strong>.
          </div>
        </div>
      )}
    </div>
  );
}
