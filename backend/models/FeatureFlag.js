const mongoose = require('mongoose');

const FeatureFlagSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    enabled: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const FeatureFlag = mongoose.model('FeatureFlag', FeatureFlagSchema);

// Helper repository for feature flags
class FeatureFlagRepository {
  static async getFlagsMap() {
    try {
      const flags = await FeatureFlag.find({});
      const map = {
        showCliFeature: false,
        showPricingFeature: false,
        showReactProviderFeature: false,
        showLiveDemo: true,
        showFeaturesGrid: true
      };
      flags.forEach(f => {
        map[f.key] = f.enabled;
      });
      return map;
    } catch (err) {
      console.warn('[FeatureFlagRepository] Fallback to default flags:', err.message);
      return {
        showCliFeature: false,
        showPricingFeature: false,
        showReactProviderFeature: false,
        showLiveDemo: true,
        showFeaturesGrid: true
      };
    }
  }

  static async setFlag(key, enabled, description = '') {
    return await FeatureFlag.findOneAndUpdate(
      { key },
      { key, enabled, description },
      { upsert: true, new: true }
    );
  }
}

module.exports = {
  FeatureFlag,
  FeatureFlagRepository
};
