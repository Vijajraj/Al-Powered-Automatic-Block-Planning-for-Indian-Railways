import { useMemo } from 'react';
import { Clock } from 'lucide-react';

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
  return Math.max(1.2, e - s);
}

const TRAIN_COLOR = '#0284c7';   // sky-600
const ENG_COLOR   = '#d97706';   // amber-600
const TRD_COLOR   = '#7c3aed';   // violet-600
const ST_COLOR    = '#059669';   // emerald-600

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
    <div className="gov-card p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-[#203a5c] pb-2.5">
        <div className="text-xs font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
          <Clock size={14} className="text-amber-400" />
          {title}
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-[#0b1a2d] px-2 py-0.5 rounded border border-[#203a5c]">
          Headway Resolution: 5 Min
        </span>
      </div>

      {/* Hour axis */}
      <div className="flex mb-1 pl-28">
        {hours.map((h) => (
          <div
            key={h}
            className="flex-1 text-[10px] text-slate-400 font-mono border-l border-[#203a5c] pl-1 font-semibold"
          >
            {String(h).padStart(2, '0')}:00
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-1.5">
        {/* Train rows */}
        {trainRows.map((train) => (
          <GanttRow
            key={train.id}
            label={train.name || train.id}
            labelColor="text-sky-300"
            blocks={[{ start: train.arrival, end: train.departure, color: TRAIN_COLOR, label: `${train.name} (${train.arrival}-${train.departure})` }]}
          />
        ))}

        {/* Separator */}
        {trainRows.length > 0 && Object.keys(depts).length > 0 && (
          <div className="border-t border-dashed border-[#203a5c] my-2" />
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
              color: DEPT_COLORS[dept] || '#475569',
              label: `${b.id} (${b.start}–${b.end})`,
              status: b.status,
            }))}
          />
        ))}

        {/* Empty state */}
        {trainRows.length === 0 && Object.keys(depts).length === 0 && (
          <div className="text-center text-slate-500 py-8 text-xs font-medium">
            Generate an optimized plan to populate the master timeline
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-5 mt-4 pt-3 border-t border-[#203a5c] text-[11px] text-slate-300 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-2.5 inline-block rounded-sm shadow-sm" style={{ background: TRAIN_COLOR }} /> Train Movement Path (COA Timetable)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-2.5 inline-block rounded-sm shadow-sm" style={{ background: ENG_COLOR }} /> Engineering (Track Renewal / Ballast)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-2.5 inline-block rounded-sm shadow-sm" style={{ background: TRD_COLOR }} /> TRD (25kV OHE Power Block)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-2.5 inline-block rounded-sm shadow-sm" style={{ background: ST_COLOR }} /> S&amp;T (Signal &amp; Telecom Interlocking)
        </span>
      </div>
    </div>
  );
}

function GanttRow({ label, labelColor = 'text-slate-300', blocks = [] }) {
  return (
    <div className="flex items-center gap-2 h-7">
      <div className={`w-28 text-[11px] font-mono font-bold truncate ${labelColor} text-right pr-2 shrink-0`}>
        {label}
      </div>
      <div className="flex-1 h-full bg-[#071324] rounded relative border border-[#203a5c] overflow-hidden">
        {blocks.map((block, i) => {
          const left = timeToPercent(block.start);
          const width = durationToPercent(block.start, block.end);
          return (
            <div
              key={i}
              title={block.label}
              className="absolute top-0 h-full flex items-center justify-center text-[9.5px] font-extrabold text-white overflow-hidden rounded-sm cursor-default shadow-sm px-1"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: block.color,
                opacity: block.status === 'Re-slotted' ? 0.9 : 1,
                border: block.status === 'Re-slotted' ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <span className="truncate">{block.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
