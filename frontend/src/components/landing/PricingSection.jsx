import React, { useState } from 'react';
import { Check, Zap, Sparkles, Shield, CreditCard, Building2 } from 'lucide-react';

const PRICING_DATA = {
  INR: {
    symbol: '₹',
    code: 'INR',
    label: 'India (₹ INR)',
    flag: '🇮🇳',
    starter: {
      price: '0',
      period: 'forever',
      note: 'No credit card or GSTIN required'
    },
    pro: {
      monthly: '1,999',
      annual: '1,599',
      billedAnnualNote: '₹19,188 billed annually (Save 20%)',
      period: '/ month'
    },
    enterprise: {
      monthly: '7,999',
      annual: '6,399',
      billedAnnualNote: '₹76,788 billed annually (Save 20%)',
      period: '/ month'
    },
    taxNote: '+ 18% GST (Tax Invoice with GSTIN & ITC provided)',
    paymentMethods: 'UPI (GPay, PhonePe, Paytm), RuPay, NetBanking & Indian Cards'
  },
  USD: {
    symbol: '$',
    code: 'USD',
    label: 'Global ($ USD)',
    flag: '🌐',
    starter: {
      price: '0',
      period: 'forever',
      note: 'Free forever for open source'
    },
    pro: {
      monthly: '29',
      annual: '24',
      billedAnnualNote: '$288 billed annually (Save 20%)',
      period: '/ month'
    },
    enterprise: {
      monthly: '99',
      annual: '79',
      billedAnnualNote: '$948 billed annually (Save 20%)',
      period: '/ month'
    },
    taxNote: 'Taxes calculated at checkout based on region',
    paymentMethods: 'Visa, Mastercard, AMEX, PayPal & Wire'
  }
};

