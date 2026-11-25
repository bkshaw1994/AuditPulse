const express = require('express');
const router = express.Router();
const { authenticateExternalApiKey } = require('../middleware/auth');
const { runExternalAudit } = require('../services/externalScanner');
const { ExternalReportRepository, generateReportId } = require('../models/ExternalReport');

function getPublicReportBaseUrl() {
  const configured = process.env.PUBLIC_REPORT_BASE_URL || 'https://auditpulse-dashboard-theta.vercel.app';
  return configured.replace(/\/+$/, '');
}

/**
 * POST /api/external-audit
 * Protected endpoint for external CRM/Outreach apps to generate a zero-install audit & shareable report.
 */
router.post('/', authenticateExternalApiKey, async (req, res) => {
  try {
    const { url, businessName = '', niche = '' } = req.body || {};

    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ error: 'url is required.' });
    }

    const scanResult = await runExternalAudit({ url, businessName, niche });
    const reportId = generateReportId(10);
    const reportUrl = `${getPublicReportBaseUrl()}/report/${reportId}`;

    await ExternalReportRepository.save({
      reportId,
      reportUrl,
      ...scanResult
    });

    return res.status(200).json({
      reportId,
      reportUrl,
      businessName: scanResult.businessName,
      niche: scanResult.niche,
      detectedStack: scanResult.detectedStack,
      metrics: {
        mobilePerformanceScore: scanResult.metrics.mobilePerformanceScore,
        performanceScore: scanResult.metrics.performanceScore,
        seoScore: scanResult.metrics.seoScore,
        bestPracticesScore: scanResult.metrics.bestPracticesScore,
        lcp: scanResult.metrics.lcp,
        cls: scanResult.metrics.cls,
        inp: scanResult.metrics.inp,
        fcp: scanResult.metrics.fcp
      },
      topIssues: scanResult.topIssues,
      auditedAt: scanResult.auditedAt,
      failingAudits: scanResult.failingAudits,
      htmlChecks: scanResult.htmlChecks
    });
  } catch (err) {
    console.error('[API Error /external-audit]', err);
    const status = err.statusCode || 500;
    return res.status(status).json({ error: err.message || 'External audit failed.' });
  }
});

/**
 * GET /api/external-audit/:reportId
 * Public endpoint returning a saved client report snapshot by reportId.
 */
router.get('/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;
    if (!reportId || !/^[A-Za-z0-9_-]{6,24}$/.test(reportId)) {
      return res.status(400).json({ error: 'Invalid reportId format.' });
    }

    const report = await ExternalReportRepository.findByReportId(reportId);
    if (!report) {
      return res.status(404).json({ error: 'Audit report not found.' });
    }

    return res.json({ data: report });
  } catch (err) {
    console.error('[API Error /external-audit/:reportId]', err);
    return res.status(500).json({ error: err.message || 'Failed to load audit report.' });
  }
});

module.exports = router;
