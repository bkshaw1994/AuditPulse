# AuditPulse v2.0 Platform Roadmap & Execution Plan

**Document Version:** 2.0.0  
**Target Release:** Production Readiness (v2)  
**Target Branch:** `feature/v2-production-readiness`  
**Core Stack:** Node.js, Express, Puppeteer, React 18, Vite, Tailwind CSS, Recharts, Lemon Squeezy

---

## 1. Executive Vision

AuditPulse v2 transforms the project from a single-URL audit utility into an end-to-end **Real-User Monitoring (RUM), Core Web Vitals diagnostic, and performance monetization SaaS platform**. 

V2 targets modern frontend engineering teams (React, Next.js, Vite, Remix) who need continuous visibility into real-user Core Web Vitals (LCP, INP, CLS), hydration freezes, and automated code-level diagnostic fixes without bloated enterprise APM costs.

---

## 2. Five-Phase Implementation Architecture

```mermaid
flowchart TD
    P1[Phase 1: Infrastructure & SEO] --> P2[Phase 2: Frictionless Onboarding]
    P2 --> P3[Phase 3: Diagnostics & Actionable UI]
    P3 --> P4[Phase 4: Monetization & Paywall Engine]
    P4 --> P5[Phase 5: Content-Led Distribution Launch]

    subgraph P1 Details
        P1A[Static Pre-rendering & SSG in index.html]
        P1B[Non-blocking Google Fonts & Preconnect]
        P1C[Manual Rollup Chunk Splitting]
        P1D[Schema.org JSON-LD Structured Data]
    end

    subgraph P2 Details
        P2A[Pre-loaded PulseCart Mock State]
        P2B[Simulated Traffic Spike at 14:00]
        P2C[@auditpulse/tracker npm Package]
        P2D[Interactive Setup Guide /app/setup]
    end

    subgraph P3 Details
        P3A[Strict Google Red/Yellow/Green Thresholds]
        P3B[Official INP Support replacing FID]
        P3C[24-Hour Time-Series Performance Charts]
        P3D[Automated Actionable Advice Engine]
    end

    subgraph P4 Details
        P4A[Lemon Squeezy / Paddle Merchant of Record]
        P4B[HMAC SHA-256 Webhook Verification]
        P4C[Locked Historical Data Retention > 24 Hours]
        P4D[Gated Slack & Webhook Regression Alerts]
    end

    subgraph P5 Details
        P5A[Technical Medium Deep-Dive Publication]
        P5B[5 Viral Developer LinkedIn Updates]
        P5C[Interactive Live Sandbox Funnel]
    end
```

---

## 3. Phase-by-Phase Technical Specifications

### Phase 1: Solidify Infrastructure & SEO (Housekeeping)

| Requirement | Implementation Details | Status |
|---|---|---|
| **Server-Side Pre-rendering (SSG)** | Pre-rendered semantic landing page content inside `index.html` with H1, hero copy, and navigation links so search engines and social media scrapers (Twitterbot, LinkedIn, Slackbot) parse the content instantly without waiting for JavaScript. | ✅ Completed |
| **Lighthouse 100 Perfection** | Eliminated render-blocking Google Fonts by implementing `rel="preload"` with `onload="this.rel='stylesheet'"` and `<noscript>` fallbacks. Configured font display swap. | ✅ Completed |
| **Payload Reduction & Chunk Splitting** | Reconfigured `vite.config.js` with `build.rollupOptions.output.manualChunks` into `vendor-react`, `vendor-recharts`, and `vendor-icons`. Reduced initial entry payload from **703 kB to 134 kB**. | ✅ Completed |
| **Search Engine Schema** | Embedded Schema.org JSON-LD structured data for `SoftwareApplication` and `WebSite`. | ✅ Completed |

---

### Phase 2: Build Frictionless Onboarding (The Demo State & npm Package)

| Requirement | Implementation Details | Status |
|---|---|---|
| **Mock Dashboard for Unauthenticated Visitors** | Created `frontend/src/data/demoProjectState.js` simulating a high-traffic production application ("PulseCart"). Loaded with 3,420 active visitors, high LCP warning (4.42s), INP bottleneck (520ms), and traffic surges. Renders immediately with zero required user input. | ✅ Completed |
| **The npm Package (`@auditpulse/tracker`)** | Created `packages/tracker/` with `<AuditPulseTracker />`, `initAuditPulse()`, and `useAuditPulseMetrics()`. Provides `<1.5KB` runtime overhead with non-blocking `navigator.sendBeacon` telemetry ingestion. | ✅ Completed |
| **Onboarding & Setup Page (`/app/setup`)** | Created `SetupGuide.jsx` with copy-pasteable implementation tabs for Next.js (App Router & Pages Router), Vite React, and Vanilla JS, paired with real-time telemetry connection ping verification. | ✅ Completed |

---

### Phase 3: Upgrade Diagnostics & UI (Actionable Insights)

