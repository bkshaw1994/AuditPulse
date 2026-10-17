import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  FileCode,
  Gauge
} from 'lucide-react';

/**
 * Dynamically generates score improvement recommendations tailored strictly
 * to the provided audit URL, domain, metrics, and detected issues.
 */
function buildDynamicSuggestions(audit) {
  if (!audit) return [];

  const url = audit.url || 'https://example.com';
  const domain = audit.domain || url.replace(/^https?:\/\//i, '').split('/')[0] || 'target-site.com';
  const perf = audit.performanceMetrics || {};
  const seo = audit.seoMeta || {};
  const ssr = audit.ssrMeta || {};
  const issues = audit.issues || [];

  const suggestions = [];

  // 1. Largest Contentful Paint (LCP) Booster
  if (perf.lcp > 2500) {
    const lcpSec = (perf.lcp / 1000).toFixed(2);
    suggestions.push({
      id: 'lcp-preload',
      title: `Preload Hero LCP Asset on ${domain} (${lcpSec}s)`,
      category: 'Core Web Vitals',
      currentMetric: `${lcpSec}s LCP`,
      targetMetric: '< 2.5s LCP',
      scoreImpact: '+18 to +25 Points',
      potentialGain: 20,
      difficulty: 'Easy (5 mins)',
      targetFile: 'frontend/index.html (<head>)',
      whyScoreSuffers: `The Largest Contentful Paint on ${url} took ${lcpSec}s (Google target is <2.5s). Late-discovered hero images or blocking font resources delay main-thread rendering.`,
      howToImprove: [
        `1. Add a high-priority preload tag in the HTML <head> for your primary above-the-fold hero asset.`,
        `2. Preconnect to critical third-party CDN domains used on ${domain}.`,
        `3. Convert images to modern WebP / AVIF with responsive srcset attributes.`
      ],
      codeSnippet: `<!-- In <head> of ${domain} -->
<link
  rel="preload"
  as="image"
  href="/hero-banner.webp"
  type="image/webp"
  fetchpriority="high"
/>
<link rel="preconnect" href="${url}" />`
    });
  }

  // 2. Server Response Time / TTFB Booster
  if (perf.ttfb > 600) {
    suggestions.push({
      id: 'ttfb-cache',
      title: `Reduce Time to First Byte (${perf.ttfb}ms) on ${domain}`,
      category: 'Server Latency',
      currentMetric: `${perf.ttfb}ms TTFB`,
      targetMetric: '< 400ms TTFB',
      scoreImpact: '+12 to +18 Points',
      potentialGain: 15,
      difficulty: 'Medium (10 mins)',
      targetFile: 'Edge CDN / Server HTTP Headers',
      whyScoreSuffers: `Initial server response time on ${domain} is ${perf.ttfb}ms. Slower initial byte delivery delays subsequent HTML parsing and style evaluation.`,
      howToImprove: [
        `1. Enable Cache-Control headers with stale-while-revalidate on your server or CDN.`,
        `2. Deploy static content to an Edge CDN (Cloudflare, Vercel Edge, AWS CloudFront).`,
        `3. Enable Gzip or Brotli compression on HTTP responses.`
      ],
      codeSnippet: `// Server Cache-Control Header for ${domain}
res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=600');`
    });
  }

  // 3. SSR / Pre-rendering Hydration Gap Booster
  if (!ssr.hasRawTitle || !ssr.hasRawDescription || audit.renderingType === 'CSR') {
    suggestions.push({
      id: 'ssr-prerender',
      title: `Pre-render Initial Server HTML for ${domain}`,
      category: 'SSR & Hydration',
      currentMetric: 'Client-Only Hydration Gap',
      targetMetric: 'Pre-rendered Static HTML',
      scoreImpact: '+14 to +20 Points',
      potentialGain: 18,
      difficulty: 'Medium (15 mins)',
      targetFile: 'frontend/index.html & Build Config',
      whyScoreSuffers: `Initial HTTP HTML response from ${url} lacks pre-rendered content. Search engine crawlers (Googlebot, Bingbot) and social bots receive an empty document prior to JS execution.`,
      howToImprove: [
        `1. Pre-render the primary <title>, <meta description>, and canonical tag directly in index.html.`,
        `2. Inject a lightweight CSS skeleton placeholder into the root container for sub-0.5s First Paint.`,
        `3. Implement Static Site Generation (SSG) or Server-Side Rendering (SSR) for indexable routes.`
      ],
      codeSnippet: `<!-- Initial pre-rendered HTML for ${domain} -->
<head>
  <title>${seo.title ? seo.title : `${domain} - High Performance Web Application`}</title>
  <meta name="description" content="${seo.description ? seo.description.slice(0, 155) : `Explore ${domain} with sub-second page performance.`}" />
  <link rel="canonical" href="${url}" />
</head>`
    });
  }

  // 4. Page Title Tag Optimization
  if (!seo.title) {
    suggestions.push({
      id: 'missing-title',
      title: `Add Missing Page Title Tag on ${domain}`,
      category: 'SEO & Indexability',
      currentMetric: 'No <title> Tag Found',
      targetMetric: '30 to 60 Chars Title',
      scoreImpact: '+20 to +25 Points',
      potentialGain: 22,
      difficulty: 'Easy (2 mins)',
      targetFile: 'frontend/index.html (<head>)',
      whyScoreSuffers: `No <title> tag was found in the rendered DOM of ${url}. Title tags are the single most influential on-page SEO ranking signal.`,
      howToImprove: [
        `1. Add a descriptive <title> tag between 30 and 60 characters.`,
        `2. Include primary brand name (${domain}) and target value proposition.`
      ],
      codeSnippet: `<title>${domain.charAt(0).toUpperCase() + domain.slice(1)} - Fast Modern Web Application</title>`
    });
  } else if (seo.titleLength < 30 || seo.titleLength > 60) {
    const isShort = seo.titleLength < 30;
    suggestions.push({
      id: 'title-length',
      title: `Optimize Page Title Length on ${domain} (${seo.titleLength} chars)`,
      category: 'SEO & Search Snippet',
      currentMetric: `"${seo.title}" (${seo.titleLength} chars)`,
      targetMetric: '30 to 60 Chars',
      scoreImpact: '+8 to +12 Points',
      potentialGain: 10,
      difficulty: 'Easy (2 mins)',
      targetFile: 'frontend/index.html (<head>)',
      whyScoreSuffers: isShort
        ? `Page title on ${url} is only ${seo.titleLength} chars. Search engines prefer titles with 30-60 characters for complete search snippet context.`
        : `Page title on ${url} is ${seo.titleLength} chars and will be truncated with an ellipsis in Google search results.`,
      howToImprove: [
        isShort
          ? `Extend title to at least 30 characters by adding key category or brand terms.`
          : `Trim title to under 60 characters to prevent truncation in search result snippets.`
      ],
      codeSnippet: isShort
        ? `<title>${seo.title} — Official Platform & Features Guide</title>`
        : `<title>${seo.title.slice(0, 55).trim()}</title>`
    });
  }

  // 5. Meta Description Tag Optimization
  if (!seo.description) {
    suggestions.push({
      id: 'missing-desc',
      title: `Add Missing Meta Description on ${domain}`,
      category: 'SEO & Click-Through',
      currentMetric: 'No Description Tag',
      targetMetric: '70 to 160 Chars',
      scoreImpact: '+15 to +20 Points',
      potentialGain: 16,
      difficulty: 'Easy (3 mins)',
      targetFile: 'frontend/index.html (<head>)',
      whyScoreSuffers: `Search engines crawling ${url} will generate arbitrary page snippet text without a designated description tag.`,
      howToImprove: [
        `1. Add a meta description tag between 70 and 160 characters.`,
        `2. Summarize key benefits and include a direct call to action.`
      ],
      codeSnippet: `<meta name="description" content="Discover ${domain}. High performance, reliable web application delivering fast page loads and seamless user experience." />`
    });
  } else if (seo.descriptionLength < 70 || seo.descriptionLength > 160) {
    const isShort = seo.descriptionLength < 70;
    suggestions.push({
      id: 'desc-length',
      title: `Refine Meta Description Length on ${domain} (${seo.descriptionLength} chars)`,
      category: 'SEO & Search Snippet',
      currentMetric: `${seo.descriptionLength} Chars`,
      targetMetric: '70 to 160 Chars',
      scoreImpact: '+8 to +12 Points',
      potentialGain: 10,
      difficulty: 'Easy (3 mins)',
      targetFile: 'frontend/index.html (<head>)',
      whyScoreSuffers: isShort
        ? `Description on ${url} is only ${seo.descriptionLength} characters. Expand to 70-160 characters to optimize click-through rate.`
        : `Description on ${url} is ${seo.descriptionLength} characters and exceeds Google's 160-character snippet display limit.`,
      howToImprove: [
        isShort
          ? `Add additional details about ${domain} to reach at least 70 characters.`
          : `Condense description to between 70 and 160 characters to avoid snippet truncation.`
      ],
      codeSnippet: isShort
        ? `<meta name="description" content="${seo.description} Explore features, documentation, and high-performance capabilities." />`
        : `<meta name="description" content="${seo.description.slice(0, 155).trim()}..." />`
    });
  }

  // 6. Image Accessibility & Alt Attributes
  if (seo.imagesMissingAlt && seo.imagesMissingAlt > 0) {
    suggestions.push({
      id: 'missing-alt',
      title: `Add Descriptive Alt Text to ${seo.imagesMissingAlt} Image(s) on ${domain}`,
      category: 'Accessibility & Image SEO',
      currentMetric: `${seo.imagesMissingAlt} Unlabeled Images`,
      targetMetric: '0 Missing Alt Tags',
      scoreImpact: '+8 to +14 Points',
      potentialGain: 12,
      difficulty: 'Easy (5 mins)',
      targetFile: 'Component <img> Tags',
      whyScoreSuffers: `${seo.imagesMissingAlt} images on ${url} lack an alt attribute, failing WCAG accessibility standards and missing Google Image Search rankings.`,
      howToImprove: [
        `1. Add concise descriptive alt text to all informative <img> tags.`,
        `2. For purely decorative icons, specify alt="" or aria-hidden="true".`
      ],
      codeSnippet: `<!-- Accessible image markup for ${domain} -->
<img src="/banner.webp" alt="Descriptive overview graphic for ${domain}" />
<img src="/decorative-icon.svg" alt="" aria-hidden="true" />`
    });
  }

  // 7. OpenGraph & Social Media Sharing Cards
  const hasOgTitle = seo.ogTags && seo.ogTags['og:title'];
  const hasOgImage = seo.ogTags && seo.ogTags['og:image'];
  if (!hasOgTitle || !hasOgImage) {
    suggestions.push({
      id: 'opengraph-social',
      title: `Inject Complete OpenGraph & Twitter Tags for ${domain}`,
      category: 'Social Indexability',
      currentMetric: 'Incomplete Social Tags',
      targetMetric: 'Rich Social Previews Active',
      scoreImpact: '+10 to +15 Points',
      potentialGain: 12,
      difficulty: 'Easy (4 mins)',
      targetFile: 'frontend/index.html (<head>)',
      whyScoreSuffers: `When links to ${url} are shared on Twitter, Slack, LinkedIn, or iMessage, no rich preview image card will generate.`,
      howToImprove: [
        `1. Define og:title, og:description, and absolute og:image URL (1200x630px).`,
        `2. Specify twitter:card as summary_large_image.`
      ],
      codeSnippet: `<!-- Social OpenGraph & Twitter tags for ${url} -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${seo.title || domain}" />
<meta property="og:description" content="${seo.description ? seo.description.slice(0, 150) : `Discover ${domain}`}" />
<meta property="og:image" content="${url.replace(/\/$/, '')}/og-image.png" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${seo.title || domain}" />
<meta name="twitter:description" content="${seo.description ? seo.description.slice(0, 150) : `Discover ${domain}`}" />
<meta name="twitter:image" content="${url.replace(/\/$/, '')}/og-image.png" />`
    });
  }

  // 8. Canonical Link Tag
  if (!seo.canonical) {
    suggestions.push({
      id: 'missing-canonical',
      title: `Specify Primary Canonical URL for ${domain}`,
      category: 'SEO Duplication Protection',
      currentMetric: 'No Canonical Specified',
      targetMetric: 'Self-Referencing Canonical Tag',
      scoreImpact: '+8 to +12 Points',
      potentialGain: 10,
      difficulty: 'Easy (2 mins)',
      targetFile: 'frontend/index.html (<head>)',
      whyScoreSuffers: `No <link rel="canonical"> tag was found on ${url}. Canonical tags prevent duplicate content indexation when URLs have query strings or trailing slashes.`,
      howToImprove: [
        `1. Add a self-referencing canonical link tag inside the HTML <head>.`
      ],
      codeSnippet: `<link rel="canonical" href="${url}" />`
    });
  }

  // 9. Heading <h1> Tag Check
  if (!seo.headings?.h1 || seo.headings.h1.length === 0) {
    suggestions.push({
      id: 'missing-h1',
      title: `Add Primary <h1> Heading to ${domain}`,
      category: 'Document Hierarchy',
      currentMetric: '0 <h1> Headings Found',
      targetMetric: 'Exactly 1 Primary <h1>',
      scoreImpact: '+10 to +15 Points',
      potentialGain: 12,
      difficulty: 'Easy (3 mins)',
      targetFile: 'Page Template Component',
      whyScoreSuffers: `No <h1> tag was found in the rendered DOM of ${url}. A clear single <h1> defines the primary topic of the document for search crawlers.`,
      howToImprove: [
        `1. Add one primary <h1> element containing the main title of the page.`
      ],
      codeSnippet: `<h1>${seo.title ? seo.title : domain}</h1>`
    });
  }

  // Fallback: If site is already high scoring (>90) and has few issues
  if (suggestions.length === 0) {
    suggestions.push({
      id: 'perf-maintenance',
      title: `Maintain Optimal Grade A Performance on ${domain}`,
      category: 'Best Practices',
      currentMetric: `${audit.scores?.overall || 95}/100 Grade A`,
      targetMetric: 'Keep > 90 Score',
      scoreImpact: 'Max Health Preserved',
      potentialGain: 5,
      difficulty: 'Ongoing',
      targetFile: 'CI/CD Performance Budgets',
      whyScoreSuffers: `Your site at ${url} is currently scoring in the top tier! Continue monitoring Real User Metrics (RUM) to prevent regression during future releases.`,
      howToImprove: [
        `1. Install @auditpulse/tracker to monitor real-user CWV metrics continuously.`,
        `2. Enforce bundle-size limits in your build pipeline.`
      ],
      codeSnippet: `// Run continuous RUM in your root layout:
import { AuditPulseTracker } from '@auditpulse/tracker';

<AuditPulseTracker apiKey="ap_live_your_key" />`
    });
  }

  return suggestions;
}

export default function ScoreImprovementAdvisor({ audit = {}, onOpenGuide }) {
  const [copiedId, setCopiedId] = useState(null);
  const [completedSteps, setCompletedSteps] = useState({});
  const [expandedStep, setExpandedStep] = useState(0);

  if (!audit || !audit.scores) return null;

  const url = audit.url || 'target-site.com';
  const domain = audit.domain || url.replace(/^https?:\/\//i, '').split('/')[0];
  const currentScore = audit.scores?.overall || 0;

  // Dynamically compute suggestions strictly for THIS audit
  const improvementSuggestions = useMemo(() => buildDynamicSuggestions(audit), [audit]);

  const totalPossibleGain = improvementSuggestions.reduce((sum, s) => sum + s.potentialGain, 0);
  const maxProjectedScore = Math.min(100, currentScore + totalPossibleGain);

  const totalGainFromCompleted = improvementSuggestions
    .filter((s) => completedSteps[s.id])
    .reduce((sum, s) => sum + s.potentialGain, 0);

  const simulatedScore = Math.min(100, currentScore + totalGainFromCompleted);

  const toggleStep = (id) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyCode = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      
      {/* Top Banner: Score Improvement Target specifically for audited URL */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Tailored Action Plan for {domain}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              How to Boost Your Score from{' '}
              <span className="text-rose-400 font-mono">{currentScore}</span> to{' '}
              <span className="text-emerald-400 font-mono">{maxProjectedScore}</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Based on the live crawl of <span className="font-mono text-indigo-200 font-semibold">{url}</span>, we identified {improvementSuggestions.length} priority opportunities. Follow the step-by-step code fixes below to eliminate score penalties.
            </p>
          </div>

          {/* Interactive Score Progression Meter */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center gap-6 shrink-0">
            <div>
              <span className="text-[10px] font-mono text-slate-300 uppercase tracking-wider block">
                Current Score
              </span>
              <div className="text-3xl font-extrabold font-mono text-rose-300">
                {currentScore}
                <span className="text-xs text-slate-400 font-sans font-normal"> / 100</span>
              </div>
            </div>

            <ArrowRight className="w-6 h-6 text-indigo-400 shrink-0" />

            <div>
              <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-wider block flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {Object.keys(completedSteps).filter((k) => completedSteps[k]).length > 0
                  ? 'Simulated Gain'
                  : 'Target Score'}
              </span>
              <div className="text-3xl font-extrabold font-mono text-emerald-400 flex items-baseline gap-1">
                <span>{simulatedScore}</span>
                <span className="text-xs text-emerald-300 font-sans font-normal">
                  (+{simulatedScore - currentScore} pts)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Milestones Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-300">Audited Target:</span>
            <span className="font-mono text-indigo-300 font-bold bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-400/30 truncate max-w-xs">
              {url}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-emerald-300 font-semibold">
              Potential Recovery: +{maxProjectedScore - currentScore} points
            </span>
          </div>

          <button
            onClick={onOpenGuide}
            className="text-indigo-300 hover:text-white underline text-xs font-medium transition"
          >
            Google CWV Guidelines &rarr;
          </button>
        </div>
      </div>

      {/* Checklist Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-indigo-600" />
            <span>Prioritized Recommendations for {domain}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any recommendation below to view code fixes tailored to your domain. Check the box to simulate score improvements.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500">
          {improvementSuggestions.length} Recommendations Found
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {improvementSuggestions.map((step, idx) => {
          const isDone = !!completedSteps[step.id];
          const isExpanded = expandedStep === idx;

          return (
            <div
              key={step.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isDone
                  ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                  : isExpanded
                  ? 'border-indigo-300 bg-indigo-50/10 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {/* Header row */}
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleStep(step.id)}
                    className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : 'border-slate-300 bg-white hover:border-indigo-400 text-transparent'
                    }`}
                    title={isDone ? 'Mark as pending' : 'Mark as applied to simulate score'}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        #{idx + 1}
                      </span>
                      <h4
                        onClick={() => setExpandedStep(isExpanded ? null : idx)}
                        className="text-base font-bold text-slate-900 cursor-pointer hover:text-indigo-600 transition"
                      >
                        {step.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
                        {step.scoreImpact}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                        {step.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                        <FileCode className="w-3.5 h-3.5 text-indigo-500" />
                        {step.targetFile}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span>Difficulty: <strong className="text-slate-700">{step.difficulty}</strong></span>
                      <span className="text-slate-400">•</span>
                      <span>Current: <strong className="text-rose-600">{step.currentMetric}</strong> &rarr; Target: <strong className="text-emerald-600">{step.targetMetric}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-start md:self-auto pl-9 md:pl-0">
                  <button
                    type="button"
                    onClick={() => setExpandedStep(isExpanded ? null : idx)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                      isExpanded
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{isExpanded ? 'Hide Code Fix' : 'View Code Fix'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Details & Code */}
              {isExpanded && (
                <div className="p-5 md:p-6 bg-slate-50 border-t border-slate-200 space-y-4 animate-in fade-in duration-150">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-1.5 text-rose-600">
                      <AlertTriangle className="w-4 h-4" /> Why Score Suffers on {domain}:
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {step.whyScoreSuffers}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-1.5 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" /> Step-by-Step Action Plan ({step.scoreImpact}):
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700 pl-4 font-sans list-disc">
                      {step.howToImprove.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                        <Code2 className="w-4 h-4 text-indigo-600" />
                        Tailored Production Code Fix for {domain}:
                      </span>

                      <button
                        type="button"
                        onClick={() => copyCode(step.codeSnippet, step.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition shadow-xs"
                      >
                        {copiedId === step.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Copy Code Snippet</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-slate-950 rounded-xl p-4 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto shadow-inner border border-slate-800">
                      <pre>{step.codeSnippet}</pre>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      <strong>Verification:</strong> Re-audit {domain} after applying this fix to claim your +{step.potentialGain} pt recovery.
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleStep(step.id)}
                      className="text-xs font-bold underline text-emerald-700 hover:text-emerald-900"
                    >
                      {isDone ? 'Mark as Pending' : `Simulate Apply (+${step.potentialGain} pts)`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
