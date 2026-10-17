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

const fallbackFlags = new Map([
  ['showCliFeature', false],
  ['showPricingFeature', false],
  ['showReactProviderFeature', false],
  ['showLiveDemo', true],
  ['showFeaturesGrid', true],
  ['monetizationEnabled', false]
]);

// Helper repository for feature flags
class FeatureFlagRepository {
  static async getFlagsMap() {
    try {
      const { getMongoStatus } = require('../config/db');
      if (getMongoStatus()) {
        const flags = await FeatureFlag.find({});
        const map = Object.fromEntries(fallbackFlags);
        flags.forEach(f => {
          map[f.key] = f.enabled;
        });
        return map;
      } else {
        return Object.fromEntries(fallbackFlags);
      }
    } catch (err) {
      return Object.fromEntries(fallbackFlags);
    }
  }

  static async setFlag(key, enabled, description = '') {
    fallbackFlags.set(key, enabled);
    try {
      const { getMongoStatus } = require('../config/db');
      if (getMongoStatus()) {
        return await FeatureFlag.findOneAndUpdate(
          { key },
          { key, enabled, description },
          { upsert: true, new: true }
        );
      }
    } catch (err) {
      // Handled in fallback
    }
    return { key, enabled, description };
  }
}

module.exports = {
  FeatureFlag,
  FeatureFlagRepository
};
