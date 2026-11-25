const { test, describe, before, after, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { app } = require('../server');
const {
  normalizeTargetUrl,
  detectTechStack,
  extractTopFailingAudits,
  runExternalAudit
} = require('../services/externalScanner');
const { ExternalReportRepository, generateReportId } = require('../models/ExternalReport');

const FALLBACK_REPORTS_FILE = path.join(__dirname, '../external_reports_fallback.json');

let testServer;
let baseUrl;
let originalFetch;
let originalAuditPulseKey;
let originalApiKey;
let originalPsiKey;
let originalBaseUrl;

before(async () => {
  originalFetch = global.fetch;
  originalAuditPulseKey = process.env.AUDIT_PULSE_API_KEY;
  originalApiKey = process.env.EXTERNAL_AUDIT_API_KEY;
  originalPsiKey = process.env.PAGESPEED_API_KEY;
  originalBaseUrl = process.env.PUBLIC_REPORT_BASE_URL;

  await new Promise((resolve) => {
    testServer = http.createServer(app);
    testServer.listen(0, '127.0.0.1', () => {
      const { port } = testServer.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

afterEach(() => {
  global.fetch = originalFetch;
  if (originalAuditPulseKey === undefined) delete process.env.AUDIT_PULSE_API_KEY;
  else process.env.AUDIT_PULSE_API_KEY = originalAuditPulseKey;

  if (originalApiKey === undefined) delete process.env.EXTERNAL_AUDIT_API_KEY;
  else process.env.EXTERNAL_AUDIT_API_KEY = originalApiKey;

  if (originalPsiKey === undefined) delete process.env.PAGESPEED_API_KEY;
  else process.env.PAGESPEED_API_KEY = originalPsiKey;

  if (originalBaseUrl === undefined) delete process.env.PUBLIC_REPORT_BASE_URL;
  else process.env.PUBLIC_REPORT_BASE_URL = originalBaseUrl;
});

after(async () => {
  await new Promise((resolve) => {
    testServer.close(resolve);
  });
});

describe('External Business Scanner & Shareable Client Reports', () => {
  test('generateReportId produces 10-char URL-safe IDs', () => {
    const id = generateReportId(10);
    assert.strictEqual(id.length, 10);
    assert.match(id, /^[0-9A-Za-z]{10}$/);
  });

  test('normalizeTargetUrl adds https:// and rejects invalid protocols', () => {
    assert.strictEqual(normalizeTargetUrl('example.com'), 'https://example.com/');
    assert.throws(() => normalizeTargetUrl('ftp://example.com'), /Only HTTP and HTTPS/);
    assert.throws(() => normalizeTargetUrl(''), /valid target website URL/);
  });

  test('detectTechStack identifies Next.js, WordPress, Shopify, and React', () => {
    assert.strictEqual(detectTechStack('<script src="/_next/static/chunk.js"></script>'), 'Next.js');
    assert.strictEqual(detectTechStack('<link rel="stylesheet" href="/wp-content/themes/a.css">'), 'WordPress');
    assert.strictEqual(detectTechStack('<script src="https://cdn.shopify.com/s/files/1/theme.js"></script>'), 'Shopify');
    assert.strictEqual(detectTechStack('<div id="root"></div><script src="react-dom.js"></script>'), 'React');
    assert.strictEqual(detectTechStack('<html><body><h1>Hello</h1></body></html>'), 'Custom / HTML');
  });

  test('extractTopFailingAudits returns at most 5 audits with score < 0.9 sorted by impact', () => {
    const audits = {
      a: { id: 'a', title: 'Passing audit', score: 0.95, scoreDisplayMode: 'numeric' },
      b: { id: 'b', title: 'Render blocking', score: 0.2, scoreDisplayMode: 'numeric', details: { overallSavingsMs: 1400 } },
      c: { id: 'c', title: 'Unused JS', score: 0.4, scoreDisplayMode: 'numeric', details: { overallSavingsMs: 800 } },
      d: { id: 'd', title: 'Images', score: 0.5, scoreDisplayMode: 'numeric', displayValue: 'Potential savings of 250 KiB' },
      e: { id: 'e', title: 'Text compression', score: 0.6, scoreDisplayMode: 'numeric' },
      f: { id: 'f', title: 'Cache policy', score: 0.7, scoreDisplayMode: 'numeric' },
      g: { id: 'g', title: 'Font display', score: 0.85, scoreDisplayMode: 'numeric' },
      h: { id: 'h', title: 'Informative only', score: 0, scoreDisplayMode: 'informative' }
    };

    const top5 = extractTopFailingAudits(audits, 5);
    assert.strictEqual(top5.length, 5);
    assert.strictEqual(top5[0].id, 'b');
    assert.strictEqual(top5[0].savingsLabel, 'Potential savings of 1.4s');
    assert.ok(!top5.some((item) => item.id === 'a' || item.id === 'h'));
  });

  test('runExternalAudit combines PageSpeed v5 metrics with HTML SEO & stack checks', async () => {
    const mockPsiPayload = {
      lighthouseResult: {
        categories: {
          performance: { score: 0.42 },
          seo: { score: 0.71 },
          'best-practices': { score: 0.83 }
        },
        audits: {
          'largest-contentful-paint': { id: 'largest-contentful-paint', title: 'Largest Contentful Paint', numericValue: 4800, score: 0.25, scoreDisplayMode: 'numeric', displayValue: '4.8 s' },
          'interaction-to-next-paint': { id: 'interaction-to-next-paint', title: 'Interaction to Next Paint', numericValue: 340, score: 0.5, scoreDisplayMode: 'numeric', displayValue: '340 ms' },
          'cumulative-layout-shift': { id: 'cumulative-layout-shift', title: 'Cumulative Layout Shift', numericValue: 0.24, score: 0.4, scoreDisplayMode: 'numeric', displayValue: '0.24' },
          'first-contentful-paint': { id: 'first-contentful-paint', title: 'First Contentful Paint', numericValue: 2100, score: 0.6, scoreDisplayMode: 'numeric', displayValue: '2.1 s' },
          'render-blocking-resources': { id: 'render-blocking-resources', title: 'Eliminate render-blocking resources', description: 'Resources are blocking the first paint. [Learn more](https://web.dev)', score: 0.1, scoreDisplayMode: 'numeric', details: { overallSavingsMs: 1200 } }
        }
      }
    };

    const mockHtml = `
      <!doctype html>
      <html>
        <head><title>Acme Dental</title></head>
        <body>
          <link rel="stylesheet" href="/wp-content/themes/dental/style.css" />
          <p>Welcome</p>
        </body>
      </html>
    `;

    const mockFetch = async (target) => {
      if (String(target).startsWith('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')) {
        assert.ok(String(target).includes('strategy=mobile'));
        assert.ok(String(target).includes('category=performance'));
        assert.ok(String(target).includes('category=seo'));
        assert.ok(String(target).includes('category=best-practices'));
        assert.ok(String(target).includes('key=test-psi-key'));
        return new Response(JSON.stringify(mockPsiPayload), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(mockHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    };

    const result = await runExternalAudit(
      { url: 'https://acmedental.example.com', businessName: 'Acme Dental', niche: 'Dental Clinic' },
      { fetchFn: mockFetch, psiApiKey: 'test-psi-key' }
    );

    assert.strictEqual(result.metrics.mobilePerformanceScore, 42);
    assert.strictEqual(result.metrics.performanceScore, 42);
    assert.strictEqual(result.metrics.seoScore, 71);
    assert.strictEqual(result.metrics.bestPracticesScore, 83);
    assert.strictEqual(result.metrics.lcp, '4.8 s');
    assert.strictEqual(result.metrics.inp, '340 ms');
    assert.strictEqual(result.metrics.cls, '0.24');
    assert.strictEqual(result.metrics.fcp, '2.1 s');
    assert.ok(result.auditedAt);
    assert.strictEqual(result.detectedStack, 'WordPress');
    assert.strictEqual(result.htmlChecks.hasTitle, true);
    assert.strictEqual(result.htmlChecks.hasMetaDescription, false);
    assert.strictEqual(result.htmlChecks.hasH1, false);
    assert.strictEqual(result.htmlChecks.hasOpenGraph, false);
    assert.ok(result.topIssues.some((i) => i.includes('4.8 s')));
    assert.ok(result.topIssues.some((i) => i.includes('Missing meta description')));
  });

  test('POST /api/external-audit enforces x-api-key and persists shareable report for GET', async () => {
    delete process.env.EXTERNAL_AUDIT_API_KEY;
    process.env.AUDIT_PULSE_API_KEY = 'super-secret-crm-key';
    process.env.PAGESPEED_API_KEY = 'psi-key-123';
    process.env.PUBLIC_REPORT_BASE_URL = 'https://auditpulse-dashboard-theta.vercel.app';

    // 1. Missing key -> 401
    const unauthRes = await originalFetch(`${baseUrl}/api/external-audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://example.com', businessName: 'Acme Dental' })
    });
    assert.strictEqual(unauthRes.status, 401);

    // 2. Wrong key -> 401
    const forbiddenRes = await originalFetch(`${baseUrl}/api/external-audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': 'wrong-key' },
      body: JSON.stringify({ url: 'https://example.com', businessName: 'Acme Dental' })
    });
    assert.strictEqual(forbiddenRes.status, 401);

    // 2b. Empty {} body with valid key -> 400
    const emptyBodyRes = await originalFetch(`${baseUrl}/api/external-audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': 'super-secret-crm-key' },
      body: JSON.stringify({})
    });
    assert.strictEqual(emptyBodyRes.status, 400);

    // 3. Valid key with mocked upstream PSI + target HTML fetch
    global.fetch = async (target, init) => {
      const urlStr = String(target);
      if (urlStr.startsWith(baseUrl)) {
        return originalFetch(target, init);
      }
      if (urlStr.startsWith('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')) {
        return new Response(JSON.stringify({
          lighthouseResult: {
            categories: {
              performance: { score: 0.65 },
              seo: { score: 0.88 },
              'best-practices': { score: 0.92 }
            },
            audits: {
              'largest-contentful-paint': { id: 'largest-contentful-paint', title: 'LCP', numericValue: 3100, score: 0.6, scoreDisplayMode: 'numeric' },
              'interaction-to-next-paint': { id: 'interaction-to-next-paint', title: 'INP', numericValue: 180, score: 0.92, scoreDisplayMode: 'numeric' },
              'cumulative-layout-shift': { id: 'cumulative-layout-shift', title: 'CLS', numericValue: 0.05, score: 0.95, scoreDisplayMode: 'numeric' },
              'first-contentful-paint': { id: 'first-contentful-paint', title: 'FCP', numericValue: 1500, score: 0.91, scoreDisplayMode: 'numeric' }
            }
          }
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      return new Response('<html><head><title>Acme</title><meta content="Best dental care" name="description"><meta property="og:title" content="Acme"></head><body><h1>Acme Dental</h1></body></html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    };

    const validRes = await originalFetch(`${baseUrl}/api/external-audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': 'super-secret-crm-key' },
      body: JSON.stringify({
        url: 'https://acmedental.com',
        businessName: 'Acme Dental',
        niche: 'Dental Clinic'
      })
    });

    assert.strictEqual(validRes.status, 200);
    const body = await validRes.json();
    assert.strictEqual(body.reportId.length, 10);
    assert.match(body.reportId, /^[0-9A-Za-z]{10}$/);
    assert.strictEqual(body.reportUrl, `https://auditpulse-dashboard-theta.vercel.app/report/${body.reportId}`);
    assert.strictEqual(body.businessName, 'Acme Dental');
    assert.strictEqual(body.metrics.mobilePerformanceScore, 65);
    assert.strictEqual(body.metrics.performanceScore, 65);
    assert.strictEqual(body.metrics.seoScore, 88);
    assert.strictEqual(body.metrics.lcp, '3.1 s');
    assert.strictEqual(body.metrics.inp, '180 ms');
    assert.strictEqual(body.metrics.cls, '0.05');
    assert.ok(body.auditedAt);

    // 4. Public GET /api/external-audit/:reportId works without x-api-key
    const getRes = await originalFetch(`${baseUrl}/api/external-audit/${body.reportId}`);
    assert.strictEqual(getRes.status, 200);
    const getBody = await getRes.json();
    assert.strictEqual(getBody.data.reportId, body.reportId);
    assert.strictEqual(getBody.data.businessName, 'Acme Dental');
    assert.strictEqual(getBody.data.htmlChecks.hasMetaDescription, true);
    assert.strictEqual(getBody.data.htmlChecks.hasH1, true);

    // 5. Missing reportId -> 404
    const missingRes = await originalFetch(`${baseUrl}/api/external-audit/DoesNotExist1`);
    assert.strictEqual(missingRes.status, 404);

    // Verify repository retrieval directly and clean up test fallback file if created during test
    const saved = await ExternalReportRepository.findByReportId(body.reportId);
    assert.ok(saved);
    if (fs.existsSync(FALLBACK_REPORTS_FILE)) {
      const entries = JSON.parse(fs.readFileSync(FALLBACK_REPORTS_FILE, 'utf-8'));
      const filtered = entries.filter((e) => e.reportId !== body.reportId);
      if (filtered.length === 0) {
        fs.unlinkSync(FALLBACK_REPORTS_FILE);
      } else {
        fs.writeFileSync(FALLBACK_REPORTS_FILE, JSON.stringify(filtered, null, 2));
      }
    }
  });
});
