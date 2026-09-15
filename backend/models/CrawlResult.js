const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const CrawlResultSchema = new mongoose.Schema({
  url: { type: String, required: true, index: true },
  domain: { type: String, required: true, index: true },
  renderingType: { type: String, enum: ['SSR/SSG', 'CSR', 'HYBRID', 'UNKNOWN'], default: 'CSR' },

  scores: {
    overall: { type: Number, default: 0 },
    seo: { type: Number, default: 0 },
    performance: { type: Number, default: 0 },
    social: { type: Number, default: 0 }
  },

  ssrMeta: {
    rawTitle: { type: String, default: '' },
    rawDescription: { type: String, default: '' },
    rawCanonical: { type: String, default: '' },
    rawOgTitle: { type: String, default: '' },
    rawOgDesc: { type: String, default: '' },
    rawOgImage: { type: String, default: '' },
    rawH1: { type: String, default: '' },
    hasRawTitle: { type: Boolean, default: false },
    hasRawDescription: { type: Boolean, default: false },
    hasRawOg: { type: Boolean, default: false },
    rawHtmlLength: { type: Number, default: 0 }
  },

  performanceMetrics: {
    ttfb: { type: Number, default: 0 },         // Time to First Byte (ms)
    fcp: { type: Number, default: 0 },          // First Contentful Paint (ms)
    lcp: { type: Number, default: 0 },          // Largest Contentful Paint (ms)
    cls: { type: Number, default: 0 },          // Cumulative Layout Shift
    tti: { type: Number, default: 0 },          // Time to Interactive / Hydration (ms)
    domContentLoaded: { type: Number, default: 0 },
    loadTime: { type: Number, default: 0 },
    jsHeapSizeKB: { type: Number, default: 0 },
    totalRequests: { type: Number, default: 0 },
    totalPageSizeKB: { type: Number, default: 0 }
  },

  seoMeta: {
    title: { type: String, default: '' },
    titleLength: { type: Number, default: 0 },
    description: { type: String, default: '' },
    descriptionLength: { type: Number, default: 0 },
    keywords: { type: String, default: '' },
    canonical: { type: String, default: '' },
    robots: { type: String, default: '' },
    viewport: { type: String, default: '' },
    charset: { type: String, default: '' },
    ogTags: { type: Map, of: String, default: {} },
    twitterTags: { type: Map, of: String, default: {} },
    headings: {
      h1: [{ type: String }],
      h2Count: { type: Number, default: 0 },
      h3Count: { type: Number, default: 0 }
    },
    structuredData: [mongoose.Schema.Types.Mixed],
    imagesTotal: { type: Number, default: 0 },
    imagesMissingAlt: { type: Number, default: 0 }
  },

  issues: [{
    severity: { type: String, enum: ['critical', 'warning', 'info'], default: 'info' },
    category: { type: String, enum: ['seo', 'performance', 'social', 'accessibility'], default: 'seo' },
    code: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
  }],

  status: { type: String, enum: ['success', 'error'], default: 'success' },
  errorMessage: { type: String, default: '' }
}, {
  timestamps: true
});

const MongoModel = mongoose.model('CrawlResult', CrawlResultSchema);

// In-Memory & Local File Fallback Store when MongoDB daemon is offline
const FALLBACK_FILE = path.join(__dirname, '../data_fallback.json');
let fallbackStore = [];

try {
  if (fs.existsSync(FALLBACK_FILE)) {
    const raw = fs.readFileSync(FALLBACK_FILE, 'utf-8');
    fallbackStore = JSON.parse(raw);
  }
} catch (err) {
  fallbackStore = [];
}

const saveFallback = () => {
  try {
    const dataDir = path.dirname(FALLBACK_FILE);
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(fallbackStore, null, 2));
  } catch (err) {
    console.error('Failed to write fallback data store', err);
  }
};

// Dual-mode Data Access Layer
class CrawlResultRepository {
  static async save(docData) {
    const { getMongoStatus } = require('../config/db');
    if (getMongoStatus()) {
      const doc = new MongoModel(docData);
      return await doc.save();
    } else {
      const record = {
        _id: 'fb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        ...docData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      fallbackStore.unshift(record);
      saveFallback();
      return record;
    }
  }

  static async findByUrl(url) {
    const { getMongoStatus } = require('../config/db');
    if (getMongoStatus()) {
      return await MongoModel.find({ url }).sort({ timestamp: -1 }).exec();
    } else {
      return fallbackStore
        .filter(item => item.url === url || item.url.replace(/\/$/, '') === url.replace(/\/$/, ''))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
  }

  static async getAllSites() {
    const { getMongoStatus } = require('../config/db');
    if (getMongoStatus()) {
      const results = await MongoModel.aggregate([
        { $sort: { timestamp: -1 } },
        {
          $group: {
            _id: '$url',
            domain: { $first: '$domain' },
            latestTimestamp: { $first: '$timestamp' },
            latestScore: { $first: '$scores.overall' },
            latestLcp: { $first: '$performanceMetrics.lcp' },
            latestTtfb: { $first: '$performanceMetrics.ttfb' },
            latestTti: { $first: '$performanceMetrics.tti' },
            title: { $first: '$seoMeta.title' },
            issuesCount: { $first: { $size: { $ifNull: ['$issues', []] } } },
            crawlCount: { $sum: 1 },
            latestId: { $first: '$_id' }
          }
        },
        { $sort: { latestTimestamp: -1 } }
      ]);
      return results;
    } else {
      const map = new Map();
      for (const item of fallbackStore) {
        if (!map.has(item.url)) {
          map.set(item.url, {
            _id: item.url,
            domain: item.domain,
            latestTimestamp: item.timestamp,
            latestScore: item.scores ? item.scores.overall : 0,
            latestLcp: item.performanceMetrics ? item.performanceMetrics.lcp : 0,
            latestTtfb: item.performanceMetrics ? item.performanceMetrics.ttfb : 0,
            latestTti: item.performanceMetrics ? item.performanceMetrics.tti : 0,
            title: item.seoMeta ? item.seoMeta.title : '',
            issuesCount: item.issues ? item.issues.length : 0,
            crawlCount: 1,
            latestId: item._id
          });
        } else {
          const entry = map.get(item.url);
          entry.crawlCount += 1;
        }
      }
      return Array.from(map.values()).sort((a, b) => new Date(b.latestTimestamp) - new Date(a.latestTimestamp));
    }
  }

  static async findById(id) {
    const { getMongoStatus } = require('../config/db');
    if (getMongoStatus()) {
      return await MongoModel.findById(id).exec();
    } else {
      return fallbackStore.find(item => String(item._id) === String(id));
    }
  }
}

module.exports = { MongoModel, CrawlResultRepository };
