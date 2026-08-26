import { useMemo } from 'react';

const HOUR_START = 7;   // 07:00
const HOUR_END = 18;    // 18:00
const TOTAL_HOURS = HOUR_END - HOUR_START;

function timeToPercent(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  const total = (h - HOUR_START) * 60 + (m || 0);
  return Math.max(0, Math.min(100, (total / (TOTAL_HOURS * 60)) * 100));
}

function durationToPercent(start, end) {
  const s = timeToPercent(start);
  const e = timeToPercent(end);
  return Math.max(1, e - s);
}

const TRAIN_COLOR = '#3b82f6';   // blue-500
const ENG_COLOR   = '#f59e0b';   // amber-500
const TRD_COLOR   = '#a78bfa';   // violet-400
const ST_COLOR    = '#34d399';   // emerald-400

const DEPT_COLORS = {
  Engineering: ENG_COLOR,
  TRD: TRD_COLOR,
  'S&T': ST_COLOR,
};

const hours = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => HOUR_START + i);

export default function GanttChart({ trains = [], plan = [], title = 'Block Planning Timeline' }) {
  // Group maintenance blocks by department
  const depts = useMemo(() => {
    const d = {};
    plan.forEach((p) => {
      if (!d[p.department]) d[p.department] = [];
      d[p.department].push(p);
    });
    return d;
  }, [plan]);

  const trainRows = trains.slice(0, 7);

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded p-4">
      <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{title}</div>

      {/* Hour axis */}
      <div className="flex mb-1 pl-24">
        {hours.map((h) => (
          <div
            key={h}
            className="flex-1 text-[9px] text-slate-500 font-mono border-l border-[#334155] pl-1"
          >
            {String(h).padStart(2, '0')}:00
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-1">
        {/* Train rows */}
        {trainRows.map((train) => (
          <GanttRow
            key={train.id}
            label={train.name || train.id}
            labelColor="text-blue-300"
            blocks={[{ start: train.arrival, end: train.departure, color: TRAIN_COLOR, label: train.name }]}
          />
        ))}

        {/* Separator */}
        {trainRows.length > 0 && Object.keys(depts).length > 0 && (
          <div className="border-t border-dashed border-[#334155] my-1" />
        )}

        {/* Department rows */}
        {Object.entries(depts).map(([dept, blocks]) => (
          <GanttRow
            key={dept}
            label={dept}
            labelColor={dept === 'Engineering' ? 'text-amber-400' : dept === 'TRD' ? 'text-violet-300' : 'text-emerald-400'}
            blocks={blocks.map((b) => ({
              start: b.start,
              end: b.end,
              color: DEPT_COLORS[dept] || '#64748b',
              label: `${b.id} (${b.start}–${b.end})`,
              status: b.status,
            }))}
          />
        ))}

        {/* Empty state */}
        {trainRows.length === 0 && Object.keys(depts).length === 0 && (
          <div className="text-center text-slate-600 py-8 text-xs">
            Generate a plan to view the timeline
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 pt-3 border-t border-[#334155] text-[10px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2 inline-block rounded-sm" style={{ background: TRAIN_COLOR }} /> Train Movement
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2 inline-block rounded-sm" style={{ background: ENG_COLOR }} /> Engineering
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2 inline-block rounded-sm" style={{ background: TRD_COLOR }} /> TRD
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2 inline-block rounded-sm" style={{ background: ST_COLOR }} /> S&T
        </span>
      </div>
    </div>
  );
}

function GanttRow({ label, labelColor = 'text-slate-300', blocks = [] }) {
  return (
    <div className="flex items-center gap-2 h-7">
      <div className={`w-24 text-[11px] font-mono font-bold truncate ${labelColor} text-right pr-2 shrink-0`}>
        {label}
      </div>
      <div className="flex-1 h-full bg-[#0f172a] rounded relative border border-[#334155] overflow-hidden">
        {blocks.map((block, i) => {
          const left = timeToPercent(block.start);
          const width = durationToPercent(block.start, block.end);
          return (
            <div
              key={i}
              title={block.label}
              className="absolute top-0 h-full flex items-center justify-center text-[9px] font-bold text-white overflow-hidden rounded-sm cursor-default"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: block.color,
                opacity: block.status === 'Re-slotted' ? 0.85 : 1,
                border: block.status === 'Re-slotted' ? '1px solid #60a5fa' : '1px solid transparent',
              }}
            >
              <span className="px-1 truncate">{block.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
