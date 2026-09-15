# ⚡ SPA AuditPulse - SPA SEO & Core Web Vitals Monitoring Engine

An enterprise-grade SEO and Performance monitoring system built specifically for Single-Page Applications (React, Vue, Angular, Next.js SPA mode).

Unlike traditional static HTML crawlers, **SPA AuditPulse** utilizes a headless Puppeteer browser engine to execute client-side JavaScript, wait for DOM hydration, inspect dynamically injected meta tags, and capture accurate Google Core Web Vitals (TTFB, FCP, LCP, CLS, TTI).

---

## 🚀 Key Features

1. **Puppeteer Headless Scraper Engine**:
   - Executes client-side JavaScript bundle.
   - Waits for SPA DOM hydration (`networkidle0` + element mounting).
   - Injects browser native `PerformanceObserver` to collect LCP, TTFB, FCP, CLS, and estimate TTI.

2. **Dynamic SPA Metadata & Tag Inspector**:
   - `<title>` content & character length validator.
   - `<meta name="description">` content & character length validator.
   - `<link rel="canonical">` verification.
   - `og:*` (OpenGraph) and `twitter:*` tags live card preview.
   - Headings hierarchy (`h1`, `h2`, `h3` inspection).
   - Image missing `alt` attributes count.
   - Schema.org `<script type="application/ld+json">` structured data parser.

3. **MongoDB / Mongoose Dual Storage**:
   - Mongoose schema for historical crawl records, performance metrics, and audit logs.
   - Built-in fallback storage layer ensuring seamless operation out-of-the-box.

4. **Express REST API**:
   - `POST /api/audit/run`: Trigger live Puppeteer crawl on any target URL.
   - `GET /api/audit/history`: Fetch all past audits for a URL to populate historical trendlines.
   - `GET /api/audit/sites`: List all monitored SPAs with latest health scores.
   - `GET /api/audit/diff`: Side-by-side comparison of two historical audits (highlights score changes, LCP/TTFB deltas, and tag edits).

5. **React + Recharts Dashboard**:
   - Glassmorphic dark design system with dynamic SVG health gauge.
   - Recharts historical line graphs for LCP, TTFB, TTI, and overall health scores.
   - Twitter & OpenGraph live share preview simulator.
   - Interactive historical audit diff comparison tool.

---

## 🛠️ Project Structure

```
SPA/
├── backend/
│   ├── server.js            # Express server (Port 5001)
│   ├── config/db.js         # Mongoose DB connection & fallback
│   ├── models/CrawlResult.js# Mongoose Schema & repository
│   ├── services/crawler.js  # Core Puppeteer SPA crawler engine
│   └── routes/audit.js      # REST API router
└── frontend/                # React + Vite Dashboard (Port 3000)
    ├── src/
    │   ├── App.jsx
    │   ├── index.css        # Custom CSS variables & glassmorphic styling
    │   ├── components/      # AuditForm, ScoreCard, WebVitalsCard, TrendChart, MetaTagTable, SocialPreview, DiffViewer
    │   └── services/api.js  # API Client
    └── vite.config.js
```

---

## 🚦 Quick Start Guide

### 1. Start the Backend Server
```bash
cd backend
export PATH=$PATH:/usr/local/bin
npm install
npm start
```
*Backend API will run on `http://localhost:5001`*

### 2. Start the Frontend Dashboard
```bash
cd frontend
export PATH=$PATH:/usr/local/bin
npm install
npm run dev
```
*Dashboard will launch on `http://localhost:3000`*

---

## 📊 Core Web Vitals Thresholds Applied
- **LCP (Largest Contentful Paint)**: Good &le; 2.5s | Poor &gt; 4.0s
- **TTFB (Time to First Byte)**: Good &le; 800ms | Poor &gt; 1.8s
- **CLS (Cumulative Layout Shift)**: Good &le; 0.1 | Poor &gt; 0.25
- **TTI (Time to Interactive)**: Hydration complete timing indicator
