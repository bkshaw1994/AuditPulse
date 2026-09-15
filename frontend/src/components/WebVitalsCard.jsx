import React from 'react';
import { Gauge, Clock, Layers, Cpu, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

export default function WebVitalsCard({ metrics = {} }) {
  const formatMs = (val) => (val >= 1000 ? `${(val / 1000).toFixed(2)}s` : `${val || 0}ms`);

  const lcp = metrics.lcp || 0;
  const ttfb = metrics.ttfb || 0;
  const cls = metrics.cls !== undefined ? metrics.cls : 0;
  const tti = metrics.tti || 0;

  const isLcpGood = lcp <= 2500;
  const isTtfbGood = ttfb <= 800;
  const isClsGood = cls <= 0.1;
  const isCwvPassing = isLcpGood && isTtfbGood && isClsGood;

  const getLcpBadge = (val) => {
    if (val <= 2500) return <span className="badge badge-good">Good (&le;2.5s)</span>;
    if (val <= 4000) return <span className="badge badge-warn">Needs Work (&le;4.0s)</span>;
    return <span className="badge badge-poor">Poor (&gt;4.0s)</span>;
  };

  const getTtfbBadge = (val) => {
    if (val <= 800) return <span className="badge badge-good">Good (&le;800ms)</span>;
    if (val <= 1800) return <span className="badge badge-warn">Needs Work (&le;1.8s)</span>;
    return <span className="badge badge-poor">Poor (&gt;1.8s)</span>;
  };

  const getClsBadge = (val) => {
    if (val <= 0.1) return <span className="badge badge-good">Good (&le;0.1)</span>;
    if (val <= 0.25) return <span className="badge badge-warn">Needs Work (&le;0.25)</span>;
    return <span className="badge badge-poor">Poor (&gt;0.25)</span>;
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Gauge size={20} color="var(--accent-cyan)" />
              Core Web Vitals & SPA Hydration Metrics
            </h3>
            {isCwvPassing ? (
              <span className="badge badge-good" style={{ fontSize: '11px' }}>
                <CheckCircle2 size={12} /> Google CWV: PASSED
              </span>
            ) : (
              <span className="badge badge-warn" style={{ fontSize: '11px' }}>
                <AlertTriangle size={12} /> Google CWV: NEEDS OPTIMIZATION
              </span>
            )}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Extracted via native browser PerformanceObserver after client JS DOM mounting
          </p>
        </div>
      </div>

      <div className="grid-cols-4" style={{ marginBottom: '20px' }}>
        {/* LCP */}
        <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Largest Contentful Paint</span>
              <Clock size={16} color="var(--accent-indigo)" />
            </div>
            <div className="mono" style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' }}>
              {formatMs(lcp)}
            </div>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {getLcpBadge(lcp)}
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target: &le;2.5s</span>
          </div>
        </div>

        {/* TTFB */}
        <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Time to First Byte (TTFB)</span>
              <Gauge size={16} color="var(--accent-cyan)" />
            </div>
            <div className="mono" style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' }}>
              {formatMs(ttfb)}
            </div>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {getTtfbBadge(ttfb)}
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target: &le;800ms</span>
          </div>
        </div>

        {/* TTI / SPA Hydration */}
        <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Time to Interactive (TTI)</span>
              <Cpu size={16} color="var(--accent-purple)" />
            </div>
            <div className="mono" style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' }}>
              {formatMs(tti)}
            </div>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="badge badge-good">Hydration Complete</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target: &le;3.8s</span>
          </div>
        </div>

        {/* CLS */}
        <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Cumulative Layout Shift</span>
              <Layers size={16} color="var(--accent-pink)" />
            </div>
            <div className="mono" style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' }}>
              {cls}
            </div>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {getClsBadge(cls)}
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target: &le;0.1</span>
          </div>
        </div>
      </div>

      {/* Resource & Memory Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        borderRadius: '10px',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        fontSize: '13px',
        color: 'var(--text-secondary)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>First Contentful Paint (FCP): <strong style={{ color: '#0f172a' }}>{formatMs(metrics.fcp)}</strong></div>
        <div>Total HTTP Requests: <strong style={{ color: '#0f172a' }}>{metrics.totalRequests || 0}</strong></div>
        <div>Page Bundle Size: <strong style={{ color: '#0f172a' }}>{metrics.totalPageSizeKB || 0} KB</strong></div>
        <div>JS Heap Usage: <strong style={{ color: '#0f172a' }}>{metrics.jsHeapSizeKB || 0} KB</strong></div>
      </div>
    </div>
  );
}
