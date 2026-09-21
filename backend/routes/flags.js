const express = require('express');
const router = express.Router();
const { FeatureFlagRepository } = require('../models/FeatureFlag');

/**
 * GET /api/flags
 * Returns current feature flags map from MongoDB
 */
router.get('/', async (req, res) => {
  try {
    const flags = await FeatureFlagRepository.getFlagsMap();
    res.json({
      success: true,
      flags
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      flags: {
        showCliFeature: false,
        showPricingFeature: false,
        showLiveDemo: true,
        showFeaturesGrid: true
      }
    });
  }
});

/**
 * PUT /api/flags
 * Updates a feature flag in DB
 * Body: { key: "showCliFeature", enabled: true/false }
 */
router.put('/', async (req, res) => {
  try {
    const { key, enabled, description } = req.body;
    if (!key || typeof enabled !== 'boolean') {
      return res.status(400).json({ success: false, error: 'Key and boolean enabled status are required.' });
    }
    const updated = await FeatureFlagRepository.setFlag(key, enabled, description);
    const flags = await FeatureFlagRepository.getFlagsMap();
    res.json({
      success: true,
      updated,
      flags
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
