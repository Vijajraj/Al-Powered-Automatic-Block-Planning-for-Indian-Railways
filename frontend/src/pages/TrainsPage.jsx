import { useEffect, useState } from 'react';
import { Filter, Train, Info } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import useAppStore from '../store/appStore';
import { fetchTrains } from '../api/client';
import { getTranslation } from '../utils/translations';

const SECTIONS = ['All', 'A-B', 'B-C', 'C-D'];

export default function TrainsPage() {
  const { trains, setTrains, setLoading, isLoading, lang } = useAppStore();
  const t = (key) => getTranslation(lang, key);
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
      <div className="border-b border-slate-300 pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold text-[#0f2744] uppercase tracking-wider">
              {t('trainsPageTitle')}
            </h1>
            <span className="px-2 py-0.5 bg-sky-100 text-sky-800 border border-sky-300 text-[10px] font-mono font-bold rounded">
              SOURCE: CONTROL OFFICE AUTOMATION (COA)
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            {t('trainsPageSub')}
          </p>
        </div>
        <div className="text-xs font-mono text-slate-800 bg-white px-3 py-1.5 rounded border border-slate-300 shadow-sm font-semibold">
          Tracking <strong className="text-sky-800">{filtered.length}</strong> Active Train Paths
        </div>
      </div>

      {/* Section filter bar */}
      <div className="gov-card p-3 flex flex-wrap items-center justify-between bg-white gap-3">
        <div className="flex items-center gap-3">
          <Filter size={14} className="text-amber-600" />
          <label className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-700 font-semibold">Corridor Section Filter:</span>
            <select
              value={section}
              onChange={e => setSection(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded px-2.5 py-1 focus:outline-none focus:border-amber-600 font-medium"
            >
              {SECTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 font-medium">
          <Info size={13} className="text-amber-600" />
          <span>Purpose: Evaluates headway gaps &amp; non-conflicting shadow paths for maintenance</span>
        </div>
      </div>

      {/* Train Table */}
      <div className="gov-card bg-white overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Train size={14} className="text-sky-700" />
            Scheduled Train Traffic Roster
          </span>
          <span className="text-[10px] text-slate-500 font-mono font-semibold">Southern Railway Operating Branch</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b-2 border-slate-300">
                {['Train No / ID', 'Train Nomenclature', 'Service Type', 'Section', 'Section Entry (Arr)', 'Section Exit (Dep)', 'Direction', 'Priority Ranking'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] uppercase font-bold tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading('trains') ? (
                <tr><td colSpan={8} className="text-center py-10 text-slate-400">Loading train timetable…</td></tr>
              ) : filtered.map((t, i) => (
                <tr key={t.id} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'} hover:bg-sky-50/50 transition`}>
                  <td className="px-4 py-3 font-mono font-bold text-sky-800">{t.id}</td>
                  <td className="px-4 py-3 text-slate-900 font-semibold">{t.name}</td>
                  <td className="px-4 py-3 text-slate-600">{t.type}</td>
                  <td className="px-4 py-3 font-mono text-slate-700 font-semibold">{t.section}</td>
                  <td className="px-4 py-3 font-mono text-emerald-700 font-bold">{t.arrival}</td>
                  <td className="px-4 py-3 font-mono text-rose-700 font-bold">{t.departure}</td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{t.direction} Line</td>
                  <td className="px-4 py-3"><StatusBadge status={t.priority} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between font-medium">
          <span>Automatic Signaled Territory: 15-Minute Safe Headway Buffer Maintained</span>
          <span className="font-mono">COA-LIVE-FEED</span>
        </div>
      </div>
    </div>
  );
}
