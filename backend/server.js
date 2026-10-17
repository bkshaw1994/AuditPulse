const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { auditRoutes, flagRoutes, billingRoutes, authRoutes, analyticsRoutes } = require('./routes');
const { CrawlResultRepository, FeatureFlagRepository } = require('./models');
const { errorHandler, globalLimiter, auditCrawlLimiter } = require('./middleware');

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

// 4. Rate Limiting Middleware
app.use('/api/', globalLimiter);
app.use('/api/audit/run', auditCrawlLimiter);

// 5. Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 6. Routes
app.use('/api/audit', auditRoutes);
app.use('/api/flags', flagRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    service: 'SPA SEO Monitoring Backend',
    uptime: process.uptime(),
    swagger: `http://localhost:${PORT}/api-docs`,
    time: new Date()
  });
});

// 7. Global Error Handler Middleware
app.use(errorHandler);

// Initialize DB feature flags (strictly no fake/dummy audit data seeded)
async function seedInitialDataIfEmpty() {
  try {
    // Seed default DB feature flags
    await FeatureFlagRepository.setFlag('showCliFeature', false, 'Toggle CLI feature widget & docs');
    await FeatureFlagRepository.setFlag('showPricingFeature', false, 'Toggle Pricing section & nav link');
    await FeatureFlagRepository.setFlag('showReactProviderFeature', false, 'Toggle React Provider SDK code showcase');
    await FeatureFlagRepository.setFlag('showLiveDemo', true, 'Toggle Live Demo sandbox');
    await FeatureFlagRepository.setFlag('showFeaturesGrid', true, 'Toggle Features grid');
    await FeatureFlagRepository.setFlag('monetizationEnabled', false, 'Toggle monetization & subscription upgrades');
    console.log('[Seed] DB Feature Flags initialized (monetizationEnabled: false)');
  } catch (err) {
    console.error('[Seed Error]', err);
  }
}

// Start Server & Handle Graceful Shutdown
let server;
if (require.main === module) {
  connectDB().then(async () => {
    await seedInitialDataIfEmpty();
    server = app.listen(PORT, () => {
      console.log(`🚀 SPA SEO Monitoring Server running on port ${PORT}`);
      console.log(`👉 API Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📚 Swagger API Docs: http://localhost:${PORT}/api-docs`);
    });
  });
}

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

module.exports = { app, connectDB, seedInitialDataIfEmpty };
