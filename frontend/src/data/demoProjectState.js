/**
 * AuditPulse v2 Demo Project State
 * Rich mock data representing a high-traffic production React e-commerce application ("PulseCart").
 * Pre-loaded with simulated traffic spikes, high LCP warnings, INP bottlenecks, 24-hour time-series data,
 * and comprehensive diagnostic fix recommendations (what to fix, where to fix, how to fix, code snippets).
 */

// Generate 24 hourly time-series data points for the past 24 hours
export const generate24HourTrendData = () => {
  const points = [];
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now - i * oneHour);
    const hour = timestamp.getHours();
    const timeLabel = `${String(hour).padStart(2, '0')}:00`;

    // Simulate normal baseline vs high traffic spike around 14:00 - 16:00
    const isSpike = hour >= 13 && hour <= 16;
    const isPeak = hour === 14 || hour === 15;

    // Traffic requests/min
    const requests = isPeak ? 8450 : isSpike ? 5200 : Math.floor(650 + Math.random() * 300);

    // LCP in seconds (Google Good <= 2.5s, Poor > 4.0s)
    const lcpSec = isPeak ? 4.42 : isSpike ? 3.15 : parseFloat((1.65 + Math.random() * 0.4).toFixed(2));

    // INP in ms (Google Good <= 200ms, Poor > 500ms)
    const inpMs = isPeak ? 520 : isSpike ? 340 : Math.floor(85 + Math.random() * 45);

    // CLS (Google Good <= 0.1, Poor > 0.25)
    const cls = isPeak ? 0.18 : parseFloat((0.02 + Math.random() * 0.03).toFixed(3));

    // TTFB in ms
    const ttfbMs = isPeak ? 680 : isSpike ? 420 : Math.floor(140 + Math.random() * 40);

    // Overall Score
    const overallScore = isPeak ? 68 : isSpike ? 78 : Math.floor(92 + Math.random() * 4);

    points.push({
      time: timeLabel,
      timestamp: timestamp.toISOString(),
      hour,
      isSpike,
      requests,
      lcpSec,
      inpMs,
      cls,
      ttfbMs,
      overallScore,
      p75Lcp: parseFloat((lcpSec * 0.95).toFixed(2)),
      p90Lcp: parseFloat((lcpSec * 1.15).toFixed(2)),
      p75Inp: Math.floor(inpMs * 0.92),
      p90Inp: Math.floor(inpMs * 1.2)
    });
  }

  return points;
};

