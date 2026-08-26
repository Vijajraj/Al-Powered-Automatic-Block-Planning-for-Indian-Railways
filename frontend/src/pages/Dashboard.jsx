import { useEffect } from 'react';
import { Activity, Train, ClipboardList, Calendar, Layers, ShieldCheck } from 'lucide-react';
import KpiCard from '../components/KpiCard';
import SectionMap from '../components/SectionMap';
import StatusBadge from '../components/StatusBadge';
import GanttChart from '../components/GanttChart';
import useAppStore from '../store/appStore';
import { fetchTrains, fetchMaintenance } from '../api/client';
import { getTranslation } from '../utils/translations';

export default function Dashboard() {
  const { trains, maintenance, planResult, setTrains, setMaintenance, setLoading, isLoading, lang } = useAppStore();
  const t = (key) => getTranslation(lang, key);

  useEffect(() => {
    async function load() {
      setLoading('dashboard', true);
      const [tr, m] = await Promise.all([fetchTrains(), fetchMaintenance()]);
      setTrains(tr);
      setMaintenance(m);
      setLoading('dashboard', false);
    }
    if (!trains.length || !maintenance.length) load();
  }, []);

  const sections = [...new Set([...trains.map(tr => tr.section), ...maintenance.map(m => m.section)])];
  const pendingMaint = maintenance.filter(m => m.status === 'Pending').length;
  const plannedBlocks = maintenance.filter(m => m.status === 'Planned').length;

  const recent = [...maintenance].slice(0, 5);
  const plan = planResult?.optimized_plan || [];

  return (
    <div className="space-y-5">
      {/* Official Government Page Title */}
      <div className="border-b border-slate-300 pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold text-[#0f2744] uppercase tracking-wider">
              {t('dashboard')}
            </h1>
            <span className="px-2 py-0.5 bg-slate-100 text-amber-800 border border-slate-300 text-[10px] font-mono font-bold rounded">
              ZONE: SR · DIV: MAS
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            {t('subTitle')}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-700 bg-white px-3 py-1.5 rounded border border-slate-300 shadow-sm">
          <ShieldCheck size={15} className="text-emerald-600" />
          <span className="font-bold">COA Headway Link: SYNCHRONIZED</span>
        </div>
      </div>

      {/* 4 Operational KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label={t('kpiActiveSections')}
          value={isLoading('dashboard') ? '…' : (sections.length || 4)}
          icon={Activity}
          color="emerald"
          sub="MAS–AJJ Core Corridor"
        />
        <KpiCard
          label={t('kpiScheduledTrains')}
          value={isLoading('dashboard') ? '…' : trains.length}
          icon={Train}
          color="blue"
          sub="Active Working Timetable"
        />
        <KpiCard
          label={t('kpiMaintenanceReqs')}
          value={isLoading('dashboard') ? '…' : maintenance.length}
          icon={ClipboardList}
          color="rose"
          sub={`${pendingMaint} Pending Sanction`}
        />
        <KpiCard
          label={t('kpiPlannedBlocks')}
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
        <div className="lg:col-span-7 gov-card bg-white flex flex-col justify-between">
          <div>
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Layers size={14} className="text-amber-600" />
                {t('maintQueueTitle')}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Top 5 Requests</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-mono uppercase text-[10.5px]">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Section</th>
                    <th className="px-3 py-2">Department</th>
                    <th className="px-3 py-2">Work Type</th>
                    <th className="px-3 py-2">Priority</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recent.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50 font-medium">
                      <td className="px-3 py-2 font-mono font-bold text-slate-900">{m.id}</td>
                      <td className="px-3 py-2 font-mono text-slate-700">{m.section}</td>
                      <td className="px-3 py-2">{m.department}</td>
                      <td className="px-3 py-2 text-slate-700">{m.workType}</td>
                      <td className="px-3 py-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          m.priority === 'Critical' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                          m.priority === 'High' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}>
                          {m.priority}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <StatusBadge status={m.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* S&T / Spatio-temporal Gantt chart view */}
      <GanttChart
        trains={trains}
        plan={plan}
        title={t('timelineTitle')}
      />
    </div>
  );
}
