import React, { useState } from 'react';
import { Share2, Twitter, Facebook, Image as ImageIcon, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SocialPreview({ ogTags = {}, twitterTags = {}, title = '', description = '', url = '' }) {
  const [platform, setPlatform] = useState('twitter'); // 'twitter' | 'facebook'

  const ogTitle = ogTags['og:title'] || title || 'No og:title specified';
  const ogDesc = ogTags['og:description'] || description || 'No og:description specified';
  const ogImg = ogTags['og:image'] || twitterTags['twitter:image'] || '';

  const twTitle = twitterTags['twitter:title'] || ogTitle;
  const twDesc = twitterTags['twitter:description'] || ogDesc;
  const twImg = twitterTags['twitter:image'] || ogImg;

  let domain = 'example.com';
  try {
    if (url) domain = new URL(url).hostname;
  } catch (e) {}

  const hasOgTitle = !!ogTags['og:title'];
  const hasOgDesc = !!ogTags['og:description'];
  const hasOgImage = !!ogTags['og:image'];
  const isOgComplete = hasOgTitle && hasOgDesc && hasOgImage;

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Share2 size={20} color="var(--accent-purple)" />
              Social Media Card Live Simulation
            </h3>
            {isOgComplete ? (
              <span className="badge badge-good">✓ Complete OpenGraph Coverage</span>
            ) : (
              <span className="badge badge-warn">⚠️ Partial OpenGraph Tags</span>
            )}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Real-time interactive preview of rendered OpenGraph and Twitter cards
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn-secondary ${platform === 'twitter' ? 'active' : ''}`}
            onClick={() => setPlatform('twitter')}
          >
            <Twitter size={14} /> Twitter / X
          </button>
          <button
            className={`btn-secondary ${platform === 'facebook' ? 'active' : ''}`}
            onClick={() => setPlatform('facebook')}
          >
            <Facebook size={14} /> Open Graph (FB/LinkedIn)
          </button>
        </div>
      </div>

      {/* Social Tag Coverage Checklist */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasOgTitle ? 'var(--status-good)' : 'var(--text-muted)' }}>
          {hasOgTitle ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />} og:title
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasOgDesc ? 'var(--status-good)' : 'var(--text-muted)' }}>
          {hasOgDesc ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />} og:description
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: hasOgImage ? 'var(--status-good)' : 'var(--text-muted)' }}>
          {hasOgImage ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />} og:image
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: twitterTags['twitter:card'] ? 'var(--status-good)' : 'var(--text-muted)' }}>
          {twitterTags['twitter:card'] ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />} twitter:card
        </div>
      </div>

      {/* Card Rendering Area */}
      {platform === 'twitter' ? (
        /* Twitter Card Preview */
        <div style={{
          maxWidth: '520px',
          margin: '0 auto',
          borderRadius: '16px',
          border: '1px solid #cbd5e1',
          background: '#ffffff',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            height: '240px',
            background: twImg ? `url(${twImg}) center/cover no-repeat` : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {!twImg && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <ImageIcon size={36} style={{ opacity: 0.5 }} />
                <div style={{ fontSize: '12px', marginTop: '4px' }}>No og:image / twitter:image tag specified</div>
              </div>
            )}
          </div>

          <div style={{ padding: '14px 16px', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{domain}</div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px', lineHeight: 1.3 }}>
              {twTitle}
            </div>
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {twDesc}
            </div>
          </div>
        </div>
      ) : (
        /* OpenGraph (Facebook/LinkedIn) Preview */
        <div style={{
          maxWidth: '520px',
          margin: '0 auto',
          borderRadius: '10px',
          border: '1px solid #cbd5e1',
          background: '#ffffff',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            height: '240px',
            background: ogImg ? `url(${ogImg}) center/cover no-repeat` : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {!ogImg && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <ImageIcon size={36} style={{ opacity: 0.5 }} />
                <div style={{ fontSize: '12px', marginTop: '4px' }}>No og:image tag rendered</div>
              </div>
            )}
          </div>

          <div style={{ padding: '14px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {domain}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginTop: '2px', lineHeight: 1.3 }}>
              {ogTitle}
            </div>
            <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {ogDesc}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
