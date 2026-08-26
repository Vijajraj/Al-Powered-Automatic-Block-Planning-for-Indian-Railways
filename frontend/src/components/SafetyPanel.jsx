import { CheckCircle2, XCircle, ShieldCheck, UserCheck } from 'lucide-react';

const CHECKS = [
  { key: 'train_conflict',    label: 'Train Path Conflict Check (Collision Prevention)' },
  { key: 'section_conflict',  label: 'Section Double-Booking Check (Block Isolation)' },
  { key: 'resource_conflict', label: 'Departmental Resource & Machine Conflict Check' },
  { key: 'power_constraint',  label: 'Traction Power (25kV OHE Isolation) Constraint' },
  { key: 'operating_window',  label: 'Day Shift Operating Window Compliance (06:00 – 18:00)' },
];

export default function SafetyPanel({ validation = {}, onApprove, approved }) {
  const overall = validation.overall;

  return (
    <div className={`gov-card p-4 space-y-4 ${overall === 'PASSED' ? 'border-emerald-600/60 bg-[#061d15]/90' : 'border-rose-600/60 bg-[#1f0e15]/90'}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#203a5c] pb-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className={overall === 'PASSED' ? 'text-emerald-400' : 'text-rose-400'} />
          <span className={`font-extrabold text-sm tracking-wider uppercase ${overall === 'PASSED' ? 'text-emerald-300' : 'text-rose-300'}`}>
            SAFETY VALIDATION &amp; INTERLOCKING VERIFICATION
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">SAFETY RULEBOOK: SR-G&amp;SR-2026</span>
      </div>

      {/* Check rows */}
      <div className="space-y-1.5">
        {CHECKS.map((check) => {
          const passed = validation[check.key];
          return (
            <div key={check.key} className="flex items-center justify-between bg-[#0b1a2d] px-3.5 py-2 rounded border border-[#1b3657] text-xs">
              <span className="text-slate-200 font-medium">{check.label}</span>
              {passed ? (
                <span className="flex items-center gap-1 text-emerald-400 font-bold font-mono">
                  <CheckCircle2 size={13} /> PASSED
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-400 font-bold font-mono">
                  <XCircle size={13} /> FAILED
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Status Bar */}
      <div className={`flex items-center justify-between rounded p-3 border font-extrabold text-sm ${
        overall === 'PASSED'
          ? 'bg-emerald-950/90 border-emerald-600 text-emerald-300'
          : 'bg-rose-950/90 border-rose-600 text-rose-300'
      }`}>
        <span className="tracking-wide">OVERALL SAFETY COMPLIANCE:</span>
        <span className="font-mono text-base">{overall}</span>
      </div>

      {/* Approve Button (Human Controller Action) */}
      {overall === 'PASSED' && !approved && (
        <div className="space-y-2 pt-1">
          <button
            onClick={onApprove}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded border border-emerald-400 transition flex items-center justify-center gap-2 shadow-md uppercase tracking-wider cursor-pointer"
          >
            <UserCheck size={16} /> APPROVE BLOCK PLAN (CONTROLLER SANCTION)
          </button>
          <div className="text-[10px] text-center text-slate-400">
            Clicking records official Section Controller approval. Automated planning does not bypass mandatory human authorization.
          </div>
        </div>
      )}

      {approved && (
        <div className="text-center py-3 bg-emerald-950 rounded border border-emerald-600 text-emerald-300 font-extrabold text-sm flex items-center justify-center gap-2 tracking-wide uppercase">
          <CheckCircle2 size={18} className="text-emerald-400" /> PLAN STATUS: APPROVED &amp; TRANSMITTED TO COA
        </div>
      )}
    </div>
  );
}
