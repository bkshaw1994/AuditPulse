import React from 'react';
import { Code, CheckCircle2, AlertCircle } from 'lucide-react';

export default function StructuredDataViewer({ structuredData = [] }) {
  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code size={20} color="var(--accent-cyan)" />
            Schema.org Structured Data (JSON-LD)
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Dynamically injected JSON-LD scripts parsed from rendered DOM ({structuredData.length} schema blocks found)
          </p>
        </div>
      </div>

      {structuredData.length === 0 ? (
        <div style={{
          padding: '24px',
          borderRadius: '12px',
          background: '#f8fafc',
          border: '1px dashed #cbd5e1',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '14px'
        }}>
          ⚠️ No JSON-LD &lt;script type="application/ld+json"&gt; tags found on this SPA page.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {structuredData.map((data, idx) => (
            <div key={idx} style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#4f46e5', fontWeight: 600, marginBottom: '8px' }}>
                Schema Block #{idx + 1} ({data['@type'] || 'StructuredData'})
              </div>
              <pre className="mono" style={{ fontSize: '13px', color: '#0f172a', background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', overflowX: 'auto', margin: 0, lineHeight: 1.4 }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
