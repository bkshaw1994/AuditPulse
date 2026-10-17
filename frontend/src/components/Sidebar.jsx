import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
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
  ArrowLeft,
  Terminal,
  Bell,
  Sparkles,
  Lock,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ issuesCount = 0, schemaCount = 0, onOpenGuide, onOpenPricing, flags = {} }) {
  const { user, isPro } = useAuth();
  const showMonetization = flags.monetizationEnabled || flags.showPricingFeature;
  const menuItems = [
    { path: '/app/overview', label: 'Overview & Vitals', icon: LayoutDashboard },
    { path: '/app/report', label: 'Full Audit Report', icon: FileText, badge: issuesCount > 0 ? 'Report' : null, badgeColor: 'indigo' },
    { path: '/app/advisor', label: 'Score Improvement', icon: TrendingUp, badge: issuesCount > 0 ? 'Boost' : null, badgeColor: 'emerald' },
    { path: '/app/diagnostics', label: 'Diagnostics & Fixes', icon: AlertCircle, badge: issuesCount > 0 ? issuesCount : null, badgeColor: 'rose' },
    { path: '/app/setup', label: 'Install npm Tracker', icon: Terminal, badge: 'SDK', badgeColor: 'slate' },
    { path: '/app/vitals', label: 'Core Web Vitals', icon: Zap },
    { path: '/app/trends', label: '24h Trends & Spikes', icon: TrendingUp },
    { path: '/app/alerts', label: 'Slack Alerts', icon: Bell, isPro: true },
    { path: '/app/ssr', label: 'SSR vs CSR Audit', icon: Server },
    { path: '/app/metatags', label: 'Dynamic Meta Tags', icon: Tag },
    { path: '/app/social', label: 'Social Preview', icon: Share2 },
    { path: '/app/diff', label: 'Audit Diff Tool', icon: GitCompare },
    { path: '/app/schema', label: 'JSON-LD Schema', icon: Code, badge: schemaCount > 0 ? schemaCount : null }
  ];

  return (
    <aside className="w-64 h-screen shrink-0 bg-white border-r border-slate-200 flex flex-col z-40 shadow-sm select-none">
      
      {/* Brand Header (Fixed Top) */}
      <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between shrink-0">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 p-[1px] shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
              <Activity className="w-4 h-4 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-slate-900 flex items-center gap-1">
              AuditPulse <span className="text-[8px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">v2.0</span>
            </span>
            <span className="text-[9px] text-slate-400 font-medium">SPA SEO & RUM Studio</span>
          </div>
        </Link>
      </div>

      {/* Navigation Links (Scrollable independently only if viewport is ultra-short) */}
      <div className="p-2 flex-1 flex flex-col gap-0.5 space-y-0.5 overflow-y-auto custom-scrollbar">
        <div className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider px-3 pt-1.5 pb-0.5">
          STUDIO NAVIGATION
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs border border-indigo-200/80'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {item.isPro && (
                      <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> PRO
                      </span>
                    )}

                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${
                          item.badgeColor === 'emerald'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.badgeColor === 'rose'
                            ? 'bg-rose-50 text-rose-600 border-rose-200'
                            : item.badgeColor === 'indigo'
                            ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {isActive && !item.badge && !item.isPro && (
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                  </div>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Upgrade to Pro Card (Controlled by DB feature flag) */}
      {showMonetization && (
        <div className="p-2.5 border-t border-slate-100 shrink-0">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50 border border-indigo-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600" /> AuditPulse Pro
              </span>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                isPro ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'
              }`}>
                {isPro ? 'PRO ACTIVE' : '₹1,999/mo'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              {isPro ? 'All Pro telemetry features unlocked.' : 'Unlock 90-day retention & Slack alerts.'}
            </p>
            <button
              onClick={onOpenPricing}
              className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition shadow-xs cursor-pointer"
            >
              {isPro ? 'Manage Subscription' : 'Upgrade Plan'}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Footer Navigation Links (Landing Page & CWV Guide) */}
      <div className="px-3 py-2 border-t border-slate-200 shrink-0 flex items-center justify-between text-xs font-mono text-slate-600">
        <Link
          to="/"
          className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition"
          title="Return to Landing Page"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
          <span>Landing</span>
        </Link>

        <button
          onClick={onOpenGuide}
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold transition"
          title="Open Core Web Vitals Metrics Guide"
        >
          <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
          <span>CWV Guide</span>
        </button>
      </div>

    </aside>
  );
}
