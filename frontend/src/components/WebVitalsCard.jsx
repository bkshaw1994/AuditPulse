import React from 'react';
import { Gauge, Clock, Layers, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function WebVitalsCard({ metrics = {} }) {
  const formatMs = (val) => (val >= 1000 ? `${(val / 1000).toFixed(2)}s` : `${val || 0}ms`);

  const lcp = metrics.lcp || 0;
  const ttfb = metrics.ttfb || 0;
  const cls = metrics.cls !== undefined ? metrics.cls : 0;
  const tti = metrics.tti || 0;

  const isLcpGood = lcp <= 2500;
  const isTtfbGood = ttfb <= 800;
  const isClsGood = cls <= 0.1;
  const isCwvPassing = isLcpGood && isTtfbGood && isClsGood;

  const getLcpBadge = (val) => {
    if (val <= 2500) return <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-semibold">Good (&le;2.5s)</span>;
    if (val <= 4000) return <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-mono font-semibold">Needs Work (&le;4.0s)</span>;
    return <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-mono font-semibold">Poor (&gt;4.0s)</span>;
  };

  const getTtfbBadge = (val) => {
    if (val <= 800) return <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-semibold">Good (&le;800ms)</span>;
    if (val <= 1800) return <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-mono font-semibold">Needs Work (&le;1.8s)</span>;
    return <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-mono font-semibold">Poor (&gt;1.8s)</span>;
  };

  const getClsBadge = (val) => {
    if (val <= 0.1) return <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-semibold">Good (&le;0.1)</span>;
    if (val <= 0.25) return <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-mono font-semibold">Needs Work (&le;0.25)</span>;
    return <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-mono font-semibold">Poor (&gt;0.25)</span>;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-indigo-600" />
              Core Web Vitals & SPA Hydration Metrics
            </h3>
            {isCwvPassing ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Google CWV: PASSED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-mono font-semibold">
                <AlertTriangle className="w-3 h-3 text-amber-600" /> Google CWV: NEEDS WORK
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Extracted via native browser PerformanceObserver after client JS DOM mounting
          </p>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* LCP */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1 text-xs text-slate-600 font-medium">
              <span>Largest Contentful (LCP)</span>
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="font-mono text-2xl font-bold text-slate-900">
              {formatMs(lcp)}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
            {getLcpBadge(lcp)}
            <span className="text-[10px] font-mono text-slate-400">&le;2.5s</span>
          </div>
        </div>

        {/* TTFB */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1 text-xs text-slate-600 font-medium">
              <span>Time to First Byte (TTFB)</span>
              <Gauge className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="font-mono text-2xl font-bold text-slate-900">
              {formatMs(ttfb)}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
            {getTtfbBadge(ttfb)}
            <span className="text-[10px] font-mono text-slate-400">&le;800ms</span>
          </div>
        </div>

        {/* TTI */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1 text-xs text-slate-600 font-medium">
              <span>Time to Interactive (TTI)</span>
              <Cpu className="w-4 h-4 text-purple-600" />
            </div>
            <div className="font-mono text-2xl font-bold text-slate-900">
              {formatMs(tti)}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-semibold">Hydration Complete</span>
            <span className="text-[10px] font-mono text-slate-400">&le;3.8s</span>
          </div>
        </div>

        {/* CLS */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1 text-xs text-slate-600 font-medium">
              <span>Cumulative Layout Shift</span>
              <Layers className="w-4 h-4 text-pink-600" />
            </div>
            <div className="font-mono text-2xl font-bold text-slate-900">
              {cls}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
            {getClsBadge(cls)}
            <span className="text-[10px] font-mono text-slate-400">&le;0.1</span>
          </div>
        </div>
      </div>

      {/* Resource & Memory Strip */}
      <div className="flex flex-wrap items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 gap-3">
        <div>First Contentful Paint (FCP): <strong className="text-slate-900">{formatMs(metrics.fcp)}</strong></div>
        <div>Total HTTP Requests: <strong className="text-slate-900">{metrics.totalRequests || 0}</strong></div>
        <div>Page Bundle Size: <strong className="text-slate-900">{metrics.totalPageSizeKB || 0} KB</strong></div>
        <div>JS Heap Usage: <strong className="text-slate-900">{metrics.jsHeapSizeKB || 0} KB</strong></div>
      </div>

    </div>
  );
}
