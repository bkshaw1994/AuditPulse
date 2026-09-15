import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AuditForm from './components/AuditForm';
import ExecutiveSummary from './components/ExecutiveSummary';
import WebVitalsGuideModal from './components/WebVitalsGuideModal';
import ScoreCard from './components/ScoreCard';
import WebVitalsCard from './components/WebVitalsCard';
import TrendChart from './components/TrendChart';
import MetaTagTable from './components/MetaTagTable';
import SocialPreview from './components/SocialPreview';
import DiffViewer from './components/DiffViewer';
import StructuredDataViewer from './components/StructuredDataViewer';
import SsrAuditCard from './components/SsrAuditCard';
import IssuesList from './components/IssuesList';
import { runAudit, fetchHistory, fetchMonitoredSites } from './services/api';

export default function App() {
  const [sites, setSites] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState('https://react.dev');
  const [currentAudit, setCurrentAudit] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isConnected, setIsConnected] = useState(true);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    loadSites();
  }, []);

  useEffect(() => {
    if (selectedUrl) {
      loadHistoryForUrl(selectedUrl);
    }
  }, [selectedUrl]);

  const loadSites = async () => {
    try {
      const data = await fetchMonitoredSites();
      setSites(data.sites || []);
      setIsConnected(true);
      if (data.sites && data.sites.length > 0 && !selectedUrl) {
        setSelectedUrl(data.sites[0]._id);
      }
    } catch (err) {
      console.warn('Backend connection error:', err);
      setIsConnected(false);
    }
  };

  const loadHistoryForUrl = async (url) => {
    try {
      const data = await fetchHistory(url);
      setHistory(data.history || []);
      if (data.history && data.history.length > 0) {
        setCurrentAudit(data.history[0]);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleTriggerAudit = async (urlToAudit) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await runAudit(urlToAudit);
      const newRecord = result.data;
      setSelectedUrl(newRecord.url);
      setCurrentAudit(newRecord);
      await loadHistoryForUrl(newRecord.url);
      await loadSites();
    } catch (err) {
      setError(err.message || 'Audit execution failed');
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
    link.download = `spa-audit-${currentAudit.domain || 'report'}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCsv = () => {
    if (!currentAudit) return;
    const { scores = {}, performanceMetrics = {}, seoMeta = {}, issues = [] } = currentAudit;
    const csvRows = [
      ['Target URL', 'Domain', 'Audit Date', 'Overall Score', 'SEO Score', 'Performance Score', 'LCP (ms)', 'TTFB (ms)', 'TTI (ms)', 'Title', 'Canonical', 'Issues Count'],
      [
        `"${currentAudit.url}"`,
        `"${currentAudit.domain}"`,
        `"${new Date(currentAudit.timestamp).toLocaleString()}"`,
        scores.overall || 0,
        scores.seo || 0,
        scores.performance || 0,
        performanceMetrics.lcp || 0,
        performanceMetrics.ttfb || 0,
        performanceMetrics.tti || 0,
        `"${(seoMeta.title || '').replace(/"/g, '""')}"`,
        `"${seoMeta.canonical || ''}"`,
        issues.length
      ]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `spa-seo-audit-${currentAudit.domain || 'report'}.csv`);
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
    <>
      <Analytics />
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        {/* Left Collapsible SaaS Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          issuesCount={issuesCount}
          schemaCount={schemaCount}
          onOpenGuide={() => setIsGuideOpen(true)}
        />

      {/* Main Content App Shell */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navbar */}
        <Navbar
          currentAudit={currentAudit}
          isConnected={isConnected}
          onExportJson={handleExportJson}
          onExportCsv={handleExportCsv}
          onPrintReport={handlePrintReport}
        />

        {/* Container View */}
        <main style={{ padding: '28px 32px 60px 32px', flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          {/* Audit URL Input Form */}
          <AuditForm onAuditTrigger={handleTriggerAudit} isLoading={isLoading} error={error} />

          {currentAudit ? (
            <div>
              {/* View 1: Overview & Vitals */}
              {activeTab === 'overview' && (
                <>
                  <ExecutiveSummary audit={currentAudit} onOpenGuide={() => setIsGuideOpen(true)} />
                  <ScoreCard
                    scores={currentAudit.scores}
                    issuesCount={issuesCount}
                    timestamp={currentAudit.timestamp}
                    domain={currentAudit.domain}
                  />
                  <SsrAuditCard
                    renderingType={currentAudit.renderingType}
                    ssrMeta={currentAudit.ssrMeta}
                    seoMeta={currentAudit.seoMeta}
                  />
                  <WebVitalsCard metrics={currentAudit.performanceMetrics} />
                  <IssuesList issues={currentAudit.issues} />
                </>
              )}

              {/* View 2: Core Web Vitals Dedicated */}
              {activeTab === 'vitals' && (
                <>
                  <WebVitalsCard metrics={currentAudit.performanceMetrics} />
                  <TrendChart history={history} />
                </>
              )}

              {/* View 3: SSR vs CSR Architecture Dedicated */}
              {activeTab === 'ssr' && (
                <SsrAuditCard
                  renderingType={currentAudit.renderingType}
                  ssrMeta={currentAudit.ssrMeta}
                  seoMeta={currentAudit.seoMeta}
                />
              )}

              {/* View 3: Dynamic Meta Tags */}
              {activeTab === 'metatags' && (
                <MetaTagTable seoMeta={currentAudit.seoMeta} issues={currentAudit.issues} />
              )}

              {/* View 4: Social Preview */}
              {activeTab === 'social' && (
                <SocialPreview
                  ogTags={currentAudit.seoMeta?.ogTags}
                  twitterTags={currentAudit.seoMeta?.twitterTags}
                  title={currentAudit.seoMeta?.title}
                  description={currentAudit.seoMeta?.description}
                  url={currentAudit.url}
                />
              )}

              {/* View 5: Historical Analytics */}
              {activeTab === 'trends' && (
                <TrendChart history={history} />
              )}

              {/* View 6: Audit Diff Tool */}
              {activeTab === 'diff' && (
                <DiffViewer history={history} />
              )}

              {/* View 7: JSON-LD Schema */}
              {activeTab === 'schema' && (
                <StructuredDataViewer structuredData={currentAudit.seoMeta?.structuredData} />
              )}

              {/* View 8: Diagnostics & Fixes */}
              {activeTab === 'diagnostics' && (
                <IssuesList issues={currentAudit.issues} />
              )}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '8px' }}>No SPA Audit Selected</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Enter a URL above to perform your first SPA SEO & Core Web Vitals audit.</p>
            </div>
          )}
        </main>

        <footer style={{ borderTop: '1px solid #e2e8f0', background: '#ffffff', padding: '18px 0', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          SPA AuditPulse &copy; 2026 — Built with Node.js, Puppeteer, Mongoose, Express, React & Recharts
        </footer>
      </div>

      {/* Core Web Vitals Educational Guide Drawer Modal */}
      <WebVitalsGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
    </>
  );
}
