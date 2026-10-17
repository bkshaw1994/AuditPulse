import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AuditForm from './AuditForm';
import ExecutiveSummary from './ExecutiveSummary';
import WebVitalsGuideModal from './WebVitalsGuideModal';
import ScoreCard from './ScoreCard';
import WebVitalsCard from './WebVitalsCard';
import TrendChart from './TrendChart';
import MetaTagTable from './MetaTagTable';
import SocialPreview from './SocialPreview';
import DiffViewer from './DiffViewer';
import StructuredDataViewer from './StructuredDataViewer';
import SsrAuditCard from './SsrAuditCard';
import IssuesList from './IssuesList';
import SetupGuide from './SetupGuide';
import AlertSettingsCard from './AlertSettingsCard';
import PricingModal from './PricingModal';
import FullAuditReport from './FullAuditReport';
import ScoreImprovementAdvisor from './ScoreImprovementAdvisor';
import { runAudit, fetchHistory, fetchMonitoredSites } from '../services/api';
import { Sparkles, Terminal, ArrowRight, Search, Activity, AlertCircle } from 'lucide-react';

export default function DashboardLayout() {
  const [sites, setSites] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [currentAudit, setCurrentAudit] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      const data = await fetchMonitoredSites();
      setSites(data.sites || []);
      setIsConnected(true);
    } catch (err) {
      console.warn('Backend connection notice:', err);
      setIsConnected(false);
    }
  };

  const loadHistoryForUrl = async (url) => {
    try {
      const data = await fetchHistory(url);
      if (data.history && data.history.length > 0) {
        setHistory(data.history);
      }
    } catch (err) {
      console.warn('Error fetching history:', err);
    }
  };

  const handleTriggerAudit = async (urlToAudit) => {
    if (!urlToAudit || !urlToAudit.trim()) {
      setError('Please enter a website URL (e.g., https://your-site.com)');
      return;
    }

    let formatted = urlToAudit.trim();
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = 'https://' + formatted;
    }

    setIsLoading(true);
    setError(null);
    setSelectedUrl(formatted);

    try {
      const result = await runAudit(formatted);
      if (result && result.data) {
        setCurrentAudit(result.data);
        setSelectedUrl(result.data.url);
        setHistory((prev) => [result.data, ...prev.filter((h) => h._id !== result.data._id)]);
        await loadSites();
      } else {
        throw new Error('Audit crawl failed: No report data returned.');
      }
    } catch (err) {
      console.error('[DashboardLayout] Crawl error:', err);
      setError(err.message || 'Audit crawl process failed. Verify the URL is publicly reachable.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportJson = () => {
    if (!currentAudit) return;
    const jsonStr = JSON.stringify(currentAudit, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `auditpulse-${currentAudit.domain || 'report'}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCsv = () => {
    if (!currentAudit) return;
    const { scores = {}, performanceMetrics = {}, seoMeta = {}, issues = [] } = currentAudit;
    const csvRows = [
      ['Target URL', 'Domain', 'Audit Date', 'Overall Score', 'SEO Score', 'Performance Score', 'LCP (ms)', 'INP (ms)', 'TTFB (ms)', 'Title', 'Canonical', 'Issues Count'],
      [
        `"${currentAudit.url}"`,
        `"${currentAudit.domain}"`,
        `"${new Date(currentAudit.timestamp).toLocaleString()}"`,
        scores.overall || 0,
        scores.seo || 0,
        scores.performance || 0,
        performanceMetrics.lcp || 0,
        performanceMetrics.inp || 0,
        performanceMetrics.ttfb || 0,
        `"${(seoMeta.title || '').replace(/"/g, '""')}"`,
        `"${seoMeta.canonical || ''}"`,
        issues.length
      ]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `auditpulse-${currentAudit.domain || 'report'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const issuesCount = currentAudit?.issues?.length || 0;
  const schemaCount = currentAudit?.seoMeta?.structuredData?.length || 0;

  const renderAuditView = (component) => {
    if (isLoading) return null;
    if (!currentAudit) {
      return (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-14 text-center shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
            <Search className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Enter a URL to Generate Your Audit Report
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Enter any public website URL above to run a live audit. AuditPulse will benchmark Core Web Vitals, diagnose SSR vs. CSR hydration gaps, and generate customized score improvement suggestions for your domain.
            </p>
          </div>

          {/* Quick Test Samples */}
          <div className="pt-2 max-w-md mx-auto">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Or Test Live on Sample Sites:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { name: 'React Docs', url: 'https://react.dev' },
                { name: 'Next.js', url: 'https://nextjs.org' },
                { name: 'Hacker News', url: 'https://news.ycombinator.com' }
              ].map((sample) => (
                <button
                  key={sample.url}
                  type="button"
                  onClick={() => handleTriggerAudit(sample.url)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 font-mono text-xs transition shadow-xs flex items-center gap-1.5"
                >
                  <span>{sample.name}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return component;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Left Fixed Sidebar */}
      <Sidebar
        issuesCount={issuesCount}
        schemaCount={schemaCount}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
      />

      {/* Main Content App Shell - Fixed Independent Vertical Scroll */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Studio Top Navbar Header */}
        <Navbar
          currentAudit={currentAudit}
          isConnected={isConnected}
          onExportJson={handleExportJson}
          onExportCsv={handleExportCsv}
          onPrintReport={handlePrintReport}
          onOpenPricing={() => setIsPricingOpen(true)}
        />

        {/* Main Content Area */}
        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Audit URL Input Form */}
          <AuditForm onAuditTrigger={handleTriggerAudit} isLoading={isLoading} error={error} initialUrl={selectedUrl} />

          {/* State 1: Audit In Progress */}
          {isLoading && (
            <div className="rounded-3xl border border-indigo-200 bg-white p-12 text-center shadow-lg space-y-5 animate-pulse">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto text-indigo-600">
                <Activity className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-2 max-w-lg mx-auto">
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Auditing {selectedUrl}...
                </h3>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                  Launching headless Chromium browser agent, benchmarking Core Web Vitals (LCP, INP, CLS), evaluating SSR hydration, and extracting live SEO metadata.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                <span>Inspecting dynamic DOM & Network waterfall...</span>
              </div>
            </div>
          )}

          {/* Audit Views Routing */}
          <div className="space-y-6">
            <Routes>
              {/* Redirect /app to /app/overview */}
              <Route path="/" element={<Navigate to="/app/overview" replace />} />
              
              {/* Onboarding & Setup Page */}
              <Route path="/setup" element={<SetupGuide />} />

              {/* Gated Slack Alerts Page */}
              <Route
                path="/alerts"
                element={<AlertSettingsCard onUpgradeClick={() => setIsPricingOpen(true)} />}
              />

              {/* Route 1: Overview & Vitals */}
              <Route
                path="/overview"
                element={renderAuditView(
                  <>
                    <ExecutiveSummary audit={currentAudit} onOpenGuide={() => setIsGuideOpen(true)} />
                    <ScoreCard
                      scores={currentAudit?.scores}
                      issuesCount={issuesCount}
                      timestamp={currentAudit?.timestamp}
                      domain={currentAudit?.domain}
                    />
                    {/* Priority Score Improvement Action Plan */}
                    <ScoreImprovementAdvisor
                      audit={currentAudit}
                      onOpenGuide={() => setIsGuideOpen(true)}
                    />
                    <SsrAuditCard
                      renderingType={currentAudit?.renderingType}
                      ssrMeta={currentAudit?.ssrMeta}
                      seoMeta={currentAudit?.seoMeta}
                    />
                    <WebVitalsCard metrics={currentAudit?.performanceMetrics} />
                    <TrendChart history={history} onUpgradeClick={() => setIsPricingOpen(true)} />
                    <IssuesList issues={currentAudit?.issues} />
                  </>
                )}
              />

              {/* Route: Dedicated Score Improvement Advisor */}
              <Route
                path="/advisor"
                element={renderAuditView(
                  <ScoreImprovementAdvisor
                    audit={currentAudit}
                    onOpenGuide={() => setIsGuideOpen(true)}
                  />
                )}
              />

              {/* Route 2: Core Web Vitals */}
              <Route
                path="/vitals"
                element={renderAuditView(
                  <>
                    <WebVitalsCard metrics={currentAudit?.performanceMetrics} />
                    <TrendChart history={history} onUpgradeClick={() => setIsPricingOpen(true)} />
                  </>
                )}
              />

              {/* Route 3: SSR vs CSR Audit */}
              <Route
                path="/ssr"
                element={renderAuditView(
                  <SsrAuditCard
                    renderingType={currentAudit?.renderingType}
                    ssrMeta={currentAudit?.ssrMeta}
                    seoMeta={currentAudit?.seoMeta}
                  />
                )}
              />

              {/* Route 4: Dynamic Meta Tags */}
              <Route
                path="/metatags"
                element={renderAuditView(
                  <MetaTagTable seoMeta={currentAudit?.seoMeta} issues={currentAudit?.issues} />
                )}
              />

              {/* Route 5: Social Preview */}
              <Route
                path="/social"
                element={renderAuditView(
                  <SocialPreview
                    ogTags={currentAudit?.seoMeta?.ogTags}
                    twitterTags={currentAudit?.seoMeta?.twitterTags}
                    title={currentAudit?.seoMeta?.title}
                    description={currentAudit?.seoMeta?.description}
                    url={currentAudit?.url}
                  />
                )}
              />

              {/* Route 6: Historical Analytics & 24h Trends */}
              <Route
                path="/trends"
                element={renderAuditView(
                  <TrendChart history={history} onUpgradeClick={() => setIsPricingOpen(true)} />
                )}
              />

              {/* Route 7: Audit Diff Tool */}
              <Route
                path="/diff"
                element={renderAuditView(
                  <DiffViewer history={history} />
                )}
              />

              {/* Route 8: JSON-LD Schema */}
              <Route
                path="/schema"
                element={renderAuditView(
                  <StructuredDataViewer structuredData={currentAudit?.seoMeta?.structuredData} />
                )}
              />

              {/* Route: Comprehensive Full Audit Report */}
              <Route
                path="/report"
                element={renderAuditView(
                  <FullAuditReport
                    audit={currentAudit}
                    onOpenPricing={() => setIsPricingOpen(true)}
                    onOpenGuide={() => setIsGuideOpen(true)}
                  />
                )}
              />

              {/* Route 9: Diagnostics & Fixes */}
              <Route
                path="/diagnostics"
                element={renderAuditView(
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs font-mono">
                            ACTION CENTER
                          </span>
                          <span className="text-xs text-slate-500">
                            {currentAudit?.issues?.length || 0} Issues Detected
                          </span>
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                          Production Code Fix Center
                        </h2>
                        <p className="text-xs text-slate-600 mt-1 max-w-xl">
                          Root causes, target file paths, step-by-step instructions, and ready-to-copy code fixes to eliminate Core Web Vitals penalties.
                        </p>
                      </div>
                      <Link
                        to="/app/report"
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs shrink-0 flex items-center gap-1.5"
                      >
                        <span>Full Audit Report</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <IssuesList issues={currentAudit?.issues} />
                  </div>
                )}
              />

              {/* Fallback redirect */}
              <Route path="*" element={<Navigate to="/app/overview" replace />} />
            </Routes>
          </div>
        </main>

        <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 font-mono">
          AuditPulse &copy; {new Date().getFullYear()} — Core Web Vitals, SSR Hydration & Real User Monitoring Platform
        </footer>
      </div>

      {/* Core Web Vitals Educational Guide Drawer Modal */}
      <WebVitalsGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* Monetization Pricing & Paywall Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        selectedFeature="Pro Developer Subscription"
      />
    </div>
  );
}
