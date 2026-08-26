import { useEffect } from 'react';
import { Activity, Train, ClipboardList, Calendar } from 'lucide-react';
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
      {/* Page Header */}
      <div className="border-b border-[#334155] pb-3">
        <h1 className="text-lg font-bold text-slate-100 uppercase tracking-wide">Dashboard</h1>
        <p className="text-xs text-slate-500 mt-0.5">Real-time block planning overview · Chennai Division</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Active Sections"
          value={isLoading('dashboard') ? '…' : (sections.length || 12)}
          icon={Activity}
          color="emerald"
          sub="MAS–AJJ line sections"
        />
        <KpiCard
          label="Scheduled Trains"
          value={isLoading('dashboard') ? '…' : trains.length}
          icon={Train}
          color="blue"
          sub="Active in timetable"
        />
        <KpiCard
          label="Maintenance Requests"
          value={isLoading('dashboard') ? '…' : maintenance.length}
          icon={ClipboardList}
          color="rose"
          sub={`${pendingMaint} pending`}
        />
        <KpiCard
          label="Planned Blocks"
          value={isLoading('dashboard') ? '…' : (plannedBlocks || plan.length)}
          icon={Calendar}
          color="amber"
          sub="Ready for approval"
        />
      </div>

      {/* Two-column layout: Network View & Maintenance Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Section map */}
        <div className="lg:col-span-5">
          <SectionMap trains={trains} maintenance={maintenance} />
        </div>

        {/* Recent maintenance requests */}
        <div className="lg:col-span-7 bg-[#1e293b] border border-[#334155] rounded">
          <div className="px-4 py-3 border-b border-[#334155] flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Maintenance Requests</span>
            <span className="text-xs text-slate-600 font-mono">Showing {recent.length} of {maintenance.length}</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#334155]">
                {['ID', 'Section', 'Dept', 'Work', 'Priority', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((m, i) => (
                <tr key={m.id} className={`border-b border-[#263348] ${i % 2 === 0 ? '' : 'bg-[#172033]'} hover:bg-[#263348] transition`}>
                  <td className="px-4 py-2 font-mono font-bold text-amber-400">{m.id}</td>
                  <td className="px-4 py-2 font-mono text-slate-300">{m.section}</td>
                  <td className="px-4 py-2 text-slate-300">{m.department}</td>
                  <td className="px-4 py-2 text-slate-400">{m.workType}</td>
                  <td className="px-4 py-2"><StatusBadge status={m.priority} /></td>
                  <td className="px-4 py-2"><StatusBadge status={m.status} /></td>
                </tr>
              ))}
              {!recent.length && (
                <tr><td colSpan={6} className="text-center py-6 text-slate-600 text-xs">Loading…</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block Planning Timeline on Dashboard */}
      <div>
        <GanttChart
          trains={trains}
          plan={plan}
          title="Block Planning Timeline"
        />
      </div>
    </div>
  );
}

