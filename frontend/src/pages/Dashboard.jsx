import { useEffect } from 'react';
import { Activity, Train, ClipboardList, Calendar, Layers, ShieldCheck } from 'lucide-react';
import KpiCard from '../components/KpiCard';
import SectionMap from '../components/SectionMap';
import StatusBadge from '../components/StatusBadge';
import GanttChart from '../components/GanttChart';
import useAppStore from '../store/appStore';
import { fetchTrains, fetchMaintenance } from '../api/client';

export default function Dashboard() {
  const { trains, maintenance, planResult, setTrains, setMaintenance, setLoading, isLoading } = useAppStore();

  useEffect(() => {
    async function load() {
      setLoading('dashboard', true);
      const [t, m] = await Promise.all([fetchTrains(), fetchMaintenance()]);
      setTrains(t);
      setMaintenance(m);
      setLoading('dashboard', false);
    }
    if (!trains.length || !maintenance.length) load();
  }, []);

  const sections = [...new Set([...trains.map(t => t.section), ...maintenance.map(m => m.section)])];
  const pendingMaint = maintenance.filter(m => m.status === 'Pending').length;
  const plannedBlocks = maintenance.filter(m => m.status === 'Planned').length;

  const recent = [...maintenance].slice(0, 5);
  const plan = planResult?.optimized_plan || [];

  return (
    <div className="space-y-5">
      {/* Official Government Page Title */}
      <div className="border-b border-[#203a5c] pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-white uppercase tracking-wider">
              OPERATIONAL CONTROL DASHBOARD
            </h1>
            <span className="px-2 py-0.5 bg-[#0b1a2d] text-amber-400 border border-[#203a5c] text-[10px] font-mono font-bold rounded">
              ZONE: SR · DIV: MAS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time Block Planning &amp; Maintenance Management Overview · Southern Railway (Chennai Control Office)
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#0b1a2d] px-3 py-1.5 rounded border border-[#203a5c]">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>COA Headway Link: SYNCHRONIZED</span>
        </div>
      </div>

      {/* 4 Operational KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Active Sections"
          value={isLoading('dashboard') ? '…' : (sections.length || 12)}
          icon={Activity}
          color="emerald"
          sub="MAS–AJJ Core Corridor"
        />
        <KpiCard
          label="Scheduled Trains"
          value={isLoading('dashboard') ? '…' : trains.length}
          icon={Train}
          color="blue"
          sub="Active Working Timetable"
        />
        <KpiCard
          label="Maintenance Requests"
          value={isLoading('dashboard') ? '…' : maintenance.length}
          icon={ClipboardList}
          color="rose"
          sub={`${pendingMaint} Pending Sanction`}
        />
        <KpiCard
          label="Planned Blocks"
          value={isLoading('dashboard') ? '…' : (plannedBlocks || plan.length)}
          icon={Calendar}
          color="amber"
          sub="Sanctioned / Ready"
        />
      </div>

      {/* Two-column layout: Network View & Maintenance Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Section map */}
        <div className="lg:col-span-5">
          <SectionMap trains={trains} maintenance={maintenance} />
        </div>

        {/* Recent maintenance requests */}
        <div className="lg:col-span-7 gov-card flex flex-col justify-between">
          <div>
            <div className="px-4 py-3 border-b border-[#203a5c] bg-[#0b1a2d] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Layers size={13} className="text-amber-400" />
                Departmental Maintenance Queue
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Showing {recent.length} of {maintenance.length} Active</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#081526] text-slate-400 border-b border-[#203a5c]">
                    {['Req ID', 'Section', 'Dept', 'Work Description', 'Priority', 'Status'].map(h => (
                      <th key={h} className="text-left px-3.5 py-2.5 text-[10px] uppercase font-bold tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((m, i) => (
                    <tr key={m.id} className={`border-b border-[#182e49] ${i % 2 === 0 ? 'bg-[#0d1e33]' : 'bg-[#0a1829]'} hover:bg-[#142842] transition`}>
                      <td className="px-3.5 py-2 font-mono font-bold text-amber-400">{m.id}</td>
                      <td className="px-3.5 py-2 font-mono text-slate-200 font-medium">{m.section}</td>
                      <td className="px-3.5 py-2 text-slate-300 font-medium">{m.department}</td>
                      <td className="px-3.5 py-2 text-slate-400">{m.workType}</td>
                      <td className="px-3.5 py-2"><StatusBadge status={m.priority} /></td>
                      <td className="px-3.5 py-2"><StatusBadge status={m.status} /></td>
                    </tr>
                  ))}
                  {!recent.length && (
                    <tr><td colSpan={6} className="text-center py-6 text-slate-500 text-xs">Loading queue…</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="px-4 py-2 border-t border-[#203a5c] bg-[#0b1a2d] text-[10px] text-slate-400 flex items-center justify-between">
            <span>Priority Order: Critical ➔ High ➔ Medium ➔ Low</span>
            <span className="text-amber-400 font-medium">Auto-synced with PWI Logbook</span>
          </div>
        </div>
      </div>

      {/* Block Planning Timeline on Dashboard */}
      <div>
        <GanttChart
          trains={trains}
          plan={plan}
          title="Section Spatio-Temporal Master Timeline (07:00 – 18:00)"
        />
      </div>
    </div>
  );
}