export default function PricingSection() {
  const [currency, setCurrency] = useState('INR');
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'

  const active = PRICING_DATA[currency];

  return (
    <section id="pricing" className="py-20 md:py-28 relative bg-slate-50/50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-mono text-indigo-700 font-medium">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Developer-Friendly Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Transparent Pricing for <span className="text-gradient-purple-light">Engineering Teams</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Start for free on personal projects. Upgrade with fair, localized pricing when your React application scales.
          </p>

          {/* Controls: Currency Selector & Billing Cycle */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* Currency Selector (India INR default) */}
            <div className="inline-flex items-center bg-white border border-slate-200 p-1 rounded-xl shadow-xs">
              <button
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  currency === 'INR'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🇮🇳 India (₹ INR)</span>
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  currency === 'USD'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🌐 Global ($ USD)</span>
              </button>
            </div>

            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center bg-white border border-slate-200 p-1 rounded-xl shadow-xs">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  billingCycle === 'monthly'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Yearly</span>
                <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          
          {/* Free Starter */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">Hobby / Starter</span>
              <h3 className="text-2xl font-bold text-slate-900">Community</h3>
              <p className="text-xs text-slate-600">Perfect for side-projects, indie hackers & open source React apps.</p>
              
              <div className="pt-2">
                <span className="text-3xl font-extrabold font-mono text-slate-900">{active.symbol}{active.starter.price}</span>
                <span className="text-xs text-slate-500 font-normal"> / {active.starter.period}</span>
                <p className="text-[11px] text-slate-400 mt-1">{active.starter.note}</p>
              </div>

              <ul className="space-y-3 pt-4 text-xs text-slate-700 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" />
                  <span>1 Monitored Domain / Endpoint</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" />
                  <span>Core Web Vitals monitoring (TTI, LCP, CLS)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" />
                  <span>24-Hour Telemetry Retention</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" />
                  <span>Interactive Lighthouse Audit Simulator</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <span className="w-4 h-4 text-center shrink-0">—</span>
                  <span>Slack & Webhook Regression Alerts</span>
                </li>
              </ul>
            </div>

            <a
              href="#demo"
              className="w-full py-3 rounded-xl bg-slate-100 border border-slate-200 text-center text-xs font-semibold text-slate-900 hover:bg-slate-200 transition-all block"
            >
              Get Started Free
            </a>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="relative rounded-2xl border-2 border-indigo-600 bg-white p-8 flex flex-col justify-between space-y-6 shadow-xl shadow-indigo-950/10 transform md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-indigo-600 text-[10px] font-mono font-bold text-white uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Most Popular</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-600 uppercase tracking-wider font-bold">Pro Developer</span>
                {currency === 'INR' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    UPI / RuPay
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Pro</h3>
              <p className="text-xs text-slate-600">For fast-growing SaaS startups & production React applications.</p>
              
              <div className="pt-2">
                <span className="text-3xl font-extrabold font-mono text-slate-900">
                  {active.symbol}{billingCycle === 'monthly' ? active.pro.monthly : active.pro.annual}
                </span>
                <span className="text-xs text-slate-500 font-normal"> {active.pro.period}</span>
                {billingCycle === 'annual' && (
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    {active.pro.billedAnnualNote}
                  </p>
                )}
              </div>

              <ul className="space-y-3 pt-4 text-xs text-slate-700 border-t border-slate-100">
                <li className="flex items-center gap-2 font-semibold text-slate-900">
                  <Check className="w-4 h-4 text-indigo-600 font-bold shrink-0" />
                  <span>90-Day Full Telemetry Retention</span>
                </li>
                <li className="flex items-center gap-2 font-semibold text-slate-900">
                  <Check className="w-4 h-4 text-indigo-600 font-bold shrink-0" />
                  <span>Real-time Slack & Webhook Alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 font-bold shrink-0" />
                  <span>Up to 25 Monitored Domains</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 font-bold shrink-0" />
                  <span>React Fiber Component Flamegraph Traces</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 font-bold shrink-0" />
                  <span>Historical Trend & Regressions View</span>
                </li>
              </ul>
            </div>

            <a
              href="/app"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-center text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all block"
            >
              Start 14-Day Free Pro Trial
            </a>
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">Enterprise</span>
              <h3 className="text-2xl font-bold text-slate-900">Scale</h3>
              <p className="text-xs text-slate-600">Dedicated isolation, SLA & custom telemetry pipelines.</p>
              
              <div className="pt-2">
                <span className="text-3xl font-extrabold font-mono text-slate-900">
                  {active.symbol}{billingCycle === 'monthly' ? active.enterprise.monthly : active.enterprise.annual}
                </span>
                <span className="text-xs text-slate-500 font-normal"> {active.enterprise.period}</span>
                {billingCycle === 'annual' && (
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    {active.enterprise.billedAnnualNote}
                  </p>
                )}
              </div>

              <ul className="space-y-3 pt-4 text-xs text-slate-700 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600 font-bold shrink-0" />
                  <span>1-Year Telemetry Retention</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600 font-bold shrink-0" />
                  <span>Unlimited Monitored Domains</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600 font-bold shrink-0" />
                  <span>On-premise / VPC Collector Agent</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600 font-bold shrink-0" />
                  <span>Custom Webhook & Datadog exports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-600 font-bold shrink-0" />
                  <span>Dedicated Performance SLA (99.99%)</span>
                </li>
              </ul>
            </div>

            <a
              href="mailto:sales@auditpulse.io?subject=AuditPulse%20Enterprise%20Inquiry"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-center text-xs font-semibold text-white transition-all block"
            >
              Contact Enterprise Sales
            </a>
          </div>

        </div>

        {/* Indian Compliance & Payment Methods Footer */}
        <div className="max-w-4xl mx-auto rounded-xl bg-white border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-3">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>{active.taxNote}</strong> • Accepted: {active.paymentMethods}.
            </span>
          </div>
          <span className="text-[11px] text-slate-400 shrink-0">14-day refund guarantee • Cancel anytime</span>
        </div>

      </div>
    </section>
  );
}
