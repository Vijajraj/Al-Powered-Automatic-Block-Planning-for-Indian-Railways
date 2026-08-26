import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, Train, Calendar,
  AlertTriangle, CheckSquare, Activity, UserCheck, Bell, Shield
} from 'lucide-react';

const NAV = [
  { to: '/',               label: 'Dashboard',            icon: LayoutDashboard },
  { to: '/maintenance',    label: 'Maintenance Requests',  icon: ClipboardList },
  { to: '/trains',         label: 'Train Timetable',       icon: Train },
  { to: '/block-planning', label: 'Block Planning',       icon: Calendar },
  { to: '/disruptions',    label: 'Disruption Log',        icon: AlertTriangle },
  { to: '/approvals',      label: 'Safety Approvals',      icon: CheckSquare },
];

export default function Layout({ children }) {
  const [fontSize, setFontSize] = useState('normal'); // 'small', 'normal', 'large'
  const [lang, setLang] = useState('EN');

  const fontClass = fontSize === 'small' ? 'text-[92%]' : fontSize === 'large' ? 'text-[108%]' : '';

  return (
    <div className={`min-h-screen flex flex-col bg-[#071324] text-slate-100 antialiased ${fontClass}`}>

      {/* ── 1. GIGW TOP NATIONAL ACCESSIBILITY BAR ─────────────────────────── */}
      <div className="bg-[#040c17] text-slate-300 text-xs border-b border-[#162a42]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
          
          {/* Left: Bilingual Government Identity */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white tracking-wide">भारत सरकार</span>
              <span className="text-slate-600">|</span>
              <span className="font-semibold text-white tracking-wide">Government of India</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <span>रेल मंत्रालय</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">Ministry of Railways</span>
            </div>
          </div>

          {/* Right: Operational Details & Accessibility */}
          <div className="flex items-center gap-3 text-xs">
            <div className="hidden md:flex items-center gap-1.5 bg-[#0e1e33] px-2.5 py-0.5 rounded border border-[#1b3454]">
              <span className="text-slate-400">Division:</span>
              <strong className="text-amber-400 font-mono">Southern Railway · Chennai (MAS)</strong>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 border-l border-[#1b3454] pl-3">
              <span className="text-slate-400">Shift:</span>
              <span className="text-slate-200 font-medium">Day (06:00 - 14:00)</span>
            </div>

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="px-2 py-0.5 bg-[#0e1e33] hover:bg-[#162b46] text-amber-400 rounded text-[11px] border border-[#1b3454] font-bold"
            >
              {lang === 'EN' ? 'हिन्दी' : 'English'}
            </button>

            {/* Accessibility font size */}
            <div className="flex items-center gap-1 border-l border-[#1b3454] pl-3">
              <button
                onClick={() => setFontSize('small')}
                title="Decrease font size"
                className={`px-1.5 py-0.5 rounded text-[11px] border ${fontSize === 'small' ? 'bg-amber-500 text-slate-900 border-amber-400 font-bold' : 'bg-[#0e1e33] hover:bg-[#162b46] text-slate-300 border-[#1b3454]'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('normal')}
                title="Reset font size"
                className={`px-1.5 py-0.5 rounded text-[11px] border ${fontSize === 'normal' ? 'bg-amber-500 text-slate-900 border-amber-400 font-bold' : 'bg-[#0e1e33] hover:bg-[#162b46] text-slate-300 border-[#1b3454]'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                title="Increase font size"
                className={`px-1.5 py-0.5 rounded text-[11px] border ${fontSize === 'large' ? 'bg-amber-500 text-slate-900 border-amber-400 font-bold' : 'bg-[#0e1e33] hover:bg-[#162b46] text-slate-300 border-[#1b3454]'}`}
              >
                A+
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. NATIONAL TRICOLOR RIBBON ────────────────────────────────────── */}
      <div className="tricolor-bar"></div>

      {/* ── 3. MAIN PORTAL HEADER ──────────────────────────────────────────── */}
      <header className="bg-[#0b1a2d] border-b border-[#1d3758] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          
          {/* Emblem & Portal Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-[#061120] text-amber-400 flex items-center justify-center rounded border border-[#23456e] shadow-inner">
              <Train size={24} className="text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-base sm:text-lg font-extrabold text-white tracking-wide uppercase">
                  AI BLOCK PLANNING &amp; MAINTENANCE MANAGEMENT
                </h1>
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-600 text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
                  <Activity size={10} className="animate-pulse text-emerald-400" /> SYSTEM: ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Indian Railways • Operating &amp; Engineering Department (Control Office, Chennai Division)
              </p>
            </div>
          </div>

          {/* Section Controller ID badge */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-amber-400 font-mono">Console: MAS-CTRL-04</div>
              <div className="text-[10px] text-slate-400 font-mono">COA Integration: Active • FOIS Sync: OK</div>
            </div>
            <div className="w-9 h-9 bg-[#061120] border border-[#23456e] rounded flex items-center justify-center text-slate-300">
              <UserCheck size={18} className="text-amber-400" />
            </div>
          </div>
        </div>

        {/* ── 4. GOVERNMENT NAVIGATION MENU BAR ────────────────────────────── */}
        <nav className="bg-[#061120] text-slate-200 border-t border-[#162a42]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between text-xs font-semibold">
            <div className="flex flex-wrap items-center">
              {NAV.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `px-3.5 py-2.5 flex items-center gap-1.5 transition border-r border-[#162a42] ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-[#0e1e33]'
                    }`
                  }
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-2 text-slate-400 pr-2 text-[11px] font-mono">
              <Shield size={12} className="text-emerald-400" />
              <span>Safety Interlocking: ENABLED</span>
            </div>
          </div>
        </nav>
      </header>

      {/* ── 5. OPERATIONAL NOTICE / ALERT TICKER ────────────────────────────── */}
      <div className="bg-[#0d2238] border-b border-[#1b3b61] text-xs px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 bg-amber-600 text-slate-950 font-bold text-[10px] rounded uppercase tracking-wider flex items-center gap-1">
              <Bell size={10} /> NOTICE
            </span>
            <span className="text-slate-200 text-xs">
              Section A-B (Chennai – Kanchipuram) track renewal maintenance blocks scheduled. Preceding caution orders synchronized with COA portal.
            </span>
          </div>
          <span className="text-[11px] font-mono text-amber-400/90 font-semibold hidden md:inline">
            Ref: MAS-DIV-OP-2026/84
          </span>
        </div>
      </div>

      {/* ── 6. MAIN WORKSPACE CONTENT ──────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex-1 w-full space-y-5">
        {children}
      </main>

      {/* ── 7. OFFICIAL INDIAN GOVERNMENT FOOTER ────────────────────────────── */}
      <footer className="bg-[#040c17] border-t border-[#162a42] text-slate-400 text-xs mt-auto">
        <div className="tricolor-bar"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#162a42] pb-3">
            <div>
              <div className="font-bold text-slate-200">Ministry of Railways, Government of India</div>
              <div className="text-[11px] text-slate-500">Southern Railway Zone • Chennai Division Control Office</div>
            </div>
            <div className="text-right text-[11px]">
              <div className="text-slate-300 font-medium">Designed, Developed &amp; Hosted by</div>
              <div className="text-amber-400 font-bold">Centre for Railway Information Systems (CRIS)</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
            <div>
              © 2026 Indian Railways. All Rights Reserved. Adheres to Guidelines for Indian Government Websites (GIGW 3.0).
            </div>
            <div className="flex items-center gap-3">
              <span>Security Audited: STQC Certified</span>
              <span>•</span>
              <span className="font-mono">Build v2.4.8-MAS</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
