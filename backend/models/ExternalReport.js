const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REPORT_ID_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function generateReportId(length = 10) {
  const bytes = crypto.randomBytes(length);
  let id = '';
  for (let i = 0; i < length; i += 1) {
    id += REPORT_ID_ALPHABET[bytes[i] % REPORT_ID_ALPHABET.length];
  }
  return id;
}

const ExternalReportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true, index: true },
  reportUrl: { type: String, required: true },
  url: { type: String, required: true, index: true },
  businessName: { type: String, required: true },
  niche: { type: String, default: '' },
  detectedStack: { type: String, default: 'Custom / HTML' },

  metrics: {
    performanceScore: { type: Number, default: 0 },
    seoScore: { type: Number, default: 0 },
    bestPracticesScore: { type: Number, default: 0 },
    lcp: { type: String, default: 'N/A' },
    inp: { type: String, default: 'N/A' },
    cls: { type: String, default: 'N/A' },
    fcp: { type: String, default: 'N/A' },
    lcpMs: { type: Number, default: null },
    inpMs: { type: Number, default: null },
    clsValue: { type: Number, default: null },
    fcpMs: { type: Number, default: null }
  },

  topIssues: [{ type: String }],

  failingAudits: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    displayValue: { type: String, default: '' },
    savingsLabel: { type: String, default: '' },
    score: { type: Number, default: 0 }
  }],

  htmlChecks: {
    fetched: { type: Boolean, default: false },
    statusCode: { type: Number, default: null },
    hasTitle: { type: Boolean, default: false },
    title: { type: String, default: '' },
    hasMetaDescription: { type: Boolean, default: false },
    metaDescription: { type: String, default: '' },
    hasH1: { type: Boolean, default: false },
    h1Text: { type: String, default: '' },
    hasOpenGraph: { type: Boolean, default: false },
    ogTags: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      image: { type: String, default: '' }
    }
  }
}, {
  timestamps: true
});

const ExternalReportModel = mongoose.model('ExternalReport', ExternalReportSchema);

const FALLBACK_FILE = path.join(__dirname, '../external_reports_fallback.json');
let fallbackReports = [];

try {
  if (fs.existsSync(FALLBACK_FILE)) {
    const raw = fs.readFileSync(FALLBACK_FILE, 'utf-8');
    fallbackReports = JSON.parse(raw);
  }
} catch (err) {
  fallbackReports = [];
}

function saveFallbackReports() {
  try {
    const dir = path.dirname(FALLBACK_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(fallbackReports, null, 2));
  } catch (err) {
    console.error('[ExternalReport] Failed to write fallback store:', err);
  }
}

class ExternalReportRepository {
  static async save(reportData) {
    const { getMongoStatus } = require('../config/db');
    if (getMongoStatus()) {
      const doc = new ExternalReportModel(reportData);
      const saved = await doc.save();
      return saved.toObject ? saved.toObject() : saved;
    }

    const now = new Date().toISOString();
    const record = {
      _id: `ext_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      ...reportData,
      createdAt: now,
      updatedAt: now
    };
    fallbackReports.unshift(record);
    saveFallbackReports();
    return record;
  }

  static async findByReportId(reportId) {
    const { getMongoStatus } = require('../config/db');
    if (getMongoStatus()) {
      return await ExternalReportModel.findOne({ reportId }).lean().exec();
    }
    return fallbackReports.find((item) => item.reportId === reportId) || null;
  }
}

module.exports = {
  ExternalReportModel,
  ExternalReportRepository,
  generateReportId
};
