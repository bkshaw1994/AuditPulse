const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const COUNTER_FILE = path.join(__dirname, '../visitor_counter.json');
const INITIAL_BASELINE = 12842;

// Load counter from disk or initialize baseline
let visitorCount = INITIAL_BASELINE;
try {
  if (fs.existsSync(COUNTER_FILE)) {
    const raw = fs.readFileSync(COUNTER_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (typeof parsed.count === 'number' && !isNaN(parsed.count)) {
      visitorCount = parsed.count;
    }
  } else {
    fs.writeFileSync(COUNTER_FILE, JSON.stringify({ count: visitorCount }, null, 2), 'utf8');
  }
} catch (e) {
  console.warn('[Analytics] Notice reading visitor counter:', e.message);
}

function persistCount(newCount) {
  try {
    fs.writeFileSync(
      COUNTER_FILE,
      JSON.stringify({ count: newCount, updatedAt: new Date().toISOString() }, null, 2),
      'utf8'
    );
  } catch (e) {
    console.warn('[Analytics] Notice persisting visitor counter:', e.message);
  }
}

// Set of recent visitor IP hashes to avoid spamming
const recentIps = new Map();

function cleanOldIps() {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [key, ts] of recentIps.entries()) {
    if (ts < oneHourAgo) recentIps.delete(key);
  }
}

function isLocalhost(req) {
  const host = (req.headers.host || '').toLowerCase();
  const origin = (req.headers.origin || '').toLowerCase();
  const referer = (req.headers.referer || '').toLowerCase();
  const ip = (req.ip || req.connection?.remoteAddress || '').toLowerCase();
  const clientFlag = req.body?.isLocalhost === true || req.query?.isLocalhost === 'true';

  if (clientFlag) return true;
  if (host.includes('localhost') || host.includes('127.0.0.1')) return true;
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) return true;
  if (referer.includes('localhost') || referer.includes('127.0.0.1')) return true;
  if (ip === '127.0.0.1' || ip === '::1' || ip.includes('127.0.0.1')) return true;

  return false;
}

/**
 * GET /api/analytics/visitors
 * Read current visitor count without incrementing
 */
router.get('/visitors', (req, res) => {
  return res.json({
    success: true,
    count: visitorCount,
    isLocalhost: isLocalhost(req)
  });
});

/**
 * POST /api/analytics/visitor-hit
 * Records a page view and increments counter only if NOT localhost
 */
router.post('/visitor-hit', (req, res) => {
  cleanOldIps();
  const clientIsLocal = isLocalhost(req);

  // Strictly DO NOT count localhost visits
  if (clientIsLocal) {
    return res.json({
      success: true,
      count: visitorCount,
      counted: false,
      reason: 'localhost_excluded',
      isLocalhost: true
    });
  }

  // Identify visitor IP / client id
  const clientIp = req.headers['x-forwarded-for'] || req.ip || 'unknown_ip';
  const lastVisit = recentIps.get(clientIp);

  // If visited within last 30 minutes, don't count duplicate
  if (lastVisit && Date.now() - lastVisit < 30 * 60 * 1000) {
    return res.json({
      success: true,
      count: visitorCount,
      counted: false,
      reason: 'recent_visitor',
      isLocalhost: false
    });
  }

  // Count new non-localhost visitor
  recentIps.set(clientIp, Date.now());
  visitorCount += 1;
  persistCount(visitorCount);

  return res.json({
    success: true,
    count: visitorCount,
    counted: true,
    isLocalhost: false
  });
});

module.exports = router;
