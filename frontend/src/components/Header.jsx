import React from 'react';
import { Zap } from 'lucide-react';

export default function Header({ siteCount, isConnected }) {
  return (
    <header style={{
      borderBottom: '1px solid #e2e8f0',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
    }}>
      <div className="container" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #4f46e5, #0284c7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
          }}>
            <Zap size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '19px', fontWeight: '800', letterSpacing: '-0.5px', color: '#0f172a' }}>
                SPA <span style={{ background: 'linear-gradient(90deg, #0284c7, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AuditPulse</span>
              </h1>
              <span className="badge badge-good" style={{ fontSize: '11px' }}>
                SPA Engine v1.0
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Core Web Vitals & Dynamic SEO Tag Inspector for Single Page Apps
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            fontSize: '13px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isConnected ? 'var(--status-good)' : 'var(--status-warn)',
              boxShadow: isConnected ? '0 0 8px var(--status-good)' : 'none'
            }} />
            <span style={{ color: isConnected ? '#0f172a' : 'var(--text-muted)', fontWeight: 500 }}>
              {isConnected ? 'API Online' : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
