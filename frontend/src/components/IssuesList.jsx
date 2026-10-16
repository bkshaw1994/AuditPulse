import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
  Check,
  Lightbulb,
  FileCode,
  Zap,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';

export default function IssuesList({ issues = [] }) {
  const [severityFilter, setSeverityFilter] = useState('all');
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Initialize: expand all critical and warning issues by default so users immediately see the fixes!
  const [expandedIndices, setExpandedIndices] = useState(() => {
    const initial = {};
    issues.forEach((issue, idx) => {
      if (issue.severity === 'critical' || issue.severity === 'warning') {
        initial[idx] = true;
      }
    });
    return initial;
  });

  const toggleExpand = (idx) => {
    setExpandedIndices((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleExpandAll = () => {
    const all = {};
    issues.forEach((_, idx) => {
      all[idx] = true;
    });
    setExpandedIndices(all);
  };

  const handleCollapseAll = () => {
    setExpandedIndices({});
  };

  const copySnippet = (text, idx) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredIssues = issues.filter((issue) => {
    if (severityFilter === 'all') return true;
    return issue.severity === severityFilter;
  });

  const counts = {
    all: issues.length,
    critical: issues.filter((i) => i.severity === 'critical').length,
    warning: issues.filter((i) => i.severity === 'warning').length,
    info: issues.filter((i) => i.severity === 'info').length
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-300 text-rose-700 text-xs font-mono font-bold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            CRITICAL FIX
          </span>
        );
      case 'warning':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-mono font-bold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            WARNING
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-semibold flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-indigo-600" />
            INFO / PASSED
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm mb-6 space-y-6">
      
      {/* Header with Counters & Quick Action Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
              <Lightbulb className="w-5 h-5 text-indigo-600" />
              Audit Diagnostics & Full Code Fix Center
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-bold">
              {issues.length} Total Checks Analyzed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Prioritized issues with plain-English root causes, target file paths, step-by-step instructions, and ready-to-copy code snippets.
          </p>
        </div>

        {/* Action Controls: Filters & Expand All */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Severity Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSeverityFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                severityFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({counts.all})
            </button>
            <button
              onClick={() => setSeverityFilter('critical')}
              className={`px-3 py-1.5 rounded-lg transition ${
                severityFilter === 'critical'
                  ? 'bg-white text-rose-700 font-bold shadow-xs'
                  : 'text-rose-600 hover:text-rose-800'
              }`}
            >
              Critical ({counts.critical})
            </button>
            <button
              onClick={() => setSeverityFilter('warning')}
              className={`px-3 py-1.5 rounded-lg transition ${
                severityFilter === 'warning'
                  ? 'bg-white text-amber-800 font-bold shadow-xs'
                  : 'text-amber-700 hover:text-amber-900'
              }`}
            >
              Warnings ({counts.warning})
            </button>
            <button
              onClick={() => setSeverityFilter('info')}
              className={`px-3 py-1.5 rounded-lg transition ${
                severityFilter === 'info'
                  ? 'bg-white text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Info ({counts.info})
            </button>
          </div>

          {/* Expand/Collapse All Buttons */}
          <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
            <button
              onClick={handleExpandAll}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium transition"
              title="Expand all fix details"
            >
              Expand All
            </button>
            <button
              onClick={handleCollapseAll}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium transition"
              title="Collapse all fix details"
            >
              Collapse
            </button>
          </div>
        </div>
      </div>

      {/* Issues Accordion Cards */}
      {filteredIssues.length === 0 ? (
        <div className="py-12 px-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h4 className="text-base font-bold text-slate-900">No issues found for this filter criteria</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            All checks passed for this severity level. Your application meets the target guidelines.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIssues.map((issue, idx) => {
            const isExpanded = !!expandedIndices[idx];
            const isCritical = issue.severity === 'critical';
            const isWarning = issue.severity === 'warning';

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isCritical
                    ? 'border-rose-200 bg-rose-50/20 shadow-xs'
                    : isWarning
                    ? 'border-amber-200 bg-amber-50/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50/30'
                }`}
              >
                {/* Summary Row */}
                <div
                  onClick={() => toggleExpand(idx)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="mt-1">
                      {isCritical ? (
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-slate-900 tracking-tight">
                          {issue.title}
                        </span>
                        {getSeverityBadge(issue.severity)}
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                          {issue.category}
                        </span>
                        {issue.whereToFix && (
                          <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                            <FileCode className="w-3 h-3 text-indigo-500" />
                            {issue.whereToFix.split('&')[0].trim()}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {issue.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-start md:self-auto pl-8 md:pl-0">
                    {issue.estimatedImpact && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                        <Zap className="w-3 h-3 text-emerald-600" />
                        {issue.estimatedImpact.replace('⚡', '').trim()}
                      </span>
                    )}

                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                        isExpanded
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Hide Details' : 'View Fix & Code'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Full Fix Details Accordion */}
                {isExpanded && (
                  <div className="p-5 md:p-6 bg-white border-t border-slate-200 space-y-5 animate-in fade-in duration-150">
                    
                    {/* Section 1: What is Broken? */}
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wide">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>1. What is Broken & Root Cause Analysis:</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans pl-6">
                        {issue.whatToFix || issue.description}
                      </p>
                    </div>

                    {/* Section 2: Where to Fix (Target File & Location) */}
                    <div className="flex items-center gap-2 text-xs text-slate-700 bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl">
                      <FileCode className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="font-bold text-slate-900">Target File / Component:</span>
                      <code className="bg-white px-2 py-0.5 rounded border border-indigo-200 font-mono text-[11px] text-indigo-700 font-bold">
                        {issue.whereToFix || (issue.category === 'seo' ? 'frontend/index.html (<head>)' : issue.category === 'social' ? 'frontend/index.html (OpenGraph tags)' : 'frontend/src/components/ (React Tree)')}
                      </code>
                    </div>

                    {/* Section 3: How to Fix (Step-by-Step Resolution) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wide">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>2. How to Fix It (Step-by-Step Action Plan):</span>
                      </div>
                      <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line pl-6 font-sans space-y-1">
                        {issue.howToFix || issue.solution || 'Update component markup and pre-rendering hooks to conform with Core Web Vitals and SEO standards.'}
                      </div>
                    </div>

                    {/* Section 4: Copy-Pasteable Code Snippet */}
                    {(issue.fixSnippet || issue.actionableAdvice) && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wide">
                            <Code2 className="w-4 h-4 text-indigo-600" />
                            <span>3. Ready-to-Copy Production Code Fix:</span>
                          </div>

                          <button
                            onClick={() => copySnippet(issue.fixSnippet || issue.actionableAdvice, idx)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition shadow-xs"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Copied to Clipboard!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Copy Fix Code</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="relative group bg-slate-950 rounded-xl p-4 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto shadow-inner border border-slate-800">
                          <pre>{issue.fixSnippet || issue.actionableAdvice}</pre>
                        </div>
                      </div>
                    )}

                    {/* Section 5: Estimated Performance Impact */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold">Expected Verification Result:</span>
                        <span>{issue.estimatedImpact || (issue.severity === 'critical' ? '⚡ Eliminates critical Google ranking penalty' : '⚡ Improves score by +5-15 points')}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700">75th Percentile Recovers</span>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
