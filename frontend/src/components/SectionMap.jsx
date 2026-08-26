import { useState } from 'react';
import { ChevronRight, MapPin } from 'lucide-react';

const stations = [
  { id: 'MAS', name: 'CHENNAI CENTRAL', code: 'MAS' },
  { id: 'KPD', name: 'KANCHIPURAM', code: 'CJ' },
  { id: 'AJJ', name: 'ARAKKONAM / ARCOT', code: 'AJJ' },
  { id: 'VLR', name: 'VELLORE CANTT', code: 'VLR' },
];

const sections = [
  { id: 'A-B', from: 'CHENNAI (MAS)', to: 'KANCHIPURAM (CJ)', track: 'Double (Electrified 25kV AC)', activeTrains: 3, maintenanceReqs: 2, currentBlock: 'None' },
  { id: 'B-C', from: 'KANCHIPURAM (CJ)', to: 'ARAKKONAM (AJJ)', track: 'Single (Electrified 25kV AC)', activeTrains: 2, maintenanceReqs: 1, currentBlock: 'None' },
  { id: 'C-D', from: 'ARAKKONAM (AJJ)', to: 'VELLORE (VLR)', track: 'Single (Electrified 25kV AC)', activeTrains: 1, maintenanceReqs: 2, currentBlock: 'None' },
];

export default function SectionMap({ maintenance = [], trains = [] }) {
  const [selected, setSelected] = useState('A-B');

  // Enrich sections with live counts
  const enriched = sections.map((s) => ({
    ...s,
    activeTrains: trains.filter((t) => t.section === s.id).length || s.activeTrains,
    maintenanceReqs: maintenance.filter((m) => m.section === s.id).length || s.maintenanceReqs,
  }));

  const sel = enriched.find((s) => s.id === selected) || enriched[0];

  return (
    <div className="gov-card p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-[#203a5c] pb-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <MapPin size={13} className="text-amber-400" />
          Network / Section Schematic View
        </div>
        <span className="text-[10px] text-slate-400 font-mono">MAS Division Core Corridor</span>
      </div>

      <div className="flex gap-5 pt-1">
        {/* Schematic rail diagram */}
        <div className="flex flex-col items-center gap-0 min-w-[150px]">
          {stations.map((stn, i) => {
            const sec = enriched[i - 1];
            const hasMaint = sec && sec.maintenanceReqs > 0;
            return (
              <div key={stn.id} className="flex flex-col items-center">
                {i > 0 && (
                  <button
                    onClick={() => setSelected(sec.id === selected ? null : sec.id)}
                    className="flex flex-col items-center cursor-pointer group my-0.5"
                  >
                    {/* Section line */}
                    <div
                      className={`w-1 h-6 transition-colors ${
                        selected === sec.id
                          ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                          : hasMaint
                          ? 'bg-amber-600'
                          : 'bg-slate-600'
                      }`}
                    />
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition-all ${
                        selected === sec.id
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold'
                          : 'bg-[#0b1a2d] text-slate-300 border-[#203a5c] group-hover:border-amber-500 group-hover:text-amber-400'
                      }`}
                    >
                      Section {sec.id}
                    </span>
                    <div
                      className={`w-1 h-6 transition-colors ${
                        selected === sec.id
                          ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                          : hasMaint
                          ? 'bg-amber-600'
                          : 'bg-slate-600'
                      }`}
                    />
                  </button>
                )}

                {/* Station node */}
                <div className="flex items-center gap-2 py-1">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 bg-[#071324] shadow-sm" />
                  <div>
                    <div className="text-[11px] font-bold text-slate-200">{stn.name}</div>
                    <div className="text-[9px] text-slate-400 font-mono">Code: {stn.code}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Detail Panel */}
        <div className="flex-1 min-h-[220px]">
          {sel ? (
            <div className="bg-[#0b1a2d] border border-[#203a5c] rounded p-3.5 space-y-3 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#1b3657] pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <ChevronRight size={14} className="text-amber-400" />
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                      Section Parameter: {sel.id}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-[#102136] px-2 py-0.5 rounded border border-[#203a5c]">
                    {sel.from} ➔ {sel.to}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#102136] p-2 rounded border border-[#203a5c]">
                    <div className="text-slate-400 uppercase text-[9px] font-bold">Track &amp; Traction</div>
                    <div className="text-slate-200 font-medium text-[11px] mt-1">{sel.track}</div>
                  </div>
                  <div className="bg-[#102136] p-2 rounded border border-[#203a5c]">
                    <div className="text-slate-400 uppercase text-[9px] font-bold">Active Trains</div>
                    <div className="text-sky-400 font-bold font-mono text-sm mt-0.5">{sel.activeTrains} Movements</div>
                  </div>
                  <div className="bg-[#102136] p-2 rounded border border-[#203a5c]">
                    <div className="text-slate-400 uppercase text-[9px] font-bold">Maintenance Requests</div>
                    <div className={`font-bold font-mono text-sm mt-0.5 ${sel.maintenanceReqs > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {sel.maintenanceReqs} Requests
                    </div>
                  </div>
                  <div className="bg-[#102136] p-2 rounded border border-[#203a5c]">
                    <div className="text-slate-400 uppercase text-[9px] font-bold">Current Block State</div>
                    <div className={`font-semibold text-xs mt-1 ${sel.currentBlock === 'None' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {sel.currentBlock}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 border-t border-[#1b3657] pt-2 flex items-center justify-between">
                <span>Signal System: Automatic Block (ABS)</span>
                <span className="text-slate-400">Headway: 15 min</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs text-center">
              Click a section label to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
