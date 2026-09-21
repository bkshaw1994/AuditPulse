import React, { useState } from 'react';
import { 
  ArrowRight, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Activity, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  TrendingUp, 
  Layers, 
  ChevronRight
} from 'lucide-react';

export default function HeroSection({ onLaunchDemo, flags = {} }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('tti');
  const [selectedSpike, setSelectedSpike] = useState(true);

  const showCli = flags.showCliFeature ?? false;
  const commandText = "npx @auditpulse/cli@latest monitor --url=https://myapp.io";

  const handleCopy = () => {
    navigator.clipboard.writeText(commandText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-hero-glow-light">
      {/* Background Decorative Light Grid */}
      <div className="absolute inset-0 bg-grid-pattern-light opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-6">
          <a
            href="#problem"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-mono text-indigo-700 hover:border-indigo-300 hover:bg-indigo-100/80 transition-all shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-ping"></span>
            <span className="text-indigo-800 font-semibold">New:</span> Real-Time React Fiber Profiler 2.0
            <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
          </a>
        </div>

        {/* Hero Text Block */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Stop Guessing About <br />
            <span className="text-gradient-purple-light">React Performance.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
            Continuous Core Web Vitals and main-thread monitoring for React SPAs. Catch client-side rendering bottlenecks before your users do.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#demo"
              onClick={onLaunchDemo}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-xl shadow-indigo-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <span>Start Auditing for Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#demo"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 font-medium text-base shadow-sm transition-all flex items-center justify-center gap-2 group"
            >
              <Play className="w-4 h-4 text-indigo-600 fill-indigo-100 group-hover:scale-110 transition-transform" />
              <span>View Live Demo</span>
            </a>
          </div>

          {/* CLI One-liner Copy Box (Controlled by DB feature flag) */}
          {showCli && (
            <div className="pt-3 flex items-center justify-center animate-in fade-in duration-300">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-900 text-slate-100 border border-slate-800 text-xs font-mono shadow-md">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-500">$</span>
                <span className="text-indigo-300 select-all">{commandText}</span>
                <button
                  onClick={handleCopy}
                  className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors ml-1"
                  title="Copy CLI Command"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Visual Asset: Stylized Light-Mode Analytics Dashboard Placeholder */}
        <div className="mt-12 md:mt-16 max-w-5xl mx-auto">
          <div className="relative rounded-2xl border border-slate-200 bg-white p-2 sm:p-4 shadow-2xl shadow-slate-900/10 overflow-hidden group">
            
            {/* Window Controls Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-slate-50 rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="ml-3 text-xs font-mono text-slate-600 flex items-center gap-1.5 font-medium">
                  <Activity className="w-3.5 h-3.5 text-indigo-600" />
                  AuditPulse Dashboard — Production SPA Monitoring
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  LIVE RUM ACTIVE
                </span>
                <span className="hidden sm:inline">env: prod-us-east-1</span>
              </div>
            </div>

            {/* Metric KPI Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-slate-50/50">
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>LCP (Largest Contentful)</span>
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-emerald-600">1.24s</span>
                  <span className="text-[10px] text-emerald-600 font-mono font-semibold">Good (&lt;2.5s)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 shadow-sm">
                <div className="flex items-center justify-between text-xs text-rose-800 font-semibold">
                  <span>TTI (Time to Interactive)</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-rose-600">4.18s</span>
                  <span className="text-[10px] text-rose-700 font-mono font-bold px-1 rounded bg-rose-200/60">SPIKE ALERT</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>CLS (Cumulative Layout)</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-emerald-600">0.012</span>
                  <span className="text-[10px] text-emerald-600 font-mono font-semibold">Good (&lt;0.1)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Main-Thread Lock</span>
                  <Cpu className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-amber-600">384ms</span>
                  <span className="text-[10px] text-amber-700 font-mono font-semibold">High Diffing</span>
                </div>
              </div>
            </div>

            {/* Main Chart & Component Bottleneck Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-3">
              
              {/* Left 2 Cols: Stylized Line Chart showing TTI Spike */}
              <div className="lg:col-span-2 p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      Time to Interactive (TTI) & Main-Thread Blocking
                    </h4>
                    <p className="text-xs text-slate-500">30-minute real-user continuous trend line</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-[11px] font-mono">
                    <button
                      onClick={() => setActiveTab('tti')}
                      className={`px-2 py-0.5 rounded ${activeTab === 'tti' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      TTI Spike
                    </button>
                    <button
                      onClick={() => setActiveTab('fid')}
                      className={`px-2 py-0.5 rounded ${activeTab === 'fid' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Long Tasks
                    </button>
                  </div>
                </div>

                {/* SVG Line Chart with TTI Spike Graphic */}
                <div className="relative h-48 w-full my-3 flex items-end pt-6">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                    <div className="border-b border-slate-200 w-full" />
                    <div className="border-b border-slate-200 w-full" />
                    <div className="border-b border-slate-200 w-full" />
                    <div className="border-b border-slate-200 w-full" />
                  </div>

                  {/* SVG Path line */}
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradientLight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                        <stop offset="60%" stopColor="#e11d48" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="strokeGradientLight" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0284c7" />
                        <stop offset="50%" stopColor="#6366f1" />
                        <stop offset="70%" stopColor="#e11d48" />
                        <stop offset="100%" stopColor="#0284c7" />
                      </linearGradient>
                    </defs>

                    {/* Area Fill */}
                    <path
                      d="M 0 120 L 50 115 L 100 122 L 150 110 L 200 118 L 250 112 L 300 25 L 340 18 L 380 95 L 420 110 L 460 115 L 500 118 L 500 150 L 0 150 Z"
                      fill="url(#chartGradientLight)"
                    />

                    {/* Main Trend Line */}
                    <path
                      d="M 0 120 L 50 115 L 100 122 L 150 110 L 200 118 L 250 112 L 300 25 L 340 18 L 380 95 L 420 110 L 460 115 L 500 118"
                      fill="none"
                      stroke="url(#strokeGradientLight)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Spike Marker */}
                    <g transform="translate(320, 20)" className="cursor-pointer" onClick={() => setSelectedSpike(!selectedSpike)}>
                      <circle r="8" fill="#e11d48" className="animate-ping opacity-75" />
                      <circle r="6" fill="#e11d48" stroke="#ffffff" strokeWidth="2" />
                    </g>
                  </svg>

                  {/* Callout Tooltip box over Spike */}
                  {selectedSpike && (
                    <div className="absolute top-2 left-[58%] -translate-x-1/2 bg-white border border-rose-300 p-2.5 rounded-lg shadow-xl text-left z-20 pointer-events-none">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-rose-600 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        TTI Bottleneck: +4.18s
                      </div>
                      <div className="text-[10px] text-slate-700 font-mono mt-0.5">
                        Cause: <span className="text-indigo-600 font-semibold">&lt;ProductGrid filter=all /&gt;</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Un-memoized re-render (340ms lock)
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100">
                  <span>10:00 AM</span>
                  <span>10:10 AM</span>
                  <span className="text-rose-600 font-semibold">10:18 AM (PR #142 Merged)</span>
                  <span>10:25 AM</span>
                  <span>10:30 AM</span>
                </div>
              </div>

              {/* Right Col: Component Bottleneck Breakdown */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      Component Flamegraph
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">React Fiber</span>
                  </div>

                  {/* Component list */}
                  <div className="space-y-2.5">
                    {/* Component 1 (Worst offender) */}
                    <div className="p-2 rounded-lg bg-rose-50 border border-rose-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-rose-900 font-semibold text-[11px]">
                          &lt;ProductGrid /&gt;
                        </span>
                        <span className="font-mono text-rose-600 font-bold text-[11px]">340ms</span>
                      </div>
                      <div className="w-full bg-rose-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-rose-500 h-full w-[90%] rounded-full" />
                      </div>
                      <div className="text-[10px] text-rose-700 font-mono mt-1">
                        Reason: Missing React.memo on 45 items
                      </div>
                    </div>

                    {/* Component 2 */}
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-800 text-[11px] font-medium">
                          &lt;FilterSidebar /&gt;
                        </span>
                        <span className="font-mono text-amber-600 text-[11px] font-semibold">42ms</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-amber-500 h-full w-[35%] rounded-full" />
                      </div>
                    </div>

                    {/* Component 3 */}
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-800 text-[11px] font-medium">
                          &lt;HeaderNav /&gt;
                        </span>
                        <span className="font-mono text-emerald-600 text-[11px] font-semibold">8ms</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[10%] rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono text-indigo-700 font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-indigo-600" />
                    Auto-Fix Suggestion Available
                  </span>
                  <a href="#demo" className="text-indigo-600 hover:underline font-mono text-[10px] font-bold">Inspect Code &rarr;</a>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
