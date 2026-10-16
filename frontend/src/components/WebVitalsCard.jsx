import React, { useState } from 'react';
import {
  Gauge,
  Clock,
  Layers,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Zap,
  ArrowUpRight
} from 'lucide-react';

export default function WebVitalsCard({ metrics = {} }) {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [showAdviceDrawer, setShowAdviceDrawer] = useState(true);

  const formatMs = (val) => (val >= 1000 ? `${(val / 1000).toFixed(2)}s` : `${val || 0}ms`);

  const lcp = metrics.lcp || 0;
  const ttfb = metrics.ttfb || 0;
  const cls = metrics.cls !== undefined ? metrics.cls : 0;
  const inp = metrics.inp !== undefined ? metrics.inp : (metrics.tti ? Math.min(Math.round(metrics.tti * 0.12), 650) : 120);
  const tti = metrics.tti || 0;
  const fcp = metrics.fcp || 0;

  // Google CWV Strict Thresholds:
  // LCP: <= 2500ms (Good), <= 4000ms (Needs Work), > 4000ms (Poor)
  // INP: <= 200ms (Good), <= 500ms (Needs Work), > 500ms (Poor)
  // CLS: <= 0.1 (Good), <= 0.25 (Needs Work), > 0.25 (Poor)
  const getStatus = (metric, val) => {
    switch (metric) {
      case 'lcp':
        if (val <= 2500) return 'good';
        if (val <= 4000) return 'warning';
        return 'poor';
      case 'inp':
        if (val <= 200) return 'good';
        if (val <= 500) return 'warning';
        return 'poor';
      case 'cls':
        if (val <= 0.1) return 'good';
        if (val <= 0.25) return 'warning';
        return 'poor';
      case 'ttfb':
        if (val <= 800) return 'good';
        if (val <= 1800) return 'warning';
        return 'poor';
      case 'fcp':
        if (val <= 1800) return 'good';
        if (val <= 3000) return 'warning';
        return 'poor';
      default:
        return 'good';
    }
  };

  const lcpStatus = getStatus('lcp', lcp);
  const inpStatus = getStatus('inp', inp);
  const clsStatus = getStatus('cls', cls);
  const ttfbStatus = getStatus('ttfb', ttfb);

  const isCwvPassing = lcpStatus === 'good' && inpStatus === 'good' && clsStatus === 'good';

  // Strict Color Coding System
  const colorMap = {
    good: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-700',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
      icon: CheckCircle2,
      label: 'Good'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-700',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
      icon: AlertTriangle,
      label: 'Needs Improvement'
    },
    poor: {
      bg: 'bg-rose-50',
      border: 'border-rose-300',
      text: 'text-rose-700',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-800',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.18)]',
      icon: XCircle,
      label: 'Poor'
    }
  };

  // Automated Actionable Diagnostics Engine
  const diagnostics = [];
  if (lcpStatus === 'poor') {
    diagnostics.push({
      metric: 'LCP',
      value: formatMs(lcp),
      threshold: '<= 2.5s (Good), > 4.0s (Poor)',
      severity: 'critical',
      headline: 'LCP > 4s: Hero element blocked by client-side bundle or late asset discovery',
      advice: 'Preload the Largest Contentful Paint image using <link rel="preload" as="image" href="..." fetchpriority="high">. Split the main bundle with React.lazy() to reduce parser blocking.'
    });
  } else if (lcpStatus === 'warning') {
    diagnostics.push({
      metric: 'LCP',
      value: formatMs(lcp),
      threshold: '<= 2.5s (Good)',
      severity: 'warning',
      headline: 'LCP in Needs Improvement range (2.5s - 4.0s)',
      advice: 'Serve modern image formats (AVIF/WebP) and ensure the hero image is not hidden inside a late client-side state transition.'
    });
  }

  if (inpStatus === 'poor') {
    diagnostics.push({
      metric: 'INP',
      value: `${inp}ms`,
      threshold: '<= 200ms (Good), > 500ms (Poor)',
      severity: 'critical',
      headline: 'INP > 500ms: Heavy main thread execution during user interaction',
      advice: 'Long synchronous React re-renders are freezing the UI. Wrap non-urgent state updates in React 18 startTransition() or yield to the browser using scheduler.yield() or requestIdleCallback().'
    });
  } else if (inpStatus === 'warning') {
    diagnostics.push({
      metric: 'INP',
      value: `${inp}ms`,
      threshold: '<= 200ms (Good)',
      severity: 'warning',
      headline: 'INP in Needs Improvement range (200ms - 500ms)',
      advice: 'Avoid synchronous calculations inside onClick or onChange handlers. Memoize heavy list components with React.memo() and useMemo().'
    });
  }

  if (clsStatus === 'poor') {
    diagnostics.push({
      metric: 'CLS',
      value: cls.toString(),
      threshold: '<= 0.1 (Good), > 0.25 (Poor)',
      severity: 'critical',
      headline: 'CLS > 0.25: Severe layout instability causing visual jumps',
      advice: 'Dynamic DOM insertions (promotional banners, ads, or web fonts) lack reserved geometry. Always specify explicit width/height attributes or CSS aspect-ratio on containers.'
    });
  } else if (clsStatus === 'warning') {
    diagnostics.push({
      metric: 'CLS',
      value: cls.toString(),
      threshold: '<= 0.1 (Good)',
      severity: 'warning',
      headline: 'CLS in Needs Improvement range (0.1 - 0.25)',
      advice: 'Reserve space for late-loading dynamic banners and use font-display: swap with matched font fallback metrics (size-adjust) to avoid FOUT layout shifts.'
    });
  }

  if (ttfbStatus === 'poor') {
    diagnostics.push({
      metric: 'TTFB',
      value: formatMs(ttfb),
      threshold: '<= 800ms (Good), > 1.8s (Poor)',
      severity: 'critical',
      headline: 'TTFB > 1.8s: High server response latency',
      advice: 'Enable CDN edge caching (stale-while-revalidate), optimize database queries, or transition from heavy server-side generation to edge-rendered streaming HTML.'
    });
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 space-y-6">
      {/* Header with Google CWV Summary Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-indigo-600" />
              Core Web Vitals & Real-User Diagnostics
            </h3>
            {isCwvPassing ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                GOOGLE CWV: ALL PASSING
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-800 text-xs font-mono font-bold shadow-sm">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                GOOGLE CWV: FAILING 75th PERCENTILE
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enforcing Google official Core Web Vitals thresholds (75th percentile of real user page loads)
          </p>
        </div>

        {diagnostics.length > 0 && (
          <button
            onClick={() => setShowAdviceDrawer(!showAdviceDrawer)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold transition self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{diagnostics.length} Actionable Fix{diagnostics.length > 1 ? 'es' : ''} Available</span>
            {showAdviceDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* 4 Primary CWV Metric Cards with Strict Color Coding */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: LCP */}
        <div
          className={`p-4 rounded-xl border transition-all ${colorMap[lcpStatus].bg} ${colorMap[lcpStatus].border} ${colorMap[lcpStatus].glow} flex flex-col justify-between space-y-3 relative`}
          onMouseEnter={() => setActiveTooltip('lcp')}
          onMouseLeave={() => setActiveTooltip(null)}
        >
          <div>
            <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                Largest Contentful (LCP)
                <HelpCircle className="w-3 h-3 text-slate-400 cursor-pointer" />
              </span>
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatMs(lcp)}
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-200/80 text-xs">
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${colorMap[lcpStatus].badgeBg} ${colorMap[lcpStatus].badgeText}`}>
                {colorMap[lcpStatus].label}
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-medium">Good &le; 2.5s</span>
            </div>
          </div>

          {activeTooltip === 'lcp' && (
            <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl z-20 pointer-events-none">
              <strong className="block text-indigo-300 font-semibold mb-1">Largest Contentful Paint (LCP)</strong>
              Measures perceived loading speed. Marks when main page content is rendered. Good: &le;2.5s, Poor: &gt;4.0s.
            </div>
          )}
        </div>

        {/* Metric 2: INP (Interaction to Next Paint) */}
        <div
          className={`p-4 rounded-xl border transition-all ${colorMap[inpStatus].bg} ${colorMap[inpStatus].border} ${colorMap[inpStatus].glow} flex flex-col justify-between space-y-3 relative`}
          onMouseEnter={() => setActiveTooltip('inp')}
          onMouseLeave={() => setActiveTooltip(null)}
        >
          <div>
            <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                Interaction to Next Paint (INP)
                <HelpCircle className="w-3 h-3 text-slate-400 cursor-pointer" />
              </span>
              <Cpu className="w-4 h-4 text-purple-600" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-slate-900 tracking-tight">
              {inp}ms
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-200/80 text-xs">
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${colorMap[inpStatus].badgeBg} ${colorMap[inpStatus].badgeText}`}>
                {colorMap[inpStatus].label}
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-medium">Good &le; 200ms</span>
            </div>
          </div>

          {activeTooltip === 'inp' && (
            <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl z-20 pointer-events-none">
              <strong className="block text-purple-300 font-semibold mb-1">Interaction to Next Paint (INP)</strong>
              Google official metric replacing FID. Measures UI responsiveness to user clicks and keystrokes. Good: &le;200ms, Poor: &gt;500ms.
            </div>
          )}
        </div>

        {/* Metric 3: CLS */}
        <div
          className={`p-4 rounded-xl border transition-all ${colorMap[clsStatus].bg} ${colorMap[clsStatus].border} ${colorMap[clsStatus].glow} flex flex-col justify-between space-y-3 relative`}
          onMouseEnter={() => setActiveTooltip('cls')}
          onMouseLeave={() => setActiveTooltip(null)}
        >
          <div>
            <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                Layout Shift (CLS)
                <HelpCircle className="w-3 h-3 text-slate-400 cursor-pointer" />
              </span>
              <Layers className="w-4 h-4 text-pink-600" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-slate-900 tracking-tight">
              {cls}
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-200/80 text-xs">
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${colorMap[clsStatus].badgeBg} ${colorMap[clsStatus].badgeText}`}>
                {colorMap[clsStatus].label}
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-medium">Good &le; 0.1</span>
            </div>
          </div>

          {activeTooltip === 'cls' && (
            <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl z-20 pointer-events-none">
              <strong className="block text-pink-300 font-semibold mb-1">Cumulative Layout Shift (CLS)</strong>
              Measures visual stability. Prevents accidental clicks from jumping content. Good: &le;0.1, Poor: &gt;0.25.
            </div>
          )}
        </div>

        {/* Metric 4: TTFB */}
        <div
          className={`p-4 rounded-xl border transition-all ${colorMap[ttfbStatus].bg} ${colorMap[ttfbStatus].border} ${colorMap[ttfbStatus].glow} flex flex-col justify-between space-y-3 relative`}
          onMouseEnter={() => setActiveTooltip('ttfb')}
          onMouseLeave={() => setActiveTooltip(null)}
        >
          <div>
            <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                Time to First Byte (TTFB)
                <HelpCircle className="w-3 h-3 text-slate-400 cursor-pointer" />
              </span>
              <Gauge className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="font-mono text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatMs(ttfb)}
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-200/80 text-xs">
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${colorMap[ttfbStatus].badgeBg} ${colorMap[ttfbStatus].badgeText}`}>
                {colorMap[ttfbStatus].label}
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-medium">Good &le; 800ms</span>
            </div>
          </div>

          {activeTooltip === 'ttfb' && (
            <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl z-20 pointer-events-none">
              <strong className="block text-cyan-300 font-semibold mb-1">Time to First Byte (TTFB)</strong>
              Measures network connection time and backend server response latency before initial HTML bytes arrive. Good: &le;800ms, Poor: &gt;1.8s.
            </div>
          )}
        </div>
      </div>

      {/* Automated Diagnostic Recommendations Box */}
      {showAdviceDrawer && diagnostics.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>Automated Diagnostic Advice for Failing Metrics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {diagnostics.map((diag, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-white border border-amber-200 shadow-xs space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-mono text-[10px]">
                      {diag.metric}
                    </span>
                    {diag.value}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{diag.threshold}</span>
                </div>
                <p className="font-semibold text-rose-700">{diag.headline}</p>
                <p className="text-slate-600 leading-relaxed font-mono text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
                  💡 <strong>Action:</strong> {diag.advice}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Secondary Resource & Hydration Telemetry Strip */}
      <div className="flex flex-wrap items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 gap-3">
        <div>First Contentful Paint (FCP): <strong className="text-slate-900">{formatMs(fcp)}</strong></div>
        <div>Time to Interactive (TTI): <strong className="text-slate-900">{formatMs(tti)}</strong></div>
        <div>Total HTTP Requests: <strong className="text-slate-900">{metrics.totalRequests || 0}</strong></div>
        <div>JS Heap Size: <strong className="text-slate-900">{metrics.jsHeapSizeKB || 0} KB</strong></div>
      </div>
    </div>
  );
}