export const DEMO_PROJECT_STATE = {
  _id: 'demo_pulsecart_v2_active',
  isDemoMode: true,
  projectName: 'PulseCart Storefront (Production)',
  url: 'https://pulsecart-store.io',
  domain: 'pulsecart-store.io',
  environment: 'production',
  timestamp: new Date().toISOString(),
  activeVisitors: 3420,
  scores: {
    overall: 68, // Degraded due to LCP & INP
    seo: 92,
    performance: 64,
    social: 95
  },
  renderingType: 'Single Page Application (React 18 Concurrent Mode + Client Hydration)',
  performanceMetrics: {
    ttfb: 380,
    fcp: 1450,
    lcp: 4420, // > 4.0s: POOR - triggers automated diagnostic advice!
    inp: 520,  // > 500ms: POOR - triggers interaction diagnostic advice!
    cls: 0.18, // 0.1-0.25: NEEDS IMPROVEMENT
    tti: 4180, // Heavy hydration delay
    domContentLoaded: 1120,
    loadTime: 4620,
    jsHeapSizeKB: 38400,
    totalRequests: 64,
    totalPageSizeKB: 2480
  },
  seoMeta: {
    title: 'PulseCart - Next-Generation Developer Tech & Ergonomic Workstations',
    titleLength: 64,
    description: 'High-performance ergonomic keyboards, mechanical switches, 4K monitors, and developer workstation hardware shipped globally in 24 hours.',
    descriptionLength: 147,
    keywords: 'mechanical keyboards, developer desks, react monitors, developer ergonomics',
    canonical: 'https://pulsecart-store.io',
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0',
    charset: 'UTF-8',
    ogTags: {
      'og:type': 'website',
      'og:title': 'PulseCart - Next-Generation Developer Tech & Ergonomic Workstations',
      'og:description': 'High-performance ergonomic gear shipped globally.',
      'og:image': 'https://pulsecart-store.io/og-banner.png',
      'og:url': 'https://pulsecart-store.io'
    },
    twitterTags: {
      'twitter:card': 'summary_large_image',
      'twitter:title': 'PulseCart Storefront',
      'twitter:site': '@pulsecart_io'
    },
    headings: {
      h1: ['Engineered for Peak Developer Flow & Ergonomics'],
      h2Count: 8,
      h3Count: 16
    },
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Store',
        'name': 'PulseCart',
        'url': 'https://pulsecart-store.io',
        'priceRange': '$$$'
      }
    ],
    imagesTotal: 34,
    imagesMissingAlt: 2
  },
  issues: [
    {
      severity: 'critical',
      category: 'performance',
      code: 'LCP_EXCEEDED_4S',
      title: 'High Largest Contentful Paint (4.42s > 2.5s Target)',
      whatToFix: 'The largest visual element on the page (hero-desk-setup.webp) takes 4.42 seconds to paint. The image is hidden inside a client-side component that only mounts after an asynchronous user profile API call resolves, forcing the browser to delay discovery by nearly 3 seconds.',
      whereToFix: 'frontend/index.html (<head>) & frontend/src/components/HeroSection.jsx',
      howToFix: '1. Add a high-priority preload link in index.html <head> so the browser downloads the hero image in parallel with JavaScript.\n2. Convert the image format to modern WebP or AVIF with responsive srcset sizes.\n3. Add fetchpriority="high" and loading="eager" directly to the <img> element.\n4. Avoid hiding the hero container behind unhydrated client state.',
      solution: 'Preload the hero image in document <head> using <link rel="preload" as="image" fetchpriority="high"> and render the hero immediately in initial HTML markup.',
      fixSnippet: `<!-- In your public/index.html or Next.js app/layout.tsx <head> -->
<link rel="preconnect" href="https://cdn.pulsecart-store.io" crossorigin />
<link 
  rel="preload" 
  as="image" 
  href="https://cdn.pulsecart-store.io/hero-desk-setup.avif" 
  type="image/avif" 
  fetchpriority="high" 
/>

<!-- In your Hero Component -->
<img
  src="https://cdn.pulsecart-store.io/hero-desk-setup.avif"
  alt="Ergonomic Workstation Setup"
  width="1280"
  height="720"
  loading="eager"
  fetchpriority="high"
  decoding="async"
  className="w-full h-auto object-cover rounded-2xl shadow-xl"
/>`,
      estimatedImpact: '⚡ Cuts LCP by ~2.74s (Recovers from 4.42s to 1.68s -> PASSING Google CWV)',
      status: 'actionable'
    },
    {
      severity: 'critical',
      category: 'performance',
      code: 'INP_EXCEEDED_500MS',
      title: 'Interaction to Next Paint Degraded (520ms > 200ms Target)',
      whatToFix: 'Clicking the "Filter by Switch Type" dropdown freezes the main thread for 520ms. The event handler triggers a synchronous JavaScript loop sorting and filtering 1,200 product card items, blocking user input feedback and dropping frames below 15 FPS.',
      whereToFix: 'frontend/src/components/ProductCatalog/FilterDrawer.jsx (handleFilterChange)',
      howToFix: '1. Wrap the heavy list filter state inside React 18 startTransition() to let user clicks and keystrokes execute immediately.\n2. Memoize individual product cards using React.memo() to avoid re-rendering off-screen items.\n3. Virtualize the product grid with @tanstack/react-virtual or react-window for large catalog lists.\n4. Use scheduler.yield() or requestIdleCallback() for heavy multi-criteria sorting operations.',
      solution: 'Wrap non-urgent catalog state changes in startTransition() and virtualize the product item list.',
      fixSnippet: `import React, { useState, useTransition, useMemo } from 'react';

export function FilterDrawer({ onFilterSelect, catalogItems }) {
  const [isPending, startTransition] = useTransition();
  const [selectedTag, setSelectedTag] = useState('all');

  const handleFilterClick = (tag) => {
    // 1. Update immediate UI button selection state synchronously
    setSelectedTag(tag);

    // 2. Defer heavy list computation and DOM re-renders without freezing main thread
    startTransition(() => {
      onFilterSelect(tag);
    });
  };

  return (
    <div className="flex gap-2">
      {['All', 'Linear', 'Tactile', 'Clicky'].map((type) => (
        <button
          key={type}
          onClick={() => handleFilterClick(type)}
          className={\`px-3 py-1.5 rounded-lg \${selectedTag === type ? 'bg-indigo-600 text-white' : 'bg-slate-100'}\`}
        >
          {type} {isPending && <span className="animate-spin ml-1 text-xs">...</span>}
        </button>
      ))}
    </div>
  );
}`,
      estimatedImpact: '⚡ Reduces INP from 520ms to 45ms (Passes Google Good threshold <= 200ms)',
      status: 'actionable'
    },
    {
      severity: 'warning',
      category: 'traffic',
      code: 'TRAFFIC_SPIKE_DETECTED',
      title: 'Simulated Traffic Surge: 8,450 req/min (Spike at 14:00 GMT)',
      whatToFix: 'A sudden 10x traffic spike degraded Time to First Byte (TTFB) from 140ms to 680ms, increasing p90 hydration delay across mobile Safari and Chrome clients due to un-cached database queries on the catalog API.',
      whereToFix: 'backend/server.js & CDN Edge Cache Configuration (Cloudflare / Vercel)',
      howToFix: '1. Enable stale-while-revalidate caching headers on public catalog endpoints.\n2. Configure an in-memory Redis or NodeCache layer for repeated product queries.\n3. Enable CDN Edge caching to serve 95%+ of landing requests from local edge PoPs without hitting origin servers.',
      solution: 'Deploy HTTP Cache-Control stale-while-revalidate headers and CDN edge caching rules.',
      fixSnippet: `// Express / Fastify / Node API route handler
app.get('/api/catalog', (req, res) => {
  // Edge CDN caches for 5 minutes, serves stale for up to 1 hour while revalidating
  res.setHeader(
    'Cache-Control', 
    'public, max-age=300, s-maxage=300, stale-while-revalidate=3600'
  );
  
  // Return catalog JSON
  res.json({ products: cachedCatalogData });
});`,
      estimatedImpact: '⚡ Stabilizes TTFB under 160ms even during 10,000+ req/min traffic surges',
      status: 'actionable'
    },
    {
      severity: 'warning',
      category: 'performance',
      code: 'CLS_LAYOUT_SHIFT',
      title: 'Cumulative Layout Shift Warning (0.18 > 0.10 Target)',
      whatToFix: 'A promotional announcement countdown banner ("Flash Sale: 20% off Keycaps") was inserted dynamically above the top navigation 1.4 seconds after page load without reserving container height, abruptly pushing down all header elements by 48px.',
      whereToFix: 'frontend/src/index.css & frontend/src/components/PromoBanner.jsx',
      howToFix: '1. Set an explicit min-height: 48px or CSS contain: layout size on the banner parent container.\n2. Use CSS aspect-ratio on all product thumbnail image wrappers.\n3. Add size-adjust and font-display: swap to custom Google Web Fonts to prevent FOUT layout shift.',
      solution: 'Reserve layout geometry before client JavaScript mounts using CSS min-height or aspect-ratio.',
      fixSnippet: `/* CSS Fix in your global stylesheet */
.promo-banner-wrapper {
  min-height: 48px;
  contain: layout-size;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease-in-out;
}

/* Ensure images always preserve 16:9 geometry before download completes */
.product-card-image-box {
  aspect-ratio: 16 / 9;
  width: 100%;
  background-color: #f1f5f9; /* Skeleton placeholder */
}`,
      estimatedImpact: '⚡ Lowers CLS from 0.18 to 0.005 (Recovers to Good threshold <= 0.10)',
      status: 'actionable'
    },
    {
      severity: 'warning',
      category: 'seo',
      code: 'IMAGES_MISSING_ALT',
      title: '2 Catalog Product Images Missing Descriptive Alt Attributes',
      whatToFix: 'Found 2 <img> elements with empty or missing alt attributes. This negatively impacts accessibility score and prevents Google Images from indexing your product photography.',
      whereToFix: 'frontend/src/components/ProductCard.jsx',
      howToFix: '1. Audit all <img> tags to verify alt attributes contain meaningful descriptions.\n2. For purely decorative elements, explicitly provide alt="" and aria-hidden="true".',
      solution: 'Add informative alt attributes reflecting product model and colorway.',
      fixSnippet: `<img
  src={product.thumbnailUrl}
  alt={\`\${product.name} Mechanical Keyboard with \${product.switchType} switches\`}
  loading="lazy"
  width="320"
  height="180"
/>`,
      estimatedImpact: '⚡ +4 SEO & Accessibility Score on Google Lighthouse',
      status: 'actionable'
    },
    {
      severity: 'info',
      category: 'seo',
      code: 'GOOD_CANONICAL',
      title: 'Self-Referencing Canonical Tag Verified',
      whatToFix: 'No fix needed. The canonical URL matches destination domain correctly.',
      whereToFix: 'frontend/index.html',
      howToFix: 'Keep existing <link rel="canonical" href="https://pulsecart-store.io" /> verified on deploy.',
      solution: 'Verified: Self-referencing canonical tag prevents duplicate content splitting.',
      fixSnippet: `<link rel="canonical" href="https://pulsecart-store.io" />`,
      estimatedImpact: '✓ Verified Standard',
      status: 'passed'
    }
  ],
  status: 'warning'
};
