import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Gauge,
  Globe,
  Layers,
  Printer,
  ShieldCheck,
  Smartphone,
  Sparkles,
  XCircle,
  Zap
} from 'lucide-react';
import { fetchExternalReport } from '../services/api';

function getScoreTone(score) {
  if (score >= 90) {
    return {
      label: 'Good',
      ring: '#059669',
      track: '#d1fae5',
      text: 'text-emerald-700',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
  }
  if (score >= 50) {
    return {
      label: 'Needs Improvement',
      ring: '#d97706',
      track: '#fef3c7',
      text: 'text-amber-700',
      badge: 'bg-amber-50 text-amber-700 border-amber-200'
    };
  }
  return {
    label: 'Critical',
    ring: '#dc2626',
    track: '#fee2e2',
    text: 'text-rose-700',
    badge: 'bg-rose-50 text-rose-700 border-rose-200'
  };
}

function getVitalStatus(metricKey, valueStr, numericVal) {
  let num = typeof numericVal === 'number' ? numericVal : null;
  if (num === null && typeof valueStr === 'string') {
    const parsed = parseFloat(valueStr);
    if (!Number.isNaN(parsed)) {
      if (valueStr.endsWith('s') && !valueStr.endsWith('ms')) {
        num = parsed * 1000;
      } else {
        num = parsed;
      }
    }
  }

  if (num === null) {
    return { label: 'Measured', tone: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
  }

  const thresholds = {
    lcp: [2500, 4000],
    inp: [200, 500],
    cls: [0.1, 0.25],
    fcp: [1800, 3000]
  };

  const [goodMax, warnMax] = thresholds[metricKey] || [0, 0];
  if (num <= goodMax) {
    return { label: 'Good', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
  }
  if (num <= warnMax) {
    return { label: 'Needs Work', tone: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
  }
  return { label: 'Poor', tone: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
}

function ScoreGauge({ title, subtitle, score = 0 }) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score || 0)));
  const tone = getScoreTone(safeScore);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="print-avoid-break bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-5">
      <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88" aria-hidden="true">
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke={tone.track}
            strokeWidth="8"
          />
          <circle
            cx="44"
            cy="44"
            r={radius}
            fill="none"
            stroke={tone.ring}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className={`absolute text-2xl font-extrabold tracking-tight ${tone.text}`}>
          {safeScore}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{subtitle}</p>
        <h3 className="text-lg font-bold text-slate-900 mt-0.5">{title}</h3>
        <span className={`inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tone.badge}`}>
          {tone.label}
        </span>
      </div>
    </div>
  );
}

