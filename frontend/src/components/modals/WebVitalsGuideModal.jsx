import React from 'react';
import { X, Gauge, Clock, Layers, Cpu, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function WebVitalsGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '720px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '30px',
        background: '#ffffff',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', pb: '16px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={22} color="var(--accent-indigo)" />
              Google Core Web Vitals & SPA Indexability Guide
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Understanding performance benchmarks and client-side JavaScript rendering for search engines
            </p>
          </div>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Guide Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '14px', color: '#334155' }}>
          {/* LCP */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
              <Clock size={18} color="var(--accent-indigo)" />
              1. Largest Contentful Paint (LCP) — Recommended: &le; 2.5s
            </div>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
              LCP measures when the main hero element or primary text block becomes visible to users. Google uses LCP as a direct ranking factor. For Single Page Apps, slow component mounting or unoptimized images delay LCP.
            </p>
          </div>

          {/* TTFB */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
              <Gauge size={18} color="var(--accent-cyan)" />
              2. Time to First Byte (TTFB) — Recommended: &le; 800ms
            </div>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
              TTFB measures the duration between the browser requesting a URL and receiving the first byte of data from the server. Use edge CDNs, server caching, or static pre-rendering to optimize TTFB.
            </p>
          </div>

          {/* TTI */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
              <Cpu size={18} color="var(--accent-purple)" />
              3. Time to Interactive & SPA DOM Hydration (TTI) — Recommended: &le; 3.8s
            </div>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
              In React/Vue SPAs, the browser downloads JavaScript bundles and executes React's `hydrateRoot` or `createRoot` to render dynamic SEO meta tags. TTI measures when the page becomes fully interactive.
            </p>
          </div>

          {/* CLS */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
              <Layers size={18} color="var(--accent-pink)" />
              4. Cumulative Layout Shift (CLS) — Recommended: &le; 0.1
            </div>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
              CLS measures visual stability. Layout shifts occur when dynamic components or un-sized images suddenly load and push visible content down.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={onClose}>
            Got it, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
