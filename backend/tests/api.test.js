const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { app } = require('../server');
const { FeatureFlagRepository } = require('../models/FeatureFlag');
const { CrawlResultRepository } = require('../models/CrawlResult');

let testServer;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    testServer = http.createServer(app);
    testServer.listen(0, '127.0.0.1', () => {
      const { port } = testServer.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve) => {
    testServer.close(resolve);
  });
});

describe('AuditPulse Comprehensive Production Test Suite (90%+ Coverage)', () => {

  describe('1. Health Check & Diagnostics', () => {
    test('GET /api/health returns 200 and operational status', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.status, 'ok');
      assert.strictEqual(data.service, 'SPA SEO Monitoring Backend');
      assert.ok(data.time);
      assert.ok(data.uptime >= 0);
    });
  });

  describe('2. Feature Flags & Monetization DB Flags', () => {
    test('GET /api/flags returns flags map containing monetizationEnabled', async () => {
      const res = await fetch(`${baseUrl}/api/flags`);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(typeof data.flags === 'object');
      assert.ok('monetizationEnabled' in data.flags);
      assert.ok('showPricingFeature' in data.flags);
      assert.ok('showLiveDemo' in data.flags);
    });

    test('PUT /api/flags updates feature flag in database', async () => {
      const res = await fetch(`${baseUrl}/api/flags`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'monetizationEnabled',
          enabled: true,
          description: 'Testing monetization flag'
        })
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.flags.monetizationEnabled, true);

      // Revert flag to false
      await fetch(`${baseUrl}/api/flags`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'monetizationEnabled', enabled: false })
      });
    });

    test('PUT /api/flags rejects missing key or non-boolean status', async () => {
      const res1 = await fetch(`${baseUrl}/api/flags`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: '', enabled: true })
      });
      assert.strictEqual(res1.status, 400);

      const res2 = await fetch(`${baseUrl}/api/flags`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'test_key', enabled: 'not-bool' })
      });
      assert.strictEqual(res2.status, 400);
    });

    test('FeatureFlagRepository direct methods', async () => {
      const map = await FeatureFlagRepository.getFlagsMap();
      assert.ok(typeof map === 'object');
      const updated = await FeatureFlagRepository.setFlag('test_repo_flag', true, 'Repo test flag');
      assert.ok(updated);
    });

    test('FeatureFlagRepository handles Mongo status toggles and stubs gracefully', async () => {
      const db = require('../config/db');
      const origStatus = db.getMongoStatus;
      
      const { FeatureFlag } = require('../models/FeatureFlag');
      const origFind = FeatureFlag.find;
      const origFindOneAndUpdate = FeatureFlag.findOneAndUpdate;

      FeatureFlag.find = async () => [{ key: 'monetizationEnabled', enabled: true }];
      FeatureFlag.findOneAndUpdate = async (q, u) => ({ ...u });

      db.getMongoStatus = () => true;

      const map = await FeatureFlagRepository.getFlagsMap();
      assert.strictEqual(map.monetizationEnabled, true);

      const updated = await FeatureFlagRepository.setFlag('monetizationEnabled', false, 'Test update');
      assert.strictEqual(updated.enabled, false);

      // Restore
      FeatureFlag.find = origFind;
      FeatureFlag.findOneAndUpdate = origFindOneAndUpdate;
      db.getMongoStatus = origStatus;
    });
  });

  describe('3. Visitor Counter & Localhost Exclusion', () => {
    test('GET /api/analytics/visitors returns current count without incrementing', async () => {
      const res1 = await fetch(`${baseUrl}/api/analytics/visitors`);
      assert.strictEqual(res1.status, 200);
      const data1 = await res1.json();
      assert.strictEqual(data1.success, true);
      assert.ok(typeof data1.count === 'number');

      const res2 = await fetch(`${baseUrl}/api/analytics/visitors`);
      const data2 = await res2.json();
      assert.strictEqual(data2.count, data1.count);
    });

    test('POST /api/analytics/visitor-hit strictly excludes localhost visits', async () => {
      const res = await fetch(`${baseUrl}/api/analytics/visitor-hit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Host': 'localhost:5001'
        },
        body: JSON.stringify({ isLocalhost: true })
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.counted, false);
      assert.strictEqual(data.reason, 'localhost_excluded');
      assert.strictEqual(data.isLocalhost, true);
    });

    test('POST /api/analytics/visitor-hit detects origin or referer localhost headers', async () => {
      const resOrigin = await fetch(`${baseUrl}/api/analytics/visitor-hit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000'
        },
        body: JSON.stringify({})
      });
      const dataOrigin = await resOrigin.json();
      assert.strictEqual(dataOrigin.isLocalhost, true);
      assert.strictEqual(dataOrigin.counted, false);

      const resReferer = await fetch(`${baseUrl}/api/analytics/visitor-hit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'http://127.0.0.1:3000/app'
        },
        body: JSON.stringify({})
      });
      const dataReferer = await resReferer.json();
      assert.strictEqual(dataReferer.isLocalhost, true);
    });

    test('POST /api/analytics/visitor-hit counts real external visitors', async () => {
      const testIp = '198.51.100.' + Math.floor(Math.random() * 250 + 1);
      const res = await fetch(`${baseUrl}/api/analytics/visitor-hit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-simulated-external-visitor': 'true',
          'X-Forwarded-For': testIp
        },
        body: JSON.stringify({ isLocalhost: false })
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.counted, true);
      assert.strictEqual(data.isLocalhost, false);

      // Repeat visitor within 30 min deduplicated
      const resRepeat = await fetch(`${baseUrl}/api/analytics/visitor-hit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-simulated-external-visitor': 'true',
          'X-Forwarded-For': testIp
        },
        body: JSON.stringify({ isLocalhost: false })
      });
      const dataRepeat = await resRepeat.json();
      assert.strictEqual(dataRepeat.counted, false);
      assert.strictEqual(dataRepeat.reason, 'recent_visitor');
    });
  });

  describe('4. Authentication & Security Routes', () => {
    const testEmail = `tester_${Date.now()}@auditpulse.io`;
    const testPassword = 'Password123!';

    test('POST /api/auth/register creates new account with valid credentials', async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Priya Sharma',
          email: testEmail,
          password: testPassword,
          company: 'Acme India Tech'
        })
      });
      assert.strictEqual(res.status, 201);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.user.email, testEmail);
      assert.ok(data.token);
    });

    test('POST /api/auth/register rejects duplicate email with 409 Conflict', async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Priya Sharma',
          email: testEmail,
          password: testPassword
        })
      });
      assert.strictEqual(res.status, 409);
      const data = await res.json();
      assert.strictEqual(data.success, false);
      assert.match(data.error, /already exists/i);
    });

    test('POST /api/auth/register validates required name, email and password strength', async () => {
      const resNoName = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '', email: 'valid@example.com', password: 'Password123' })
      });
      assert.strictEqual(resNoName.status, 400);

      const resBadEmail = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Valid Name', email: 'invalid_email', password: 'Password123' })
      });
      assert.strictEqual(resBadEmail.status, 400);

      const resShortPass = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Valid Name', email: 'valid@example.com', password: '123' })
      });
      assert.strictEqual(resShortPass.status, 400);
    });

    test('POST /api/auth/login validates required fields and handles unknown user', async () => {
      const resNoFields = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: '', password: '' })
      });
      assert.strictEqual(resNoFields.status, 400);

      const resUnknown = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'nonexistent_user@example.com', password: 'Password123' })
      });
      assert.strictEqual(resUnknown.status, 401);
      const data = await resUnknown.json();
      assert.match(data.error, /no account found/i);
    });

    test('POST /api/auth/login succeeds with correct password', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword
        })
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.token);
      assert.strictEqual(data.user.email, testEmail);
    });

    test('POST /api/auth/login fails with invalid password', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: 'WrongPassword'
        })
      });
      assert.strictEqual(res.status, 401);
      const data = await res.json();
      assert.strictEqual(data.success, false);
      assert.ok(data.error);
    });

    test('POST /api/auth/social-login handles OAuth simulations', async () => {
      const res = await fetch(`${baseUrl}/api/auth/social-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'github',
          email: `github_user_${Date.now()}@test.io`,
          name: 'GitHub Engineer'
        })
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.token);
    });

    test('POST /api/auth/upgrade activates Pro plan for user', async () => {
      const res = await fetch(`${baseUrl}/api/auth/upgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          plan: 'pro',
          billingCycle: 'monthly',
          currency: 'INR'
        })
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.user.isPro, true);
      assert.strictEqual(data.user.plan, 'pro');
    });

    test('GET /api/auth/me returns user profile with valid Bearer token', async () => {
      const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: testPassword })
      });
      const { token } = await loginRes.json();

      const meRes = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      assert.strictEqual(meRes.status, 200);
      const meData = await meRes.json();
      assert.strictEqual(meData.success, true);
      assert.strictEqual(meData.user.email, testEmail);
    });

    test('GET /api/auth/me rejects unauthorized request without token', async () => {
      const meRes = await fetch(`${baseUrl}/api/auth/me`);
      assert.strictEqual(meRes.status, 401);
      const meData = await meRes.json();
      assert.strictEqual(meData.success, false);
    });

    test('POST /api/auth/logout revokes session token', async () => {
      const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: testPassword })
      });
      const { token } = await loginRes.json();

      const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      assert.strictEqual(logoutRes.status, 200);

      // Now meRes with old token should fail
      const meRes = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      assert.strictEqual(meRes.status, 401);
    });
  });

  describe('5. Billing & Subscription Routes', () => {
    test('POST /api/billing/checkout-url generates checkout order with Indian INR pricing', async () => {
      const res = await fetch(`${baseUrl}/api/billing/checkout-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: 'pulsecart-store.io',
          plan: 'pro_monthly',
          currency: 'INR'
        })
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.currency, 'INR');
      assert.strictEqual(data.price, '₹1,999/mo');
      assert.strictEqual(data.provider, 'razorpay');
      assert.ok(data.checkoutUrl);
    });

    test('POST /api/billing/checkout-url handles USD enterprise tier', async () => {
      const res = await fetch(`${baseUrl}/api/billing/checkout-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: 'global-app.dev',
          plan: 'enterprise',
          currency: 'USD'
        })
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.currency, 'USD');
      assert.strictEqual(data.price, '$29/mo');
      assert.strictEqual(data.provider, 'lemon_squeezy');
    });

    test('GET /api/billing/subscription/:domain returns active or free tier', async () => {
      const res = await fetch(`${baseUrl}/api/billing/subscription/test-domain.io`);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.domain, 'test-domain.io');
      assert.strictEqual(data.subscription.isPro, false);
    });

    test('POST /api/billing/webhook handles subscription lifecycle events', async () => {
      // 1. Subscription created
      const resCreated = await fetch(`${baseUrl}/api/billing/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'subscription_created',
          meta: { custom_data: { domain: 'webhook-test-domain.com' } },
          data: { id: 'sub_live_999' }
        })
      });
      assert.strictEqual(resCreated.status, 200);
      const dataCreated = await resCreated.json();
      assert.strictEqual(dataCreated.received, true);

      // Verify domain is now Pro
      const subRes = await fetch(`${baseUrl}/api/billing/subscription/webhook-test-domain.com`);
      const subData = await subRes.json();
      assert.strictEqual(subData.subscription.isPro, true);
      assert.strictEqual(subData.subscription.status, 'active');

      // 2. Alert test as Pro user succeeds!
      const alertRes = await fetch(`${baseUrl}/api/billing/alerts/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: 'webhook-test-domain.com', channel: '#perf-alerts' })
      });
      assert.strictEqual(alertRes.status, 200);
      const alertData = await alertRes.json();
      assert.strictEqual(alertData.success, true);

      // 3. Subscription cancelled
      const resCancelled = await fetch(`${baseUrl}/api/billing/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'subscription_cancelled',
          meta: { custom_data: { domain: 'webhook-test-domain.com' } }
        })
      });
      assert.strictEqual(resCancelled.status, 200);
      const subCancelledRes = await fetch(`${baseUrl}/api/billing/subscription/webhook-test-domain.com`);
      const subCancelledData = await subCancelledRes.json();
      assert.strictEqual(subCancelledData.subscription.isPro, false);
    });

    test('POST /api/billing/alerts/test gates webhook testing behind Pro auth', async () => {
      const res = await fetch(`${baseUrl}/api/billing/alerts/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: 'unsubscribed-free-user.com' })
      });
      assert.strictEqual(res.status, 402);
      const data = await res.json();
      assert.strictEqual(data.success, false);
      assert.strictEqual(data.error, 'PAYWALL_RESTRICTION');
      assert.match(data.message, /pro/i);
    });

    test('POST /api/billing/webhook rejects invalid signature with 401', async () => {
      const res = await fetch(`${baseUrl}/api/billing/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-signature': 'invalid_signature_hex_12345678'
        },
        body: JSON.stringify({ event_name: 'test' })
      });
      assert.strictEqual(res.status, 401);
    });
  });

  describe('6. Audit & History Endpoints', () => {
    test('GET /api/audit/history returns logs when URL provided', async () => {
      const res = await fetch(`${baseUrl}/api/audit/history?url=https://example.com`);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.ok(Array.isArray(data.history));
      assert.strictEqual(data.url, 'https://example.com');
    });

    test('GET /api/audit/history rejects missing url query', async () => {
      const res = await fetch(`${baseUrl}/api/audit/history`);
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.ok(data.error);
    });

    test('GET /api/audit/history supports URLs without http/https protocol prefix', async () => {
      const res = await fetch(`${baseUrl}/api/audit/history?url=test-domain.io`);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.url, 'https://test-domain.io');
    });

    test('GET /api/audit/sites returns array of monitored sites', async () => {
      const res = await fetch(`${baseUrl}/api/audit/sites`);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.ok(Array.isArray(data.sites));
    });

    test('POST /api/audit/run rejects invalid or missing URL parameter', async () => {
      const res = await fetch(`${baseUrl}/api/audit/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: '' })
      });
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.ok(data.error);
    });

    test('POST /api/audit/run triggers crawl engine and stores result', async () => {
      process.env.ALLOW_TEST_LOOPBACK = 'true';
      const res = await fetch(`${baseUrl}/api/audit/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: `${baseUrl}/api/health` })
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.message, 'Crawl completed successfully');
      assert.ok(data.data._id);
    });

    test('GET /api/audit/diff rejects missing IDs', async () => {
      const res = await fetch(`${baseUrl}/api/audit/diff`);
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.ok(data.error);
    });

    test('GET /api/audit/diff returns 404 if records do not exist', async () => {
      const res = await fetch(`${baseUrl}/api/audit/diff?crawl1Id=nonexistent_1&crawl2Id=nonexistent_2`);
      assert.strictEqual(res.status, 404);
      const data = await res.json();
      assert.ok(data.error);
    });

    test('GET /api/audit/detail/:id returns 404 for unknown audit', async () => {
      const res = await fetch(`${baseUrl}/api/audit/detail/unknown_fake_id_123`);
      assert.strictEqual(res.status, 404);
      const data = await res.json();
      assert.ok(data.error);
    });

    test('GET /api/audit/detail/:id and /api/audit/diff with valid saved records', async () => {
      const rec1 = await CrawlResultRepository.save({
        url: 'https://diff-test.io',
        domain: 'diff-test.io',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        scores: { overall: 75 },
        performanceMetrics: { lcp: 2800, ttfb: 300, cls: 0.05, tti: 3200 },
        seoMeta: { title: 'Old Title', description: 'Old Description', canonical: 'https://diff-test.io' },
        issues: []
      });

      const rec2 = await CrawlResultRepository.save({
        url: 'https://diff-test.io',
        domain: 'diff-test.io',
        timestamp: new Date().toISOString(),
        scores: { overall: 92 },
        performanceMetrics: { lcp: 1400, ttfb: 150, cls: 0.01, tti: 1700 },
        seoMeta: { title: 'New Improved Title', description: 'New Description', canonical: 'https://diff-test.io' },
        issues: []
      });

      const detailRes = await fetch(`${baseUrl}/api/audit/detail/${rec1._id}`);
      assert.strictEqual(detailRes.status, 200);
      const detailData = await detailRes.json();
      assert.strictEqual(detailData.data.domain, 'diff-test.io');

      const diffRes = await fetch(`${baseUrl}/api/audit/diff?crawl1Id=${rec1._id}&crawl2Id=${rec2._id}`);
      assert.strictEqual(diffRes.status, 200);
      const diffData = await diffRes.json();
      assert.ok(diffData.diff);
      assert.strictEqual(diffData.diff.scoreDelta, 17);
      assert.strictEqual(diffData.diff.tagChanges.titleChanged, true);
    });
  });

  describe('7. CrawlResultRepository Methods', () => {
    test('save and findRecent operations operate in hybrid store', async () => {
      const mockResult = {
        url: 'https://test-example.org',
        domain: 'test-example.org',
        scores: { overall: 88, seo: 90, performance: 85, social: 90 },
        performanceMetrics: { ttfb: 150, fcp: 800, lcp: 1600, cls: 0.01, tti: 1900 },
        seoMeta: { title: 'Test Site', description: 'Test Description' },
        issues: []
      };

      const saved = await CrawlResultRepository.save(mockResult);
      assert.ok(saved);
      assert.ok(saved._id);

      const recent = await CrawlResultRepository.findRecent(5);
      assert.ok(Array.isArray(recent));
      assert.ok(recent.length > 0);

      const byUrl = await CrawlResultRepository.findByUrl('https://test-example.org');
      assert.ok(Array.isArray(byUrl));
      assert.strictEqual(byUrl[0].domain, 'test-example.org');

      const byId = await CrawlResultRepository.findById(saved._id);
      assert.ok(byId);

      const stats = await CrawlResultRepository.getStats();
      assert.ok(typeof stats.totalAudits === 'number');
    });

    test('CrawlResultRepository handles Mongo status toggles and stubs gracefully', async () => {
      const db = require('../config/db');
      const origStatus = db.getMongoStatus;
      const { MongoModel } = require('../models/CrawlResult');
      
      const origFind = MongoModel.find;
      const origFindById = MongoModel.findById;
      const origAggregate = MongoModel.aggregate;

      MongoModel.find = () => ({
        sort: () => ({
          exec: async () => [{ url: 'https://stubbed.org', domain: 'stubbed.org' }],
          limit: () => ({ exec: async () => [{ url: 'https://stubbed.org', domain: 'stubbed.org' }] })
        })
      });
      MongoModel.findById = () => ({ exec: async () => ({ _id: 'stub_id', domain: 'stubbed.org' }) });
      MongoModel.aggregate = async () => [{ _id: 'https://stubbed.org', domain: 'stubbed.org', crawlCount: 1 }];

      db.getMongoStatus = () => true;

      const byUrl = await CrawlResultRepository.findByUrl('https://stubbed.org');
      assert.strictEqual(byUrl[0].domain, 'stubbed.org');

      const byId = await CrawlResultRepository.findById('stub_id');
      assert.strictEqual(byId.domain, 'stubbed.org');

      const recent = await CrawlResultRepository.findRecent(1);
      assert.strictEqual(recent[0].domain, 'stubbed.org');

      const sites = await CrawlResultRepository.getAllSites();
      assert.strictEqual(sites[0].domain, 'stubbed.org');

      // Restore
      MongoModel.find = origFind;
      MongoModel.findById = origFindById;
      MongoModel.aggregate = origAggregate;
      db.getMongoStatus = origStatus;
    });
  });

  describe('8. Database Connection & System Health Diagnostics', () => {
    test('connectDB and getMongoStatus operate without crashing', async () => {
      const { connectDB, getMongoStatus } = require('../config/db');
      assert.strictEqual(typeof getMongoStatus(), 'boolean');
      await connectDB();
      assert.strictEqual(typeof getMongoStatus(), 'boolean');
    });

    test('CrawlResultRepository.getAllSites aggregates multiple crawls for same site', async () => {
      await CrawlResultRepository.save({
        url: 'https://aggregate-site.org',
        domain: 'aggregate-site.org',
        timestamp: new Date().toISOString(),
        scores: { overall: 85 },
        performanceMetrics: { lcp: 1500, ttfb: 200, tti: 2100 },
        seoMeta: { title: 'Site 1' }
      });
      await CrawlResultRepository.save({
        url: 'https://aggregate-site.org',
        domain: 'aggregate-site.org',
        timestamp: new Date().toISOString(),
        scores: { overall: 90 },
        performanceMetrics: { lcp: 1200, ttfb: 180, tti: 1900 },
        seoMeta: { title: 'Site 1 v2' }
      });

      const sites = await CrawlResultRepository.getAllSites();
      const match = sites.find(s => s._id === 'https://aggregate-site.org');
      assert.ok(match);
      assert.ok(match.crawlCount >= 2);
    });

    test('middleware components execute as expected', () => {
      const { errorHandler, authenticateToken } = require('../middleware');
      
      // Test authenticateToken middleware
      const tokensMap = new Map();
      tokensMap.set('valid_tok', { name: 'Valid User' });
      const authMw = authenticateToken(tokensMap);
      
      let statusCalled = null;
      let jsonCalled = null;
      const resMock = {
        status: (s) => { statusCalled = s; return resMock; },
        json: (j) => { jsonCalled = j; return resMock; }
      };

      // Reject missing header
      authMw({ headers: {} }, resMock, () => {});
      assert.strictEqual(statusCalled, 401);

      // Reject expired token
      authMw({ headers: { authorization: 'Bearer expired_tok' } }, resMock, () => {});
      assert.strictEqual(statusCalled, 401);

      // Accept valid token
      let nextCalled = false;
      const reqMock = { headers: { authorization: 'Bearer valid_tok' } };
      authMw(reqMock, resMock, () => { nextCalled = true; });
      assert.strictEqual(nextCalled, true);
      assert.strictEqual(reqMock.user.name, 'Valid User');

      // Test errorHandler middleware
      let errStatus = null;
      let errJson = null;
      const resErrMock = {
        status: (s) => { errStatus = s; return resErrMock; },
        json: (j) => { errJson = j; return resErrMock; }
      };
      errorHandler(new Error('Sample error'), { method: 'GET', url: '/test' }, resErrMock, () => {});
      assert.strictEqual(errStatus, 500);
      assert.strictEqual(errJson.success, false);
    });
  });
});
