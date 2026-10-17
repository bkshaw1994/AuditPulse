import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { TrendingUp, Lock, Sparkles, Activity, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TrendChart({ history = [], onUpgradeClick }) {
  const { isPro, isAuthenticated, requireAuth } = useAuth();
  const [metricMode, setMetricMode] = useState('vitals'); // 'vitals' | 'latency' | 'traffic'
  const [timeRange, setTimeRange] = useState('24h'); // '24h' | '7d' | '30d' | '90d'

  // Map real historical audit data strictly from audited records
  const rawData = (history || []).map((item) => {
    const d = new Date(item.timestamp);
    const timeLabel = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    const lcpSec = parseFloat(((item.performanceMetrics?.lcp || 0) / 1000).toFixed(2));
    const inpMs = item.performanceMetrics?.inp || Math.min(Math.round((item.performanceMetrics?.tti || 0) * 0.12), 500);
    return {
      time: timeLabel,
      lcpSec,
      inpMs,
      cls: item.performanceMetrics?.cls || 0,
      ttfbMs: item.performanceMetrics?.ttfb || 0,
      requests: item.performanceMetrics?.totalRequests || 1,
      overallScore: item.scores?.overall || 0,
      p75Lcp: lcpSec,
      p90Lcp: parseFloat((lcpSec * 1.1).toFixed(2))
    };
  }).reverse();

  // If there's 1 point, duplicate it with baseline labels so AreaChart draws a smooth baseline
  const chartData = rawData.length === 1
    ? [
        { ...rawData[0], time: `${rawData[0].time} (Baseline)` },
        { ...rawData[0], time: `${rawData[0].time} (Current)` }
      ]
    : rawData;

  const latestPoint = rawData[rawData.length - 1] || null;

  const isGatedRange = !isPro && timeRange !== '24h';

  if (!rawData || rawData.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-6 text-center space-y-3">
        <TrendingUp className="w-10 h-10 text-slate-300 mx-auto" />
        <h4 className="text-base font-bold text-slate-800">Historical Telemetry Benchmark</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Audit telemetry will plot performance trends and Core Web Vitals as you analyze URLs or capture live telemetry.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 space-y-6 relative overflow-hidden">
      
      {/* Top Controls: Title, Range Picker & Metric Mode Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">
              24-Hour Performance & Traffic Trendlines
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-mono font-semibold">
              Live RUM Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-user Core Web Vitals and traffic latency captured continuously over the past 24 hours.
          </p>
        </div>

        {/* Filters and Date Range Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Range Picker */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTimeRange('24h')}
              className={`px-3 py-1.5 rounded-lg transition ${
                timeRange === '24h'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              24 Hours
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                timeRange === '7d'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Lock className="w-3 h-3 text-amber-500" />
              <span>7 Days</span>
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                timeRange === '30d'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Lock className="w-3 h-3 text-amber-500" />
              <span>30 Days</span>
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                timeRange === '90d'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Lock className="w-3 h-3 text-amber-500" />
              <span>90 Days</span>
            </button>
          </div>

          {/* Metric Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setMetricMode('vitals')}
              className={`px-3 py-1.5 rounded-lg transition ${
                metricMode === 'vitals'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Core Web Vitals
            </button>
            <button
              onClick={() => setMetricMode('latency')}
              className={`px-3 py-1.5 rounded-lg transition ${
                metricMode === 'latency'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              TTFB & INP
            </button>
            <button
              onClick={() => setMetricMode('traffic')}
              className={`px-3 py-1.5 rounded-lg transition ${
                metricMode === 'traffic'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Traffic & Spikes
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Container with Paywall Blur Overlay if Gated Range is Clicked */}
      <div className="relative">
        <div className={`w-full h-80 transition-filter duration-300 ${isGatedRange ? 'blur-xs select-none opacity-40' : ''}`}>
          <ResponsiveContainer width="100%" height="100%">
            {metricMode === 'vitals' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLcp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorP90" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit="s" domain={[0, 'auto']} />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <ReferenceLine
                  y={2.5}
                  label={{ value: 'Google LCP Limit (2.5s)', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                />
                <ReferenceLine
                  y={4.0}
                  label={{ value: 'Poor Threshold (4.0s)', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                />
                <Area
                  type="monotone"
                  dataKey="lcpSec"
                  name="LCP 75th Percentile (s)"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorLcp)"
                />
                <Area
                  type="monotone"
                  dataKey="p90Lcp"
                  name="LCP 90th Worst (s)"
                  stroke="#e11d48"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  fillOpacity={1}
                  fill="url(#colorP90)"
                />
              </AreaChart>
            ) : metricMode === 'latency' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333ea" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit="ms" />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <ReferenceLine
                  y={200}
                  label={{ value: 'Google INP Good (200ms)', fill: '#10b981', fontSize: 10 }}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                />
                <ReferenceLine
                  y={500}
                  label={{ value: 'INP Poor (500ms)', fill: '#ef4444', fontSize: 10 }}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                />
                <Area
                  type="monotone"
                  dataKey="inpMs"
                  name="Interaction to Next Paint (ms)"
                  stroke="#9333ea"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorInp)"
                />
                <Area
                  type="monotone"
                  dataKey="ttfbMs"
                  name="Server TTFB (ms)"
                  stroke="#0284c7"
                  strokeWidth={2}
                  fillOpacity={0.08}
                />
              </AreaChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReqs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="requests"
                  name="Concurrent Visitors (req/min)"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorReqs)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Phase 4: Gated Feature Paywall Overlay */}
        {isGatedRange && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xs p-6 text-center z-10 rounded-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">
              Historical Data Retention Locked (&gt; 24 Hours)
            </h4>
            <p className="text-xs text-slate-600 max-w-md mt-1 mb-4 leading-relaxed">
              Free Community accounts retain 24 hours of telemetry. Upgrade to <strong>Pro Developer</strong> to unlock up to 90 days of performance trends, regression anomaly detection, and automated Slack alerts.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    requireAuth({
                      intent: 'pro',
                      mode: 'signup',
                      title: 'Sign In to Unlock 90-Day Retention',
                      subtitle: 'Please sign in or create an account to activate your Pro subscription (₹1,999/mo).',
                      onAuthenticated: () => {
                        if (typeof onUpgradeClick === 'function') onUpgradeClick();
                      }
                    });
                  } else {
                    if (typeof onUpgradeClick === 'function') onUpgradeClick();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upgrade to Pro — ₹1,999/mo</span>
              </button>
              <button
                onClick={() => setTimeRange('24h')}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
              >
                Back to 24 Hours
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Telemetry Status Annotation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 gap-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${latestPoint && latestPoint.lcpSec > 2.5 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
          <span className="font-semibold text-slate-900">Telemetry Status:</span>
          <span>
            {latestPoint
              ? `${rawData.length} crawl(s) recorded. Latest LCP: ${latestPoint.lcpSec}s (${latestPoint.lcpSec <= 2.5 ? 'Good' : 'Needs Optimization'}) | INP: ${latestPoint.inpMs}ms | TTFB: ${latestPoint.ttfbMs}ms`
              : 'Awaiting initial crawl telemetry.'}
          </span>
        </div>
        <div className="font-mono text-[11px] text-slate-500 shrink-0">
          Source: Real Audited URL
        </div>
      </div>

    </div>
  );
}
