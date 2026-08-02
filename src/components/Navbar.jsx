import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, Plus, AlertTriangle, CheckCircle, Clock, X, FileText, ShieldAlert } from 'lucide-react';

export const Navbar = ({ 
  activeTab, 
  searchTerm, 
  setSearchTerm, 
  onOpenAddTenant, 
  theme, 
  setTheme,
  urgentAlerts = []
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Tenant Management Dashboard';
      case 'tenants': return 'Tenants Directory & ID Proofs';
      case 'tenant-detail': return 'Tenant Record & Agreement History';
      case 'properties': return 'Property & Room Roster';
      case 'payments': return 'Monthly Rent Collection Manager';
      case 'maintenance': return 'Maintenance Hub';
      case 'reports': return 'Financial Reports & Exports';
      default: return 'Dashboard';
    }
  };

  return (
    <header style={{
      height: '70px',
      padding: '0 2rem',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--bg-surface)',
      position: 'sticky',
      top: 0,
      zIndex: 9
    }}>
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{getTitle()}</h2>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Home Tenant System • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Center Search Input */}
      <div style={{ width: '320px', position: 'relative' }}>
        <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          className="form-input"
          id="global-search-input"
          placeholder="Search tenant name, room #, phone, Aadhar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '38px', height: '40px', borderRadius: '20px', fontSize: '0.825rem' }}
        />
        {searchTerm && (
          <X 
            size={14} 
            color="var(--text-muted)" 
            onClick={() => setSearchTerm('')}
            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
          />
        )}
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Add Tenant Action */}
        <button 
          onClick={onOpenAddTenant}
          className="btn btn-primary btn-sm" 
          id="navbar-add-tenant-btn"
          style={{ borderRadius: '20px', gap: '0.4rem', boxShadow: '0 4px 14px var(--accent-glow)' }}
        >
          <Plus size={16} /> Add Tenant
        </button>

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="btn btn-secondary btn-sm"
          id="theme-toggle-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {/* Notifications Popup Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn btn-secondary btn-sm"
            id="notifications-bell-btn"
            style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%', position: 'relative' }}
          >
            <Bell size={18} color="var(--text-primary)" />
            {urgentAlerts.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '18px',
                height: '18px',
                background: 'var(--accent-danger)',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: '800',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-surface)'
              }}>
                {urgentAlerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="animate-fade-in" style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '340px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color-hover)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '1rem',
              zIndex: 50
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: '800', fontSize: '0.9rem' }}>System Alerts & Notifications</div>
                <span className="badge badge-danger">{urgentAlerts.length} Critical</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '280px', overflowY: 'auto' }}>
                {urgentAlerts.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                    <CheckCircle size={24} color="var(--accent-success)" style={{ display: 'block', margin: '0 auto 0.5rem' }} />
                    No pending rent or expiring agreements within 7 days!
                  </div>
                ) : (
                  urgentAlerts.map((alert, idx) => (
                    <div key={idx} style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      background: alert.type === 'overdue' ? 'var(--accent-danger-bg)' : 'var(--accent-warning-bg)',
                      border: `1px solid ${alert.type === 'overdue' ? 'rgba(244,63,94,0.4)' : 'rgba(245,158,11,0.4)'}`,
                      fontSize: '0.775rem'
                    }}>
                      <div style={{ fontWeight: '800', color: alert.type === 'overdue' ? 'var(--accent-danger)' : 'var(--accent-warning)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {alert.type === 'overdue' ? <ShieldAlert size={14} /> : <FileText size={14} />}
                        {alert.title}
                      </div>
                      <div style={{ color: 'var(--text-primary)', marginTop: '2px', fontWeight: '500' }}>{alert.message}</div>
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
