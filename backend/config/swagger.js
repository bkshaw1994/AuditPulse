const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SPA AuditPulse API Specification',
      version: '1.0.0',
      description: 'RESTful API documentation for SPA SEO & Core Web Vitals Performance Monitoring Engine. Powers dynamic DOM scraping, headless Puppeteer metrics extraction, historical diff tracking, and health scoring.',
      contact: {
        name: 'SPA SEO Engineering Team',
        url: 'https://github.com/spa-seo-monitoring'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development Server'
      }
    ],
    components: {
      schemas: {
        CrawlRequest: {
          type: 'object',
          required: ['url'],
          properties: {
            url: {
              type: 'string',
              example: 'https://react.dev',
              description: 'The target Single-Page Application URL to audit'
            }
          }
        },
        ScoreBreakdown: {
          type: 'object',
          properties: {
            overall: { type: 'number', example: 95 },
            seo: { type: 'number', example: 98 },
            performance: { type: 'number', example: 93 },
            social: { type: 'number', example: 94 }
          }
        },
        PerformanceMetrics: {
          type: 'object',
          properties: {
            ttfb: { type: 'number', example: 180, description: 'Time to First Byte (ms)' },
            fcp: { type: 'number', example: 820, description: 'First Contentful Paint (ms)' },
            lcp: { type: 'number', example: 1720, description: 'Largest Contentful Paint (ms)' },
            cls: { type: 'number', example: 0.005, description: 'Cumulative Layout Shift' },
            tti: { type: 'number', example: 1890, description: 'Time to Interactive / SPA Hydration (ms)' },
            domContentLoaded: { type: 'number', example: 650 },
            loadTime: { type: 'number', example: 1850 },
            jsHeapSizeKB: { type: 'number', example: 14900 },
            totalRequests: { type: 'number', example: 21 },
            totalPageSizeKB: { type: 'number', example: 620 }
          }
        },
        SeoMeta: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'React - The library for web and native user interfaces' },
            titleLength: { type: 'number', example: 55 },
            description: { type: 'string', example: 'React lets you build user interfaces out of individual pieces called components.' },
            descriptionLength: { type: 'number', example: 79 },
            canonical: { type: 'string', example: 'https://react.dev' },
            robots: { type: 'string', example: 'index, follow' },
            viewport: { type: 'string', example: 'width=device-width, initial-scale=1' },
            ogTags: { type: 'object', example: { 'og:title': 'React', 'og:image': 'https://react.dev/og-image.png' } },
            twitterTags: { type: 'object', example: { 'twitter:card': 'summary_large_image' } },
            headings: {
              type: 'object',
              properties: {
                h1: { type: 'array', items: { type: 'string' } },
                h2Count: { type: 'number' },
                h3Count: { type: 'number' }
              }
            },
            structuredData: { type: 'array', items: { type: 'object' } },
            imagesTotal: { type: 'number', example: 12 },
            imagesMissingAlt: { type: 'number', example: 0 }
          }
        },
        Issue: {
          type: 'object',
          properties: {
            severity: { type: 'string', enum: ['critical', 'warning', 'info'], example: 'warning' },
            category: { type: 'string', enum: ['seo', 'performance', 'social', 'accessibility'], example: 'performance' },
            code: { type: 'string', example: 'NEEDS_IMPROVEMENT_LCP' },
            title: { type: 'string', example: 'LCP Needs Improvement (2.85s)' },
            description: { type: 'string', example: 'Target LCP should be under 2.5s.' }
          }
        },
        CrawlResult: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6aa96d38f2db2717ddc8b68e' },
            url: { type: 'string', example: 'https://react.dev' },
            domain: { type: 'string', example: 'react.dev' },
            timestamp: { type: 'string', format: 'date-time' },
            scores: { $ref: '#/components/schemas/ScoreBreakdown' },
            performanceMetrics: { $ref: '#/components/schemas/PerformanceMetrics' },
            seoMeta: { $ref: '#/components/schemas/SeoMeta' },
            issues: { type: 'array', items: { $ref: '#/components/schemas/Issue' } },
            status: { type: 'string', example: 'success' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
