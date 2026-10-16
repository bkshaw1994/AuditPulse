/**
 * AuditPulse v2 Demo Project State
 * Rich mock data representing a high-traffic production React e-commerce application ("PulseCart").
 * Pre-loaded with simulated traffic spikes, high LCP warnings, INP bottlenecks, and 24-hour time-series data.
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
      title: 'High LCP Bottleneck (4.42s > 4.0s Threshold)',
      description: 'The largest hero element (hero-desk-setup.webp) took 4.42s to paint due to missing preloading tags and client-side bundle competition.',
      actionableAdvice: 'Preload hero asset in HTML <head> with <link rel="preload" as="image" href="..." fetchpriority="high"> and defer non-critical CSS/JS.'
    },
    {
      severity: 'critical',
      category: 'performance',
      code: 'INP_EXCEEDED_500MS',
      title: 'Degraded Interaction to Next Paint (520ms)',
      description: 'Clicking the "Filter By Switch Type" dropdown froze the UI for 520ms because 1,200 product card items re-rendered synchronously.',
      actionableAdvice: 'Wrap product list filter state inside React 18 startTransition(() => setFilter(val)) and memoize child components with React.memo().'
    },
    {
      severity: 'warning',
      category: 'traffic',
      code: 'TRAFFIC_SPIKE_DETECTED',
      title: 'Simulated Traffic Surge: 8,450 req/min (Spike at 14:00)',
      description: 'Sudden traffic spike degraded TTFB from 140ms to 680ms, increasing p90 hydration delay across mobile Safari and Chrome clients.',
      actionableAdvice: 'Enable CDN stale-while-revalidate caching and configure rate limiting or autoscaling on origin nodes.'
    },
    {
      severity: 'warning',
      category: 'performance',
      code: 'CLS_LAYOUT_SHIFT',
      title: 'Cumulative Layout Shift Warning (0.18)',
      description: 'Promotional countdown banner inserted dynamically above the navigation without reserving fixed height container dimensions.',
      actionableAdvice: 'Set explicit CSS min-height: 48px or aspect-ratio on promotional banners before client JS hydrates.'
    },
    {
      severity: 'info',
      category: 'seo',
      code: 'GOOD_CANONICAL',
      title: 'Self-Referencing Canonical Tag Verified',
      description: 'Canonical URL matches destination domain correctly.'
    }
  ],
  status: 'warning'
};
