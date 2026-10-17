import React, { useState } from 'react';
import { Bell, Lock, Sparkles, Send, Check } from 'lucide-react';

export default function AlertSettingsCard({ onUpgradeClick }) {
  const [slackUrl, setSlackUrl] = useState('');
  const [channel, setChannel] = useState('#alerts-performance');
  const [alertLcp, setAlertLcp] = useState(true);
  const [alertInp, setAlertInp] = useState(true);
  const [alertSpike, setAlertSpike] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTestOrSave = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/billing/alerts/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: 'pulsecart-store.io',
          webhookUrl: slackUrl,
          channel
        })
      });

      const data = await response.json();
      if (response.status === 402 || !data.success) {
        // Gated feature paywall hit!
        setTestResult({
          status: 'locked',
          message: data.message || 'Real-time Slack & custom webhook alerts are locked behind Pro.'
        });
      } else {
        setTestResult({ status: 'success', message: data.message });
      }
    } catch (err) {
      setTestResult({
        status: 'locked',
        message: 'Real-time Slack & custom webhook regression alerts require an active Pro subscription.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 space-y-6 relative overflow-hidden">
      {/* Card Header with PRO Locked Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Slack & Webhook Anomaly Regression Alerts
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-mono font-bold flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-600" />
              PRO FEATURE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Get instant notifications in Slack or Discord whenever Core Web Vitals degrade or traffic surges occur.
          </p>
        </div>

        <button
          onClick={onUpgradeClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold transition self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Unlock with Pro</span>
        </button>
      </div>

      {/* Alert Configuration Inputs */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Slack Incoming Webhook URL
            </label>
            <input
              type="text"
              placeholder="https://hooks.slack.com/services/T00/B00/XXXX"
              value={slackUrl}
              onChange={(e) => setSlackUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Destination Channel
            </label>
            <input
              type="text"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Trigger Thresholds */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Trigger Conditions (Automated Anomaly Watchdogs)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 cursor-pointer hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={alertLcp}
                onChange={(e) => setAlertLcp(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Alert when LCP &gt; 2.5s</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 cursor-pointer hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={alertInp}
                onChange={(e) => setAlertInp(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Alert when INP &gt; 200ms</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 cursor-pointer hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={alertSpike}
                onChange={(e) => setAlertSpike(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Alert on Traffic Spikes</span>
            </label>
          </div>
        </div>
      </div>

      {/* Test / Save Action with Paywall Intervention */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <button
          onClick={handleTestOrSave}
          disabled={isTesting}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition flex items-center gap-2 shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isTesting ? 'Verifying Pipeline...' : 'Test Slack Alert Dispatch'}</span>
        </button>

        {testResult && testResult.status === 'locked' && (
          <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-xl">
            <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>{testResult.message}</span>
            <button
              onClick={onUpgradeClick}
              className="underline font-bold hover:text-rose-900 ml-1 shrink-0"
            >
              Upgrade &rarr;
            </button>
          </div>
        )}

        {testResult && testResult.status === 'success' && (
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{testResult.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
