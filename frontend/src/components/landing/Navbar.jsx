import React, { useState } from 'react';
import { Activity, Menu, X, ArrowRight, Sparkles, LayoutDashboard } from 'lucide-react';

export default function Navbar({ onSwitchToDashboard, activeMode, flags = {} }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // DB feature flags
  const showPricing = flags.showPricingFeature ?? false;
  const showCli = flags.showCliFeature ?? false;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 p-[1px] shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-indigo-600 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
                AuditPulse <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold tracking-wider">PRO</span>
              </span>
            </div>
          </a>

          {/* Quick status pill */}
          <div className="hidden lg:flex items-center gap-2 ml-3 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-mono text-[11px] text-slate-700 font-medium">v2.4 React 19 Ready</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">
            Features
          </a>
          <a href="#problem" className="hover:text-slate-900 transition-colors">
            Why AuditPulse
          </a>
          <a href="#demo" className="hover:text-slate-900 transition-colors flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Live Demo
          </a>

          {/* Conditionally render CLI / Profiler link if feature flag enabled */}
          {showCli && (
            <a href="#architecture" className="hover:text-slate-900 transition-colors font-mono text-xs">
              &lt;Profiler/&gt;
            </a>
          )}

          {/* Conditionally render Pricing link if feature flag enabled */}
          {showPricing && (
            <a href="#pricing" className="hover:text-slate-900 transition-colors">
              Pricing
            </a>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Toggle button to switch to Dashboard view */}
          {onSwitchToDashboard && (
            <button
              onClick={onSwitchToDashboard}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/90 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 text-xs font-mono transition-all font-semibold"
              title="Open full Auditor App"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />
              {activeMode === 'dashboard' ? 'View Landing Page' : 'Launch Auditor App'}
            </button>
          )}

          <a
            href="#demo"
            className="group relative inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Start Auditing Free</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {onSwitchToDashboard && (
            <button
              onClick={onSwitchToDashboard}
              className="p-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-mono"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-700">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900"
            >
              Features
            </a>
            <a
              href="#problem"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900"
            >
              Why AuditPulse
            </a>
            <a
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 flex items-center justify-between"
            >
              <span>Live Demo</span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            </a>

            {showCli && (
              <a
                href="#architecture"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900 font-mono text-xs"
              >
                &lt;Profiler/&gt; Architecture
              </a>
            )}

            {showPricing && (
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-md hover:bg-slate-100 hover:text-slate-900"
              >
                Pricing
              </a>
            )}
          </nav>
          
          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <a
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-lg bg-indigo-600 text-center text-white font-medium text-sm shadow-md shadow-indigo-600/20"
            >
              Start Auditing for Free
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
