import { useEffect, useState } from 'react';
import { Filter, Train, Info } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import useAppStore from '../store/appStore';
import { fetchTrains } from '../api/client';

const SECTIONS = ['All', 'A-B', 'B-C', 'C-D'];

export default function TrainsPage() {
  const { trains, setTrains, setLoading, isLoading } = useAppStore();
  const [section, setSection] = useState('All');

  useEffect(() => {
    async function load() {
      setLoading('trains', true);
      const data = await fetchTrains();
      setTrains(data);
      setLoading('trains', false);
    }
    if (!trains.length) load();
  }, []);

  const filtered = trains.filter(t => section === 'All' || t.section === section);

  return (
    <div className="space-y-5">
      {/* Official Heading */}
      <div className="border-b border-[#203a5c] pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-white uppercase tracking-wider">
              TRAIN WORKING TIMETABLE &amp; TRAFFIC DENSITY
            </h1>
            <span className="px-2 py-0.5 bg-[#0b1a2d] text-sky-400 border border-[#203a5c] text-[10px] font-mono font-bold rounded">
              SOURCE: CONTROL OFFICE AUTOMATION (COA)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Active scheduled train movements — baseline traffic constraints that block planning must work around
          </p>
        </div>
        <div className="text-xs font-mono text-slate-300 bg-[#0b1a2d] px-3 py-1.5 rounded border border-[#203a5c]">
          Tracking <strong className="text-sky-400">{filtered.length}</strong> Active Train Paths
        </div>
      </div>

      {/* Section filter bar */}
      <div className="gov-card p-3 flex flex-wrap items-center justify-between bg-[#0b1a2d] gap-3">
        <div className="flex items-center gap-3">
          <Filter size={14} className="text-amber-400" />
          <label className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-300 font-semibold">Corridor Section Filter:</span>
            <select
              value={section}
              onChange={e => setSection(e.target.value)}
              className="bg-[#081526] border border-[#203a5c] text-slate-200 text-xs rounded px-2.5 py-1 focus:outline-none focus:border-amber-500 font-medium"
            >
              {SECTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-[#081526] px-2.5 py-1 rounded border border-[#1b3657]">
          <Info size={12} className="text-amber-400" />
          <span>Purpose: Evaluates headway gaps &amp; non-conflicting shadow paths for maintenance</span>
        </div>
      </div>

      {/* Train Table */}
      <div className="gov-card overflow-hidden">
        <div className="px-4 py-2.5 bg-[#0b1a2d] border-b border-[#203a5c] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Train size={13} className="text-sky-400" />
            Scheduled Train Traffic Roster
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Southern Railway Operating Branch</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#081526] text-slate-300 border-b-2 border-[#203a5c]">
                {['Train No / ID', 'Train Nomenclature', 'Service Type', 'Section', 'Section Entry (Arr)', 'Section Exit (Dep)', 'Direction', 'Priority Ranking'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] uppercase font-bold tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading('trains') ? (
                <tr><td colSpan={8} className="text-center py-10 text-slate-500">Loading train timetable…</td></tr>
              ) : filtered.map((t, i) => (
                <tr key={t.id} className={`border-b border-[#182e49] ${i % 2 === 0 ? 'bg-[#0d1e33]' : 'bg-[#0a1829]'} hover:bg-[#142842] transition`}>
                  <td className="px-4 py-2.5 font-mono font-bold text-sky-400">{t.id}</td>
                  <td className="px-4 py-2.5 text-slate-200 font-medium">{t.name}</td>
                  <td className="px-4 py-2.5 text-slate-300">{t.type}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300 font-medium">{t.section}</td>
                  <td className="px-4 py-2.5 font-mono text-emerald-400 font-bold">{t.arrival}</td>
                  <td className="px-4 py-2.5 font-mono text-rose-400 font-bold">{t.departure}</td>
                  <td className="px-4 py-2.5 text-slate-300 font-medium">{t.direction} Line</td>
                  <td className="px-4 py-2.5"><StatusBadge status={t.priority} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 bg-[#081526] border-t border-[#203a5c] text-[11px] text-slate-500 flex items-center justify-between">
          <span>Automatic Signaled Territory: 15-Minute Safe Headway Buffer Maintained</span>
          <span className="font-mono">COA-LIVE-FEED</span>
        </div>
      </div>
    </div>
  );
}
