const PSI_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

/**
 * Normalize and validate an incoming public website URL.
 * Rejects non-HTTP(S) schemes and malformed URLs.
 */
function normalizeTargetUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    const err = new Error('A valid target website URL is required.');
    err.statusCode = 400;
    throw err;
  }

  let candidate = rawUrl.trim();
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  let parsed;
  try {
    parsed = new URL(candidate);
  } catch {
    const err = new Error('Invalid website URL format.');
    err.statusCode = 400;
    throw err;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    const err = new Error('Only HTTP and HTTPS URLs are supported.');
    err.statusCode = 400;
    throw err;
  }

  return parsed.toString();
}

function stripMarkdownLinks(text = '') {
  return String(text)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatSeconds(ms) {
  if (typeof ms !== 'number' || Number.isNaN(ms)) return 'N/A';
  return `${(ms / 1000).toFixed(1)} s`;
}

function formatMilliseconds(ms) {
  if (typeof ms !== 'number' || Number.isNaN(ms)) return 'N/A';
  return `${Math.round(ms)} ms`;
}

function formatCls(val) {
  if (typeof val !== 'number' || Number.isNaN(val)) return 'N/A';
  return val.toFixed(2);
}

function formatSavings(audit) {
  if (audit.displayValue) return audit.displayValue;
  const savingsMs = audit.details?.overallSavingsMs;
  if (typeof savingsMs === 'number' && savingsMs > 0) {
    return savingsMs >= 1000
      ? `Potential savings of ${(savingsMs / 1000).toFixed(1)}s`
      : `Potential savings of ${Math.round(savingsMs)}ms`;
  }
  const savingsBytes = audit.details?.overallSavingsBytes;
  if (typeof savingsBytes === 'number' && savingsBytes > 0) {
    return `Potential savings of ${Math.round(savingsBytes / 1024)} KiB`;
  }
  return 'Impacts mobile score and user experience';
}

function extractTopFailingAudits(auditsMap = {}, limit = 5) {
  const excludedModes = new Set(['notApplicable', 'informative', 'manual', 'error']);

  return Object.values(auditsMap)
    .filter((audit) => (
      audit &&
      typeof audit.score === 'number' &&
      audit.score < 0.9 &&
      !excludedModes.has(audit.scoreDisplayMode) &&
      audit.title
    ))
    .map((audit) => {
      const savingsMs = Number(audit.details?.overallSavingsMs || 0);
      const savingsBytes = Number(audit.details?.overallSavingsBytes || 0);
      const priority = (1 - audit.score) * 100 + Math.min(savingsMs / 50, 200) + Math.min(savingsBytes / 20000, 100);

      return {
        id: audit.id || audit.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: audit.title,
        description: stripMarkdownLinks(audit.description || ''),
        displayValue: audit.displayValue || '',
        savingsLabel: formatSavings(audit),
        score: Number(audit.score.toFixed(2)),
        _priority: priority
      };
    })
    .sort((a, b) => b._priority - a._priority)
    .slice(0, limit)
    .map(({ _priority, ...rest }) => rest);
}

/**
 * Call Google PageSpeed Insights API v5 (mobile) and extract scores, CWV, and top 5 failing audits.
 */
async function fetchPageSpeedInsights(targetUrl, apiKey = process.env.PAGESPEED_API_KEY, fetchFn = fetch) {
  const params = new URLSearchParams({
    url: targetUrl,
    strategy: 'mobile'
  });
  params.append('category', 'performance');
  params.append('category', 'seo');
  params.append('category', 'best-practices');
  if (apiKey) {
    params.set('key', apiKey);
  }

  const response = await fetchFn(`${PSI_ENDPOINT}?${params.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(45000)
  });

  if (!response.ok) {
    let detail = `PageSpeed Insights returned status ${response.status}`;
    try {
      const errBody = await response.json();
      if (errBody?.error?.message) {
        detail = errBody.error.message;
      }
    } catch {
      // Ignore JSON parse errors on upstream error response
    }
    const err = new Error(`PageSpeed scan failed: ${detail}`);
    err.statusCode = response.status >= 400 && response.status < 500 ? 422 : 502;
    throw err;
  }

  const payload = await response.json();
  const lighthouse = payload.lighthouseResult || {};
  const categories = lighthouse.categories || {};
  const audits = lighthouse.audits || {};
  const fieldMetrics = payload.loadingExperience?.metrics || {};

  const performanceScore = Math.round((categories.performance?.score ?? 0) * 100);
  const seoScore = Math.round((categories.seo?.score ?? 0) * 100);
  const bestPracticesScore = Math.round((categories['best-practices']?.score ?? 0) * 100);

  const lcpMs = audits['largest-contentful-paint']?.numericValue
    ?? fieldMetrics.LARGEST_CONTENTFUL_PAINT_MS?.percentile
    ?? null;

  const inpMs = fieldMetrics.INTERACTION_TO_NEXT_PAINT?.percentile
    ?? audits['interaction-to-next-paint']?.numericValue
    ?? audits['total-blocking-time']?.numericValue
    ?? audits['max-potential-fid']?.numericValue
    ?? null;

  const clsValue = audits['cumulative-layout-shift']?.numericValue
    ?? (typeof fieldMetrics.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile === 'number'
      ? fieldMetrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100
      : null);

  const fcpMs = audits['first-contentful-paint']?.numericValue
    ?? fieldMetrics.FIRST_CONTENTFUL_PAINT_MS?.percentile
    ?? null;

  return {
    metrics: {
      mobilePerformanceScore: performanceScore,
      performanceScore,
      seoScore,
      bestPracticesScore,
      lcp: formatSeconds(lcpMs),
      inp: formatMilliseconds(inpMs),
      cls: formatCls(clsValue),
      fcp: formatSeconds(fcpMs),
      lcpMs: lcpMs !== null ? Math.round(lcpMs) : null,
      inpMs: inpMs !== null ? Math.round(inpMs) : null,
      clsValue: clsValue !== null ? Number(clsValue.toFixed(4)) : null,
      fcpMs: fcpMs !== null ? Math.round(fcpMs) : null
    },
    failingAudits: extractTopFailingAudits(audits, 5)
  };
}

function extractMetaContent(html, attrName, attrValue) {
  const escapedVal = attrValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patternA = new RegExp(
    `<meta[^>]*\\b${attrName}=["']${escapedVal}["'][^>]*\\bcontent=["']([^"']*)["'][^>]*>`,
    'i'
  );
  const patternB = new RegExp(
    `<meta[^>]*\\bcontent=["']([^"']*)["'][^>]*\\b${attrName}=["']${escapedVal}["'][^>]*>`,
    'i'
  );
  const match = html.match(patternA) || html.match(patternB);
  return match ? match[1].trim() : '';
}

function stripTags(str = '') {
  return str.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function detectTechStack(html = '', headers = null) {
  const lowerHtml = html.toLowerCase();
  const poweredBy = headers?.get ? (headers.get('x-powered-by') || '').toLowerCase() : '';
  const serverHeader = headers?.get ? (headers.get('server') || '').toLowerCase() : '';

  if (
    lowerHtml.includes('/_next/static') ||
    lowerHtml.includes('__next_data__') ||
    poweredBy.includes('next.js')
  ) {
    return 'Next.js';
  }

  if (
    lowerHtml.includes('cdn.shopify.com') ||
    lowerHtml.includes('shopify.theme') ||
    lowerHtml.includes('shopify-section') ||
    serverHeader.includes('shopify')
  ) {
    return 'Shopify';
  }

  if (
    lowerHtml.includes('/wp-content/') ||
    lowerHtml.includes('/wp-includes/') ||
    /name=["']generator["'][^>]*wordpress/i.test(html)
  ) {
    return 'WordPress';
  }

  if (
    lowerHtml.includes('data-reactroot') ||
    lowerHtml.includes('react-dom') ||
    lowerHtml.includes('__react_devtools') ||
    /<div\s+id=["']root["']/i.test(html)
  ) {
    return 'React';
  }

  return 'Custom / HTML';
}

/**
 * Lightweight HTML fetch for core on-page SEO tags and technology stack fingerprints.
 */
async function inspectHtmlAndStack(targetUrl, fetchFn = fetch) {
  const emptyChecks = {
    fetched: false,
    statusCode: null,
    hasTitle: false,
    title: '',
    hasMetaDescription: false,
    metaDescription: '',
    hasH1: false,
    h1Text: '',
    hasOpenGraph: false,
    ogTags: { title: '', description: '', image: '' }
  };

  try {
    const response = await fetchFn(targetUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'AuditPulse-ExternalScanner/1.0 (+https://auditpulse-dashboard-theta.vercel.app)',
        Accept: 'text/html,application/xhtml+xml'
      },
      signal: AbortSignal.timeout(10000)
    });

    const html = await response.text();
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? stripTags(titleMatch[1]) : '';

    const metaDescription = extractMetaContent(html, 'name', 'description');
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h1Text = h1Match ? stripTags(h1Match[1]) : '';

    const ogTitle = extractMetaContent(html, 'property', 'og:title');
    const ogDescription = extractMetaContent(html, 'property', 'og:description');
    const ogImage = extractMetaContent(html, 'property', 'og:image');
    const hasOpenGraph = Boolean(ogTitle || ogDescription || ogImage);

    return {
      detectedStack: detectTechStack(html, response.headers),
      htmlChecks: {
        fetched: true,
        statusCode: response.status,
        hasTitle: Boolean(title),
        title,
        hasMetaDescription: Boolean(metaDescription),
        metaDescription,
        hasH1: Boolean(h1Text),
        h1Text,
        hasOpenGraph,
        ogTags: {
          title: ogTitle,
          description: ogDescription,
          image: ogImage
        }
      }
    };
  } catch (err) {
    console.warn(`[ExternalScanner] Lightweight HTML fetch failed for ${targetUrl}: ${err.message}`);
    return {
      detectedStack: 'Custom / HTML',
      htmlChecks: emptyChecks
    };
  }
}

function buildTopIssues(metrics, failingAudits, htmlChecks) {
  const issues = [];

  if (typeof metrics.lcpMs === 'number' && metrics.lcpMs > 2500) {
    issues.push(`Mobile Largest Contentful Paint is ${metrics.lcp} (exceeds 2.5s threshold)`);
  }
  if (typeof metrics.inpMs === 'number' && metrics.inpMs > 200) {
    issues.push(`Mobile interactivity delay (INP) is ${metrics.inp} (exceeds 200ms threshold)`);
  }
  if (typeof metrics.clsValue === 'number' && metrics.clsValue > 0.1) {
    issues.push(`Cumulative Layout Shift is ${metrics.cls} (exceeds 0.10 visual stability target)`);
  }

  if (htmlChecks.fetched) {
    if (!htmlChecks.hasTitle) issues.push('Missing <title> tag on homepage');
    if (!htmlChecks.hasMetaDescription) issues.push('Missing meta description on homepage');
    if (!htmlChecks.hasH1) issues.push('Missing primary <h1> heading on homepage');
    if (!htmlChecks.hasOpenGraph) issues.push('Missing Open Graph social preview tags');
  }

  for (const audit of failingAudits) {
    if (issues.length >= 6) break;
    const summary = audit.displayValue ? `${audit.title} (${audit.displayValue})` : audit.title;
    if (!issues.some((existing) => existing.toLowerCase() === summary.toLowerCase())) {
      issues.push(summary);
    }
  }

  return issues.slice(0, 6);
}

/**
 * Run a zero-install external audit combining PageSpeed Insights v5 and direct HTML inspection.
 */
async function runExternalAudit({ url, businessName = '', niche = '' }, deps = {}) {
  const normalizedUrl = normalizeTargetUrl(url);
  const resolvedBusinessName = typeof businessName === 'string' && businessName.trim()
    ? businessName.trim()
    : new URL(normalizedUrl).hostname;
  const fetchFn = deps.fetchFn || fetch;
  const psiApiKey = deps.psiApiKey !== undefined ? deps.psiApiKey : process.env.PAGESPEED_API_KEY;

  const [psiResult, htmlResult] = await Promise.all([
    fetchPageSpeedInsights(normalizedUrl, psiApiKey, fetchFn),
    inspectHtmlAndStack(normalizedUrl, fetchFn)
  ]);

  const topIssues = buildTopIssues(
    psiResult.metrics,
    psiResult.failingAudits,
    htmlResult.htmlChecks
  );

  return {
    url: normalizedUrl,
    businessName: resolvedBusinessName,
    niche: typeof niche === 'string' ? niche.trim() : '',
    detectedStack: htmlResult.detectedStack,
    metrics: psiResult.metrics,
    failingAudits: psiResult.failingAudits,
    htmlChecks: htmlResult.htmlChecks,
    topIssues,
    auditedAt: new Date().toISOString()
  };
}

module.exports = {
  normalizeTargetUrl,
  fetchPageSpeedInsights,
  inspectHtmlAndStack,
  detectTechStack,
  extractTopFailingAudits,
  buildTopIssues,
  runExternalAudit
};
