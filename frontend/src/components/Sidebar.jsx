import React from 'react';
import {
  LayoutDashboard,
  Zap,
  Tag,
  Share2,
  TrendingUp,
  GitCompare,
  Code,
  AlertCircle,
  Sparkles,
  HelpCircle,
  Globe,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, issuesCount = 0, schemaCount = 0, onOpenGuide }) {
  const menuItems = [
    { id: 'overview', label: 'Overview & Vitals', icon: LayoutDashboard },
    { id: 'vitals', label: 'Core Web Vitals', icon: Zap },
    { id: 'metatags', label: 'Dynamic Meta Tags', icon: Tag },
    { id: 'social', label: 'Social Preview', icon: Share2 },
    { id: 'trends', label: 'Historical Analytics', icon: TrendingUp },
    { id: 'diff', label: 'Audit Diff Tool', icon: GitCompare },
    { id: 'schema', label: 'JSON-LD Schema', icon: Code, badge: schemaCount > 0 ? schemaCount : null },
    { id: 'diagnostics', label: 'Diagnostics & Fixes', icon: AlertCircle, badge: issuesCount > 0 ? issuesCount : null, badgeColor: issuesCount > 0 ? '#e11d48' : null }
  ];

  return (
    <aside style={{
      width: '260px',
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '1px 0 3px 0 rgba(0, 0, 0, 0.02)'
    }}>
      {/* Brand Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #4f46e5, #0284c7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
        }}>
          <Zap size={20} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
            SPA <span style={{ background: 'linear-gradient(90deg, #0284c7, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AuditPulse</span>
          </h1>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
            SPA SEO Monitoring System
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '8px 12px 4px 12px' }}>
          Navigation
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? '#e0e7ff' : 'transparent',
                color: isActive ? '#3730a3' : '#475569',
                fontWeight: isActive ? 600 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={17} color={isActive ? '#4f46e5' : '#64748b'} />
                <span>{item.label}</span>
              </div>

              {item.badge ? (
                <span style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  background: item.badgeColor ? '#fff1f2' : '#f1f5f9',
                  color: item.badgeColor ? '#e11d48' : '#475569',
                  border: `1px solid ${item.badgeColor ? '#fecdd3' : '#cbd5e1'}`
                }}>
                  {item.badge}
                </span>
              ) : (
                isActive && <ChevronRight size={14} color="#4f46e5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer Help Card */}
      <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0' }}>
        <div style={{
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '14px',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <HelpCircle size={22} color="#4f46e5" style={{ margin: '0 auto 6px auto', display: 'block' }} />
          <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Core Web Vitals Guide</h4>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', marginBottom: '10px' }}>
            Learn Google thresholds for LCP, TTFB & TTI
          </p>
          <button
            className="btn-primary"
            onClick={onOpenGuide}
            style={{ fontSize: '11px', padding: '6px 12px', width: '100%', justifyContent: 'center' }}
          >
            Open Guide
          </button>
        </div>
      </div>
    </aside>
  );
}
