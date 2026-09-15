import React, { useState, useEffect } from 'react';
import { GitCompare, ArrowRight, ArrowUpRight, ArrowDownRight, Check, AlertCircle, Clock, FileText } from 'lucide-react';
import { fetchDiff } from '../services/api';

export default function DiffViewer({ history = [] }) {
  const [crawl1Id, setCrawl1Id] = useState('');
  const [crawl2Id, setCrawl2Id] = useState('');
  const [diffData, setDiffData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (history.length >= 2) {
      setCrawl1Id(history[history.length - 1]._id); // oldest
      setCrawl2Id(history[0]._id);                 // newest
    }
  }, [history]);

  const handleCompare = async () => {
    if (!crawl1Id || !crawl2Id || crawl1Id === crawl2Id) return;
    setLoading(true);
    try {
      const res = await fetchDiff(crawl1Id, crawl2Id);
      setDiffData(res.diff);
    } catch (err) {
      console.error('Diff error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (history.length < 2) {
    return (
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Run at least 2 audits on this SPA target to unlock historical diff & performance comparison.
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitCompare size={20} color="var(--accent-pink)" />
            Historical Audit Diff & Regression Tool
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Compare two historical crawls side-by-side to pinpoint tag edits and performance shifts
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Base Audit (Older):</label>
          <select
            className="glass-input"
            style={{ width: '100%', background: '#ffffff', color: '#0f172a' }}
            value={crawl1Id}
            onChange={(e) => setCrawl1Id(e.target.value)}
          >
            {history.map((h) => (
              <option key={h._id} value={h._id}>
                {new Date(h.timestamp).toLocaleString()} — Health Score: {h.scores?.overall || 0}
              </option>
            ))}
          </select>
        </div>

        <ArrowRight size={22} color="var(--text-muted)" style={{ marginTop: '20px' }} />

        <div style={{ flex: 1, minWidth: '220px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Compare Audit (Newer):</label>
          <select
            className="glass-input"
            style={{ width: '100%', background: '#ffffff', color: '#0f172a' }}
            value={crawl2Id}
            onChange={(e) => setCrawl2Id(e.target.value)}
          >
            {history.map((h) => (
              <option key={h._id} value={h._id}>
                {new Date(h.timestamp).toLocaleString()} — Health Score: {h.scores?.overall || 0}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn-primary"
          style={{ marginTop: '20px' }}
          onClick={handleCompare}
          disabled={loading || crawl1Id === crawl2Id}
        >
          {loading ? 'Comparing...' : 'Run Audit Comparison'}
        </button>
      </div>

      {diffData && (
        <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '22px', border: '1px solid #e2e8f0' }}>
          {/* Summary Delta Cards */}
          <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Overall Health Delta</div>
              <div style={{
                fontSize: '24px',
                fontWeight: '800',
                color: diffData.scoreDelta >= 0 ? 'var(--status-good)' : 'var(--status-poor)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '4px'
              }}>
                {diffData.scoreDelta >= 0 ? <ArrowUpRight size={22} /> : <ArrowDownRight size={22} />}
                {diffData.scoreDelta > 0 ? `+${diffData.scoreDelta}` : diffData.scoreDelta} pts
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>LCP Delta</div>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: diffData.metricsDiff.lcpDelta <= 0 ? 'var(--status-good)' : 'var(--status-poor)',
                marginTop: '4px'
              }}>
                {diffData.metricsDiff.lcpDelta > 0 ? `+${diffData.metricsDiff.lcpDelta}ms (Slower)` : `${diffData.metricsDiff.lcpDelta}ms (Faster)`}
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>TTFB Delta</div>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: diffData.metricsDiff.ttfbDelta <= 0 ? 'var(--status-good)' : 'var(--status-poor)',
                marginTop: '4px'
              }}>
                {diffData.metricsDiff.ttfbDelta > 0 ? `+${diffData.metricsDiff.ttfbDelta}ms` : `${diffData.metricsDiff.ttfbDelta}ms`}
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>TTI Delta</div>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: diffData.metricsDiff.ttiDelta <= 0 ? 'var(--status-good)' : 'var(--status-poor)',
                marginTop: '4px'
              }}>
                {diffData.metricsDiff.ttiDelta > 0 ? `+${diffData.metricsDiff.ttiDelta}ms` : `${diffData.metricsDiff.ttiDelta}ms`}
              </div>
            </div>
          </div>

          {/* Meta Tag Diff Details */}
          <h4 style={{ fontSize: '15px', color: '#0f172a', marginBottom: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color="var(--accent-cyan)" /> Rendered Tag Differences:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ padding: '14px', borderRadius: '10px', background: diffData.tagChanges.titleChanged ? '#fffbeb' : '#ffffff', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#3730a3' }}>Title Tag: </strong>
              {diffData.tagChanges.titleChanged ? (
                <span style={{ color: 'var(--status-warn)' }}>Changed from "{diffData.tagChanges.oldTitle}" to "{diffData.tagChanges.newTitle}"</span>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>Unchanged ("{diffData.tagChanges.newTitle}")</span>
              )}
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', background: diffData.tagChanges.descriptionChanged ? '#fffbeb' : '#ffffff', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#3730a3' }}>Meta Description Tag: </strong>
              {diffData.tagChanges.descriptionChanged ? (
                <span style={{ color: 'var(--status-warn)' }}>Changed from "{diffData.tagChanges.oldDescription}" to "{diffData.tagChanges.newDescription}"</span>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>Unchanged</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
