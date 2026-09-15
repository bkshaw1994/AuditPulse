import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[React Error Boundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          color: '#0f172a',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ padding: '40px', maxWidth: '480px', textAlign: 'center' }}>
            <AlertTriangle size={48} color="#e11d48" style={{ margin: '0 auto 16px auto', display: 'block' }} />
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Something went wrong</h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
              An unexpected error occurred in the UI. Click reload to refresh the dashboard.
            </p>
            <button
              className="btn-primary"
              onClick={() => window.location.reload()}
              style={{ margin: '0 auto' }}
            >
              <RefreshCw size={16} /> Reload Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
