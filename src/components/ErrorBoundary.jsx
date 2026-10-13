import React from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('EstatePulse Uncaught Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetStorage = () => {
    try {
      localStorage.removeItem('estatepulse_tenants');
      localStorage.removeItem('estatepulse_payments');
      localStorage.removeItem('estatepulse_properties');
      localStorage.removeItem('estatepulse_theme');
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0D1117',
          color: '#F1F5F9',
          fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
          padding: '1.5rem'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: '#161B22',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'rgba(248, 113, 113, 0.15)',
                border: '1px solid rgba(248, 113, 113, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F87171'
              }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, color: '#F1F5F9' }}>
                  EstatePulse UI Recovery
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>
                  A component error was safely caught.
                </p>
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              padding: '0.85rem',
              marginBottom: '1.25rem',
              fontSize: '0.8rem',
              color: '#F87171',
              fontFamily: 'monospace',
              wordBreak: 'break-word',
              maxHeight: '120px',
              overflowY: 'auto'
            }}>
              {this.state.error?.toString() || 'Unknown UI render exception'}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem 1rem',
                  background: '#3B82F6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={15} /> Reload Application
              </button>
              <button
                onClick={this.handleResetStorage}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem 1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#94A3B8',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={15} /> Reset Local Cache & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
