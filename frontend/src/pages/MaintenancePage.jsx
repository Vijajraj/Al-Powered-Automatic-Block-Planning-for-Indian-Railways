import { useEffect, useState } from 'react';
import { Filter, RotateCcw, ClipboardList, ShieldAlert } from 'lucide-react';
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
      {/* Official Heading */}
      <div className="border-b border-[#203a5c] pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-white uppercase tracking-wider">
              DEPARTMENTAL MAINTENANCE REQUESTS QUEUE
            </h1>
            <span className="px-2 py-0.5 bg-[#0b1a2d] text-amber-400 border border-[#203a5c] text-[10px] font-mono font-bold rounded">
              FORM: IR-ENGG-BLK-01
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Civil Engineering, Electrical (TRD 25kV OHE), and Signal &amp; Telecom (S&amp;T) block sanction intake register
          </p>
        </div>
        <div className="text-xs font-mono text-slate-300 bg-[#0b1a2d] px-3 py-1.5 rounded border border-[#203a5c]">
          Displaying <strong className="text-amber-400">{filtered.length}</strong> of {maintenance.length} Active Records
        </div>
      </div>

      {/* Government Filter Control Bar */}
      <div className="gov-card p-3 flex flex-wrap gap-4 items-center justify-between bg-[#0b1a2d]">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wide">
            <Filter size={13} className="text-amber-400" /> Filters:
          </span>
          <GovSelect label="Department" value={dept} onChange={setDept} options={DEPTS} />
          <GovSelect label="Priority" value={priority} onChange={setPriority} options={PRIORITIES} />
          <GovSelect label="Section" value={section} onChange={setSection} options={SECTIONS} />
          <GovSelect label="Sanction Status" value={status} onChange={setStatus} options={STATUSES} />
        </div>
        <button
          onClick={() => { setDept('All'); setPriority('All'); setSection('All'); setStatus('All'); }}
          className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 font-semibold transition"
        >
          <RotateCcw size={12} /> Clear Filter Criteria
        </button>
      </div>

      {/* Official Maintenance Table */}
      <div className="gov-card overflow-hidden">
        <div className="px-4 py-2.5 bg-[#0b1a2d] border-b border-[#203a5c] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <ClipboardList size={13} className="text-amber-400" />
            Registered Maintenance Works Register
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Control Office Sanction Protocol</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#081526] text-slate-300 border-b-2 border-[#203a5c]">
                {['Req ID', 'Section', 'Department', 'Nature of Work', 'Priority Index', 'Duration', 'Requested Slot', 'Sanction Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] uppercase font-bold tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading('maint') ? (
                <tr><td colSpan={8} className="text-center py-10 text-slate-500">Loading maintenance requests…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-slate-500">No records match the selected filters</td></tr>
              ) : (
                filtered.map((m, i) => (
                  <tr key={m.id} className={`border-b border-[#182e49] ${i % 2 === 0 ? 'bg-[#0d1e33]' : 'bg-[#0a1829]'} hover:bg-[#142842] transition`}>
                    <td className="px-4 py-2.5 font-mono font-bold text-amber-400">{m.id}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-200 font-medium">{m.section}</td>
                    <td className="px-4 py-2.5 text-slate-200 font-medium">{m.department}</td>
                    <td className="px-4 py-2.5 text-slate-300">{m.workType}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={m.priority} /></td>
                    <td className="px-4 py-2.5 font-mono text-slate-200 font-bold">{m.duration} min</td>
                    <td className="px-4 py-2.5 font-mono text-amber-300/90">{m.requestedSlot}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={m.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 bg-[#081526] border-t border-[#203a5c] text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldAlert size={12} className="text-amber-400" />
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
      <span className="text-slate-400 font-semibold">{label}:</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-[#081526] border border-[#203a5c] text-slate-200 text-xs rounded px-2.5 py-1 focus:outline-none focus:border-amber-500 font-medium"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
