const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const auditRoutes = require('./routes/audit');
const flagRoutes = require('./routes/flags');
const { CrawlResultRepository } = require('./models/CrawlResult');
const { FeatureFlagRepository } = require('./models/FeatureFlag');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// 1. Security Headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: false, // Allowed for Swagger UI static resources
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// 2. Gzip Payload Compression
app.use(compression());

// 3. CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true); // Allow dev fallback
      }
    },
    credentials: true
  })
);

app.use(express.json({ limit: '2mb' }));

// 4. Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per 15m
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});

const auditCrawlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25, // Limit each IP to 25 live audits per 15m
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Crawl rate limit exceeded. Maximum 25 audits per 15 minutes.' }
});

app.use('/api/', globalLimiter);
app.use('/api/audit/run', auditCrawlLimiter);

// 5. Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 6. Routes
app.use('/api/audit', auditRoutes);
app.use('/api/flags', flagRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    service: 'SPA SEO Monitoring Backend',
    swagger: `http://localhost:${PORT}/api-docs`,
    time: new Date()
  });
});

// Seed sample historical data if empty
async function seedInitialDataIfEmpty() {
  try {
    const sites = await CrawlResultRepository.getAllSites();
    if (sites.length === 0) {
      console.log('[Seed] Populating initial demo audit data for React SPA docs...');
      const sampleUrl = 'https://react.dev';
      const sampleDomain = 'react.dev';

      const timestamps = [
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        new Date()
      ];

      const sampleData = [
        {
          url: sampleUrl,
          domain: sampleDomain,
          timestamp: timestamps[0],
          scores: { overall: 78, seo: 82, performance: 75, social: 70 },
          performanceMetrics: { ttfb: 420, fcp: 1450, lcp: 2850, cls: 0.04, tti: 3200, domContentLoaded: 1200, loadTime: 3100, jsHeapSizeKB: 18400, totalRequests: 32, totalPageSizeKB: 850 },
          seoMeta: {
            title: 'React - The library for web and native user interfaces',
            titleLength: 55,
            description: 'React lets you build user interfaces out of individual pieces called components.',
            descriptionLength: 79,
            keywords: 'react, javascript, ui, frontend, components',
            canonical: 'https://react.dev',
            robots: 'index, follow',
            viewport: 'width=device-width, initial-scale=1',
            charset: 'UTF-8',
            ogTags: { 'og:title': 'React', 'og:description': 'The library for web and native user interfaces', 'og:image': 'https://react.dev/og-image.png' },
            twitterTags: { 'twitter:card': 'summary_large_image', 'twitter:title': 'React' },
            headings: { h1: ['React'], h2Count: 6, h3Count: 14 },
            structuredData: [{ "@context": "https://schema.org", "@type": "WebSite", "name": "React" }],
            imagesTotal: 8,
            imagesMissingAlt: 1
          },
          issues: [
            { severity: 'warning', category: 'performance', code: 'NEEDS_IMPROVEMENT_LCP', title: 'LCP Needs Improvement (2.85s)', description: 'Target LCP should be under 2.5s.' },
            { severity: 'warning', category: 'social', code: 'INCOMPLETE_OPEN_GRAPH', title: 'Incomplete Open Graph Tags', description: 'Missing og:url tag.' }
          ],
          status: 'success'
        },
        {
          url: sampleUrl,
          domain: sampleDomain,
          timestamp: timestamps[1],
          scores: { overall: 84, seo: 90, performance: 81, social: 80 },
          performanceMetrics: { ttfb: 310, fcp: 1200, lcp: 2400, cls: 0.02, tti: 2700, domContentLoaded: 980, loadTime: 2600, jsHeapSizeKB: 17200, totalRequests: 28, totalPageSizeKB: 790 },
          seoMeta: {
            title: 'React - The library for web and native user interfaces',
            titleLength: 55,
            description: 'React lets you build user interfaces out of individual pieces called components. Create your own React components like Thumbnail, LikeButton, and Video.',
            descriptionLength: 154,
            keywords: 'react, javascript, ui, frontend, components',
            canonical: 'https://react.dev',
            robots: 'index, follow',
            viewport: 'width=device-width, initial-scale=1',
            charset: 'UTF-8',
            ogTags: { 'og:title': 'React', 'og:description': 'The library for web and native user interfaces', 'og:image': 'https://react.dev/og-image.png', 'og:url': 'https://react.dev' },
            twitterTags: { 'twitter:card': 'summary_large_image', 'twitter:title': 'React' },
            headings: { h1: ['React'], h2Count: 8, h3Count: 18 },
            structuredData: [{ "@context": "https://schema.org", "@type": "WebSite", "name": "React" }],
            imagesTotal: 10,
            imagesMissingAlt: 0
          },
          issues: [
            { severity: 'info', category: 'seo', code: 'GOOD_STANDING', title: 'Good SEO Tag Coverage', description: 'All critical dynamic SPA meta tags present.' }
          ],
          status: 'success'
        },
        {
          url: sampleUrl,
          domain: sampleDomain,
          timestamp: timestamps[2],
          scores: { overall: 91, seo: 95, performance: 88, social: 90 },
          performanceMetrics: { ttfb: 220, fcp: 950, lcp: 1950, cls: 0.01, tti: 2200, domContentLoaded: 780, loadTime: 2100, jsHeapSizeKB: 15800, totalRequests: 24, totalPageSizeKB: 680 },
          seoMeta: {
            title: 'React - The library for web and native user interfaces',
            titleLength: 55,
            description: 'React lets you build user interfaces out of individual pieces called components. Create your own React components like Thumbnail, LikeButton, and Video.',
            descriptionLength: 154,
            keywords: 'react, javascript, ui, frontend, components',
            canonical: 'https://react.dev',
            robots: 'index, follow',
            viewport: 'width=device-width, initial-scale=1',
            charset: 'UTF-8',
            ogTags: { 'og:title': 'React', 'og:description': 'The library for web and native user interfaces', 'og:image': 'https://react.dev/og-image.png', 'og:url': 'https://react.dev' },
            twitterTags: { 'twitter:card': 'summary_large_image', 'twitter:title': 'React', 'twitter:site': '@reactjs' },
            headings: { h1: ['React'], h2Count: 8, h3Count: 18 },
            structuredData: [{ "@context": "https://schema.org", "@type": "WebSite", "name": "React", "url": "https://react.dev" }],
            imagesTotal: 10,
            imagesMissingAlt: 0
          },
          issues: [],
          status: 'success'
        },
        {
          url: sampleUrl,
          domain: sampleDomain,
          timestamp: timestamps[3],
          scores: { overall: 95, seo: 98, performance: 93, social: 94 },
          performanceMetrics: { ttfb: 180, fcp: 820, lcp: 1720, cls: 0.005, tti: 1890, domContentLoaded: 650, loadTime: 1850, jsHeapSizeKB: 14900, totalRequests: 21, totalPageSizeKB: 620 },
          seoMeta: {
            title: 'React - The library for web and native user interfaces',
            titleLength: 55,
            description: 'React lets you build user interfaces out of individual pieces called components. Create your own React components like Thumbnail, LikeButton, and Video.',
            descriptionLength: 154,
            keywords: 'react, javascript, ui, frontend, components, single page app',
            canonical: 'https://react.dev',
            robots: 'index, follow',
            viewport: 'width=device-width, initial-scale=1',
            charset: 'UTF-8',
            ogTags: { 'og:title': 'React', 'og:description': 'The library for web and native user interfaces', 'og:image': 'https://react.dev/og-image.png', 'og:url': 'https://react.dev' },
            twitterTags: { 'twitter:card': 'summary_large_image', 'twitter:title': 'React', 'twitter:site': '@reactjs' },
            headings: { h1: ['React'], h2Count: 10, h3Count: 22 },
            structuredData: [{ "@context": "https://schema.org", "@type": "WebSite", "name": "React", "url": "https://react.dev" }],
            imagesTotal: 12,
            imagesMissingAlt: 0
          },
          issues: [],
          status: 'success'
        }
      ];

      for (const item of sampleData) {
        await CrawlResultRepository.save(item);
      }
      console.log('[Seed] Demo data successfully seeded!');
    }

    // Seed default DB feature flags (Flag CLI, Pricing, and React Provider SDK off as requested)
    await FeatureFlagRepository.setFlag('showCliFeature', false, 'Toggle CLI feature widget & docs');
    await FeatureFlagRepository.setFlag('showPricingFeature', false, 'Toggle Pricing section & nav link');
    await FeatureFlagRepository.setFlag('showReactProviderFeature', false, 'Toggle React Provider SDK code showcase');
    await FeatureFlagRepository.setFlag('showLiveDemo', true, 'Toggle Live Demo sandbox');
    await FeatureFlagRepository.setFlag('showFeaturesGrid', true, 'Toggle Features grid');
    console.log('[Seed] DB Feature Flags initialized: { showCliFeature: false, showPricingFeature: false, showReactProviderFeature: false }');
  } catch (err) {
    console.error('[Seed Error]', err);
  }
}

// Start Server & Handle Graceful Shutdown
let server;
connectDB().then(async () => {
  await seedInitialDataIfEmpty();
  server = app.listen(PORT, () => {
    console.log(`🚀 SPA SEO Monitoring Server running on port ${PORT}`);
    console.log(`👉 API Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📚 Swagger API Docs: http://localhost:${PORT}/api-docs`);
  });
});

// Graceful process termination
const shutdown = () => {
  console.log('[Shutdown] Received kill signal. Gracefully closing HTTP server...');
  if (server) {
    server.close(() => {
      console.log('[Shutdown] HTTP server closed cleanly.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
