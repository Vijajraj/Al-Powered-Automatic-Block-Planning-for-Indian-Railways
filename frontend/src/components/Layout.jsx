import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, Train, Calendar,
  AlertTriangle, CheckSquare, Activity
} from 'lucide-react';

const NAV = [
  { to: '/',             label: 'Dashboard',         icon: LayoutDashboard },
  { to: '/maintenance',  label: 'Maintenance',        icon: ClipboardList },
  { to: '/trains',       label: 'Trains',             icon: Train },
  { to: '/block-planning', label: 'Block Planning',   icon: Calendar },
  { to: '/disruptions',  label: 'Disruptions',        icon: AlertTriangle },
  { to: '/approvals',    label: 'Approvals',          icon: CheckSquare },
];

export default function Layout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0f172a] text-slate-100">

      {/* Sidebar */}
      <aside className="w-52 shrink-0 bg-[#0a1628] border-r border-[#1e3a5f] flex flex-col">
        {/* Logo bar */}
        <div className="px-4 py-4 border-b border-[#1e3a5f]">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest leading-none">
            AI BLOCK PLANNING
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5 font-mono uppercase tracking-wide">
            Indian Railways · SIH 2025
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border-r-2 border-amber-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1e293b]'
                }`
              }
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#1e3a5f] text-[9px] text-slate-600 font-mono">
          Chennai Division · MAS-CTRL-04
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-10 shrink-0 bg-[#0a1628] border-b border-[#1e3a5f] flex items-center justify-between px-5">
          <div className="text-xs text-slate-400 font-mono">
            Block Planning &amp; Maintenance Management System — Southern Railway
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Activity size={11} className="animate-pulse" /> SYSTEM: ONLINE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500 font-mono">25 Aug 2026 · Day Shift</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 space-y-5">
          {children}
        </main>
      </div>
    </div>
  );
}
