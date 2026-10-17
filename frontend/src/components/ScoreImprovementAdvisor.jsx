import React, { useState } from 'react';
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
  ShieldCheck,
  FileCode,
  Gauge
} from 'lucide-react';

export default function ScoreImprovementAdvisor({ audit = {}, onOpenGuide }) {
  const [copiedId, setCopiedId] = useState(null);
  const [completedSteps, setCompletedSteps] = useState({});
  const [expandedStep, setExpandedStep] = useState(0); // auto-expand first priority fix

  if (!audit || !audit.scores) return null;

  const currentScore = audit.scores?.overall || 58;
  const currentPerf = audit.scores?.performance || 48;
  const currentSeo = audit.scores?.seo || 62;

  // Curated high-impact score improvement suggestions
  const improvementSuggestions = [
    {
      id: 'lcp-preload',
      title: 'Preload Hero LCP Asset & Enable High Fetch Priority',
      category: 'Core Web Vitals',
      currentMetric: `${((audit.performanceMetrics?.lcp || 4420) / 1000).toFixed(2)}s LCP`,
      targetMetric: '< 2.5s LCP',
      scoreImpact: '+18 to +24 Points',
      potentialGain: 22,
      difficulty: 'Easy (5 mins)',
      targetFile: 'frontend/index.html (<head>)',
      whyScoreSuffers:
        'The Largest Contentful Paint image or critical font is requested late during client-side hydration, delaying render by over 3.2 seconds and triggering a severe Google CWV ranking penalty.',
      howToImprove: [
        '1. Add a <link rel="preload"> tag in the HTML <head> with fetchpriority="high".',
        '2. Convert the image to modern WebP / AVIF format with optimized dimensions.',
        '3. Ensure Cache-Control immutable headers are enabled on your CDN.'
      ],
      codeSnippet: `<!-- frontend/index.html (<head>) -->
<!-- 1. Preload high-priority hero image before JS hydration -->
<link
  rel="preload"
  as="image"
  href="/hero-banner.webp"
  type="image/webp"
  fetchpriority="high"
/>

<!-- 2. Preconnect to critical asset CDN origins -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`
    },
    {
      id: 'ssr-prerender',
      title: 'Pre-render Server HTML for Non-JS Crawlers & Instant FCP',
      category: 'SSR & SEO',
      currentMetric: 'Empty #root Container',
      targetMetric: 'Full Static HTML Skeleton',
      scoreImpact: '+14 to +18 Points',
      potentialGain: 16,
      difficulty: 'Medium (15 mins)',
      targetFile: 'frontend/index.html & vite.config.js',
      whyScoreSuffers:
        'When Googlebot or social link bots request your URL, they receive an empty <div> container. If client-side JavaScript takes >5s to hydrate, the page is indexed as blank or penalized.',
      howToImprove: [
        '1. Pre-render essential meta tags (<title>, <meta description>, canonical) directly in index.html.',
        '2. Insert a lightweight CSS skeleton placeholder inside #root so First Contentful Paint is under 0.8s.',
        '3. Use Vite SSG (vite-plugin-ssr or static pre-rendering) for marketing and content routes.'
      ],
      codeSnippet: `<!-- frontend/index.html -->
<head>
  <title>PulseCart Storefront - Modern E-Commerce Performance</title>
  <meta name="description" content="Shop verified high-performance apparel with instantaneous sub-second page transitions." />
  <link rel="canonical" href="https://pulsecart-store.io" />
</head>
<body>
  <div id="root">
    <!-- Server-Side Pre-rendered Skeleton for 0.4s First Paint -->
    <header class="skeleton-header"><nav>Loading PulseCart...</nav></header>
  </div>
</body>`
    },
    {
      id: 'inp-memo',
      title: 'Eliminate 520ms React Hydration Freeze with React.memo() & startTransition',
      category: 'Interaction to Next Paint (INP)',
      currentMetric: `${audit.performanceMetrics?.inp || 520}ms INP`,
      targetMetric: '< 200ms INP',
      scoreImpact: '+10 to +15 Points',
      potentialGain: 12,
      difficulty: 'Medium (10 mins)',
      targetFile: 'frontend/src/components/ProductGrid.jsx',
      whyScoreSuffers:
        'Filtering or typing triggers a synchronous reconciliation cascade across 120 child components, blocking the browser main thread and failing Google INP thresholds.',
      howToImprove: [
        '1. Wrap pure leaf components in React.memo() with primitive prop comparisons.',
        '2. Wrap non-urgent search filter state updates inside startTransition().',
        '3. Virtualize lists with react-window if rendering more than 50 items at once.'
      ],
      codeSnippet: `import React, { memo, startTransition, useState } from 'react';

// 1. Memoize child items to prevent unnecessary re-renders
export const ProductCard = memo(function ProductCard({ product, onSelect }) {
  return (
    <div onClick={() => onSelect(product.id)} className="product-card">
      <img src={product.image} alt={product.title} loading="lazy" />
      <h4>{product.title}</h4>
    </div>
  );
});

// 2. Wrap heavy filter updates in startTransition to keep UI responsive
function ProductCatalog({ items }) {
  const [filter, setFilter] = useState('');

  const handleSearch = (e) => {
    const val = e.target.value;
    startTransition(() => {
      setFilter(val);
    });
  };

  return <input type="text" onChange={handleSearch} placeholder="Filter items..." />;
}`
    },
    {
      id: 'opengraph-social',
      title: 'Inject Complete OpenGraph & Twitter Card Meta Tags',
      category: 'Social Indexability',
      currentMetric: 'Missing og:image & twitter:card',
      targetMetric: 'Rich Social Previews Active',
      scoreImpact: '+8 to +12 Points',
      potentialGain: 10,
      difficulty: 'Easy (5 mins)',
      targetFile: 'frontend/index.html (<head>)',
      whyScoreSuffers:
        'Slack, LinkedIn, Twitter, and iMessage generate blank grey snippet cards when links are shared, resulting in zero social click-throughs and lower domain authority score.',
      howToImprove: [
        '1. Define og:title, og:description, and absolute og:image URL (1200x630px).',
        '2. Add twitter:card as summary_large_image.',
        '3. Validate that og:image is served over HTTPS with permissive CORS headers.'
      ],
      codeSnippet: `<!-- frontend/index.html (<head>) -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://pulsecart-store.io" />
<meta property="og:title" content="PulseCart - High Performance React Storefront" />
<meta property="og:description" content="Shop verified high-performance apparel with instantaneous page transitions." />
<meta property="og:image" content="https://pulsecart-store.io/social-preview.png" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="PulseCart - High Performance React Storefront" />
<meta name="twitter:description" content="Shop verified high-performance apparel." />
<meta name="twitter:image" content="https://pulsecart-store.io/social-preview.png" />`
    }
  ];

  // Calculate simulated score based on checked steps
  const totalGainFromCompleted = improvementSuggestions
    .filter((s) => completedSteps[s.id])
    .reduce((sum, s) => sum + s.potentialGain, 0);

  const simulatedScore = Math.min(98, currentScore + totalGainFromCompleted);
  const maxProjectedScore = 96;

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
      
      {/* Top Banner: Score Improvement Target */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Interactive Score Improvement Roadmap</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              How to Boost Your Score from{' '}
              <span className="text-rose-400 font-mono">{currentScore}</span> to{' '}
              <span className="text-emerald-400 font-mono">{maxProjectedScore}+</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              We identified 4 high-leverage bottlenecks. Apply the recommendations below to eliminate Core Web Vitals penalties and achieve a grade A score.
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

        {/* Quick Progression Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-300">Target Milestones:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
              LCP &lt; 2.5s (+22 pts)
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30">
              SSR Pre-render (+16 pts)
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-500/30">
              INP &lt; 200ms (+12 pts)
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
            <span>Prioritized Step-by-Step Score Boosters</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any booster to reveal exact code fixes, target file paths, and test instructions. Check boxes to simulate your new score.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500">
          Showing {improvementSuggestions.length} High-Impact Recommendations
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
                  {/* Interactive Checkbox */}
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
                      <span>Metric Delta: <strong className="text-rose-600">{step.currentMetric}</strong> &rarr; <strong className="text-emerald-600">{step.targetMetric}</strong></span>
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
                  {/* Why Score Suffers */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-1.5 text-rose-600">
                      <AlertTriangle className="w-4 h-4" /> Why Your Score Suffers:
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {step.whyScoreSuffers}
                    </p>
                  </div>

                  {/* Step-by-Step Instructions */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-1.5 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" /> Action Plan to Gain {step.scoreImpact}:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700 pl-4 font-sans list-disc">
                      {step.howToImprove.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Copy-Paste Code Fix */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                        <Code2 className="w-4 h-4 text-indigo-600" />
                        Ready-to-Copy Production Code Fix:
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

                  {/* Verification Note */}
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      <strong>Verification:</strong> Re-run audit after deployment to observe automated +{step.potentialGain} pt recovery.
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleStep(step.id)}
                      className="text-xs font-bold underline text-emerald-700 hover:text-emerald-900"
                    >
                      {isDone ? 'Mark as Not Applied' : 'Mark as Applied (+ ' + step.potentialGain + ' pts)'}
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
