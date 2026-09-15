import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Copy,
  Check,
  Zap,
  Globe,
  HelpCircle,
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function ExecutiveSummary({ audit = {}, onOpenGuide }) {
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!audit || !audit.scores) return null;

  const { scores = {}, issues = [], performanceMetrics = {}, seoMeta = {}, url = '' } = audit;
  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const warningIssues = issues.filter(i => i.severity === 'warning');

  // Compute Indexability Status
  const hasTitle = !!seoMeta.title;
  const hasDesc = !!seoMeta.description;
  const isNoIndex = (seoMeta.robots || '').toLowerCase().includes('noindex');
  const isIndexable = hasTitle && !isNoIndex && scores.overall >= 50;

  // Generate shareable text summary for Slack/Email
  const generateTextSummary = () => {
    return `📊 SPA SEO & Core Web Vitals Audit Report for ${url}
• Overall Health Score: ${scores.overall}/100
• SEO Tags Score: ${scores.seo}/100
• Core Web Vitals Score: ${scores.performance}/100
• LCP: ${(performanceMetrics.lcp / 1000).toFixed(2)}s | TTFB: ${performanceMetrics.ttfb}ms | TTI: ${(performanceMetrics.tti / 1000).toFixed(2)}s
• Critical Issues: ${criticalIssues.length} | Warnings: ${warningIssues.length}
• Audited with SPA AuditPulse on ${new Date(audit.timestamp).toLocaleString()}`;
  };

  const handleCopyTextSummary = () => {
    navigator.clipboard.writeText(generateTextSummary());
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleExportCsv = () => {
    const csvRows = [
      ['Target URL', 'Domain', 'Audit Date', 'Overall Score', 'SEO Score', 'Performance Score', 'LCP (ms)', 'TTFB (ms)', 'TTI (ms)', 'Title', 'Canonical', 'Critical Issues'],
      [
        `"${url}"`,
        `"${audit.domain}"`,
        `"${new Date(audit.timestamp).toLocaleString()}"`,
        scores.overall,
        scores.seo,
        scores.performance,
        performanceMetrics.lcp,
        performanceMetrics.ttfb,
        performanceMetrics.tti,
        `"${(seoMeta.title || '').replace(/"/g, '""')}"`,
        `"${seoMeta.canonical || ''}"`,
        criticalIssues.length
      ]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `spa-seo-audit-${audit.domain || 'report'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Executive Overview Banner */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', border: '1px solid #cbd5e1' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: isIndexable ? '#ecfdf5' : '#fff1f2',
              border: `1px solid ${isIndexable ? '#a7f3d0' : '#fecdd3'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isIndexable ? <CheckCircle2 size={24} color="#059669" /> : <ShieldAlert size={24} color="#e11d48" />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                  Executive SPA Audit Summary
                </h3>
                {isIndexable ? (
                  <span className="badge badge-good">✓ Search Engine Indexable</span>
                ) : (
                  <span className="badge badge-poor">⚠️ Indexability Issues Detected</span>
                )}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Key findings and prioritized action items for SEO & Growth teams
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={onOpenGuide} style={{ fontSize: '12px', background: '#e0e7ff', borderColor: '#c7d2fe', color: '#3730a3' }}>
              <HelpCircle size={14} /> Core Web Vitals Guide
            </button>
            <button className="btn-secondary" onClick={handleCopyTextSummary} style={{ fontSize: '12px' }}>
              {copiedSummary ? <Check size={14} color="#059669" /> : <Copy size={14} />}
              {copiedSummary ? 'Summary Copied' : 'Copy Summary'}
            </button>
            <button className="btn-secondary" onClick={handleExportCsv} style={{ fontSize: '12px' }}>
              <FileSpreadsheet size={14} color="#059669" /> Export CSV
            </button>
          </div>
        </div>

        {/* Top 3 Prioritized Actionable Fixes */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="var(--accent-indigo)" /> Top Recommended Fixes for Immediate Ranking Boost:
          </h4>

          {issues.length === 0 ? (
            <div style={{ fontSize: '13px', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> All core checks passed! No priority fixes required.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {issues.slice(0, 3).map((issue, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontWeight: '700', color: issue.severity === 'critical' ? '#e11d48' : '#d97706', minWidth: '20px' }}>
                    #{idx + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: '#0f172a' }}>{issue.title}: </strong>
                    <span style={{ color: '#475569' }}>{issue.description}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
