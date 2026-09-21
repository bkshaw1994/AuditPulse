import React, { useState } from 'react';
import { Search, Loader2, Play, Sparkles, Cpu } from 'lucide-react';

export default function AuditForm({ onAuditTrigger, isLoading, error }) {
  const [url, setUrl] = useState('https://react.dev');
  const [stepIndex, setStepIndex] = useState(0);

  const presets = [
    { label: 'React Docs', url: 'https://react.dev' },
    { label: 'ViteJS', url: 'https://vitejs.dev' },
    { label: 'Next.js', url: 'https://nextjs.org' }
  ];

  const auditSteps = [
    'Launching Headless Chrome Scraper...',
    'Navigating & Waiting for SPA DOM Hydration...',
    'Extracting Dynamically Injected Meta Tags...',
    'Injecting PerformanceObserver for Core Web Vitals...',
    'Evaluating SEO Rules & Computing Health Score...'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;

    setStepIndex(0);
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < auditSteps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1800);

    onAuditTrigger(url.trim()).finally(() => {
      clearInterval(interval);
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden space-y-4">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-full bg-gradient-radial from-indigo-500/10 to-transparent pointer-events-none" />

      <div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Audit SPA SEO & Core Web Vitals
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter any Single Page Application URL. Puppeteer will execute client JS, wait for DOM hydration, and extract dynamic metadata.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono placeholder-slate-400 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all shadow-inner"
              placeholder="e.g. https://my-react-app.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Auditing SPA...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run Full Audit</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
        <span>Try presets:</span>
        {presets.map((preset) => (
          <button
            key={preset.url}
            type="button"
            onClick={() => setUrl(preset.url)}
            disabled={isLoading}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
              url === preset.url
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Progress Status Bar */}
      {isLoading && (
        <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-semibold text-indigo-900">
              <Cpu className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>{auditSteps[stepIndex]}</span>
            </div>
            <span className="font-mono text-slate-500">
              Step {stepIndex + 1} of {auditSteps.length}
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
              style={{ width: `${((stepIndex + 1) / auditSteps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
          ⚠️ Audit Error: {error}
        </div>
      )}
    </div>
  );
}
