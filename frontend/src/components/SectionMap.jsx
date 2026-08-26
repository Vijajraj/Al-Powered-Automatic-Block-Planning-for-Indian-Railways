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
    <div className="gov-card bg-white p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <MapPin size={14} className="text-amber-600" />
          Network / Section Schematic View
        </div>
        <span className="text-[10px] text-slate-500 font-mono font-medium">MAS Division Core Corridor</span>
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
                          ? 'bg-amber-500 shadow-sm'
                          : hasMaint
                          ? 'bg-amber-600'
                          : 'bg-slate-300'
                      }`}
                    />
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition-all ${
                        selected === sec.id
                          ? 'bg-amber-500 text-slate-950 border-amber-600 font-extrabold shadow-sm'
                          : 'bg-slate-100 text-slate-700 border-slate-300 group-hover:border-amber-500 group-hover:text-amber-700'
                      }`}
                    >
                      Section {sec.id}
                    </span>
                    <div
                      className={`w-1 h-6 transition-colors ${
                        selected === sec.id
                          ? 'bg-amber-500 shadow-sm'
                          : hasMaint
                          ? 'bg-amber-600'
                          : 'bg-slate-300'
                      }`}
                    />
                  </button>
                )}

                {/* Station node */}
                <div className="flex items-center gap-2 py-1">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-600 bg-white shadow-sm" />
                  <div>
                    <div className="text-[11px] font-bold text-slate-900">{stn.name}</div>
                    <div className="text-[9px] text-slate-500 font-mono font-semibold">Code: {stn.code}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Detail Panel */}
        <div className="flex-1 min-h-[220px]">
          {sel ? (
            <div className="bg-slate-50 border border-slate-200 rounded p-3.5 space-y-3 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <ChevronRight size={14} className="text-amber-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Section: {sel.id}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-300 font-medium">
                    {sel.from} ➔ {sel.to}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <div className="text-slate-500 uppercase text-[9px] font-bold">Track &amp; Traction</div>
                    <div className="text-slate-800 font-semibold text-[11px] mt-0.5">{sel.track}</div>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <div className="text-slate-500 uppercase text-[9px] font-bold">Active Trains</div>
                    <div className="text-sky-800 font-bold font-mono text-sm mt-0.5">{sel.activeTrains} Movements</div>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <div className="text-slate-500 uppercase text-[9px] font-bold">Maintenance Requests</div>
                    <div className={`font-bold font-mono text-sm mt-0.5 ${sel.maintenanceReqs > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {sel.maintenanceReqs} Requests
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <div className="text-slate-500 uppercase text-[9px] font-bold">Current Block State</div>
                    <div className={`font-bold text-xs mt-1 ${sel.currentBlock === 'None' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {sel.currentBlock}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 border-t border-slate-200 pt-2 flex items-center justify-between font-medium">
                <span>Signal System: Automatic Block (ABS)</span>
                <span>Headway: 15 min</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs text-center">
              Click a section label to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
