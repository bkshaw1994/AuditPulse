import React from 'react';
import { Activity, Github, Twitter, MessageSquare, ArrowUpRight } from 'lucide-react';

export default function Footer({ flags = {} }) {
  const showPricing = flags.showPricingFeature ?? false;
  const showCli = flags.showCliFeature ?? false;

  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600 text-sm pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid: Logo & Grouped Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-[1px] shadow-sm">
                <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
                  <Activity className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">AuditPulse</span>
            </a>

            <p className="text-xs text-slate-600 leading-relaxed">
              Continuous Core Web Vitals and main-thread monitoring for React SPAs. Catch client-side rendering bottlenecks before your users do.
            </p>

            {/* System Operational Badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Group 1: Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 font-mono">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
              </li>
              {showPricing && (
                <li>
                  <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
                </li>
              )}
              <li>
                <a href="#changelog" className="hover:text-slate-900 transition-colors flex items-center gap-1">
                  <span>Changelog</span>
                  <span className="px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded text-[9px] font-mono font-semibold border border-indigo-200">v2.4</span>
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-slate-900 transition-colors">Integrations</a>
              </li>
            </ul>
          </div>

          {/* Group 2: Resources Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 font-mono">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <a href="#docs" className="hover:text-slate-900 transition-colors flex items-center gap-1">
                  <span>Documentation</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors flex items-center gap-1">
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-slate-900 transition-colors flex items-center gap-1">
                  <span>Medium Blog</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="#vitals" className="hover:text-slate-900 transition-colors">Core Web Vitals Guide</a>
              </li>
            </ul>
          </div>

          {/* Group 3: Social & Community */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 font-mono">
              Community
            </h4>
            <p className="text-xs text-slate-600">
              Join 12,000+ React engineers crafting high-performance frontends.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-colors shadow-sm"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-colors shadow-sm"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-colors shadow-sm"
                aria-label="Discord"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-mono">
          <div>
            &copy; {new Date().getFullYear()} AuditPulse Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Security</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
