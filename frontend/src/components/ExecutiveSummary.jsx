import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, FileSpreadsheet, Copy, Check, HelpCircle, Sparkles } from 'lucide-react';

export default function ExecutiveSummary({ audit = {}, onOpenGuide }) {
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!audit || !audit.scores) return null;

  const { scores = {}, issues = [], performanceMetrics = {}, seoMeta = {}, url = '' } = audit;
  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const warningIssues = issues.filter(i => i.severity === 'warning');

  const hasTitle = !!seoMeta.title;
  const isNoIndex = (seoMeta.robots || '').toLowerCase().includes('noindex');
  const isIndexable = hasTitle && !isNoIndex && scores.overall >= 50;

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
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${
            isIndexable ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-600'
          }`}>
            {isIndexable ? <CheckCircle2 className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                Executive SPA Audit Summary
              </h3>
              {isIndexable ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-semibold">
                  ✓ Search Engine Indexable
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-semibold">
                  ⚠️ Indexability Issues Detected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Key findings and prioritized action items for frontend performance & SEO
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenGuide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Core Web Vitals Guide</span>
          </button>
          <button
            onClick={handleCopyTextSummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-sm"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedSummary ? 'Summary Copied' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top 3 Actionable Fixes */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
        <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Top Recommended Fixes for Immediate Performance Boost:
        </h4>

        {issues.length === 0 ? (
          <div className="text-xs text-emerald-600 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4" /> All core checks passed! No priority fixes required.
          </div>
        ) : (
          <div className="space-y-2">
            {issues.slice(0, 3).map((issue, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-200 text-xs shadow-sm">
                <span className={`font-mono font-bold ${issue.severity === 'critical' ? 'text-rose-600' : 'text-amber-600'}`}>
                  #{idx + 1}
                </span>
                <div className="flex-1">
                  <strong className="text-slate-900 font-semibold">{issue.title}: </strong>
                  <span className="text-slate-600">{issue.description}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
