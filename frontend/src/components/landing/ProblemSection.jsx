import React from 'react';
import { AlertCircle, Flame, Cpu, Code2, Zap, Terminal } from 'lucide-react';

export default function ProblemSection() {
  return (
    <section id="problem" className="py-20 md:py-28 relative bg-slate-50 overflow-hidden">
      {/* Background Decorative Soft Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Centered Text Block with Light Card Backing */}
        <div className="relative rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 md:p-16 shadow-2xl shadow-indigo-950/5 text-center space-y-6 group hover:border-indigo-300 transition-all">
          
          {/* Subtle Glow Ring */}
          <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 opacity-60 blur group-hover:opacity-100 transition duration-500 pointer-events-none" />

          {/* Section Category Badge */}
          <div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-xs font-mono text-rose-700 font-medium">
            <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>The Silent React Performance Trap</span>
          </div>

          {/* Impactful Heading */}
          <h2 className="relative text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Your app is fast on localhost. <br className="hidden sm:inline" />
            <span className="text-gradient-purple-light">What about production?</span>
          </h2>

          {/* Body Copy */}
          <p className="relative text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            React's Virtual DOM diffing is heavy. A single un-memoized component can block the main thread for hundreds of milliseconds. AuditPulse tells you exactly where the leak is happening.
          </p>

          {/* Visual Technical Comparison Grid: Localhost vs Production */}
          <div className="relative pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            
            {/* Card 1: Localhost (Deceptive illusion) */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-600 uppercase tracking-wider flex items-center gap-2 font-semibold">
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  Localhost (MacBook Pro M3)
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  DECEPTIVE PASS
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
                  <span>Main-Thread Load</span>
                  <span className="font-mono text-emerald-600 font-bold">12ms</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[8%]" />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 font-mono text-xs text-slate-600 space-y-1">
                <div className="text-slate-400">// Dev environment hides re-render bottlenecks</div>
                <div className="text-slate-800">&lt;ProductCatalog items={'{1000}'} /&gt;</div>
                <div className="text-emerald-600 font-semibold">✓ 60 FPS (Fast CPU single thread)</div>
              </div>
            </div>

            {/* Card 2: Real Production User (The Reality) */}
            <div className="p-6 rounded-2xl bg-white border border-rose-200 space-y-4 shadow-md shadow-rose-900/5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-rose-800 uppercase tracking-wider flex items-center gap-2 font-bold">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  Real User (Mobile 4G & CPU Throttle)
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-100 text-rose-800 border border-rose-300 font-bold">
                  MAIN THREAD FROZEN
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
                  <span>Main-Thread Lock</span>
                  <span className="font-mono text-rose-600 font-bold">420ms (Spike!)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full w-[85%] rounded-full animate-pulse" />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-200 font-mono text-xs text-slate-600 space-y-1">
                <div className="text-rose-600 font-semibold">// AuditPulse Detected Component Leak:</div>
                <div className="text-slate-900 font-medium">&lt;ProductCatalog /&gt; re-rendered 14 times</div>
                <div className="text-rose-600 font-bold">✗ Long Task: 420ms main-thread freeze</div>
              </div>
            </div>

          </div>

          {/* Quick Stats Pills */}
          <div className="relative pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-700">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 shadow-sm font-medium">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>Zero Runtime Overhead (&lt;1.2KB gzipped)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 shadow-sm font-medium">
              <Code2 className="w-3.5 h-3.5 text-cyan-600" />
              <span>React 18 & 19 Concurrent Mode Aware</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 shadow-sm font-medium">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real-Time Fiber Tree Telemetry</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