export default function ExternalReportPage() {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetchExternalReport(reportId)
      .then((res) => {
        if (!active) return;
        setReport(res.data || res);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Report not found');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reportId]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may be unavailable in non-HTTPS contexts
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Activity className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold text-slate-900">Loading Client Report</h1>
          <p className="text-sm text-slate-500 mt-1">Retrieving mobile performance and technical SEO diagnostics...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Report Unavailable</h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            {error || 'This audit report link does not exist or may have expired.'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Explore AuditPulse
          </Link>
        </div>
      </div>
    );
  }

  const metrics = report.metrics || {};
  const htmlChecks = report.htmlChecks || {};
  const failingAudits = report.failingAudits || [];
  const topIssues = report.topIssues || [];
  const generatedAt = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

  const cwvCards = [
    {
      key: 'lcp',
      name: 'Largest Contentful Paint (LCP)',
      value: metrics.lcp || 'N/A',
      numeric: metrics.lcpMs,
      target: 'Target: ≤ 2.5s',
      description: 'Measures how quickly the main hero content becomes visible on mobile.',
      icon: Clock
    },
    {
      key: 'inp',
      name: 'Interaction to Next Paint (INP)',
      value: metrics.inp || 'N/A',
      numeric: metrics.inpMs,
      target: 'Target: ≤ 200ms',
      description: 'Measures responsiveness when visitors tap buttons, menus, or forms.',
      icon: Zap
    },
    {
      key: 'cls',
      name: 'Cumulative Layout Shift (CLS)',
      value: metrics.cls || 'N/A',
      numeric: metrics.clsValue,
      target: 'Target: ≤ 0.10',
      description: 'Tracks unexpected visual jumping as fonts, images, and banners load.',
      icon: Layers
    },
    {
      key: 'fcp',
      name: 'First Contentful Paint (FCP)',
      value: metrics.fcp || 'N/A',
      numeric: metrics.fcpMs,
      target: 'Target: ≤ 1.8s',
      description: 'Time until the visitor sees the very first visual element on screen.',
      icon: Gauge
    }
  ];

  const onPageChecklist = [
    {
      label: 'Homepage <title> Tag',
      passed: Boolean(htmlChecks.hasTitle),
      detail: htmlChecks.title || 'Missing <title> tag in initial HTML response.'
    },
    {
      label: 'Meta Description',
      passed: Boolean(htmlChecks.hasMetaDescription),
      detail: htmlChecks.metaDescription || 'Missing <meta name="description"> tag for search snippets.'
    },
    {
      label: 'Primary <h1> Heading',
      passed: Boolean(htmlChecks.hasH1),
      detail: htmlChecks.h1Text || 'No <h1> heading detected in initial server HTML.'
    },
    {
      label: 'Open Graph Social Tags',
      passed: Boolean(htmlChecks.hasOpenGraph),
      detail: htmlChecks.hasOpenGraph
        ? `Configured (${htmlChecks.ogTags?.title ? 'og:title' : 'Open Graph meta'} detected)`
        : 'Missing og:title / og:description / og:image tags for link previews.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 print:bg-white">
      {/* Top Action Bar (Hidden in Print) */}
      <header className="no-print sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-base">AuditPulse</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-400">Client Diagnostic</span>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyUrl}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              {copied ? 'Link Copied' : 'Copy Link'}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Report Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 print:py-0 print:px-0 print:space-y-6">
        {/* Branded Client Header Card */}
        <section className="print-avoid-break bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="hidden print:flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-lg">AuditPulse</span>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Performance &amp; SEO Audit</span>
            </div>
            <span className="text-xs font-mono text-slate-500">Report #{report.reportId}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {report.niche && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <Sparkles className="w-3.5 h-3.5" />
                    {report.niche}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                  Mobile Diagnostic
                </span>
                {report.detectedStack && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                    <Layers className="w-3.5 h-3.5" />
                    Stack: {report.detectedStack}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {report.businessName}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
                <a
                  href={report.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-indigo-600 hover:underline break-all"
                >
                  <Globe className="w-4 h-4 shrink-0" />
                  {report.url}
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 no-print" />
                </a>
                <span className="text-slate-400">•</span>
                <span>Scanned {generatedAt}</span>
              </div>
            </div>

            <div className="shrink-0 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-left md:text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Report ID</p>
              <p className="font-mono text-sm font-bold text-slate-800 mt-0.5">{report.reportId}</p>
              <p className="text-xs text-slate-500 mt-1">Zero-Install External Scan</p>
            </div>
          </div>
        </section>

        {/* Score Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <ScoreGauge
            title="Performance"
            subtitle="Mobile Speed"
            score={metrics.performanceScore}
          />
          <ScoreGauge
            title="Technical SEO"
            subtitle="Search Readiness"
            score={metrics.seoScore}
          />
          <ScoreGauge
            title="Best Practices"
            subtitle="Trust & Standards"
            score={metrics.bestPracticesScore}
          />
        </section>

        {/* Core Web Vitals */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Mobile Core Web Vitals</h2>
              <p className="text-sm text-slate-500">Google user-experience thresholds impacting mobile conversion and search rankings.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cwvCards.map((vital) => {
              const status = getVitalStatus(vital.key, vital.value, vital.numeric);
              const Icon = vital.icon;
              return (
                <div
                  key={vital.key}
                  className="print-avoid-break bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="p-2 rounded-lg bg-slate-100 text-slate-600">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.tone}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{vital.value}</p>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700 mt-1">{vital.name}</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{vital.description}</p>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400 mt-4 pt-3 border-t border-slate-100">
                    {vital.target}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Top Summary Issues + On-Page HTML Checklist */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Executive Top Issues */}
          <div className="print-avoid-break bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Key Bottlenecks Found</h2>
                <p className="text-xs text-slate-500">Highest-leverage fixes prioritized for {report.businessName}</p>
              </div>
            </div>

            {topIssues.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                No major bottlenecks detected across Core Web Vitals or initial HTML signals.
              </div>
            ) : (
              <ul className="space-y-3">
                {topIssues.map((issue, idx) => (
                  <li
                    key={`${idx}-${issue}`}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-800"
                  >
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug font-medium">{issue}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* On-Page HTML & Social Signals */}
          <div className="print-avoid-break bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">On-Page HTML &amp; Social Signals</h2>
                <p className="text-xs text-slate-500">
                  {htmlChecks.fetched
                    ? `Direct HTML inspection (HTTP ${htmlChecks.statusCode || 200})`
                    : 'Direct HTML fetch was blocked or timed out by the target server'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {onPageChecklist.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80"
                >
                  {item.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-600 mt-0.5 break-words">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Top 5 Failing Lighthouse Audits */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">Top Technical Opportunities</h2>
              <p className="text-sm text-slate-500">Lighthouse mobile diagnostics ranked by performance and SEO impact.</p>
            </div>
          </div>

          {failingAudits.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-sm text-slate-600">
              All primary Lighthouse performance and SEO audits scored 90+ on mobile.
            </div>
          ) : (
            <div className="space-y-3">
              {failingAudits.map((audit, index) => (
                <div
                  key={audit.id || index}
                  className="print-avoid-break bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-slate-900">{audit.title}</h3>
                    <span className="inline-flex items-center self-start px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      {audit.savingsLabel || audit.displayValue || 'Needs optimization'}
                    </span>
                  </div>
                  {audit.description && (
                    <p className="text-sm text-slate-600 leading-relaxed">{audit.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Report Footer */}
        <footer className="print-avoid-break pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">AuditPulse</span>
            <span>•</span>
            <span>Zero-Install Business Performance &amp; Technical SEO Report</span>
          </div>
          <span>Prepared for {report.businessName}</span>
        </footer>
      </main>
    </div>
  );
}
