import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, CheckCircle, X, FileText, ShieldAlert, Menu, Building2 } from 'lucide-react';

export const Navbar = ({ 
  activeTab, 
  searchTerm, 
  setSearchTerm, 
  theme, 
  setTheme,
  urgentAlerts = [],
  onToggleMobileMenu
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Portfolio Overview';
      case 'tenants': return 'Tenants Directory';
      case 'tenant-detail': return 'Tenant Record';
      case 'properties': return 'Properties & Units';
      case 'payments': return 'Rent Collection';
      case 'maintenance': return 'Maintenance Hub';
      case 'reports': return 'Financial Reports';
      default: return 'Overview';
    }
  };

  return (
    <header style={{
      height: '56px',
      padding: '0 1.25rem',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--bg-surface)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      gap: '0.75rem'
    }}>
      {/* Title & Brand Logo & Mobile Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
        {onToggleMobileMenu && (
          <button 
            type="button"
            onClick={onToggleMobileMenu}
            className="btn btn-secondary btn-sm mobile-menu-toggle"
            style={{ width: '32px', height: '32px', padding: 0, flexShrink: 0 }}
            aria-label="Open navigation menu"
          >
            <Menu size={17} />
          </button>
        )}

        {/* Mobile Brand Logo Display */}
        <div className="show-mobile" style={{ alignItems: 'center', gap: '0.55rem', minWidth: 0 }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 1px 3px rgba(37, 99, 235, 0.35)'
          }}>
            <Building2 size={16} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, lineHeight: 1.15 }}>
            <span style={{ 
              fontWeight: '700', 
              fontSize: '0.875rem', 
              letterSpacing: '-0.02em', 
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap'
            }}>
              EstatePulse
            </span>
            <span style={{ 
              fontSize: '0.625rem', 
              color: 'var(--text-muted)', 
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {getTitle()}
            </span>
          </div>
        </div>

        {/* Desktop View Title Header */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: '600', letterSpacing: '-0.01em', color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.25 }}>
            {getTitle()}
          </h2>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', lineHeight: 1.25 }}>
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="header-search-container" style={{ width: '240px', position: 'relative' }}>
        <Search 
          size={14} 
          color="var(--text-muted)" 
          style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} 
        />
        <input
          type="text"
          className="form-input"
          id="global-search-input"
          placeholder="Filter by name, unit, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            paddingLeft: '32px',
            paddingRight: searchTerm ? '28px' : '10px',
            height: '32px',
            fontSize: '0.775rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-input)'
          }}
        />
        {searchTerm && (
          <X 
            size={13} 
            color="var(--text-muted)" 
            onClick={() => setSearchTerm('')}
            style={{ position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
          />
        )}
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        {/* Dark/Light Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="btn btn-secondary btn-sm"
          id="theme-toggle-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          style={{ width: '32px', height: '32px', padding: 0, borderRadius: 'var(--radius-sm)' }}
        >
          {theme === 'dark' ? <Sun size={15} color="var(--status-warning)" /> : <Moon size={15} color="var(--text-secondary)" />}
        </button>

        {/* Notifications Popup Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn btn-secondary btn-sm"
            id="notifications-bell-btn"
            style={{ width: '32px', height: '32px', padding: 0, borderRadius: 'var(--radius-sm)', position: 'relative' }}
          >
            <Bell size={15} color="var(--text-secondary)" />
            {urgentAlerts.length > 0 && (
              <span 
                className="tabular-nums"
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '15px',
                  height: '15px',
                  background: 'var(--status-danger)',
                  color: '#FFFFFF',
                  fontSize: '0.625rem',
                  fontWeight: '700',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid var(--bg-surface)'
                }}
              >
                {urgentAlerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="animate-fade-in" style={{
              position: 'absolute',
              right: 0,
              top: '40px',
              width: '320px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '0.85rem',
              zIndex: 100
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontWeight: '600', fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                  Actionable Alerts
                </span>
                <span className="badge badge-danger tabular-nums">
                  {urgentAlerts.length} Critical
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '260px', overflowY: 'auto' }}>
                {urgentAlerts.length === 0 ? (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                    <CheckCircle size={20} color="var(--status-success)" style={{ display: 'block', margin: '0 auto 0.4rem' }} />
                    All rent records and lease agreements are up to date.
                  </div>
                ) : (
                  urgentAlerts.map((alert, idx) => (
                    <div key={idx} style={{
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      background: alert.type === 'overdue' ? 'var(--status-danger-bg)' : 'var(--status-warning-bg)',
                      border: `1px solid ${alert.type === 'overdue' ? 'var(--status-danger-border)' : 'var(--status-warning-border)'}`,
                      fontSize: '0.75rem'
                    }}>
                      <div style={{ 
                        fontWeight: '600', 
                        color: alert.type === 'overdue' ? 'var(--status-danger)' : 'var(--status-warning)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px' 
                      }}>
                        {alert.type === 'overdue' ? <ShieldAlert size={13} /> : <FileText size={13} />}
                        {alert.title}
                      </div>
                      <div style={{ color: 'var(--text-primary)', marginTop: '2px', fontSize: '0.725rem' }}>
                        {alert.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
