import { useEffect, useState } from 'react';
import { Filter, RotateCcw, ClipboardList, ShieldAlert } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import useAppStore from '../store/appStore';
import { fetchMaintenance } from '../api/client';
import { getTranslation } from '../utils/translations';

const DEPTS = ['All', 'Engineering', 'TRD', 'S&T'];
const PRIORITIES = ['All', 'Critical', 'High', 'Medium', 'Low'];
const SECTIONS = ['All', 'A-B', 'B-C', 'C-D'];
const STATUSES = ['All', 'Pending', 'Planned'];

export default function MaintenancePage() {
  const { maintenance, setMaintenance, setLoading, isLoading, lang } = useAppStore();
  const t = (key) => getTranslation(lang, key);
  const [dept, setDept] = useState('All');
  const [priority, setPriority] = useState('All');
  const [section, setSection] = useState('All');
  const [status, setStatus] = useState('All');

  useEffect(() => {
    async function load() {
      setLoading('maint', true);
      const data = await fetchMaintenance();
      setMaintenance(data);
      setLoading('maint', false);
    }
    if (!maintenance.length) load();
  }, []);

  const filtered = maintenance.filter(m =>
    (dept === 'All' || m.department === dept) &&
    (priority === 'All' || m.priority === priority) &&
    (section === 'All' || m.section === section) &&
    (status === 'All' || m.status === status)
  );

  return (
    <div className="space-y-5">
      {/* Official Heading */}
      <div className="border-b border-slate-300 pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold text-[#0f2744] uppercase tracking-wider">
              {t('maintPageTitle')}
            </h1>
            <span className="px-2 py-0.5 bg-slate-100 text-amber-800 border border-slate-300 text-[10px] font-mono font-bold rounded">
              FORM: IR-ENGG-BLK-01
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            {t('maintPageSub')}
          </p>
        </div>
        <div className="text-xs font-mono text-slate-800 bg-white px-3 py-1.5 rounded border border-slate-300 shadow-sm font-semibold">
          Displaying <strong className="text-amber-700">{filtered.length}</strong> of {maintenance.length} Active Records
        </div>
      </div>

      {/* Government Filter Control Bar */}
      <div className="gov-card p-3 flex flex-wrap gap-4 items-center justify-between bg-white">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
            <Filter size={14} className="text-amber-600" /> Filters:
          </span>
          <GovSelect label="Department" value={dept} onChange={setDept} options={DEPTS} />
          <GovSelect label="Priority" value={priority} onChange={setPriority} options={PRIORITIES} />
          <GovSelect label="Section" value={section} onChange={setSection} options={SECTIONS} />
          <GovSelect label="Sanction Status" value={status} onChange={setStatus} options={STATUSES} />
        </div>
        <button
          onClick={() => { setDept('All'); setPriority('All'); setSection('All'); setStatus('All'); }}
          className="text-xs text-slate-500 hover:text-amber-700 flex items-center gap-1 font-semibold transition cursor-pointer"
        >
          <RotateCcw size={12} /> Clear Filter Criteria
        </button>
      </div>

      {/* Official Maintenance Table */}
      <div className="gov-card bg-white overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <ClipboardList size={14} className="text-amber-600" />
            Registered Maintenance Works Register
          </span>
          <span className="text-[10px] text-slate-500 font-mono font-semibold">Control Office Sanction Protocol</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b-2 border-slate-300">
                {['Req ID', 'Section', 'Department', 'Nature of Work', 'Priority Index', 'Duration', 'Requested Slot', 'Sanction Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] uppercase font-bold tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading('maint') ? (
                <tr><td colSpan={8} className="text-center py-10 text-slate-400">Loading maintenance requests…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-slate-400">No records match the selected filters</td></tr>
              ) : (
                filtered.map((m, i) => (
                  <tr key={m.id} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'} hover:bg-amber-50/50 transition`}>
                    <td className="px-4 py-3 font-mono font-bold text-amber-800">{m.id}</td>
                    <td className="px-4 py-3 font-mono text-slate-800 font-semibold">{m.section}</td>
                    <td className="px-4 py-3 text-slate-800 font-semibold">{m.department}</td>
                    <td className="px-4 py-3 text-slate-600">{m.workType}</td>
                    <td className="px-4 py-3"><StatusBadge status={m.priority} /></td>
                    <td className="px-4 py-3 font-mono text-slate-900 font-bold">{m.duration} min</td>
                    <td className="px-4 py-3 font-mono text-slate-700 font-medium">{m.requestedSlot}</td>
                    <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldAlert size={13} className="text-amber-600" />
            Critical &amp; High priority works receive strict non-cancellable operating window slots.
          </span>
          <span className="font-mono text-slate-500">MAS-ENGG-SYS</span>
        </div>
      </div>
    </div>
  );
}

function GovSelect({ label, value, onChange, options }) {
  return (
    <label className="flex items-center gap-1.5 text-xs">
      <span className="text-slate-600 font-semibold">{label}:</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded px-2.5 py-1 focus:outline-none focus:border-amber-600 font-medium"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