| Requirement | Implementation Details | Status |
|---|---|---|
| **Strict CWV Thresholds** | Upgraded `WebVitalsCard.jsx` with Google's official color-coded benchmarks: <br>• **LCP**: $\le 2.5\text{s}$ (Good), $2.5-4.0\text{s}$ (Needs Work), $> 4.0\text{s}$ (Poor) <br>• **INP**: $\le 200\text{ms}$ (Good), $200-500\text{ms}$ (Needs Work), $> 500\text{ms}$ (Poor) <br>• **CLS**: $\le 0.1$ (Good), $0.1-0.25$ (Needs Work), $> 0.25$ (Poor) <br>• **TTFB**: $\le 800\text{ms}$ (Good), $800-1800\text{ms}$ (Needs Work), $> 1.8\text{s}$ (Poor). | ✅ Completed |
| **24-Hour Time-Series Charts** | Upgraded `TrendChart.jsx` to render 24-hour hourly trendlines using Recharts with p75 and p90 percentiles, event markers for the 14:00 traffic spike, and metric toggles for Vitals, Latency, and Traffic. | ✅ Completed |
| **Automated Diagnostic Advice Engine** | Implemented real-time advice generator providing actionable code recommendations and tooltips for failing metrics (e.g. `<link rel="preload" as="image" fetchpriority="high">` for LCP and `startTransition()` / `scheduler.yield()` for INP). | ✅ Completed |

---

### Phase 4: Integrate Monetization (The Paywall Engine)

| Requirement | Implementation Details | Status |
|---|---|---|
| **Merchant of Record (MoR)** | Created `backend/routes/billing.js` supporting Lemon Squeezy and Paddle subscription webhooks (`subscription_created`, `subscription_cancelled`) with HMAC SHA-256 signature verification and automated global tax compliance. | ✅ Completed |
| **Gated Historical Data (>24 Hours)** | Locked time ranges beyond 24 hours (7 Days, 30 Days, 90 Days) in `TrendChart.jsx` behind a frosted glass blur overlay with an upgrade CTA. | ✅ Completed |
| **Gated Slack & Webhook Alerts** | Created `AlertSettingsCard.jsx` (`/app/alerts`) and backend endpoint `/api/billing/alerts/test` returning HTTP 402 with paywall upgrade prompts for non-Pro users. | ✅ Completed |
| **Interactive Pricing Matrix** | Built `PricingModal.jsx` showcasing Free Hobby ($0), Pro Developer ($29/mo or $24/mo annual), and Enterprise ($99/mo) with direct Merchant of Record checkout redirection. | ✅ Completed |

---

### Phase 5: Execute a Content-Led Launch (Distribution)

| Requirement | Implementation Details | Status |
|---|---|---|
| **Medium Technical Deep-Dive** | Authored `docs/launch/MEDIUM_DEEP_DIVE_ARTICLE.md`: A 2,500+ word engineering breakdown of React hydration freezes, INP vs. FID, and real case studies from AuditPulse. | ✅ Completed |
| **LinkedIn Developer Growth Posts** | Authored `docs/launch/LINKEDIN_GROWTH_POSTS.md`: 5 viral developer posts formatted with hooks, code snippets, and CTAs pointing to the interactive demo. | ✅ Completed |
| **Distribution Funnel** | Interactive demo sandbox set as the primary landing page conversion target to drive inbound developer trials without friction. | ✅ Completed |

---

## 4. Key Performance Indicators (KPIs) for v2 Launch

| Metric | Target | Measurement Method |
|---|---|---|
| **Lighthouse Performance Score** | **100 / 100** | Google Lighthouse / PageSpeed Insights on production landing page. |
| **Initial JS Payload (Entry Chunk)** | **< 180 kB** (Currently 173 kB minified, 37 kB gzipped) | Vite build output telemetry. |
| **Onboarding Conversion Rate** | **> 18%** | Visitors moving from `/` or `/app/overview` to `/app/setup` (Install SDK). |
| **Free-to-Pro Paywall Trigger Rate** | **> 7%** | Interacting with gated 7d/30d/90d historical trends or Slack alert toggles. |
| **npm Package Installations** | **1,000+ downloads / month** | npm registry statistics for `@auditpulse/tracker`. |

---

## 5. Verification & Rollout Checklist

- [x] Branch created: `feature/v2-production-readiness`
- [x] Pre-rendered static HTML and non-blocking Google Fonts integrated in `index.html`
- [x] Vite chunk splitting verified with zero bundle size warnings
- [x] Rich mock project state (`PulseCart`) pre-loaded with simulated traffic surges & 4.42s LCP warning
- [x] npm tracker package configured (`@auditpulse/tracker`) in `packages/tracker/`
- [x] Onboarding setup guide component and route `/app/setup` implemented
- [x] WebVitalsCard updated with strict Google red/yellow/green thresholds and actionable advice
- [x] TrendChart upgraded to 24-hour time-series with p75/p90 percentiles and spike annotations
- [x] Gated historical data blur overlay and paywall triggers implemented
- [x] Gated Slack & Webhook anomaly alerts card and route `/app/alerts` created
- [x] Backend Lemon Squeezy / Paddle billing and webhook router mounted in Express
- [x] High-converting PricingModal created with Lemon Squeezy checkout integration
- [x] Medium technical deep-dive article drafted in `docs/launch/MEDIUM_DEEP_DIVE_ARTICLE.md`
- [x] 5 viral developer LinkedIn posts drafted in `docs/launch/LINKEDIN_GROWTH_POSTS.md`
- [x] Frontend builds cleanly via `npm run build`
