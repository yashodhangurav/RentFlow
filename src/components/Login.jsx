import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_TENANTS } from '../mock/initialData';
import { Building2, Lock, Mail, User, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, Home, Key } from 'lucide-react';

export const Login = ({ tenants = INITIAL_TENANTS, initialRole = 'admin', onBackToHome }) => {
  const { loginAdmin, loginTenant } = useAuth();
  const [portalType, setPortalType] = useState(initialRole);
  
  React.useEffect(() => {
    if (initialRole) {
      setPortalType(initialRole);
    }
  }, [initialRole]);
  
  // Admin form state
  const [adminEmail, setAdminEmail] = useState('admin@estatepulse.com');
  const [adminPassword, setAdminPassword] = useState('admin123');

  // Tenant form state
  const [tenantEmail, setTenantEmail] = useState(tenants[0]?.email || 'rahul.sharma@example.com');
  const [tenantPassword, setTenantPassword] = useState(tenants[0]?.password || 'Rahul101Password');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const res = loginAdmin(adminEmail, adminPassword);
      setLoading(false);
      if (!res.success) setError(res.message);
    }, 300);
  };

  const handleTenantSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const res = loginTenant(tenantEmail, tenantPassword, tenants);
      setLoading(false);
      if (!res.success) setError(res.message);
    }, 300);
  };

  const handleQuickAdminLogin = () => {
    setLoading(true);
    setTimeout(() => {
      loginAdmin('admin@estatepulse.com', 'admin123');
      setLoading(false);
    }, 200);
  };

  const handleQuickTenantLogin = (t) => {
    setLoading(true);
    setTenantEmail(t.email);
    setTenantPassword(t.password || 'Tenant123');
    setTimeout(() => {
      loginTenant(t.email, t.password || 'Tenant123', tenants);
      setLoading(false);
    }, 300);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-main)',
      padding: '1.5rem',
      position: 'relative'
    }}>
      <div className="animate-fade-in" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-xl)'
      }}>
        {/* Optional Back to Home Navigation */}
        {onBackToHome && (
          <div style={{ marginBottom: '1.25rem' }}>
            <button
              type="button"
              onClick={onBackToHome}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', gap: '0.4rem', padding: '0.35rem 0.75rem' }}
            >
              <ArrowLeft size={13} /> Back to Home Page
            </button>
          </div>
        )}

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-primary-subtle)',
            border: '1px solid var(--accent-primary-ring)',
            color: 'var(--accent-primary)',
            marginBottom: '0.75rem'
          }}>
            <Building2 size={24} />
          </div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            EstatePulse
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
            Institutional Property & Remittance Platform
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'var(--bg-hover)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)',
          padding: '3px',
          marginBottom: '1.25rem'
        }}>
          <button
            onClick={() => { setPortalType('admin'); setError(''); }}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-xs)',
              border: 'none',
              background: portalType === 'admin' ? 'var(--bg-card)' : 'transparent',
              color: portalType === 'admin' ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: portalType === 'admin' ? 'var(--shadow-sm)' : 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'var(--transition)'
            }}
          >
            <ShieldCheck size={14} color={portalType === 'admin' ? 'var(--accent-primary)' : 'inherit'} /> Property Owner
          </button>
          <button
            onClick={() => { setPortalType('tenant'); setError(''); }}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-xs)',
              border: 'none',
              background: portalType === 'tenant' ? 'var(--bg-card)' : 'transparent',
              color: portalType === 'tenant' ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: portalType === 'tenant' ? 'var(--shadow-sm)' : 'none',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'var(--transition)'
            }}
          >
            <User size={14} color={portalType === 'tenant' ? 'var(--accent-primary)' : 'inherit'} /> Resident Portal
          </button>
        </div>

        {error && (
          <div style={{
            background: 'var(--status-alert-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xs)',
            padding: '0.625rem 0.875rem',
            color: 'var(--status-alert-text)',
            fontSize: '0.8rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* OWNER PORTAL FORM */}
        {portalType === 'admin' ? (
          <div>
            <div style={{
              background: 'var(--bg-hover)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xs)',
              padding: '0.625rem 0.875rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Demo Portfolio Access
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Full owner administration
                </div>
              </div>
              <button
                type="button"
                onClick={handleQuickAdminLogin}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.725rem', padding: '3px 8px' }}
              >
                Auto Fill
              </button>
            </div>

            <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="admin-email">Owner Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    id="admin-email"
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: '32px' }}
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                <label className="form-label" htmlFor="admin-password">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    id="admin-password"
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: '32px' }}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.625rem', justifyContent: 'center' }}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : <>Sign In to Portfolio <ArrowRight size={14} /></>}
              </button>
            </form>
          </div>
        ) : (
          /* TENANT PORTAL FORM */
          <div>
            <div style={{
              background: 'var(--bg-hover)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xs)',
              padding: '0.625rem 0.875rem',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Key size={12} /> Registered Resident Accounts:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {tenants.slice(0, 3).map((t) => (
                  <button
                    key={t.id || t._id}
                    type="button"
                    onClick={() => handleQuickTenantLogin(t)}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'space-between', fontSize: '0.75rem', padding: '6px 10px', minHeight: '34px', lineHeight: '1.35' }}
                  >
                    <span><strong>{t.name}</strong> ({t.roomNo || t.unit})</span>
                    <span style={{ color: 'var(--accent-primary)', fontSize: '0.725rem', fontWeight: 600 }}>Select →</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleTenantSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="tenant-email-input">Resident Username / Email *</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    id="tenant-email-input"
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '32px' }}
                    placeholder="e.g. rahul.sharma@example.com"
                    value={tenantEmail}
                    onChange={(e) => setTenantEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                <label className="form-label" htmlFor="tenant-password-input">Portal Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    id="tenant-password-input"
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: '32px' }}
                    placeholder="Assigned password"
                    value={tenantPassword}
                    onChange={(e) => setTenantPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.625rem', justifyContent: 'center' }}
                disabled={loading}
              >
                {loading ? 'Validating...' : <>Access Resident Portal <ArrowRight size={14} /></>}
              </button>
            </form>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
          <CheckCircle2 size={12} color="var(--status-paid-text)" style={{ display: 'inline', marginRight: '4px' }} />
          End-to-End Encrypted Session
        </div>
      </div>
    </div>
  );
};
