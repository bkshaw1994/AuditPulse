import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  Server,
  Tag,
  Share2,
  TrendingUp,
  GitCompare,
  Code,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Activity,
  ArrowLeft
} from 'lucide-react';

export default function Sidebar({ issuesCount = 0, schemaCount = 0, onOpenGuide }) {
  const menuItems = [
    { path: '/app/overview', label: 'Overview & Vitals', icon: LayoutDashboard },
    { path: '/app/vitals', label: 'Core Web Vitals', icon: Zap },
    { path: '/app/ssr', label: 'SSR vs CSR Audit', icon: Server },
    { path: '/app/metatags', label: 'Dynamic Meta Tags', icon: Tag },
    { path: '/app/social', label: 'Social Preview', icon: Share2 },
    { path: '/app/trends', label: 'Historical Analytics', icon: TrendingUp },
    { path: '/app/diff', label: 'Audit Diff Tool', icon: GitCompare },
    { path: '/app/schema', label: 'JSON-LD Schema', icon: Code, badge: schemaCount > 0 ? schemaCount : null },
    { path: '/app/diagnostics', label: 'Diagnostics & Fixes', icon: AlertCircle, badge: issuesCount > 0 ? issuesCount : null, badgeColor: issuesCount > 0 ? 'rose' : null }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col min-h-screen sticky top-0 z-40 shadow-sm">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 p-[1px] shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1">
              AuditPulse <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">STUDIO</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium">SPA SEO & RUM Monitoring</span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="p-3 flex-1 flex flex-col gap-1 space-y-1">
        <div className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">
          STUDIO NAVIGATION
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm border border-indigo-200/80'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        item.badgeColor === 'rose'
                          ? 'bg-rose-50 text-rose-600 border-rose-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Back to Landing Page Link */}
      <div className="px-3 py-2 border-t border-slate-100">
        <Link
          to="/"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            <span>Back to SaaS Landing</span>
          </div>
          <span className="text-[10px] text-slate-400">Home</span>
        </Link>
      </div>

      {/* Sidebar Footer Help Card */}
      <div className="p-4 border-t border-slate-200">
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-center space-y-2">
          <HelpCircle className="w-5 h-5 text-indigo-600 mx-auto" />
          <h4 className="text-xs font-bold text-slate-900">Core Web Vitals Guide</h4>
          <p className="text-[11px] text-slate-500 leading-snug">
            Google thresholds for LCP, TTFB & TTI
          </p>
          <button
            onClick={onOpenGuide}
            className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            Open Guide
          </button>
        </div>
      </div>

    </aside>
  );
}
