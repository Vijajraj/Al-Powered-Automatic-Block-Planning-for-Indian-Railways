import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const stations = [
  { id: 'MAS', name: 'CHENNAI', code: 'MAS' },
  { id: 'KPD', name: 'KANCHIPURAM', code: 'KPD' },
  { id: 'AJJ', name: 'ARCOT', code: 'AJJ' },
  { id: 'VLR', name: 'VELLORE', code: 'VLR' },
];

const sections = [
  { id: 'A-B', from: 'MAS', to: 'KPD', track: 'Double', activeTrains: 3, maintenanceReqs: 2, currentBlock: 'None' },
  { id: 'B-C', from: 'KPD', to: 'AJJ', track: 'Single', activeTrains: 2, maintenanceReqs: 1, currentBlock: 'None' },
  { id: 'C-D', from: 'AJJ', to: 'VLR', track: 'Single', activeTrains: 1, maintenanceReqs: 2, currentBlock: 'None' },
];

export default function SectionMap({ maintenance = [], trains = [] }) {
  const [selected, setSelected] = useState(null);

  // Enrich sections with live counts
  const enriched = sections.map((s) => ({
    ...s,
    activeTrains: trains.filter((t) => t.section === s.id).length || s.activeTrains,
    maintenanceReqs: maintenance.filter((m) => m.section === s.id).length || s.maintenanceReqs,
  }));

  const sel = enriched.find((s) => s.id === selected);

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded p-4">
      <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
        Network / Section View
      </div>

      <div className="flex gap-6">
        {/* Schematic rail diagram */}
        <div className="flex flex-col items-center gap-0 min-w-[160px]">
          {stations.map((stn, i) => {
            const sec = enriched[i - 1];
            const hasMaint = sec && sec.maintenanceReqs > 0;
            return (
              <div key={stn.id} className="flex flex-col items-center">
                {i > 0 && (
                  <button
                    onClick={() => setSelected(sec.id === selected ? null : sec.id)}
                    className={`flex flex-col items-center cursor-pointer group`}
                  >
                    {/* Section line */}
                    <div
                      className={`w-0.5 h-8 transition-colors ${
                        selected === sec.id
                          ? 'bg-amber-400'
                          : hasMaint
                          ? 'bg-amber-600'
                          : 'bg-slate-500'
                      }`}
                    />
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border transition-all ${
                        selected === sec.id
                          ? 'bg-amber-500 text-slate-900 border-amber-400'
                          : 'bg-[#263348] text-slate-400 border-[#334155] group-hover:border-amber-600 group-hover:text-amber-400'
                      }`}
                    >
                      {sec.id}
                    </span>
                    <div
                      className={`w-0.5 h-8 transition-colors ${
                        selected === sec.id
                          ? 'bg-amber-400'
                          : hasMaint
                          ? 'bg-amber-600'
                          : 'bg-slate-500'
                      }`}
                    />
                  </button>
                )}

                {/* Station node */}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-slate-400 bg-[#1e293b]" />
                  <div>
                    <div className="text-[11px] font-bold text-slate-200">{stn.name}</div>
                    <div className="text-[9px] text-slate-500 font-mono">{stn.code}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Detail Panel */}
        <div className="flex-1 min-h-[200px]">
          {sel ? (
            <div className="bg-[#263348] border border-[#334155] rounded p-4 space-y-3 h-full">
              <div className="flex items-center gap-2">
                <ChevronRight size={14} className="text-amber-400" />
                <span className="text-sm font-bold text-amber-400">Section {sel.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#1e293b] p-2 rounded border border-[#334155]">
                  <div className="text-slate-500 uppercase text-[10px] font-bold">Track Type</div>
                  <div className="text-slate-200 font-semibold mt-1">{sel.track}</div>
                </div>
                <div className="bg-[#1e293b] p-2 rounded border border-[#334155]">
                  <div className="text-slate-500 uppercase text-[10px] font-bold">Active Trains</div>
                  <div className="text-amber-400 font-bold font-mono mt-1">{sel.activeTrains}</div>
                </div>
                <div className="bg-[#1e293b] p-2 rounded border border-[#334155]">
                  <div className="text-slate-500 uppercase text-[10px] font-bold">Maintenance Reqs</div>
                  <div className={`font-bold font-mono mt-1 ${sel.maintenanceReqs > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {sel.maintenanceReqs}
                  </div>
                </div>
                <div className="bg-[#1e293b] p-2 rounded border border-[#334155]">
                  <div className="text-slate-500 uppercase text-[10px] font-bold">Current Block</div>
                  <div className={`font-semibold mt-1 ${sel.currentBlock === 'None' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {sel.currentBlock}
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500">
                {sel.from} → {sel.to}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-600 text-xs text-center">
              <div>
                <div className="text-2xl mb-2">🗺</div>
                Click a section label to view details
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
