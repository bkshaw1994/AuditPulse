import React from 'react';
import { Check, Zap } from 'lucide-react';

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28 relative bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-mono text-indigo-700 font-medium">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Developer-Friendly Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Transparent Pricing for <span className="text-gradient-purple-light">Teams of Any Size</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Start for free on personal projects. Upgrade when your React application scales.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Free Starter */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">Hobby / Starter</span>
              <h3 className="text-2xl font-bold text-slate-900">Free</h3>
              <p className="text-xs text-slate-600">Perfect for side-projects & open source React apps.</p>
              
              <div className="pt-2 text-3xl font-extrabold font-mono text-slate-900">$0 <span className="text-xs text-slate-500 font-normal">/ month</span></div>

              <ul className="space-y-3 pt-4 text-xs text-slate-700 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 font-bold" />
                  <span>Up to 10,000 monthly active users (MAU)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 font-bold" />
                  <span>Core Web Vitals monitoring (TTI, LCP, CLS)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 font-bold" />
                  <span>7-day telemetry history</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <span className="w-4 h-4 text-center">—</span>
                  <span>Component Fiber Profiler</span>
                </li>
              </ul>
            </div>

            <a
              href="#demo"
              className="w-full py-3 rounded-xl bg-slate-100 border border-slate-200 text-center text-xs font-semibold text-slate-900 hover:bg-slate-200 transition-all"
            >
              Get Started Free
            </a>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="relative rounded-2xl border-2 border-indigo-600 bg-white p-8 flex flex-col justify-between space-y-6 shadow-xl shadow-indigo-950/10 transform md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-indigo-600 text-[10px] font-mono font-bold text-white uppercase tracking-wider shadow-sm">
              Most Popular
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono text-indigo-600 uppercase tracking-wider font-bold">Pro Developer</span>
              <h3 className="text-2xl font-bold text-slate-900">Pro</h3>
              <p className="text-xs text-slate-600">For fast-growing SaaS & production React applications.</p>
              
              <div className="pt-2 text-3xl font-extrabold font-mono text-slate-900">$49 <span className="text-xs text-slate-500 font-normal">/ month</span></div>

              <ul className="space-y-3 pt-4 text-xs text-slate-700 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 font-bold" />
                  <span>Up to 250,000 monthly active users</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 font-bold" />
                  <span>React Fiber component flamegraph trace</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 font-bold" />
                  <span>Slack & Discord regression alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 font-bold" />
                  <span>30-day telemetry retention</span>
                </li>
              </ul>
            </div>

            <a
              href="#demo"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-center text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all"
            >
              Start 14-Day Pro Trial
            </a>
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">Enterprise</span>
              <h3 className="text-2xl font-bold text-slate-900">Scale</h3>
              <p className="text-xs text-slate-600">Dedicated isolation, SLA & custom telemetry pipelines.</p>
              
              <div className="pt-2 text-3xl font-extrabold font-mono text-slate-900">Custom</div>

              <ul className="space-y-3 pt-4 text-xs text-slate-700 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600 font-bold" />
                  <span>Unlimited monthly active users</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600 font-bold" />
                  <span>On-premise / VPC collector agent</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600 font-bold" />
                  <span>Custom Webhook & Datadog exports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600 font-bold" />
                  <span>Dedicated React performance engineer</span>
                </li>
              </ul>
            </div>

            <a
              href="#demo"
              className="w-full py-3 rounded-xl bg-slate-100 border border-slate-200 text-center text-xs font-semibold text-slate-900 hover:bg-slate-200 transition-all"
            >
              Contact Sales
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
