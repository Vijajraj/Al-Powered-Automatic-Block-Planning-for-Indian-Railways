import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import useAppStore from '../store/appStore';
import { fetchMaintenance } from '../api/client';

const DEPTS = ['All', 'Engineering', 'TRD', 'S&T'];
const PRIORITIES = ['All', 'Critical', 'High', 'Medium', 'Low'];
const SECTIONS = ['All', 'A-B', 'B-C', 'C-D'];
const STATUSES = ['All', 'Pending', 'Planned'];

export default function MaintenancePage() {
  const { maintenance, setMaintenance, setLoading, isLoading } = useAppStore();
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
      <div className="border-b border-[#334155] pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">Maintenance Requests</h1>
          <p className="text-xs text-slate-500 mt-0.5">Department-wise maintenance work queue — Chennai Division</p>
        </div>
        <div className="text-xs font-mono text-slate-500">{filtered.length} of {maintenance.length} records</div>
      </div>

      {/* Filters */}
      <div className="bg-[#1e293b] border border-[#334155] rounded p-3 flex flex-wrap gap-3 items-center">
        <Filter size={14} className="text-slate-500" />
        <Select label="Dept" value={dept} onChange={setDept} options={DEPTS} />
        <Select label="Priority" value={priority} onChange={setPriority} options={PRIORITIES} />
        <Select label="Section" value={section} onChange={setSection} options={SECTIONS} />
        <Select label="Status" value={status} onChange={setStatus} options={STATUSES} />
        <button
          onClick={() => { setDept('All'); setPriority('All'); setSection('All'); setStatus('All'); }}
          className="text-xs text-slate-500 hover:text-slate-300 ml-auto"
        >
          Clear filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] border border-[#334155] rounded overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#334155]">
              {['Request ID', 'Section', 'Department', 'Work Type', 'Priority', 'Duration', 'Requested Slot', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading('maint') ? (
              <tr><td colSpan={8} className="text-center py-10 text-slate-600">Loading maintenance requests…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-10 text-slate-600">No records match the selected filters</td></tr>
            ) : (
              filtered.map((m, i) => (
                <tr key={m.id} className={`border-b border-[#263348] ${i % 2 === 0 ? '' : 'bg-[#172033]'} hover:bg-[#263348] transition`}>
                  <td className="px-4 py-2.5 font-mono font-bold text-amber-400">{m.id}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">{m.section}</td>
                  <td className="px-4 py-2.5 text-slate-300 font-medium">{m.department}</td>
                  <td className="px-4 py-2.5 text-slate-400">{m.workType}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={m.priority} /></td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">{m.duration} min</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">{m.requestedSlot}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={m.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex items-center gap-1.5 text-xs">
      <span className="text-slate-500 font-semibold">{label}:</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-[#0f172a] border border-[#334155] text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-amber-500"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
