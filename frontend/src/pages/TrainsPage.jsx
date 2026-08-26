import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
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
      <div className="border-b border-[#334155] pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">Train Schedule</h1>
          <p className="text-xs text-slate-500 mt-0.5">Active train movements — section traffic that block planning must work around</p>
        </div>
        <div className="text-xs font-mono text-slate-500">{filtered.length} trains</div>
      </div>

      {/* Section filter */}
      <div className="bg-[#1e293b] border border-[#334155] rounded p-3 flex items-center gap-3">
        <Filter size={14} className="text-slate-500" />
        <label className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-semibold">Section:</span>
          <select
            value={section}
            onChange={e => setSection(e.target.value)}
            className="bg-[#0f172a] border border-[#334155] text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-amber-500"
          >
            {SECTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </label>
        <div className="ml-auto text-[10px] text-slate-600">
          Purpose: Judges can see train traffic that the block planner must avoid
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] border border-[#334155] rounded overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#334155]">
              {['Train ID', 'Name', 'Type', 'Section', 'Arrival', 'Departure', 'Direction', 'Priority'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading('trains') ? (
              <tr><td colSpan={8} className="text-center py-10 text-slate-600">Loading train data…</td></tr>
            ) : filtered.map((t, i) => (
              <tr key={t.id} className={`border-b border-[#263348] ${i % 2 === 0 ? '' : 'bg-[#172033]'} hover:bg-[#263348] transition`}>
                <td className="px-4 py-2.5 font-mono font-bold text-blue-400">{t.id}</td>
                <td className="px-4 py-2.5 text-slate-200 font-medium">{t.name}</td>
                <td className="px-4 py-2.5 text-slate-400">{t.type}</td>
                <td className="px-4 py-2.5 font-mono text-slate-300">{t.section}</td>
                <td className="px-4 py-2.5 font-mono text-emerald-400">{t.arrival}</td>
                <td className="px-4 py-2.5 font-mono text-rose-400">{t.departure}</td>
                <td className="px-4 py-2.5 text-slate-400">{t.direction}</td>
                <td className="px-4 py-2.5"><StatusBadge status={t.priority} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
