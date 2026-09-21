import React, { useState } from 'react';
import { 
  Play, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export default function LiveDemoSection({ onOpenFullDashboard }) {
  const [targetUrl, setTargetUrl] = useState('https://react.dev');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState({
    url: 'https://react.dev',
    overallScore: 94,
    tti: '1.2s',
    lcp: '1.4s',
    cls: '0.01',
    ttfb: '180ms',
    renderingType: 'Hybrid (SSR + Client Hydration)',
    bottlenecks: [
      { component: '<HeaderDropdown />', impact: '14ms re-render', status: 'optimal' },
      { component: '<SearchModal />', impact: '32ms idle diffing', status: 'minor' }
    ]
  });

  const handleRunSampleAudit = (e) => {
    e.preventDefault();
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditResult({
        url: targetUrl,
        overallScore: Math.floor(Math.random() * 15) + 82,
        tti: (Math.random() * 2 + 1.1).toFixed(2) + 's',
        lcp: (Math.random() * 1.5 + 1.0).toFixed(2) + 's',
        cls: '0.0' + Math.floor(Math.random() * 8),
        ttfb: Math.floor(Math.random() * 120 + 100) + 'ms',
        renderingType: 'Single Page Application (React 18)',
        bottlenecks: [
          { component: '<ProductGrid items={120} />', impact: '184ms main-thread lock', status: 'critical' },
          { component: '<SidebarFilter />', impact: '48ms un-memoized re-render', status: 'warn' },
          { component: '<UserAvatar />', impact: '4ms render', status: 'optimal' }
        ]
      });
    }, 1200);
  };

  return (
    <section id="demo" className="py-20 md:py-28 relative bg-slate-50">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-mono text-cyan-800 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Interactive Sandbox</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Try AuditPulse <span className="text-gradient-cyan-light">Live Right Now</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Test any React SPA URL below to see how our main-thread telemetry uncovers hidden re-render bottlenecks.
          </p>
        </div>

        {/* Live Audit Interactive Card Container */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-900/5 space-y-6">
          
          {/* Input Form Bar */}
          <form onSubmit={handleRunSampleAudit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://your-react-app.com"
                required
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm font-mono outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-inner"
              />
            </div>
            
            <button
              type="submit"
              disabled={isAuditing}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Auditing React Fiber...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run Live Audit</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
            <span>Preset targets:</span>
            {['https://react.dev', 'https://vercel.com', 'https://nextjs.org'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTargetUrl(preset)}
                className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-slate-400 hover:text-slate-900 transition-colors shadow-sm font-medium"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Results Screen */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-6">
            
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-mono font-bold text-xl shadow-sm">
                  {auditResult.overallScore}
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold text-base font-mono flex items-center gap-2">
                    {auditResult.url}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    {auditResult.renderingType}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-semibold">
                  Passed 18 Fiber Checks
                </span>
              </div>
            </div>

            {/* Core Web Vitals Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono shadow-sm">
                <div className="text-[11px] text-slate-500">Time to Interactive</div>
                <div className="text-lg font-bold text-indigo-600 mt-1">{auditResult.tti}</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono shadow-sm">
                <div className="text-[11px] text-slate-500">Largest Contentful (LCP)</div>
                <div className="text-lg font-bold text-emerald-600 mt-1">{auditResult.lcp}</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono shadow-sm">
                <div className="text-[11px] text-slate-500">Layout Shift (CLS)</div>
                <div className="text-lg font-bold text-emerald-600 mt-1">{auditResult.cls}</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono shadow-sm">
                <div className="text-[11px] text-slate-500">Time to First Byte</div>
                <div className="text-lg font-bold text-cyan-600 mt-1">{auditResult.ttfb}</div>
              </div>
            </div>

            {/* Component Bottleneck List */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-slate-500 tracking-wider flex items-center justify-between font-semibold">
                <span>Detected Main-Thread Component Locks</span>
                <span className="text-indigo-600">Profiler Telemetry</span>
              </div>

              <div className="space-y-2">
                {auditResult.bottlenecks.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 text-xs font-mono shadow-sm">
                    <div className="flex items-center gap-2.5">
                      {item.status === 'critical' ? (
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                      ) : item.status === 'warn' ? (
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      )}
                      <span className="text-slate-900 font-semibold">{item.component}</span>
                    </div>
                    <span className={item.status === 'critical' ? 'text-rose-600 font-bold' : item.status === 'warn' ? 'text-amber-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                      {item.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Full Workspace Button */}
            {onOpenFullDashboard && (
              <div className="pt-2 text-center">
                <button
                  onClick={onOpenFullDashboard}
                  className="inline-flex items-center gap-2 text-xs font-mono text-indigo-600 hover:text-indigo-800 underline font-bold"
                >
                  Open Full Diagnostic Studio & Export CSV/JSON &rarr;
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
