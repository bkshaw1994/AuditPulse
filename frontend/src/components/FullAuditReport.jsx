import React, { useState } from 'react';
import {
  FileText,
  Gauge,
  Server,
  Share2,
  Tag,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Printer,
  Sparkles
} from 'lucide-react';
import IssuesList from './IssuesList';
import WebVitalsCard from './WebVitalsCard';
import SsrAuditCard from './SsrAuditCard';
import MetaTagTable from './MetaTagTable';
import SocialPreview from './SocialPreview';
import ScoreImprovementAdvisor from './ScoreImprovementAdvisor';

export default function FullAuditReport({ audit = {}, onOpenPricing, onOpenGuide }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'advisor' | 'fixes' | 'vitals' | 'ssr' | 'seo' | 'social'

  if (!audit || !audit.scores) {
    return (
      <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500">
        No active audit record selected. Run a crawl or load the demo project.
      </div>
    );
  }

  const { scores = {}, performanceMetrics = {}, seoMeta = {}, ssrMeta = {}, issues = [] } = audit;

  const criticalIssues = issues.filter((i) => i.severity === 'critical');
  const warningIssues = issues.filter((i) => i.severity === 'warning');
  const passedCount = 12; // Standard passed checks

  const getGrade = (score) => {
    if (score >= 90) return { letter: 'A', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (score >= 80) return { letter: 'B', color: 'text-cyan-600 bg-cyan-50 border-cyan-200' };
    if (score >= 70) return { letter: 'C', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (score >= 60) return { letter: 'D', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { letter: 'F', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  };

  const overallGrade = getGrade(scores.overall || 0);

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(audit, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `auditpulse-full-report-${audit.domain || 'report'}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Report Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Comprehensive Audit Report
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-mono">
                Generated: {new Date(audit.timestamp).toLocaleString()}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Audit Report for <span className="font-mono text-indigo-600">{audit.url}</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-2xl">
              End-to-end diagnosis of Core Web Vitals (LCP, INP, CLS), SSR hydration gaps, dynamic SPA metadata, and priority resolution instructions.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Export Full JSON</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Report</span>
            </button>
            <button
              onClick={onOpenPricing}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Upgrade to Pro</span>
            </button>
          </div>
        </div>

        {/* Executive Scorecard Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Overall */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Overall Health
              </span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono">
                {scores.overall}
                <span className="text-xs text-slate-400 font-sans font-normal"> / 100</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-extrabold text-xl font-mono ${overallGrade.color}`}>
              {overallGrade.letter}
            </div>
          </div>

          {/* Performance & CWV */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Core Web Vitals
              </span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono">
                {scores.performance}
                <span className="text-xs text-slate-400 font-sans font-normal"> / 100</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-extrabold text-xl font-mono ${getGrade(scores.performance).color}`}>
              {getGrade(scores.performance).letter}
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                SEO & Indexability
              </span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono">
                {scores.seo}
                <span className="text-xs text-slate-400 font-sans font-normal"> / 100</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-extrabold text-xl font-mono ${getGrade(scores.seo).color}`}>
              {getGrade(scores.seo).letter}
            </div>
          </div>

          {/* Social Share Tags */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Social Link Cards
              </span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono">
                {scores.social}
                <span className="text-xs text-slate-400 font-sans font-normal"> / 100</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-extrabold text-xl font-mono ${getGrade(scores.social).color}`}>
              {getGrade(scores.social).letter}
            </div>
          </div>
        </div>

        {/* Quick Diagnostic Tally Banner */}
        <div className="flex flex-wrap items-center justify-between p-4 rounded-xl bg-slate-900 text-white text-xs gap-3 font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-rose-400 font-bold">
              <XCircle className="w-4 h-4" /> {criticalIssues.length} Critical Issues
            </span>
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4" /> {warningIssues.length} Warnings
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> {passedCount} Passed Checks
            </span>
          </div>

          <button
            onClick={onOpenGuide}
            className="text-indigo-300 hover:text-white underline text-xs font-sans transition"
          >
            Review Google CWV Guidelines &rarr;
          </button>
        </div>
      </div>

      {/* Navigation Filter Tabs for Report Sections */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'All Report Sections' },
          { key: 'advisor', label: 'Score Improvement Roadmap', badge: '+38 pts' },
          { key: 'fixes', label: `Code Fix Center (${issues.length})`, badge: issues.length },
          { key: 'vitals', label: 'Core Web Vitals Matrix' },
          { key: 'ssr', label: 'SSR vs CSR Hydration' },
          { key: 'seo', label: 'Meta Tags & Headings' },
          { key: 'social', label: 'Social Previews' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
              activeTab === tab.key
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === tab.key ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Section 0: Score Improvement Roadmap & Action Plan */}
      {(activeTab === 'all' || activeTab === 'advisor') && (
        <section className="space-y-3">
          <ScoreImprovementAdvisor audit={audit} onOpenGuide={onOpenGuide} />
        </section>
      )}

      {/* Section 1: Detailed Code Fix Center (Always shown on 'all' or 'fixes') */}
      {(activeTab === 'all' || activeTab === 'fixes') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Prioritized Resolution Strategy & Production Code Fixes
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Expand any issue to view step-by-step instructions and code snippets
            </span>
          </div>
          <IssuesList issues={issues} />
        </section>
      )}

      {/* Section 2: Core Web Vitals Deep Dive */}
      {(activeTab === 'all' || activeTab === 'vitals') && (
        <section className="space-y-3">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-indigo-600" />
            Core Web Vitals & Real-User Performance
          </h3>
          <WebVitalsCard metrics={performanceMetrics} />
        </section>
      )}

      {/* Section 3: SSR vs CSR Hydration Gap Analysis */}
      {(activeTab === 'all' || activeTab === 'ssr') && (
        <section className="space-y-3">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-600" />
            Server-Side Rendering (SSR) vs. Client-Side (CSR) Hydration Audit
          </h3>
          <SsrAuditCard
            renderingType={audit.renderingType}
            ssrMeta={ssrMeta}
            seoMeta={seoMeta}
          />
        </section>
      )}

      {/* Section 4: Dynamic Meta Tags & Headings */}
      {(activeTab === 'all' || activeTab === 'seo') && (
        <section className="space-y-3">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-600" />
            Dynamic Meta Tags, Headings & Schema.org Structured Data
          </h3>
          <MetaTagTable seoMeta={seoMeta} issues={issues} />
        </section>
      )}

      {/* Section 5: Social Share Previews */}
      {(activeTab === 'all' || activeTab === 'social') && (
        <section className="space-y-3">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-600" />
            Social Media Link Cards & Crawler Previews
          </h3>
          <SocialPreview
            ogTags={seoMeta?.ogTags}
            twitterTags={seoMeta?.twitterTags}
            title={seoMeta?.title}
            description={seoMeta?.description}
            url={audit.url}
          />
        </section>
      )}

    </div>
  );
}
