import React from 'react';
import { Download, Printer, FileSpreadsheet, CheckCircle2, Globe, Activity } from 'lucide-react';

export default function Navbar({ currentAudit, isConnected, onExportJson, onPrintReport, onExportCsv }) {
  return (
    <header style={{
      height: '64px',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 35,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.02)'
    }}>
      {/* Current Target Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {currentAudit ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#059669',
              boxShadow: '0 0 8px #059669'
            }} />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Target:</span>
            <span className="mono" style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
              {currentAudit.url}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>SPA SEO Dashboard</span>
        )}
      </div>

      {/* Action Controls & Health */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {currentAudit && (
          <>
            <button className="btn-secondary" onClick={onExportCsv} style={{ fontSize: '12px', padding: '6px 12px' }}>
              <FileSpreadsheet size={14} color="#059669" /> Export CSV
            </button>
            <button className="btn-secondary" onClick={onExportJson} style={{ fontSize: '12px', padding: '6px 12px' }}>
              <Download size={14} /> Export JSON
            </button>
            <button className="btn-secondary" onClick={onPrintReport} style={{ fontSize: '12px', padding: '6px 12px' }}>
              <Printer size={14} /> Print PDF
            </button>
          </>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 12px',
          borderRadius: '20px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          fontSize: '12px'
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: isConnected ? '#059669' : '#d97706'
          }} />
          <span style={{ color: isConnected ? '#0f172a' : 'var(--text-muted)', fontWeight: 500 }}>
            {isConnected ? 'API Connected' : 'Offline'}
          </span>
        </div>
      </div>
    </header>
  );
}
