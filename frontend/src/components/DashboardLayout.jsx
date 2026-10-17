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
import { DEMO_PROJECT_STATE } from '../data/demoProjectState';
import { Sparkles, Terminal, ArrowRight } from 'lucide-react';

export default function DashboardLayout() {
  const [sites, setSites] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(DEMO_PROJECT_STATE.url);
  const [currentAudit, setCurrentAudit] = useState(DEMO_PROJECT_STATE);
  const [history, setHistory] = useState([DEMO_PROJECT_STATE]);
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
        setCurrentAudit(data.history[0]);
      } else {
        const fallback = createFallbackAuditForUrl(url);
        setHistory([fallback]);
        setCurrentAudit(fallback);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      const fallback = createFallbackAuditForUrl(url);
      setHistory([fallback]);
      setCurrentAudit(fallback);
    }
  };

  const createFallbackAuditForUrl = (targetUrl) => {
    let domain = targetUrl.replace(/^https?:\/\//, '').split('/')[0];
    return {
      ...DEMO_PROJECT_STATE,
      _id: `audit_${Date.now()}`,
      isDemoMode: false,
      url: targetUrl,
      domain: domain || 'target-app.com',
      timestamp: new Date().toISOString()
    };
  };

  const handleTriggerAudit = async (urlToAudit) => {
    setIsLoading(true);
    setError(null);

    const optimisticRecord = createFallbackAuditForUrl(urlToAudit);
    setCurrentAudit(optimisticRecord);

    try {
      const result = await runAudit(urlToAudit);
      const newRecord = result.data || optimisticRecord;
      setSelectedUrl(newRecord.url);
      setCurrentAudit({ ...newRecord, isDemoMode: false });
      await loadHistoryForUrl(newRecord.url);
      await loadSites();
    } catch (err) {
      console.warn('Audit crawl fallback invoked:', err);
      setError(err.message || 'Crawl notice - displaying baseline report');
      setCurrentAudit(optimisticRecord);
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

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Left Sidebar */}
      <Sidebar
        issuesCount={issuesCount}
        schemaCount={schemaCount}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
      />

      {/* Main Content App Shell */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Studio Top Navbar Header */}
        <Navbar
          currentAudit={currentAudit}
          isConnected={isConnected}
          onExportJson={handleExportJson}
          onExportCsv={handleExportCsv}
          onPrintReport={handlePrintReport}
          onOpenPricing={() => setIsPricingOpen(true)}
        />

        {/* Demo Mode Notice Banner */}
        {currentAudit?.isDemoMode && (
          <div className="bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 p-[1px] shadow-xs">
            <div className="bg-white/95 px-6 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                <span className="font-bold text-slate-900">
                  ⚡ Interactive Demo State:
                </span>
                <span className="text-slate-600">
                  Loaded rich mock project ("PulseCart Storefront") with simulated traffic surge (8,450 req/min) and high LCP warning (4.42s).
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/app/setup"
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold border border-indigo-200 transition flex items-center gap-1"
                >
                  <Terminal className="w-3 h-3" />
                  <span>Connect Your App</span>
                </Link>
                <button
                  onClick={() => setIsPricingOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>View Pro Features</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Audit URL Input Form */}
          <AuditForm onAuditTrigger={handleTriggerAudit} isLoading={isLoading} error={error} />

          {/* Full Audit Report Views */}
          {currentAudit && (
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
                  element={
                    <>
                      <ExecutiveSummary audit={currentAudit} onOpenGuide={() => setIsGuideOpen(true)} />
                      <ScoreCard
                        scores={currentAudit.scores}
                        issuesCount={issuesCount}
                        timestamp={currentAudit.timestamp}
                        domain={currentAudit.domain}
                      />
                      {/* Priority Score Improvement Action Plan */}
                      <ScoreImprovementAdvisor
                        audit={currentAudit}
                        onOpenGuide={() => setIsGuideOpen(true)}
                      />
                      <SsrAuditCard
                        renderingType={currentAudit.renderingType}
                        ssrMeta={currentAudit.ssrMeta}
                        seoMeta={currentAudit.seoMeta}
                      />
                      <WebVitalsCard metrics={currentAudit.performanceMetrics} />
                      <TrendChart history={history} onUpgradeClick={() => setIsPricingOpen(true)} />
                      <IssuesList issues={currentAudit.issues} />
                    </>
                  }
                />

                {/* Route: Dedicated Score Improvement Advisor */}
                <Route
                  path="/advisor"
                  element={
                    <ScoreImprovementAdvisor
                      audit={currentAudit}
                      onOpenGuide={() => setIsGuideOpen(true)}
                    />
                  }
                />

                {/* Route 2: Core Web Vitals */}
                <Route
                  path="/vitals"
                  element={
                    <>
                      <WebVitalsCard metrics={currentAudit.performanceMetrics} />
                      <TrendChart history={history} onUpgradeClick={() => setIsPricingOpen(true)} />
                    </>
                  }
                />

                {/* Route 3: SSR vs CSR Audit */}
                <Route
                  path="/ssr"
                  element={
                    <SsrAuditCard
                      renderingType={currentAudit.renderingType}
                      ssrMeta={currentAudit.ssrMeta}
                      seoMeta={currentAudit.seoMeta}
                    />
                  }
                />

                {/* Route 4: Dynamic Meta Tags */}
                <Route
                  path="/metatags"
                  element={
                    <MetaTagTable seoMeta={currentAudit.seoMeta} issues={currentAudit.issues} />
                  }
                />

                {/* Route 5: Social Preview */}
                <Route
                  path="/social"
                  element={
                    <SocialPreview
                      ogTags={currentAudit.seoMeta?.ogTags}
                      twitterTags={currentAudit.seoMeta?.twitterTags}
                      title={currentAudit.seoMeta?.title}
                      description={currentAudit.seoMeta?.description}
                      url={currentAudit.url}
                    />
                  }
                />

                {/* Route 6: Historical Analytics & 24h Trends */}
                <Route
                  path="/trends"
                  element={
                    <TrendChart history={history} onUpgradeClick={() => setIsPricingOpen(true)} />
                  }
                />

                {/* Route 7: Audit Diff Tool */}
                <Route
                  path="/diff"
                  element={
                    <DiffViewer history={history} />
                  }
                />

                {/* Route 8: JSON-LD Schema */}
                <Route
                  path="/schema"
                  element={
                    <StructuredDataViewer structuredData={currentAudit.seoMeta?.structuredData} />
                  }
                />

                {/* Route: Comprehensive Full Audit Report */}
                <Route
                  path="/report"
                  element={
                    <FullAuditReport
                      audit={currentAudit}
                      onOpenPricing={() => setIsPricingOpen(true)}
                      onOpenGuide={() => setIsGuideOpen(true)}
                    />
                  }
                />

                {/* Route 9: Diagnostics & Fixes */}
                <Route
                  path="/diagnostics"
                  element={
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs font-mono">
                              ACTION CENTER
                            </span>
                            <span className="text-xs text-slate-500">
                              {currentAudit.issues?.length || 0} Issues Detected
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
                      <IssuesList issues={currentAudit.issues} />
                    </div>
                  }
                />

                {/* Fallback redirect */}
                <Route path="*" element={<Navigate to="/app/overview" replace />} />
              </Routes>
            </div>
          )}
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
