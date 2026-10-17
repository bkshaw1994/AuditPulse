import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, FileSpreadsheet, Copy, Check, HelpCircle, Sparkles, ArrowRight, FileText } from 'lucide-react';

export default function ExecutiveSummary({ audit = {}, onOpenGuide }) {
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!audit || !audit.scores) return null;

  const { scores = {}, issues = [], performanceMetrics = {}, seoMeta = {}, url = '' } = audit;
  const criticalIssues = issues.filter((i) => i.severity === 'critical');
  const warningIssues = issues.filter((i) => i.severity === 'warning');

  const hasTitle = !!seoMeta.title;
  const isNoIndex = (seoMeta.robots || '').toLowerCase().includes('noindex');
  const isIndexable = hasTitle && !isNoIndex && scores.overall >= 50;

  const generateTextSummary = () => {
    return `📊 SPA SEO & Core Web Vitals Audit Report for ${url}
• Overall Health Score: ${scores.overall}/100
• SEO Tags Score: ${scores.seo}/100
• Core Web Vitals Score: ${scores.performance}/100
• LCP: ${(performanceMetrics.lcp / 1000).toFixed(2)}s | INP: ${performanceMetrics.inp || 0}ms | TTFB: ${performanceMetrics.ttfb}ms | TTI: ${(performanceMetrics.tti / 1000).toFixed(2)}s
• Critical Issues: ${criticalIssues.length} | Warnings: ${warningIssues.length}
• Audited with AuditPulse on ${new Date(audit.timestamp).toLocaleString()}`;
  };

  const handleCopyTextSummary = () => {
    navigator.clipboard.writeText(generateTextSummary());
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleExportCsv = () => {
    const csvRows = [
      ['Target URL', 'Domain', 'Audit Date', 'Overall Score', 'SEO Score', 'Performance Score', 'LCP (ms)', 'INP (ms)', 'TTFB (ms)', 'TTI (ms)', 'Title', 'Canonical', 'Critical Issues'],
      [
        `"${url}"`,
        `"${audit.domain}"`,
        `"${new Date(audit.timestamp).toLocaleString()}"`,
        scores.overall,
        scores.seo,
        scores.performance,
        performanceMetrics.lcp,
        performanceMetrics.inp || 0,
        performanceMetrics.ttfb,
        performanceMetrics.tti,
        `"${(seoMeta.title || '').replace(/"/g, '""')}"`,
        `"${seoMeta.canonical || ''}"`,
        criticalIssues.length
      ]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `auditpulse-audit-${audit.domain || 'report'}.csv`);
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
                Executive Audit Diagnostic Summary
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
              Prioritized action items and diagnostic findings for frontend performance & SEO
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/app/report"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Full Report</span>
          </Link>
          <button
            onClick={onOpenGuide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors shadow-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>CWV Guide</span>
          </button>
          <button
            onClick={handleCopyTextSummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-xs"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedSummary ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Top Actionable Fixes Quick Preview */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Priority Action Items ({issues.length} Total):
          </h4>
          <Link
            to="/app/diagnostics"
            className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1"
          >
            <span>Open Code Fix Center</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {issues.length === 0 ? (
          <div className="text-xs text-emerald-600 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4" /> All core checks passed! No priority fixes required.
          </div>
        ) : (
          <div className="space-y-2">
            {issues.slice(0, 3).map((issue, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-white border border-slate-200 text-xs shadow-xs">
                <div className="flex items-start gap-2.5">
                  <span className={`font-mono font-bold shrink-0 ${issue.severity === 'critical' ? 'text-rose-600' : 'text-amber-600'}`}>
                    #{idx + 1}
                  </span>
                  <div>
                    <strong className="text-slate-900 font-semibold">{issue.title}: </strong>
                    <span className="text-slate-600">{issue.description}</span>
                  </div>
                </div>

                {issue.whereToFix && (
                  <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded shrink-0 self-start sm:self-auto">
                    {issue.whereToFix.split('&')[0].trim()}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
