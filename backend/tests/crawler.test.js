const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const {
  validatePublicUrl,
  decodeHtmlEntities,
  extractMetaContent,
  extractTitle,
  extractCanonical,
  extractAllMetaTags,
  parseRawHtmlMeta,
  getEmptySsrMeta,
  auditSeoMeta,
  auditSocialMeta,
  auditPerformance,
  analyzeSeoAndPerformance
} = require('../services/crawler');

describe('Crawler Engine & SEO/Performance Evaluation Test Suite', () => {

  describe('1. SSRF Protection & URL Validation', () => {
    test('validatePublicUrl allows valid public HTTP and HTTPS URLs', () => {
      assert.doesNotThrow(() => validatePublicUrl('https://example.com'));
      assert.doesNotThrow(() => validatePublicUrl('https://react.dev/docs'));
      assert.doesNotThrow(() => validatePublicUrl('http://my-spa.io/catalog?page=2'));
    });

    test('validatePublicUrl throws for malformed URLs', () => {
      assert.throws(() => validatePublicUrl('not_a_valid_url'), /Invalid URL/);
      assert.throws(() => validatePublicUrl(''), /Invalid URL/);
    });

    test('validatePublicUrl blocks private, loopback, and cloud metadata IPs', () => {
      assert.throws(() => validatePublicUrl('http://localhost:3000'), /restricted for security/);
      assert.throws(() => validatePublicUrl('http://127.0.0.1:8080'), /restricted for security/);
      assert.throws(() => validatePublicUrl('http://169.254.169.254/latest/meta-data/'), /restricted for security/);
      assert.throws(() => validatePublicUrl('http://10.0.1.5'), /forbidden/);
      assert.throws(() => validatePublicUrl('http://192.168.1.1'), /forbidden/);
      assert.throws(() => validatePublicUrl('http://172.16.0.1'), /forbidden/);
      assert.throws(() => validatePublicUrl('ftp://example.com'), /Unsupported protocol/);
    });
  });

  describe('2. HTML Entity Decoding & Tag Extraction', () => {
    test('decodeHtmlEntities unescapes HTML special entities and strips HTML tags', () => {
      assert.strictEqual(decodeHtmlEntities('Fast &amp; Furious'), 'Fast & Furious');
      assert.strictEqual(decodeHtmlEntities('&quot;quoted&quot; &apos;test&#39;'), '"quoted" \'test\'');
      assert.strictEqual(decodeHtmlEntities('<b>Bold Text</b>'), 'Bold Text');
      assert.strictEqual(decodeHtmlEntities('&#39;hello&#39;'), "'hello'");
      assert.strictEqual(decodeHtmlEntities(''), '');
    });

    test('extractTitle extracts and trims page title from HTML', () => {
      const html = '<html><head><title>  AuditPulse — React Observability  </title></head></html>';
      assert.strictEqual(extractTitle(html), 'AuditPulse — React Observability');
      assert.strictEqual(extractTitle('<html><head></head></html>'), '');
    });

    test('extractMetaContent finds content attribute regardless of attribute order', () => {
      const html1 = '<meta name="description" content="Next.js SEO guide">';
      const html2 = '<meta content="Vite SPA guide" name="description">';
      assert.strictEqual(extractMetaContent(html1, 'description'), 'Next.js SEO guide');
      assert.strictEqual(extractMetaContent(html2, 'description'), 'Vite SPA guide');
      assert.strictEqual(extractMetaContent('<div>No meta</div>', 'description'), '');
    });

    test('extractCanonical extracts href from canonical link tag', () => {
      const html = '<link rel="canonical" href="https://react.dev/learn" />';
      assert.strictEqual(extractCanonical(html), 'https://react.dev/learn');
      assert.strictEqual(extractCanonical('<link rel="stylesheet" href="/style.css" />'), '');
    });

    test('extractAllMetaTags collects OpenGraph and Twitter tags into dictionary', () => {
      const html = `
        <meta property="og:title" content="React Home" />
        <meta property="og:description" content="UI Library" />
        <meta property="og:image" content="https://react.dev/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
      `;
      const og = extractAllMetaTags(html, 'og:');
      assert.strictEqual(og['og:title'], 'React Home');
      assert.strictEqual(og['og:description'], 'UI Library');
      assert.strictEqual(og['og:image'], 'https://react.dev/og.png');

      const tw = extractAllMetaTags(html, 'twitter:');
      assert.strictEqual(tw['twitter:card'], 'summary_large_image');
    });

    test('getEmptySsrMeta returns compliant baseline object', () => {
      const empty = getEmptySsrMeta();
      assert.strictEqual(empty.hasRawTitle, false);
      assert.strictEqual(empty.hasRawDescription, false);
      assert.strictEqual(empty.rawHtmlLength, 0);
    });

    test('parseRawHtmlMeta parses complex server HTML', () => {
      const rawHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Server Hydrated Page</title>
            <meta name="description" content="Detailed server description" />
            <link rel="canonical" href="https://mysite.com/server" />
            <meta property="og:title" content="OG Server Title" />
            <meta property="og:image" content="https://mysite.com/og.jpg" />
          </head>
          <body>
            <h1>Main Server Heading</h1>
          </body>
        </html>
      `;
      const meta = parseRawHtmlMeta(rawHtml);
      assert.strictEqual(meta.rawTitle, 'Server Hydrated Page');
      assert.strictEqual(meta.hasRawTitle, true);
      assert.strictEqual(meta.rawDescription, 'Detailed server description');
      assert.strictEqual(meta.rawCanonical, 'https://mysite.com/server');
      assert.strictEqual(meta.rawH1, 'Main Server Heading');
      assert.ok(meta.rawHtmlLength > 50);
    });
  });

  describe('3. SEO Meta Evaluation Heuristics', () => {
    test('auditSeoMeta rewards optimal title, description, canonical and headings', () => {
      const seoMeta = {
        title: 'Modern React SPA Performance and SEO Platform',
        titleLength: 46,
        description: 'AuditPulse provides real-time Core Web Vitals telemetry, SSR hydration audits, and continuous main-thread monitoring for modern React SPAs.',
        descriptionLength: 140,
        canonical: 'https://mysite.com',
        robots: 'index, follow',
        viewport: 'width=device-width, initial-scale=1',
        headings: { h1: ['Welcome to AuditPulse'], h2Count: 4, h3Count: 8 },
        imagesTotal: 5,
        imagesMissingAlt: 0
      };
      const ssrMeta = { hasRawTitle: true, hasRawDescription: true, hasRawH1: true };

      const result = auditSeoMeta(seoMeta, ssrMeta, 'https://mysite.com');
      assert.ok(result.points >= 90);
      assert.ok(Array.isArray(result.issues));
    });

    test('auditSeoMeta penalizes missing title, description, and alt tags', () => {
      const badSeoMeta = {
        title: '', // Missing title
        titleLength: 0,
        description: '', // Missing description
        descriptionLength: 0,
        canonical: '', // Missing canonical
        headings: { h1: [], h2Count: 0, h3Count: 0 }, // Missing H1
        imagesTotal: 10,
        imagesMissingAlt: 5 // Missing alt
      };

      const result = auditSeoMeta(badSeoMeta, {}, 'https://mysite.com');
      assert.ok(result.points < 50);
      const codes = result.issues.map(i => i.code);
      assert.ok(codes.includes('MISSING_TITLE'));
      assert.ok(codes.includes('MISSING_DESCRIPTION'));
      assert.ok(codes.includes('MISSING_CANONICAL'));
      assert.ok(codes.includes('MISSING_H1'));
      assert.ok(codes.includes('IMAGES_MISSING_ALT'));
    });

    test('auditSeoMeta flags suboptimal lengths (> 60 char title, > 160 char description)', () => {
      const longMeta = {
        title: 'This is an excessively long page title designed specifically to exceed sixty total characters in length',
        titleLength: 104,
        description: 'This is an extremely verbose and needlessly detailed meta description designed to test the upper boundary length validation threshold which penalizes descriptions exceeding 160 total characters.',
        descriptionLength: 195,
        canonical: 'https://site.com',
        headings: { h1: ['Title'] },
        imagesTotal: 1,
        imagesMissingAlt: 0
      };

      const result = auditSeoMeta(longMeta, { hasRawTitle: true }, 'https://site.com');
      const codes = result.issues.map(i => i.code);
      assert.ok(codes.includes('SUBOPTIMAL_TITLE_LENGTH'));
      assert.ok(codes.includes('SUBOPTIMAL_DESCRIPTION_LENGTH'));
    });

    test('auditSeoMeta flags SSR hydration missing raw title', () => {
      const clientMeta = {
        title: 'Client Rendered Title with Sufficient Characters',
        titleLength: 48,
        description: 'Valid client description for this page exceeding seventy characters for quality check.',
        descriptionLength: 87,
        canonical: 'https://site.com',
        headings: { h1: ['Heading'] }
      };
      const ssrMeta = {
        hasRawTitle: false, // Server didn't pre-render title!
        hasRawDescription: true
      };

      const result = auditSeoMeta(clientMeta, ssrMeta, 'https://site.com');
      const codes = result.issues.map(i => i.code);
      assert.ok(codes.includes('SSR_MISSING_RAW_TITLE'));
    });
  });

  describe('4. Social OpenGraph Evaluation Heuristics', () => {
    test('auditSocialMeta rewards complete OpenGraph metadata with SSR support', () => {
      const ogTags = {
        'og:title': 'AuditPulse Performance Platform',
        'og:description': 'Real-user React monitoring',
        'og:image': 'https://auditpulse.io/card.png',
        'og:url': 'https://auditpulse.io'
      };
      const ssrMeta = { hasRawOg: true };
      const result = auditSocialMeta(ogTags, ssrMeta);
      assert.strictEqual(result.points, 100);
      assert.strictEqual(result.issues.length, 0);
    });

    test('auditSocialMeta penalizes missing og:image and og:url', () => {
      const incompleteOg = {
        'og:title': 'AuditPulse',
        'og:description': 'Monitoring'
      };
      const result = auditSocialMeta(incompleteOg, { hasRawOg: true });
      assert.ok(result.points < 100);
      const codes = result.issues.map(i => i.code);
      assert.ok(codes.includes('INCOMPLETE_OPEN_GRAPH'));
    });

    test('auditSocialMeta flags SSR social bot failure when OpenGraph tags exist only on client', () => {
      const clientOg = {
        'og:title': 'AuditPulse Live',
        'og:description': 'Platform monitoring',
        'og:image': 'https://auditpulse.io/cover.png'
      };
      const result = auditSocialMeta(clientOg, { hasRawOg: false });
      const codes = result.issues.map(i => i.code);
      assert.ok(codes.includes('SSR_SOCIAL_BOT_FAILURE'));
    });
  });

  describe('5. Core Web Vitals & Performance Scoring Heuristics', () => {
    test('auditPerformance assigns high score for optimal Core Web Vitals', () => {
      const goodPerf = {
        lcp: 1400, // < 2500ms
        tti: 1800, // < 3800ms
        cls: 0.02, // < 0.1
        ttfb: 180,  // < 800ms
        inp: 45
      };
      const result = auditPerformance(goodPerf);
      assert.ok(result.points >= 90);
      assert.strictEqual(result.issues.length, 0);
    });

    test('auditPerformance penalizes poor LCP, and sluggish TTFB', () => {
      const poorPerf = {
        lcp: 4800, // > 4000ms critical
        ttfb: 2100 // > 1800ms critical
      };
      const result = auditPerformance(poorPerf);
      assert.ok(result.points <= 60);
      const codes = result.issues.map(i => i.code);
      assert.ok(codes.includes('POOR_LCP'));
      assert.ok(codes.includes('SLOW_TTFB'));
    });

    test('auditPerformance handles needs-improvement boundaries', () => {
      const moderatePerf = {
        lcp: 3100, // Between 2500 and 4000
        ttfb: 950
      };
      const result = auditPerformance(moderatePerf);
      assert.ok(result.points > 50 && result.points < 90);
      const codes = result.issues.map(i => i.code);
      assert.ok(codes.includes('NEEDS_IMPROVEMENT_LCP'));
    });
  });

  describe('6. Holistic Score & Issue Aggregator', () => {
    test('analyzeSeoAndPerformance computes weighted overall score and attaches fix blueprints', () => {
      const seo = {
        title: 'AuditPulse - Continuous React Observability',
        titleLength: 42,
        description: 'Comprehensive Core Web Vitals monitoring for single page applications.',
        descriptionLength: 70,
        canonical: 'https://auditpulse.io',
        headings: { h1: ['AuditPulse'] },
        ogTags: {
          'og:title': 'AuditPulse',
          'og:description': 'Observability',
          'og:image': 'https://auditpulse.io/card.png'
        }
      };
      const ssr = { hasRawTitle: true, hasRawDescription: true, hasRawOg: true };
      const perf = { lcp: 1800, tti: 2100, cls: 0.01, ttfb: 220 };
      const result = analyzeSeoAndPerformance(seo, ssr, 'SSR/SSG', perf, 'https://auditpulse.io');

      assert.ok(result.scores.overall >= 80);
      assert.ok(result.scores.seo >= 80);
      assert.ok(result.scores.performance >= 80);
      assert.ok(typeof result.scores.social === 'number');

      // Verify that every issue has actionable fix blueprints
      result.issues.forEach(issue => {
        assert.ok(issue.whatToFix);
        assert.ok(issue.whereToFix);
        assert.ok(issue.howToFix);
        assert.ok(issue.estimatedImpact);
      });
    });
  });

  describe('7. Live Ephemeral Server & End-to-End Crawler Execution', () => {
    const http = require('http');
    const { inspectRawSsrHtml, auditUrlWithHttp, auditUrl } = require('../services/crawler');
    let server;
    let testPort;
    let testUrl;

    test('setup ephemeral mock server', async () => {
      process.env.ALLOW_TEST_LOOPBACK = 'true';
      server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PulseCart Store - Premier E-Commerce Experience</title>
  <meta name="description" content="Shop the finest curated goods with blazing fast delivery across India and worldwide destinations.">
  <meta name="keywords" content="ecommerce, shop, online store">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="canonical" href="http://127.0.0.1:${testPort}/">
  <meta property="og:title" content="PulseCart Store">
  <meta property="og:description" content="Shop the finest curated goods">
  <meta property="og:image" content="http://127.0.0.1:${testPort}/og.png">
  <meta property="og:url" content="http://127.0.0.1:${testPort}/">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="PulseCart Store">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"PulseCart"}</script>
</head>
<body>
  <h1>Welcome to PulseCart Store</h1>
  <h2>Featured Categories</h2>
  <h3>Trending Products</h3>
  <img src="/logo.png" alt="PulseCart Logo" />
  <img src="/hero.png" alt="Hero banner" />
</body>
</html>`);
      });

      await new Promise(resolve => {
        server.listen(0, '127.0.0.1', () => {
          testPort = server.address().port;
          testUrl = `http://127.0.0.1:${testPort}`;
          resolve();
        });
      });

      assert.ok(testPort > 0);
    });

    test('inspectRawSsrHtml parses real server HTTP response', async () => {
      const ssrMeta = await inspectRawSsrHtml(testUrl);
      assert.strictEqual(ssrMeta.hasRawTitle, true);
      assert.strictEqual(ssrMeta.hasRawDescription, true);
      assert.strictEqual(ssrMeta.hasRawOg, true);
      assert.strictEqual(ssrMeta.rawTitle, 'PulseCart Store - Premier E-Commerce Experience');
      assert.strictEqual(ssrMeta.rawH1, 'Welcome to PulseCart Store');
    });

    test('auditUrlWithHttp executes serverless fallback engine with real HTML', async () => {
      const result = await auditUrlWithHttp(testUrl, new Error('Simulated browser crash'));
      assert.strictEqual(result.status, 'success');
      assert.strictEqual(result.renderingType, 'SSR/SSG');
      assert.strictEqual(result.seoMeta.title, 'PulseCart Store - Premier E-Commerce Experience');
      assert.strictEqual(result.seoMeta.structuredData.length, 1);
      assert.ok(result.scores.overall >= 80);
      assert.ok(result.issues.some(i => i.code === 'SERVERLESS_HTTP_MODE'));
    });

    test('auditUrlWithHttp handles network connection failures gracefully', async () => {
      const result = await auditUrlWithHttp('http://non-existent-local-test-xyz.invalid:1234');
      assert.strictEqual(result.status, 'error');
      assert.strictEqual(result.scores.overall, 0);
      assert.ok(result.issues.some(i => i.code === 'CRAWL_FAILED'));
    });

    test('auditUrl executes full Puppeteer crawler engine with real browser lifecycle', { timeout: 35000 }, async () => {
      const result = await auditUrl(testUrl);
      assert.strictEqual(result.status, 'success');
      assert.strictEqual(result.renderingType, 'SSR/SSG');
      assert.strictEqual(result.seoMeta.title, 'PulseCart Store - Premier E-Commerce Experience');
      assert.strictEqual(result.seoMeta.imagesTotal, 2);
      assert.strictEqual(result.seoMeta.imagesMissingAlt, 0);
      assert.ok(result.scores.overall >= 80);
      assert.ok(result.performanceMetrics.loadTime >= 0);
    });

    test('teardown ephemeral mock server', async () => {
      if (server) {
        await new Promise(resolve => server.close(resolve));
      }
      delete process.env.ALLOW_TEST_LOOPBACK;
    });
  });
});
