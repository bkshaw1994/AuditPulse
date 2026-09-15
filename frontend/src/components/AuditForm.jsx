import React, { useState } from 'react';
import { Search, Loader2, Play, Sparkles, CheckCircle2, Cpu } from 'lucide-react';

export default function AuditForm({ onAuditTrigger, isLoading, error }) {
  const [url, setUrl] = useState('https://react.dev');
  const [stepIndex, setStepIndex] = useState(0);

  const presets = [
    { label: 'React Docs', url: 'https://react.dev' },
    { label: 'ViteJS', url: 'https://vitejs.dev' },
    { label: 'Next.js', url: 'https://nextjs.org' }
  ];

  const auditSteps = [
    'Launching Headless Chrome Scraper...',
    'Navigating & Waiting for SPA DOM Hydration...',
    'Extracting Dynamically Injected Meta Tags...',
    'Injecting PerformanceObserver for Core Web Vitals...',
    'Evaluating SEO Rules & Computing Health Score...'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;

    setStepIndex(0);
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < auditSteps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1800);

    onAuditTrigger(url.trim()).finally(() => {
      clearInterval(interval);
    });
  };

  return (
    <div className="glass-panel" style={{ padding: '26px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '320px',
        height: '100%',
        background: 'radial-gradient(circle at 100% 0%, rgba(79, 70, 229, 0.05), transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '19px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="var(--accent-indigo)" />
          Audit SPA SEO & Core Web Vitals
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Enter any Single Page Application URL. Puppeteer will execute client JS, wait for DOM hydration, and extract dynamic metadata.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="glass-input"
              style={{ width: '100%', paddingLeft: '46px', background: '#f8fafc', borderColor: '#e2e8f0', color: '#0f172a' }}
              placeholder="e.g. https://my-react-app.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={18} className="spinner" />
                Auditing SPA...
              </>
            ) : (
              <>
                <Play size={18} />
                Run Full Audit
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Try presets:</span>
        {presets.map((preset) => (
          <button
            key={preset.url}
            type="button"
            className={`btn-secondary ${url === preset.url ? 'active' : ''}`}
            onClick={() => setUrl(preset.url)}
            disabled={isLoading}
            style={{ fontSize: '12px', padding: '5px 12px' }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Progress Status Bar */}
      {isLoading && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          borderRadius: '12px',
          background: '#f8fafc',
          border: '1px solid #c7d2fe'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#3730a3', fontWeight: 600 }}>
              <Cpu size={16} className="spinner" color="#4f46e5" />
              <span>{auditSteps[stepIndex]}</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Step {stepIndex + 1} of {auditSteps.length}</span>
          </div>

          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${((stepIndex + 1) / auditSteps.length) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #4f46e5, #0284c7)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          borderRadius: '10px',
          background: 'var(--status-poor-bg)',
          border: '1px solid var(--status-poor-border)',
          color: 'var(--status-poor)',
          fontSize: '13px'
        }}>
          ⚠️ Audit Error: {error}
        </div>
      )}
    </div>
  );
}
