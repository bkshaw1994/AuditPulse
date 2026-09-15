import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, ChevronDown, ChevronUp, Code, Copy, Check, Lightbulb } from 'lucide-react';

export default function IssuesList({ issues = [] }) {
  const [severityFilter, setSeverityFilter] = useState('all');
  const [expandedIndices, setExpandedIndices] = useState({});
  const [copiedIndex, setCopiedIndex] = useState(null);

  const toggleExpand = (idx) => {
    setExpandedIndices(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const copySnippet = (text, idx) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredIssues = issues.filter(issue => {
    if (severityFilter === 'all') return true;
    return issue.severity === severityFilter;
  });

  const counts = {
    all: issues.length,
    critical: issues.filter(i => i.severity === 'critical').length,
    warning: issues.filter(i => i.severity === 'warning').length,
    info: issues.filter(i => i.severity === 'info').length
  };

  const getSeverityBadge = (severity) => {
    if (severity === 'critical') return <span className="badge badge-poor">CRITICAL</span>;
    if (severity === 'warning') return <span className="badge badge-warn">WARNING</span>;
    return <span className="badge" style={{ background: '#e0e7ff', color: '#3730a3', border: '1px solid #c7d2fe' }}>INFO</span>;
  };

  const getIcon = (severity) => {
    if (severity === 'critical') return <AlertCircle size={20} color="var(--status-poor)" />;
    if (severity === 'warning') return <AlertTriangle size={20} color="var(--status-warn)" />;
    return <Info size={20} color="var(--accent-indigo)" />;
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={20} color="var(--status-warn)" />
            Audit Diagnostics & Suggested Code Fixes ({issues.length})
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Actionable code fix suggestions tailored for React & Single-Page Application developers
          </p>
        </div>

        {/* Severity Filter Buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className={`btn-secondary ${severityFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSeverityFilter('all')}
            style={{ fontSize: '12px', padding: '5px 12px' }}
          >
            All ({counts.all})
          </button>
          <button
            className={`btn-secondary ${severityFilter === 'critical' ? 'active' : ''}`}
            onClick={() => setSeverityFilter('critical')}
            style={{ fontSize: '12px', padding: '5px 12px', color: counts.critical > 0 ? '#e11d48' : 'inherit' }}
          >
            Critical ({counts.critical})
          </button>
          <button
            className={`btn-secondary ${severityFilter === 'warning' ? 'active' : ''}`}
            onClick={() => setSeverityFilter('warning')}
            style={{ fontSize: '12px', padding: '5px 12px', color: counts.warning > 0 ? '#d97706' : 'inherit' }}
          >
            Warnings ({counts.warning})
          </button>
          <button
            className={`btn-secondary ${severityFilter === 'info' ? 'active' : ''}`}
            onClick={() => setSeverityFilter('info')}
            style={{ fontSize: '12px', padding: '5px 12px' }}
          >
            Info ({counts.info})
          </button>
        </div>
      </div>

      {filteredIssues.length === 0 ? (
        <div style={{
          padding: '24px',
          borderRadius: '12px',
          background: '#f8fafc',
          border: '1px dashed #cbd5e1',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          <CheckCircle2 size={32} color="var(--status-good)" style={{ margin: '0 auto 8px auto', display: 'block' }} />
          <h4 style={{ fontSize: '15px', color: '#0f172a' }}>No issues found for this filter criteria</h4>
          <p style={{ fontSize: '13px' }}>All diagnostic checks passed!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredIssues.map((issue, idx) => {
            const isExpanded = !!expandedIndices[idx];
            return (
              <div
                key={idx}
                style={{
                  padding: '18px',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ marginTop: '2px' }}>{getIcon(issue.severity)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>{issue.title}</span>
                      {getSeverityBadge(issue.severity)}
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        [{issue.category}]
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {issue.description}
                    </p>
                  </div>

                  {/* Toggle Fix Suggestion Button */}
                  <button
                    className="btn-secondary"
                    onClick={() => toggleExpand(idx)}
                    style={{ fontSize: '12px', padding: '6px 12px', background: isExpanded ? '#e0e7ff' : '#ffffff', borderColor: '#c7d2fe', color: '#3730a3', gap: '4px' }}
                  >
                    <Lightbulb size={14} color="#4f46e5" />
                    <span>Suggested Fix</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {/* Suggested Code Fix Accordion */}
                {isExpanded && (
                  <div style={{
                    marginTop: '6px',
                    padding: '16px',
                    borderRadius: '10px',
                    background: '#ffffff',
                    border: '1px solid #c7d2fe',
                    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.06)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#3730a3', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Lightbulb size={16} color="#4f46e5" />
                        Resolution Strategy:
                      </div>
                      {issue.fixSnippet && (
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '11px', padding: '3px 8px' }}
                          onClick={() => copySnippet(issue.fixSnippet, idx)}
                        >
                          {copiedIndex === idx ? <Check size={12} color="var(--status-good)" /> : <Copy size={12} />}
                          {copiedIndex === idx ? 'Copied' : 'Copy Fix Code'}
                        </button>
                      )}
                    </div>

                    <p style={{ fontSize: '13px', color: '#475569', marginBottom: '10px', lineHeight: 1.4 }}>
                      {issue.solution || 'Update component props and metadata header tags to satisfy Google ranking guidelines.'}
                    </p>

                    {issue.fixSnippet && (
                      <pre className="mono" style={{
                        fontSize: '12px',
                        color: '#0f172a',
                        background: '#f8fafc',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        overflowX: 'auto',
                        margin: 0,
                        lineHeight: 1.4
                      }}>
                        {issue.fixSnippet}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
