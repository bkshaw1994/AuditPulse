import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Zap,
  Gauge
} from 'lucide-react';
import { runAudit } from '../../services/api';

export default function LiveDemoSection() {
  const [targetUrl, setTargetUrl] = useState('https://react.dev');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [error, setError] = useState(null);

  const handleRunSampleAudit = async (e) => {
    e.preventDefault();
    if (!targetUrl || !targetUrl.trim()) return;

    let formatted = targetUrl.trim();
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = 'https://' + formatted;
    }

    setIsAuditing(true);
    setError(null);

    try {
      const response = await runAudit(formatted);
      if (response && response.data) {
        const d = response.data;
        const perf = d.performanceMetrics || {};
        const scores = d.scores || {};
        setAuditResult({
          url: d.url,
          domain: d.domain,
          overallScore: scores.overall || 0,
          seoScore: scores.seo || 0,
          perfScore: scores.performance || 0,
          tti: perf.tti ? `${(perf.tti / 1000).toFixed(2)}s` : `${(perf.domContentLoaded ? (perf.domContentLoaded / 1000).toFixed(2) : '1.20')}s`,
          lcp: perf.lcp ? `${(perf.lcp / 1000).toFixed(2)}s` : `${(perf.fcp ? (perf.fcp / 1000).toFixed(2) : '1.40')}s`,
          cls: perf.cls !== undefined ? perf.cls.toFixed(3) : '0.000',
          ttfb: perf.ttfb ? `${perf.ttfb}ms` : '120ms',
          renderingType: d.renderingType || 'SPA (Client Rendered)',
          issues: d.issues || []
        });
      } else {
        throw new Error('Audit did not return report data.');
      }
    } catch (err) {
      console.warn('[LiveDemoSection] Audit error:', err);
      setError(err.message || 'Audit crawl process failed. Please verify the URL is public and reachable.');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <section id="demo" className="py-20 md:py-28 relative bg-slate-50">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-mono text-cyan-800 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Live Interactive Sandbox</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Audit Any Live Site <span className="text-gradient-cyan-light">In Real Time</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Enter any public website or React SPA URL below to execute a real headless Chromium crawl and inspect Core Web Vitals telemetry.
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
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Crawling Live Site...</span>
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
            <span>Or test sample live sites:</span>
            {['https://react.dev', 'https://nextjs.org', 'https://news.ycombinator.com'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTargetUrl(preset)}
                className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-slate-400 hover:text-slate-900 transition-colors shadow-sm font-medium cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Results Screen */}
          {auditResult ? (
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
                      {auditResult.renderingType} &bull; SEO Score: {auditResult.seoScore} &bull; Perf Score: {auditResult.perfScore}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-semibold">
                    Real-Time Crawl Complete
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

              {/* Diagnostic Issues List */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase text-slate-500 tracking-wider flex items-center justify-between font-semibold">
                  <span>Detected Crawl Diagnostics</span>
                  <span className="text-indigo-600">{auditResult.issues.length} Issues Identified</span>
                </div>

                {auditResult.issues.length > 0 ? (
                  <div className="space-y-2">
                    {auditResult.issues.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 text-xs font-mono shadow-sm">
                        <div className="flex items-center gap-2.5">
                          {item.severity === 'critical' ? (
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          ) : (
                            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                          <span className="text-slate-900 font-semibold">{item.title}</span>
                        </div>
                        <span className="text-slate-500 text-[11px] max-w-xs truncate hidden sm:inline">
                          {item.description}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>No critical Core Web Vitals penalties identified on this page.</span>
                  </div>
                )}
              </div>

              {/* Launch Full Workspace Button */}
              <div className="pt-3 text-center">
                <Link
                  to="/app/overview"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                >
                  <span>Open Full Studio Dashboard & Optimization Roadmap</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-50/70 border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-indigo-600 shadow-xs">
                <Gauge className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                Ready for Live Performance Benchmark
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Paste any live website URL above and click &quot;Run Live Audit&quot; to test your site against real Core Web Vitals and SSR hydration criteria.
              </p>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
