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
    <div className={`gov-card p-4 space-y-4 ${overall === 'PASSED' ? 'border-emerald-300 bg-emerald-50/70' : 'border-rose-300 bg-rose-50/70'}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className={overall === 'PASSED' ? 'text-emerald-700' : 'text-rose-700'} />
          <span className={`font-extrabold text-sm tracking-wider uppercase ${overall === 'PASSED' ? 'text-emerald-900' : 'text-rose-900'}`}>
            SAFETY VALIDATION &amp; INTERLOCKING VERIFICATION
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 font-semibold">SAFETY RULEBOOK: SR-G&amp;SR-2026</span>
      </div>

      {/* Check rows */}
      <div className="space-y-1.5">
        {CHECKS.map((check) => {
          const passed = validation[check.key];
          return (
            <div key={check.key} className="flex items-center justify-between bg-white px-3.5 py-2 rounded border border-slate-200 text-xs shadow-sm">
              <span className="text-slate-800 font-semibold">{check.label}</span>
              {passed ? (
                <span className="flex items-center gap-1 text-emerald-700 font-extrabold font-mono">
                  <CheckCircle2 size={14} className="text-emerald-600" /> PASSED
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-700 font-extrabold font-mono">
                  <XCircle size={14} className="text-rose-600" /> FAILED
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Status Bar */}
      <div className={`flex items-center justify-between rounded p-3 border font-extrabold text-sm ${
        overall === 'PASSED'
          ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
          : 'bg-rose-100 border-rose-300 text-rose-900'
      }`}>
        <span className="tracking-wide">OVERALL SAFETY COMPLIANCE:</span>
        <span className="font-mono text-base font-extrabold">{overall}</span>
      </div>

      {/* Approve Button (Human Controller Action) */}
      {overall === 'PASSED' && !approved && (
        <div className="space-y-2 pt-1">
          <button
            onClick={onApprove}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded border border-emerald-700 transition flex items-center justify-center gap-2 shadow-md uppercase tracking-wider cursor-pointer"
          >
            <UserCheck size={16} /> APPROVE BLOCK PLAN (CONTROLLER SANCTION)
          </button>
          <div className="text-[10px] text-center text-slate-500 font-medium">
            Clicking records official Section Controller approval. Automated planning does not bypass mandatory human authorization.
          </div>
        </div>
      )}

      {approved && (
        <div className="text-center py-3 bg-emerald-100 rounded border border-emerald-400 text-emerald-900 font-extrabold text-sm flex items-center justify-center gap-2 tracking-wide uppercase shadow-sm">
          <CheckCircle2 size={18} className="text-emerald-700" /> PLAN STATUS: APPROVED &amp; TRANSMITTED TO COA
        </div>
      )}
    </div>
  );
}
