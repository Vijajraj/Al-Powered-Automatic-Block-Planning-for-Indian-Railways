import { CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

const CHECKS = [
  { key: 'train_conflict',    label: 'Train Conflict Check' },
  { key: 'section_conflict',  label: 'Section Conflict Check' },
  { key: 'resource_conflict', label: 'Resource Conflict Check' },
  { key: 'power_constraint',  label: 'Power Constraint (OHE)' },
  { key: 'operating_window',  label: 'Operating Window Compliance' },
];

export default function SafetyPanel({ validation = {}, onApprove, approved }) {
  const overall = validation.overall;

  return (
    <div className={`rounded border p-4 space-y-4 ${overall === 'PASSED' ? 'border-emerald-700 bg-emerald-950/30' : 'border-rose-700 bg-rose-950/30'}`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <ShieldCheck size={16} className={overall === 'PASSED' ? 'text-emerald-400' : 'text-rose-400'} />
        <span className={`font-bold text-sm ${overall === 'PASSED' ? 'text-emerald-400' : 'text-rose-400'}`}>
          SAFETY VALIDATION
        </span>
      </div>

      {/* Check rows */}
      <div className="space-y-1.5">
        {CHECKS.map((check) => {
          const passed = validation[check.key];
          return (
            <div key={check.key} className="flex items-center justify-between bg-[#1e293b] px-3 py-2 rounded border border-[#334155] text-xs">
              <span className="text-slate-300">{check.label}</span>
              {passed ? (
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle2 size={12} /> PASS
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-400 font-bold">
                  <XCircle size={12} /> FAIL
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall */}
      <div className={`flex items-center justify-between rounded p-3 border font-bold text-sm ${
        overall === 'PASSED'
          ? 'bg-emerald-900/40 border-emerald-700 text-emerald-300'
          : 'bg-rose-900/40 border-rose-700 text-rose-300'
      }`}>
        <span>OVERALL STATUS</span>
        <span>{overall}</span>
      </div>

      {/* Approve Button */}
      {overall === 'PASSED' && !approved && (
        <button
          onClick={onApprove}
          className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm rounded border border-emerald-600 transition flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={15} /> APPROVE BLOCK PLAN
        </button>
      )}

      {approved && (
        <div className="text-center py-2.5 bg-emerald-900/60 rounded border border-emerald-700 text-emerald-300 font-bold text-sm flex items-center justify-center gap-2">
          <CheckCircle2 size={15} /> PLAN STATUS: APPROVED
        </div>
      )}
    </div>
  );
}
