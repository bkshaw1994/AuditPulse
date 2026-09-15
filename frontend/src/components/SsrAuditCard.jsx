import React from 'react';
import { Server, Monitor, CheckCircle2, AlertTriangle, ShieldAlert, Cpu, Sparkles, FileCode } from 'lucide-react';

export default function SsrAuditCard({ renderingType = 'CSR', ssrMeta = {}, seoMeta = {} }) {
  const isSsr = renderingType === 'SSR/SSG' || renderingType === 'HYBRID';
  const hasRawTitle = ssrMeta.hasRawTitle;
  const hasRawDesc = ssrMeta.hasRawDescription;
  const hasRawOg = ssrMeta.hasRawOg;

  const isSocialBotReady = hasRawOg || (hasRawTitle && hasRawDesc);

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={20} color="var(--accent-indigo)" />
              SSR vs CSR Rendering Architecture & Bot Indexability Audit
            </h3>
            <span className={`badge ${isSsr ? 'badge-good' : 'badge-warn'}`}>
              Rendering: {renderingType}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Compares un-hydrated raw HTTP server response against final client-side React DOM execution
          </p>
        </div>

        {isSocialBotReady ? (
          <span className="badge badge-good">✓ Social Media Bots Ready</span>
        ) : (
          <span className="badge badge-poor">⚠️ Non-JS Social Bots Will See Missing Tags</span>
        )}
      </div>

      {/* Rendering Type Explanation Strip */}
      <div style={{
        padding: '16px',
        borderRadius: '12px',
        background: isSsr ? '#ecfdf5' : '#fffbeb',
        border: `1px solid ${isSsr ? '#a7f3d0' : '#fde68a'}`,
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        {isSsr ? <CheckCircle2 size={20} color="#059669" style={{ marginTop: '2px' }} /> : <AlertTriangle size={20} color="#d97706" style={{ marginTop: '2px' }} />}
        <div style={{ flex: 1, fontSize: '13px', color: isSsr ? '#065f46' : '#92400e', lineHeight: 1.5 }}>
          <strong>Architecture Mode: {renderingType}</strong> — {isSsr ? (
            'SEO tags are pre-rendered directly into the initial HTTP HTML document. Both Googlebot and non-JavaScript social bots (Twitter, Facebook, LinkedIn) can parse page metadata instantly.'
          ) : (
            'SEO tags are injected dynamically after client-side React JS bundle hydration. While Googlebot executes JS, social media share bots (Twitter, LinkedIn, Slack) do NOT run JS and may display blank link previews.'
          )}
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Raw Server HTTP HTML Column */}
        <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Server size={16} color="#4f46e5" />
            Initial Server HTTP HTML (Raw Un-hydrated)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Raw Title (&lt;title&gt;)</div>
              <div className="mono" style={{ color: ssrMeta.rawTitle ? '#0f172a' : '#e11d48', fontWeight: 600, marginTop: '2px' }}>
                {ssrMeta.rawTitle || '[MISSING IN INITIAL HTTP HTML]'}
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Raw Meta Description</div>
              <div style={{ color: ssrMeta.rawDescription ? '#334155' : '#e11d48', marginTop: '2px' }}>
                {ssrMeta.rawDescription || '[MISSING IN INITIAL HTTP HTML]'}
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Raw OpenGraph Title</div>
              <div style={{ color: ssrMeta.rawOgTitle ? '#059669' : '#d97706', marginTop: '2px' }}>
                {ssrMeta.rawOgTitle || '[NOT PRE-RENDERED ON SERVER]'}
              </div>
            </div>
          </div>
        </div>

        {/* Hydrated Client DOM Column */}
        <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Monitor size={16} color="#0284c7" />
            Hydrated Client DOM (Post JS Execution)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Rendered Title</div>
              <div className="mono" style={{ color: seoMeta.title ? '#0f172a' : '#e11d48', fontWeight: 600, marginTop: '2px' }}>
                {seoMeta.title || '[MISSING IN RENDERED DOM]'}
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Rendered Description</div>
              <div style={{ color: seoMeta.description ? '#334155' : '#e11d48', marginTop: '2px' }}>
                {seoMeta.description || '[MISSING IN RENDERED DOM]'}
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Rendered OpenGraph Title</div>
              <div style={{ color: seoMeta.ogTags?.['og:title'] ? '#059669' : '#d97706', marginTop: '2px' }}>
                {seoMeta.ogTags?.['og:title'] || '[NOT FOUND IN DOM]'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
