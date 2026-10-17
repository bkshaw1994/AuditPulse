const rateLimit = require('express-rate-limit');

/**
 * Global API rate limiter (200 reqs per 15 min window)
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP. Please try again after 15 minutes.' }
});

/**
 * Dedicated Crawler Rate Limiter (20 crawls per 15 min window)
 */
const auditCrawlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Crawl quota exceeded. Maximum 20 audits per 15 minutes.' }
});

module.exports = {
  globalLimiter,
  auditCrawlLimiter
};
