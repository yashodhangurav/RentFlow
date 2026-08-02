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
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  pendingRentCount = 0, 
  openMaintenanceCount = 0 
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tenants', label: 'Tenants Directory', icon: Users },
    { id: 'properties', label: 'Property Portfolio', icon: Building2 },
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
    <aside style={{
      width: '260px',
      minWidth: '260px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      zIndex: 20,
      overflowY: 'auto'
    }}>
      <div>
        {/* Brand Header */}
        <div style={{
          padding: '1.5rem 1.25rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px var(--accent-glow)'
          }}>
            <Building2 size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.15rem', letterSpacing: '-0.02em' }}>
              Estate<span className="gradient-text">Pulse</span>
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Property Management System</div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav style={{ padding: '1.25rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', padding: '0 0.5rem 0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Main Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.7rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: isActive ? 'var(--accent-primary-bg)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </div>

                {item.badge ? (
                  <span className={`badge badge-${item.badgeType}`} style={{ fontSize: '0.7rem' }}>
                    {item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight size={14} color="var(--accent-primary)" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div style={{
        padding: '1.25rem',
        borderTop: '1px solid var(--border-color)',
        background: 'rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={user?.name || "Owner"}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.825rem', color: 'var(--text-primary)' }}>
                {user?.name || 'Yashodhan Gurav'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Property Owner</div>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', fontSize: '0.775rem' }}
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
};
