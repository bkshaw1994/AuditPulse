import React from 'react';
import { ShieldCheck, Zap, Share2, AlertCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function ScoreCard({ scores = {}, issuesCount = 0, timestamp, domain }) {
  const overall = scores.overall || 0;
  const seo = scores.seo || 0;
  const performance = scores.performance || 0;
  const social = scores.social || 0;

  const getScoreColor = (val) => {
    if (val >= 90) return '#059669';
    if (val >= 70) return '#d97706';
    return '#e11d48';
  };

  const getScoreLabel = (val) => {
    if (val >= 90) return 'Optimal Health';
    if (val >= 70) return 'Needs Work';
    return 'Action Required';
  };

  const strokeDashoffset = 283 - (283 * overall) / 100;

  return (
    <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
      {/* Overall Health Card */}
      <div className="glass-panel" style={{ padding: '22px', display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '120px',
          height: '120px',
          background: `radial-gradient(circle, ${getScoreColor(overall)}15 0%, transparent 70%)`,
          pointerEvents: 'none'
        }} />

        {/* Dual Ring Circular Gauge */}
        <div style={{ position: 'relative', width: '92px', height: '92px', flexShrink: 0 }}>
          <svg width="92" height="92" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke={getScoreColor(overall)}
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>{overall}</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', tracking: '0.5px', marginTop: '-2px' }}>/ 100</span>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)', fontWeight: 600 }}>
            Overall SPA Health
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginTop: '2px', lineHeight: 1.2 }}>
            {getScoreLabel(overall)}
          </h3>
          <div style={{ fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {issuesCount === 0 ? (
              <span className="badge badge-good" style={{ fontSize: '11px' }}>
                <CheckCircle2 size={12} /> 0 Critical Issues
              </span>
            ) : (
              <span className="badge badge-warn" style={{ fontSize: '11px' }}>
                ⚠️ {issuesCount} Issue(s) Detected
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SEO Score Card */}
      <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Dynamic SEO Tags</span>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={18} color="var(--accent-indigo)" />
          </div>
        </div>
        <div>
          <div style={{ fontSize: '30px', fontWeight: '800', color: getScoreColor(seo), letterSpacing: '-0.5px' }}>
            {seo}<span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>/100</span>
          </div>
          <div style={{ width: '100%', height: '5px', background: '#f1f5f9', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${seo}%`, height: '100%', background: getScoreColor(seo), borderRadius: '3px', transition: 'width 0.8s ease' }} />
          </div>
        </div>
      </div>

      {/* Performance Score Card */}
      <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Core Web Vitals</span>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="var(--accent-cyan)" />
          </div>
        </div>
        <div>
          <div style={{ fontSize: '30px', fontWeight: '800', color: getScoreColor(performance), letterSpacing: '-0.5px' }}>
            {performance}<span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>/100</span>
          </div>
          <div style={{ width: '100%', height: '5px', background: '#f1f5f9', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${performance}%`, height: '100%', background: getScoreColor(performance), borderRadius: '3px', transition: 'width 0.8s ease' }} />
          </div>
        </div>
      </div>

      {/* Social Tags Score Card */}
      <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Social OpenGraph</span>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Share2 size={18} color="var(--accent-purple)" />
          </div>
        </div>
        <div>
          <div style={{ fontSize: '30px', fontWeight: '800', color: getScoreColor(social), letterSpacing: '-0.5px' }}>
            {social}<span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>/100</span>
          </div>
          <div style={{ width: '100%', height: '5px', background: '#f1f5f9', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${social}%`, height: '100%', background: getScoreColor(social), borderRadius: '3px', transition: 'width 0.8s ease' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
