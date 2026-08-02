import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_TENANTS } from '../mock/initialData';
import { Building2, Lock, Mail, User, ShieldCheck, ArrowRight, CheckCircle2, Home, Key } from 'lucide-react';

export const Login = ({ tenants = INITIAL_TENANTS }) => {
  const { loginAdmin, loginTenant } = useAuth();
  const [portalType, setPortalType] = useState('admin');
  
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
      background: 'radial-gradient(ellipse at top left, #1e1b4b 0%, #0b0f19 60%, #090d16 100%)',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Glow */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div className="glass-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '490px',
        padding: '2.5rem 2rem',
        borderRadius: '24px',
        background: 'rgba(17, 24, 39, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
            marginBottom: '0.85rem'
          }}>
            <Building2 size={32} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
            Estate<span className="gradient-text">Pulse</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Tenant & Property Management Portal
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '1.5rem'
        }}>
          <button
            onClick={() => { setPortalType('admin'); setError(''); }}
            style={{
              padding: '0.6rem',
              borderRadius: '9px',
              border: 'none',
              background: portalType === 'admin' ? 'var(--accent-primary)' : 'transparent',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={16} /> 👑 Owner Portal
          </button>
          <button
            onClick={() => { setPortalType('tenant'); setError(''); }}
            style={{
              padding: '0.6rem',
              borderRadius: '9px',
              border: 'none',
              background: portalType === 'tenant' ? 'var(--accent-primary)' : 'transparent',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <User size={16} /> 👤 Tenant Portal
          </button>
        </div>

        {error && (
          <div style={{
            background: 'var(--accent-danger-bg)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            color: 'var(--accent-danger)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* OWNER PORTAL FORM */}
        {portalType === 'admin' ? (
          <div>
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#a5b4fc' }}>
                  👑 Property Owner Portal
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Full management & verification access
                </div>
              </div>
              <button
                type="button"
                onClick={handleQuickAdminLogin}
                className="btn btn-primary btn-sm"
                style={{ borderRadius: '8px', fontSize: '0.75rem' }}
              >
                Quick Owner Login
              </button>
            </div>

            <form onSubmit={handleAdminSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-email">Owner Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    id="admin-email"
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" htmlFor="admin-password">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    id="admin-password"
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', fontSize: '0.925rem' }}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : <>Login to Owner Portal <ArrowRight size={18} /></>}
              </button>
            </form>
          </div>
        ) : (
          /* TENANT PORTAL FORM (AUTHENTICATED WITH OWNER CREATED CREDENTIALS) */
          <div>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#6ee7b7', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Key size={14} /> Owner-Assigned Credentials Login:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {tenants.slice(0, 3).map((t) => (
                  <button
                    key={t.id || t._id}
                    type="button"
                    onClick={() => handleQuickTenantLogin(t)}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'space-between', fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                  >
                    <span><strong>{t.name}</strong> ({t.roomNo || t.unit}) • Pass: <code>{t.password || 'Rahul101Password'}</code></span>
                    <span style={{ color: 'var(--accent-primary)', fontSize: '0.7rem' }}>Fill →</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleTenantSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="tenant-email-input">Tenant Email / Username *</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    id="tenant-email-input"
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    placeholder="e.g. rahul.sharma@example.com"
                    value={tenantEmail}
                    onChange={(e) => setTenantEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" htmlFor="tenant-password-input">Assigned Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    id="tenant-password-input"
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    placeholder="Enter password assigned by owner"
                    value={tenantPassword}
                    onChange={(e) => setTenantPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', fontSize: '0.925rem' }}
                disabled={loading}
              >
                {loading ? 'Validating Credentials...' : <>Sign In to My Tenant Portal <ArrowRight size={18} /></>}
              </button>
            </form>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <CheckCircle2 size={13} color="var(--accent-success)" style={{ display: 'inline', marginRight: '4px' }} />
          Encrypted Authentication System
        </div>
      </div>
    </div>
  );
};
