import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  CreditCard, 
  Wrench, 
  FileSpreadsheet, 
  LogOut, 
  ChevronRight,
  X
} from 'lucide-react';

export const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  pendingRentCount = 0, 
  openMaintenanceCount = 0,
  isOpen = false,
  onClose
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'tenants', label: 'Tenants Directory', icon: Users },
    { id: 'properties', label: 'Properties & Units', icon: Building2 },
    { 
      id: 'payments', 
      label: 'Rent & Payments', 
      icon: CreditCard,
      badge: pendingRentCount > 0 ? pendingRentCount : null,
      badgeType: 'danger'
    },
    { 
      id: 'maintenance', 
      label: 'Maintenance Hub', 
      icon: Wrench,
      badge: openMaintenanceCount > 0 ? openMaintenanceCount : null,
      badgeType: 'warning'
    },
    { id: 'reports', label: 'Financial Reports', icon: FileSpreadsheet }
  ];

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar-aside ${isOpen ? 'sidebar-open' : ''}`}>
        <div>
          {/* Brand Header */}
          <div style={{
            padding: '1.25rem 1.15rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Building2 size={18} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  EstatePulse
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Portfolio Ledger
                </div>
              </div>
            </div>

            {onClose && (
              <button 
                type="button"
                onClick={onClose}
                className="btn btn-secondary btn-sm show-mobile"
                style={{ width: '28px', height: '28px', padding: 0 }}
                aria-label="Close menu"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Navigation Section */}
          <nav style={{ padding: '1rem 0.65rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: '600',
              color: 'var(--text-muted)',
              padding: '0 0.5rem 0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Management
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.525rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--border-color)' : 'transparent',
                    background: isActive ? 'var(--bg-subtle)' : 'transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? '600' : '500',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Icon 
                      size={16} 
                      color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} 
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span 
                      className={`badge badge-${item.badgeType} tabular-nums`} 
                      style={{ fontSize: '0.68rem', padding: '1px 6px' }}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    isActive && <ChevronRight size={13} color="var(--text-muted)" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

      {/* User Profile Footer */}
      <div style={{
        padding: '1rem 1.15rem',
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-surface)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt={user?.name || "Owner"}
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: 'var(--radius-sm)', 
              objectFit: 'cover',
              border: '1px solid var(--border-color)'
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              fontWeight: '600', 
              fontSize: '0.8rem', 
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user?.name || 'Yashodhan Gurav'}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              {user?.role === 'admin' ? 'Owner / Admin' : 'Tenant Account'}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: 'center', gap: '0.45rem', fontSize: '0.75rem' }}
        >
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </aside>
  </>
);
};
