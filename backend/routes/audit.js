const express = require('express');
const router = express.Router();
const { auditUrl } = require('../services/crawler');
const { CrawlResultRepository } = require('../models/CrawlResult');

/**
 * @openapi
 * /api/audit/run:
 *   post:
 *     summary: Trigger a live SPA audit crawl
 *     description: Launches headless Puppeteer browser, waits for SPA client JS hydration, captures Core Web Vitals, and extracts dynamic SEO meta tags.
 *     tags:
 *       - Audit Engine
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrawlRequest'
 *     responses:
 *       200:
 *         description: Audit completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/CrawlResult' }
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Crawl process error
 */
router.post('/run', async (req, res) => {
  try {
    let { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required.' });
    }

    // Ensure URL has protocol prefix
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    console.log(`[API] Triggering crawl for: ${url}`);
    const crawlData = await auditUrl(url);

    // Save to Database / Dual Storage
    const savedRecord = await CrawlResultRepository.save(crawlData);

    return res.json({
      message: 'Crawl completed successfully',
      data: savedRecord
    });
  } catch (err) {
    console.error('[API Error /run]', err);
    return res.status(500).json({ error: err.message || 'Crawl process failed' });
  }
});

/**
 * @openapi
 * /api/audit/history:
 *   get:
 *     summary: Fetch historical audit logs for a target URL
 *     tags:
 *       - Historical Tracking
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema: { type: string }
 *         description: Target SPA URL
 *     responses:
 *       200:
 *         description: Historical audit logs array
 */
router.get('/history', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'url query parameter is required' });
    }

    let searchUrl = url;
    if (!searchUrl.startsWith('http://') && !searchUrl.startsWith('https://')) {
      searchUrl = 'https://' + searchUrl;
    }

    const history = await CrawlResultRepository.findByUrl(searchUrl);
    return res.json({
      url: searchUrl,
      count: history.length,
      history
    });
  } catch (err) {
    console.error('[API Error /history]', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * @openapi
 * /api/audit/sites:
 *   get:
 *     summary: List all monitored SPA websites
 *     tags:
 *       - Analytics & Monitored Sites
 *     responses:
 *       200:
 *         description: Array of monitored SPA sites with latest score and Core Web Vitals
 */
router.get('/sites', async (req, res) => {
  try {
    const sites = await CrawlResultRepository.getAllSites();
    return res.json({ sites });
  } catch (err) {
    console.error('[API Error /sites]', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/audit/detail/:id
 * Get single audit result by ID
 */
router.get('/detail/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const record = await CrawlResultRepository.findById(id);
    if (!record) {
      return res.status(404).json({ error: 'Audit record not found' });
    }
    return res.json({ data: record });
  } catch (err) {
    console.error('[API Error /detail]', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * @openapi
 * /api/audit/diff:
 *   get:
 *     summary: Compare two historical audits side-by-side
 *     tags:
 *       - Historical Diff & Comparison
 *     parameters:
 *       - in: query
 *         name: crawl1Id
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: crawl2Id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Side-by-side metric deltas and meta tag diffs
 */
router.get('/diff', async (req, res) => {
  try {
    const { crawl1Id, crawl2Id } = req.query;
    if (!crawl1Id || !crawl2Id) {
      return res.status(400).json({ error: 'Both crawl1Id and crawl2Id query parameters are required' });
    }

    const rec1 = await CrawlResultRepository.findById(crawl1Id);
    const rec2 = await CrawlResultRepository.findById(crawl2Id);

    if (!rec1 || !rec2) {
      return res.status(404).json({ error: 'One or both crawl records could not be found' });
    }

    // Sort chronologically (earlier vs later)
    const [older, newer] = new Date(rec1.timestamp) <= new Date(rec2.timestamp) ? [rec1, rec2] : [rec2, rec1];

    const diff = {
      olderCrawl: { id: older._id, timestamp: older.timestamp, score: older.scores.overall },
      newerCrawl: { id: newer._id, timestamp: newer.timestamp, score: newer.scores.overall },
      scoreDelta: (newer.scores?.overall || 0) - (older.scores?.overall || 0),
      metricsDiff: {
        lcpDelta: (newer.performanceMetrics?.lcp || 0) - (older.performanceMetrics?.lcp || 0),
        ttfbDelta: (newer.performanceMetrics?.ttfb || 0) - (older.performanceMetrics?.ttfb || 0),
        ttiDelta: (newer.performanceMetrics?.tti || 0) - (older.performanceMetrics?.tti || 0),
        clsDelta: parseFloat(((newer.performanceMetrics?.cls || 0) - (older.performanceMetrics?.cls || 0)).toFixed(4))
      },
      tagChanges: {
        titleChanged: older.seoMeta?.title !== newer.seoMeta?.title,
        oldTitle: older.seoMeta?.title,
        newTitle: newer.seoMeta?.title,

        descriptionChanged: older.seoMeta?.description !== newer.seoMeta?.description,
        oldDescription: older.seoMeta?.description,
        newDescription: newer.seoMeta?.description,

        canonicalChanged: older.seoMeta?.canonical !== newer.seoMeta?.canonical,
        oldCanonical: older.seoMeta?.canonical,
        newCanonical: newer.seoMeta?.canonical
      }
    };

    return res.json({ diff });
  } catch (err) {
    console.error('[API Error /diff]', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
