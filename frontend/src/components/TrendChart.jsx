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
import { TrendingUp, Calendar, Info } from 'lucide-react';

export default function TrendChart({ history = [] }) {
  const [metricMode, setMetricMode] = useState('vitals'); // 'vitals' | 'scores' | 'resources'

  if (!history || history.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        No historical audit records logged yet for this URL. Trigger a crawl to generate trendlines!
      </div>
    );
  }

  const chartData = [...history].reverse().map((item) => {
    const d = new Date(item.timestamp);
    const dateStr = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    return {
      date: dateStr,
      fullDate: d.toLocaleString(),
      overallScore: item.scores?.overall || 0,
      seoScore: item.scores?.seo || 0,
      perfScore: item.scores?.performance || 0,
      lcpSec: parseFloat(((item.performanceMetrics?.lcp || 0) / 1000).toFixed(2)),
      ttfbMs: item.performanceMetrics?.ttfb || 0,
      ttiSec: parseFloat(((item.performanceMetrics?.tti || 0) / 1000).toFixed(2)),
      jsHeapMB: parseFloat(((item.performanceMetrics?.jsHeapSizeKB || 0) / 1024).toFixed(1)),
      requests: item.performanceMetrics?.totalRequests || 0
    };
  });

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color="var(--accent-indigo)" />
            Historical Performance & SEO Trendlines
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Track historical diffs and performance regression over time ({chartData.length} audits logged)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className={`btn-secondary ${metricMode === 'vitals' ? 'active' : ''}`}
            onClick={() => setMetricMode('vitals')}
            style={{ fontSize: '12px' }}
          >
            Core Web Vitals (s)
          </button>
          <button
            className={`btn-secondary ${metricMode === 'scores' ? 'active' : ''}`}
            onClick={() => setMetricMode('scores')}
            style={{ fontSize: '12px' }}
          >
            Health Scores (0-100)
          </button>
          <button
            className={`btn-secondary ${metricMode === 'resources' ? 'active' : ''}`}
            onClick={() => setMetricMode('resources')}
            style={{ fontSize: '12px' }}
          >
            JS Memory & Requests
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height: '320px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {metricMode === 'vitals' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLcp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTti" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7e22ce" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#7e22ce" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} unit="s" />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#0f172a', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend wrapperStyle={{ color: '#0f172a', fontSize: '12px', paddingTop: '10px' }} />
              <ReferenceLine y={2.5} label={{ value: 'Google LCP Limit (2.5s)', fill: '#d97706', fontSize: 11 }} stroke="#d97706" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="lcpSec" name="LCP (s)" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#colorLcp)" />
              <Area type="monotone" dataKey="ttiSec" name="TTI Hydration (s)" stroke="#7e22ce" strokeWidth={2} fillOpacity={1} fill="url(#colorTti)" />
            </AreaChart>
          ) : metricMode === 'scores' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#0f172a', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend wrapperStyle={{ color: '#0f172a', fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="overallScore" name="Overall Health Score" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              <Area type="monotone" dataKey="seoScore" name="SEO Score" stroke="#059669" strokeWidth={2} fillOpacity={0.05} />
              <Area type="monotone" dataKey="perfScore" name="Performance Score" stroke="#0284c7" strokeWidth={2} fillOpacity={0.05} />
            </AreaChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#0f172a', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend wrapperStyle={{ color: '#0f172a', fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="jsHeapMB" name="JS Heap Size (MB)" stroke="#e11d48" strokeWidth={2} fill="rgba(225,29,72,0.1)" />
              <Area type="monotone" dataKey="requests" name="Total HTTP Requests" stroke="#d97706" strokeWidth={2} fill="rgba(217,119,6,0.1)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
