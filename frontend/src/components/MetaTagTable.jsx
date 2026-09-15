import React, { useState } from 'react';
import { Tag, CheckCircle2, AlertTriangle, XCircle, Copy, Check, Heading, Image as ImageIcon, Globe, FileText } from 'lucide-react';

export default function MetaTagTable({ seoMeta = {}, issues = [] }) {
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const titleLen = seoMeta.titleLength || 0;
  const isTitleOk = seoMeta.title && titleLen >= 30 && titleLen <= 60;
  const isTitleWarn = seoMeta.title && (titleLen < 30 || titleLen > 60);

  const descLen = seoMeta.descriptionLength || 0;
  const isDescOk = seoMeta.description && descLen >= 70 && descLen <= 160;
  const isDescWarn = seoMeta.description && (descLen < 70 || descLen > 160);

  const hasH1 = seoMeta.headings?.h1 && seoMeta.headings.h1.length === 1;

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag size={20} color="var(--accent-indigo)" />
            Dynamically Extracted SPA Meta Tags
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Extracted from client-side DOM execution after React / Vue component mount
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className={`badge ${isTitleOk && isDescOk ? 'badge-good' : 'badge-warn'}`}>
            {isTitleOk && isDescOk ? '✓ All Core Meta Tags Optimal' : '⚠️ Minor Tag Adjustments Recommended'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        {/* Title Tag Card */}
        <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#3730a3', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={15} color="var(--accent-indigo)" />
                Page Title Tag (&lt;title&gt;)
              </span>
              {isTitleOk ? (
                <span className="badge badge-good">Optimal ({titleLen} chars)</span>
              ) : isTitleWarn ? (
                <span className="badge badge-warn">{titleLen} chars (Rec: 30-60)</span>
              ) : (
                <span className="badge badge-poor">Missing Tag</span>
              )}
            </div>
            <div className="mono" style={{ fontSize: '14px', color: seoMeta.title ? '#0f172a' : 'var(--status-poor)', background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', wordBreak: 'break-word', lineHeight: 1.4 }}>
              {seoMeta.title || '[NO DYNAMIC TITLE TAG RENDERED]'}
            </div>
          </div>
          {seoMeta.title && (
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" style={{ fontSize: '11px', padding: '4px 8px' }} onClick={() => copyToClipboard(seoMeta.title, 'title')}>
                {copiedKey === 'title' ? <Check size={12} color="var(--status-good)" /> : <Copy size={12} />}
                {copiedKey === 'title' ? 'Copied' : 'Copy Title'}
              </button>
            </div>
          )}
        </div>

        {/* Description Tag Card */}
        <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#3730a3', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={15} color="var(--accent-cyan)" />
                Meta Description (&lt;meta name="description"&gt;)
              </span>
              {isDescOk ? (
                <span className="badge badge-good">Optimal ({descLen} chars)</span>
              ) : isDescWarn ? (
                <span className="badge badge-warn">{descLen} chars (Rec: 70-160)</span>
              ) : (
                <span className="badge badge-poor">Missing Tag</span>
              )}
            </div>
            <div style={{ fontSize: '13px', color: seoMeta.description ? '#334155' : 'var(--status-poor)', background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', wordBreak: 'break-word', lineHeight: 1.4 }}>
              {seoMeta.description || '[NO DYNAMIC META DESCRIPTION RENDERED]'}
            </div>
          </div>
          {seoMeta.description && (
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" style={{ fontSize: '11px', padding: '4px 8px' }} onClick={() => copyToClipboard(seoMeta.description, 'desc')}>
                {copiedKey === 'desc' ? <Check size={12} color="var(--status-good)" /> : <Copy size={12} />}
                {copiedKey === 'desc' ? 'Copied' : 'Copy Description'}
              </button>
            </div>
          )}
        </div>

        {/* Canonical Link Card */}
        <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#3730a3', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={15} color="var(--accent-purple)" />
              Canonical Link Tag (&lt;link rel="canonical"&gt;)
            </span>
            {seoMeta.canonical ? (
              <span className="badge badge-good">Present</span>
            ) : (
              <span className="badge badge-warn">Recommended</span>
            )}
          </div>
          <div className="mono" style={{ fontSize: '13px', color: seoMeta.canonical ? 'var(--accent-cyan)' : 'var(--status-warn)', background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', wordBreak: 'break-all' }}>
            {seoMeta.canonical || '[NO CANONICAL SPECIFIED]'}
          </div>
        </div>

        {/* Headings Structure Card */}
        <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#3730a3', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Heading size={15} color="var(--accent-emerald)" />
              Headings Hierarchy & Alt Audit
            </span>
            <span className={`badge ${hasH1 ? 'badge-good' : 'badge-warn'}`}>
              {hasH1 ? 'H1 Tag Optimal' : 'Check H1 Structure'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'center', fontSize: '12px' }}>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>H1 Count</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: hasH1 ? 'var(--status-good)' : 'var(--status-warn)' }}>
                {seoMeta.headings?.h1?.length || 0}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>H2 Count</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
                {seoMeta.headings?.h2Count || 0}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Missing Alt</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: seoMeta.imagesMissingAlt > 0 ? 'var(--status-warn)' : 'var(--status-good)' }}>
                {seoMeta.imagesMissingAlt || 0}
              </div>
            </div>
          </div>
          {seoMeta.headings?.h1 && seoMeta.headings.h1.length > 0 && (
            <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              Primary H1: "<strong style={{ color: '#0f172a' }}>{seoMeta.headings.h1[0]}</strong>"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
