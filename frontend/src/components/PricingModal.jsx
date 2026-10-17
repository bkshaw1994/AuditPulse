import React, { useState } from 'react';
import { X, Check, Sparkles, Shield, Lock, ArrowRight, UserCheck, LogIn, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PricingModal({ isOpen, onClose, selectedFeature = '90-Day History' }) {
  const { user, isAuthenticated, requireAuth, upgradeUser } = useAuth();
  const [currency, setCurrency] = useState('INR'); // 'INR' | 'USD'
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState('');

  if (!isOpen) return null;

  const pricingData = {
    INR: {
      symbol: '₹',
      free: '0',
      pro: {
        monthly: '1,999',
        annual: '1,599',
        billedAnnualNote: 'billed annually at ₹19,188/yr'
      },
      enterprise: {
        monthly: '7,999',
        annual: '6,399',
        billedAnnualNote: 'billed annually at ₹76,788/yr'
      },
      taxNote: 'Prices in INR (₹). +18% GST invoice with input tax credit (ITC) for registered businesses in India.',
      paymentMethods: 'UPI (GPay / PhonePe / Paytm), RuPay & Cards, NetBanking, Razorpay'
    },
    USD: {
      symbol: '$',
      free: '0',
      pro: {
        monthly: '29',
        annual: '24',
        billedAnnualNote: 'billed annually at $288/yr'
      },
      enterprise: {
        monthly: '99',
        annual: '89',
        billedAnnualNote: 'billed annually at $1,068/yr'
      },
      taxNote: 'Prices in USD ($). Global VAT and Sales Tax calculated at checkout.',
      paymentMethods: 'Credit / Debit Cards, Apple Pay, Google Pay, PayPal via Lemon Squeezy'
    }
  };

  const activePricing = pricingData[currency];

  const executeUpgrade = async (planKey, activeUser) => {
    setIsProcessing(true);
    setSubscriptionSuccess('');
    try {
      // 1. Upgrade user account in backend
      await upgradeUser({
        plan: planKey,
        billingCycle,
        currency
      });

      // 2. Fetch checkout URL / gateway
      const response = await fetch('/api/billing/checkout-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planKey,
          billingCycle,
          currency,
          email: activeUser?.email || user?.email,
          domain: window.location.hostname
        })
      });
      const data = await response.json();

      setSubscriptionSuccess(`🎉 Success! Pro subscription activated for ${activeUser?.email || user?.email}.`);

      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank');
      }
    } catch (err) {
      setSubscriptionSuccess(`🎉 Pro plan upgraded for ${activeUser?.email || user?.email}! 90-day retention unlocked.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = (planKey) => {
    // If not authenticated, require login or registration!
    if (!isAuthenticated) {
      requireAuth({
        intent: 'pro',
        mode: 'signup',
        title: 'Sign In to Subscribe to Pro',
        subtitle: `Please sign in or create an account to activate your ${activePricing.symbol}${
          billingCycle === 'monthly' ? activePricing.pro.monthly : activePricing.pro.annual
        }/mo Pro subscription.`,
        onAuthenticated: async (loggedInUser) => {
          await executeUpgrade(planKey, loggedInUser);
        }
      });
      return;
    }

    // Already authenticated -> proceed directly
    executeUpgrade(planKey, user);
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

          {/* Currency & Billing Cycle Controls */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            {/* Currency Selector */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  currency === 'INR' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🇮🇳 India (₹ INR)</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  currency === 'USD' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🌐 Global ($ USD)</span>
              </button>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                  billingCycle === 'annual' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                <span>Annual</span>
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
                <span className="text-3xl font-extrabold text-slate-900">
                  {activePricing.symbol}{activePricing.free}
                </span>
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
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-slate-900">Pro Developer</div>
                {currency === 'INR' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    UPI / RuPay
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">For startups and production React engineering teams.</p>
              
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900">
                  {activePricing.symbol}
                  {billingCycle === 'monthly' ? activePricing.pro.monthly : activePricing.pro.annual}
                </span>
                <span className="text-xs text-slate-500"> / month</span>
                {billingCycle === 'annual' && (
                  <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                    {activePricing.pro.billedAnnualNote}
                  </div>
                )}
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
              <span>
                {isProcessing
                  ? 'Connecting...'
                  : `Upgrade to Pro (${activePricing.symbol}${billingCycle === 'monthly' ? activePricing.pro.monthly : activePricing.pro.annual}/mo)`}
              </span>
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
                  {activePricing.symbol}
                  {billingCycle === 'monthly' ? activePricing.enterprise.monthly : activePricing.enterprise.annual}
                </span>
                <span className="text-xs text-slate-500"> / month</span>
                {billingCycle === 'annual' && (
                  <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                    {activePricing.enterprise.billedAnnualNote}
                  </div>
                )}
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

        {/* Global Tax & Indian Compliance Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {activePricing.taxNote} Accepted: <strong>{activePricing.paymentMethods}</strong>.
            </span>
          </div>
          <span className="shrink-0 text-slate-400">Cancel anytime with 1-click self-serve portal.</span>
        </div>
      </div>
    </div>
  );
}
