import React, { useState } from 'react';
import { 
  Activity, 
  Layers, 
  Bell, 
  Check, 
  Code2, 
  Sparkles, 
  ChevronRight
} from 'lucide-react';

export default function FeaturesSection({ flags = {} }) {
  const [activeCodeTab, setActiveCodeTab] = useState('provider');

  const showCli = flags.showCliFeature ?? false;
  const showReactProvider = flags.showReactProviderFeature ?? false;

  return (
    <section id="features" className="py-20 md:py-28 relative bg-white border-t border-b border-slate-200">
      
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-mono text-indigo-700 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Developer-First Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Built Specifically for <span className="text-gradient-purple-light">Modern React Stacks</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Purpose-built observability for Next.js, Vite, Remix, and Create React App single page applications.
          </p>
        </div>

        {/* 3-Column Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Real-User Monitoring (RUM) */}
          <div className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Card Icon */}
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <Activity className="w-6 h-6" />
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Real-User Monitoring (RUM)
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Track TTI, LCP, and CLS across real user devices and network speeds.
                </p>
              </div>

              {/* Feature Highlights */}
              <ul className="space-y-2.5 text-xs text-slate-700 font-mono">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                  <span>rIC() & PerformanceObserver API</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                  <span>Real Device CPU & 3G/4G Throttling</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                  <span>Geographic & Device Breakdown</span>
                </li>
              </ul>
            </div>

            {/* Bottom Tech Pill */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-indigo-600 font-semibold">
              <span>Telemetry: 0.8KB Agent</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Component-Level Insights */}
          <div className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl hover:border-cyan-300 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Card Icon */}
              <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <Layers className="w-6 h-6" />
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                  Component-Level Insights
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Don't just see that the app is slow—see which React component caused the main-thread block.
                </p>
              </div>

              {/* Feature Highlights */}
              <ul className="space-y-2.5 text-xs text-slate-700 font-mono">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-600 font-bold" />
                  <span>React Fiber profiler integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-600 font-bold" />
                  <span>Un-memoized prop diffing breakdown</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-600 font-bold" />
                  <span>Exact component flamegraph traces</span>
                </li>
              </ul>
            </div>

            {/* Bottom Tech Pill */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-cyan-700 font-semibold">
              <span>React.Profiler API Ready</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Regression Alerts */}
          <div className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl hover:border-pink-300 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Card Icon */}
              <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600 group-hover:scale-110 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <Bell className="w-6 h-6" />
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                  Regression Alerts
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Get notified in Slack or Discord the moment a PR degrades your performance metrics.
                </p>
              </div>

              {/* Feature Highlights */}
              <ul className="space-y-2.5 text-xs text-slate-700 font-mono">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-pink-600 font-bold" />
                  <span>GitHub Actions CI/CD bot check</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-pink-600 font-bold" />
                  <span>Slack, Discord & Webhook webhooks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-pink-600 font-bold" />
                  <span>Automatic PR status check blockers</span>
                </li>
              </ul>
            </div>

            {/* Bottom Tech Pill */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-pink-600 font-semibold">
              <span>GitHub & Slack Webhooks</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* Developer Integration Code Showcase Section (Controlled by DB feature flag) */}
        {(showReactProvider || showCli) && (
          <div id="architecture" className="mt-16 rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-mono text-cyan-800 font-medium">
                  <Code2 className="w-3.5 h-3.5 text-cyan-600" />
                  <span>3-Line Setup</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Zero Boilerplate Integration.
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Add AuditPulse to your React application in seconds with zero build-step changes. Our lightweight agent hooks cleanly into React's batching loop.
                </p>
                
                <div className="flex gap-2 font-mono text-xs pt-2">
                  {showReactProvider && (
                    <button
                      onClick={() => setActiveCodeTab('provider')}
                      className={`px-3 py-1.5 rounded-lg border ${activeCodeTab === 'provider' ? 'bg-indigo-600 text-white border-indigo-600 font-medium' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'}`}
                    >
                      React Provider
                    </button>
                  )}
                  {showCli && (
                    <button
                      onClick={() => setActiveCodeTab('cli')}
                      className={`px-3 py-1.5 rounded-lg border ${activeCodeTab === 'cli' ? 'bg-indigo-600 text-white border-indigo-600 font-medium' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'}`}
                    >
                      GitHub CI Action
                    </button>
                  )}
                </div>
              </div>

              {/* Code Snippet Terminal Container */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs overflow-x-auto shadow-2xl">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400 text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="ml-2 text-slate-300">
                      {activeCodeTab === 'provider' && showReactProvider ? 'src/App.jsx' : '.github/workflows/audit.yml'}
                    </span>
                  </div>
                  <span>React 18/19</span>
                </div>

                {activeCodeTab === 'provider' && showReactProvider ? (
                  <pre className="text-slate-300 leading-relaxed">
                    <code>
                      <span className="text-purple-400">import</span> {'{'} AuditPulseProvider {'}'} <span className="text-purple-400">from</span> <span className="text-emerald-300">'@auditpulse/react'</span>;{'\n\n'}
                      <span className="text-purple-400">export default function</span> <span className="text-yellow-300">App</span>() {'{'}{'\n'}
                      {'  '}<span className="text-purple-400">return</span> ({'\n'}
                      {'    '}&lt;<span className="text-cyan-300">AuditPulseProvider</span>{'\n'}
                      {'      '}apiKey=<span className="text-emerald-300">"ap_live_984723847"</span>{'\n'}
                      {'      '}trackComponentRenders=<span className="text-purple-400">{'{true}'}</span>{'\n'}
                      {'      '}sampleRate=<span className="text-purple-400">{'{1.0}'}</span>{'\n'}
                      {'    '}&gt;{'\n'}
                      {'      '}&lt;<span className="text-yellow-300">MyMainApp</span> /&gt;{'\n'}
                      {'    '}&lt;/<span className="text-cyan-300">AuditPulseProvider</span>&gt;{'\n'}
                      {'  '});{'\n'}
                      {'}'}
                    </code>
                  </pre>
                ) : (
                  <pre className="text-slate-300 leading-relaxed">
                    <code>
                      <span className="text-purple-400">name:</span> Performance Regression Guard{'\n'}
                      <span className="text-purple-400">on:</span> [pull_request]{'\n'}
                      <span className="text-purple-400">jobs:</span>{'\n'}
                      {'  '}<span className="text-yellow-300">audit:</span>{'\n'}
                      {'    '}<span className="text-purple-400">runs-on:</span> ubuntu-latest{'\n'}
                      {'    '}<span className="text-purple-400">steps:</span>{'\n'}
                      {'      '}- <span className="text-purple-400">uses:</span> auditpulse/action@v2{'\n'}
                      {'        '}<span className="text-purple-400">with:</span>{'\n'}
                      {'          '}<span className="text-cyan-300">api-key:</span> {'${{ secrets.AUDITPULSE_KEY }}'}{'\n'}
                      {'          '}<span className="text-cyan-300">max-tti-ms:</span> 2500{'\n'}
                      {'          '}<span className="text-cyan-300">slack-channel:</span> '#frontend-alerts'{'\n'}
                    </code>
                  </pre>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
