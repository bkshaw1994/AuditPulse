import React, { useState } from 'react';
import { X, Check, Sparkles, Shield, Lock, ArrowRight } from 'lucide-react';

export default function PricingModal({ isOpen, onClose, selectedFeature = '90-Day History' }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async (planKey) => {
    setIsProcessing(true);
    try {
      // In production, triggers Lemon Squeezy / Paddle checkout overlay
      const response = await fetch('/api/billing/checkout-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planKey,
          billingCycle,
          domain: window.location.hostname
        })
      });
      const data = await response.json();
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank');
      } else {
        alert('Lemon Squeezy checkout initiated. In production, this opens the merchant checkout overlay.');
      }
    } catch (err) {
      alert('Mock checkout initiated for Pro Developer plan ($29/mo).');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 md:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-xl mx-auto space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unlock Pro Superpowers</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Upgrade to AuditPulse Pro
          </h2>
          <p className="text-xs md:text-sm text-slate-500">
            You requested access to <strong>{selectedFeature}</strong>. Get 90-day retention, real-time Slack regression alerts, and unlimited sites.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                  billingCycle === 'annual' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Tier 1: Free Hobby */}
          <div className="border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 bg-slate-50/50">
            <div>
              <div className="text-sm font-bold text-slate-900">Community Free</div>
              <p className="text-xs text-slate-500 mt-1">For testing and personal hobby projects.</p>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900">$0</span>
                <span className="text-xs text-slate-500"> / forever</span>
              </div>

              <ul className="mt-5 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>24-Hour Telemetry Retention</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Single Monitored Domain</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Manual URL Crawls</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Slack & Webhook Alerts</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Diff Regression History</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition text-center"
            >
              Current Active Plan
            </button>
          </div>

          {/* Tier 2: Pro Developer (FEATURED) */}
          <div className="border-2 border-indigo-600 rounded-2xl p-5 flex flex-col justify-between space-y-4 bg-indigo-50/30 relative shadow-md">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[10px] tracking-wide uppercase">
              Most Popular
            </div>

            <div>
              <div className="text-sm font-bold text-slate-900">Pro Developer</div>
              <p className="text-xs text-slate-500 mt-1">For startups and production React engineering teams.</p>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900">
                  {billingCycle === 'monthly' ? '$29' : '$24'}
                </span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>

              <ul className="mt-5 space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2 font-semibold text-slate-900">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>90-Day Full Telemetry Retention</span>
                </li>
                <li className="flex items-center gap-2 font-semibold text-slate-900">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Real-time Slack & Webhook Alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Up to 25 Monitored Domains</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Automated Traffic Spike Anomaly Detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Priority Headless Chrome Audit Runner</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('pro')}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Connecting...' : 'Upgrade with Lemon Squeezy'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tier 3: Enterprise */}
          <div className="border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 bg-slate-50/50">
            <div>
              <div className="text-sm font-bold text-slate-900">Enterprise</div>
              <p className="text-xs text-slate-500 mt-1">For high-traffic platforms & enterprise governance.</p>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900">
                  {billingCycle === 'monthly' ? '$99' : '$89'}
                </span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>

              <ul className="mt-5 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1-Year Full Telemetry Retention</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited Monitored Domains</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dedicated Static Egress IP Pool</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom SLAs & SAML / SSO</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('enterprise')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition text-center"
            >
              Contact Enterprise
            </button>
          </div>
        </div>

        {/* Global Tax & Compliance Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Payments securely handled by <strong>Lemon Squeezy / Paddle</strong> (Merchant of Record). Global VAT/GST & tax compliance automated.</span>
          </div>
          <span>Cancel anytime with 1-click self-serve customer portal.</span>
        </div>
      </div>
    </div>
  );
}
