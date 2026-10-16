import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  CreditCard, 
  FileText, 
  Zap, 
  Wrench, 
  ArrowRight, 
  CheckCircle2, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  User, 
  ChevronDown, 
  ChevronUp,
  ShieldCheck,
  Check
} from 'lucide-react';
import { formatINR } from '../utils/formatters';
import './HomePage.css';

export const HomePage = ({
  onOpenLogin,
  onQuickDemoAdmin,
  onQuickDemoTenant,
  properties = [],
  theme = 'dark',
  setTheme
}) => {
  // Mobile drawer toggle
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Live Snapshot active view: 'owner' | 'resident'
  const [snapshotView, setSnapshotView] = useState('owner');

  // Short FAQ state
  const [openFaq, setOpenFaq] = useState(0);

  // Computed Portfolio Numbers
  const totalUnits = useMemo(() => {
    return properties.reduce((acc, p) => acc + (p.units || 0), 0) || 20;
  }, [properties]);

  const totalOccupied = useMemo(() => {
    return properties.reduce((acc, p) => acc + (p.occupied || 0), 0) || 17;
  }, [properties]);

  const totalRevenue = useMemo(() => {
    return properties.reduce((acc, p) => acc + (p.monthlyRevenue || 0), 0) || 270000;
  }, [properties]);

  const toggleTheme = () => {
    if (setTheme) {
      setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    }
  };

  const closeMobileNav = () => setMobileNavOpen(false);

  // Curated, real-world questions (kept short)
  const faqItems = [
    {
      q: "How does UPI payment verification work?",
      a: "Tenants submit their Google Pay, PhonePe, or Paytm payment screenshot along with the 12-digit UPI UTR reference. The owner verifies the remittance in the dashboard with a single tap, which immediately generates a signed receipt."
    },
    {
      q: "Are the generated rent receipts legally valid for HRA tax exemption?",
      a: "Yes. Every receipt includes property details, owner PAN, payment reference, and digital signature, making them fully compliant with Indian Income Tax Act regulations for corporate HRA claims."
    },
    {
      q: "How does electricity submeter splitting work?",
      a: "Simply enter the previous and current meter readings for each room. EstatePulse automatically calculates kilowatt consumption, applies your per-unit tariff rate, and creates a separate or combined bill with zero disputes."
    }
  ];

  return (
    <div className="hp-root">
      <div className="hp-ambient-light" />

      {/* --------------------------------------------------------------------
          MINIMALIST TOP NAVIGATION
          -------------------------------------------------------------------- */}
      <header className="hp-nav">
        <div className="hp-nav-container">
          <div className="hp-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="hp-brand-mark">
              <Building2 size={18} />
            </div>
            <div className="hp-brand-name">
              <span>EstatePulse</span>
              <span className="hp-brand-tag">Ledger</span>
            </div>
          </div>

          <nav className="hp-nav-links">
            <a href="#features" className="hp-nav-link">Pillars</a>
            <a href="#properties" className="hp-nav-link">Properties</a>
            <a href="#faq" className="hp-nav-link">FAQ</a>
          </nav>

          <div className="hp-nav-actions">
            {setTheme && (
              <button 
                type="button" 
                onClick={toggleTheme} 
                className="hp-theme-toggle" 
                aria-label="Toggle Theme"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}

            <button
              type="button"
              onClick={() => onOpenLogin && onOpenLogin('tenant')}
              className="btn btn-secondary btn-sm hide-mobile"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
            >
              Resident Portal
            </button>

            <button
              type="button"
              onClick={() => onOpenLogin && onOpenLogin('admin')}
              className="btn btn-primary btn-sm hide-mobile"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.95rem' }}
            >
              Owner Sign In
            </button>

            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="hp-mobile-menu-toggle"
              aria-label="Open navigation menu"
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileNavOpen && (
          <div className="hp-mobile-drawer open">
            <a href="#features" className="hp-mobile-nav-link" onClick={closeMobileNav}>
              <span>Core Pillars</span>
              <ArrowRight size={14} color="var(--text-muted)" />
            </a>
            <a href="#properties" className="hp-mobile-nav-link" onClick={closeMobileNav}>
              <span>Portfolio Preview</span>
              <ArrowRight size={14} color="var(--text-muted)" />
            </a>
            <a href="#faq" className="hp-mobile-nav-link" onClick={closeMobileNav}>
              <span>FAQ</span>
              <ArrowRight size={14} color="var(--text-muted)" />
            </a>

            <div className="hp-mobile-actions">
              <button
                type="button"
                onClick={() => { closeMobileNav(); onOpenLogin && onOpenLogin('tenant'); }}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', minHeight: '42px', justifyContent: 'center' }}
              >
                <User size={15} /> Resident Portal
              </button>

              <button
                type="button"
                onClick={() => { closeMobileNav(); onOpenLogin && onOpenLogin('admin'); }}
                className="btn btn-primary btn-sm"
                style={{ width: '100%', minHeight: '42px', justifyContent: 'center' }}
              >
                Owner Sign In
              </button>
            </div>
          </div>
        )}
      </header>

      {/* --------------------------------------------------------------------
          HERO SECTION
          -------------------------------------------------------------------- */}
      <section className="hp-hero">
        <div className="hp-badge">
          <span className="hp-badge-dot" />
          <span>Institutional Rental Ledger</span>
        </div>

        <h1 className="hp-hero-title">
          Property records & rent collection, done right.
        </h1>

        <p className="hp-hero-sub">
          A disciplined platform for Indian property owners and residents. 
          Verify UPI remittances, track submeters, issue signed PDF receipts, 
          and manage maintenance—without the clutter.
        </p>

        <div className="hp-hero-cta">
          <button
            type="button"
            onClick={() => onQuickDemoAdmin && onQuickDemoAdmin()}
            className="hp-btn-solid"
          >
            Explore Live Demo <ArrowRight size={15} />
          </button>

          <button
            type="button"
            onClick={() => onOpenLogin && onOpenLogin('tenant')}
            className="hp-btn-outline"
          >
            <User size={15} /> Resident Portal
          </button>
        </div>

        <div className="hp-trust-line">
          <span>• 1-Click Demo Access</span>
          <span>• HRA & Tax Compliant Receipts</span>
          <span>• Cloud Backed (MongoDB Atlas)</span>
        </div>

        {/* ------------------------------------------------------------------
            CLEAN LIVE DASHBOARD SNAPSHOT
            ------------------------------------------------------------------ */}
        <div className="hp-snapshot-card">
          <div className="hp-snapshot-bar">
            <div className="hp-snapshot-dots">
              <div className="hp-snapshot-dot" />
              <div className="hp-snapshot-dot" />
              <div className="hp-snapshot-dot" />
            </div>

            <div className="hp-view-switcher">
              <button
                type="button"
                className={`hp-view-btn ${snapshotView === 'owner' ? 'active' : ''}`}
                onClick={() => setSnapshotView('owner')}
              >
                Owner Overview
              </button>
              <button
                type="button"
                className={`hp-view-btn ${snapshotView === 'resident' ? 'active' : ''}`}
                onClick={() => setSnapshotView('resident')}
              >
                Resident View
              </button>
            </div>

            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }} className="hide-mobile">
              Live Ledger Demo
            </span>
          </div>

          <div className="hp-snapshot-body">
            {snapshotView === 'owner' ? (
              <div>
                <div className="hp-snapshot-metrics">
                  <div className="hp-metric-box">
                    <div className="hp-metric-label">
                      <span>Monthly Rent Collected</span>
                      <CreditCard size={14} color="var(--accent-primary)" />
                    </div>
                    <div className="hp-metric-val">{formatINR(totalRevenue)}</div>
                    <div className="hp-metric-status">92% on-time collection</div>
                  </div>

                  <div className="hp-metric-box">
                    <div className="hp-metric-label">
                      <span>Occupancy</span>
                      <Building2 size={14} color="var(--accent-primary)" />
                    </div>
                    <div className="hp-metric-val">{totalOccupied} / {totalUnits} Units</div>
                    <div className="hp-metric-status">85% occupied across 2 locations</div>
                  </div>

                  <div className="hp-metric-box">
                    <div className="hp-metric-label">
                      <span>Remittances</span>
                      <CheckCircle2 size={14} color="var(--status-success)" />
                    </div>
                    <div className="hp-metric-val">100% Verified</div>
                    <div className="hp-metric-status">Zero unverified receipts</div>
                  </div>
                </div>

                <div className="hp-snapshot-rows">
                  <div className="hp-feed-box">
                    <div className="hp-feed-header">
                      <span>Recent Verified Remittance</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--status-success)', fontWeight: 600 }}>
                        Auto-Matched
                      </span>
                    </div>
                    <div className="hp-feed-item">
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Rahul Sharma (Room 101)</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sai Kripa Nivas • Google Pay UPI (Ref: 429104829102)</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: 'var(--status-success)' }}>+₹12,000</div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Receipt #EP-101</span>
                      </div>
                    </div>
                  </div>

                  <div className="hp-feed-box">
                    <div className="hp-feed-header">
                      <span>Maintenance Radar</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>1 Active</span>
                    </div>
                    <div className="hp-feed-item">
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Geyser Heating Check</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Room 201 • Amit Verma</div>
                      </div>
                      <span style={{ fontSize: '0.68rem', background: 'var(--status-warning-bg)', color: 'var(--status-warning)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        In Progress
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Resident Snapshot */
              <div style={{ maxWidth: '520px', margin: '0 auto', padding: '0.5rem 0' }}>
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Resident Profile</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Rahul Sharma</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Room 101 • Sai Kripa Nivas</div>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--status-success)', background: 'var(--status-success-bg)', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      Active Resident
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-xs)', marginBottom: '1rem', fontSize: '0.8rem' }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>October Rent</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹12,000 (Paid)</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Submeter Electricity</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>145 Units (₹1,450)</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onQuickDemoTenant && onQuickDemoTenant()}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
                  >
                    <FileText size={14} /> View Signed Rent Receipt (PDF)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          THREE CORE PILLARS (NO BLOAT)
          -------------------------------------------------------------------- */}
      <section id="features" className="hp-section">
        <div className="hp-section-header">
          <span className="hp-section-tag">Core Capabilities</span>
          <h2 className="hp-section-title">Everything you need. Nothing you don't.</h2>
          <p className="hp-section-desc">
            Designed specifically around real rental workflows in India—clean, fast, and reliable.
          </p>
        </div>

        <div className="hp-pillars-grid">
          {/* Pillar 1 */}
          <div className="hp-pillar-card">
            <div className="hp-pillar-icon">
              <CreditCard size={20} />
            </div>
            <h3 className="hp-pillar-title">Verified UPI & Instant Receipts</h3>
            <p className="hp-pillar-desc">
              Accept PhonePe, Google Pay, and Paytm remittances with 12-digit UTR reconciliation. 
              Issue bilingual, HRA-ready PDF receipts in one click.
            </p>
            <ul className="hp-pillar-feature-list">
              <li className="hp-pillar-feature-item">
                <Check size={13} color="var(--accent-primary)" /> Automatic UTR verification
              </li>
              <li className="hp-pillar-feature-item">
                <Check size={13} color="var(--accent-primary)" /> Bilingual PDF with digital seal & PAN
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="hp-pillar-card">
            <div className="hp-pillar-icon">
              <Zap size={20} />
            </div>
            <h3 className="hp-pillar-title">Accurate Submeter Electricity</h3>
            <p className="hp-pillar-desc">
              Record previous and current meter readings. The system computes kilowatt differences, 
              applies your tariff rate, and bills tenants transparently.
            </p>
            <ul className="hp-pillar-feature-list">
              <li className="hp-pillar-feature-item">
                <Check size={13} color="var(--accent-primary)" /> Automatic unit consumption math
              </li>
              <li className="hp-pillar-feature-item">
                <Check size={13} color="var(--accent-primary)" /> Zero billing disputes between tenants
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="hp-pillar-card">
            <div className="hp-pillar-icon">
              <Wrench size={20} />
            </div>
            <h3 className="hp-pillar-title">Resident Portal & Maintenance</h3>
            <p className="hp-pillar-desc">
              Residents access their balance and submit payment proofs from their phone. 
              Track plumbing, electrical, and repair tickets on a live status board.
            </p>
            <ul className="hp-pillar-feature-list">
              <li className="hp-pillar-feature-item">
                <Check size={13} color="var(--accent-primary)" /> Mobile-friendly resident dashboard
              </li>
              <li className="hp-pillar-feature-item">
                <Check size={13} color="var(--accent-primary)" /> Work-order tracking (Reported to Resolved)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          PORTFOLIO PREVIEW (REAL DATA)
          -------------------------------------------------------------------- */}
      <section id="properties" className="hp-section" style={{ paddingTop: '1rem' }}>
        <div className="hp-section-header">
          <span className="hp-section-tag">Properties</span>
          <h2 className="hp-section-title">Portfolio At A Glance</h2>
          <p className="hp-section-desc">
            Manage multi-room buildings, flats, and PG accommodations seamlessly.
          </p>
        </div>

        <div className="hp-portfolio-grid">
          {properties.slice(0, 2).map((prop, idx) => (
            <div key={prop.id || idx} className="hp-property-card">
              <div className="hp-prop-image-wrap">
                <img
                  src={prop.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80"}
                  alt={prop.name}
                  className="hp-prop-image"
                />
                <div className="hp-prop-badge">
                  {Math.round(((prop.occupied || 0) / (prop.units || 1)) * 100)}% Occupancy
                </div>
              </div>

              <div className="hp-prop-content">
                <div className="hp-prop-name">{prop.name}</div>
                <div className="hp-prop-loc">📍 {prop.address}</div>

                <div className="hp-prop-stats">
                  <span><strong>{prop.occupied || 0}</strong> / {prop.units || 0} Rooms Occupied</span>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{formatINR(prop.monthlyRevenue)} / mo</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------------
          CONCISE FAQ
          -------------------------------------------------------------------- */}
      <section id="faq" className="hp-section" style={{ paddingTop: '1rem' }}>
        <div className="hp-section-header">
          <span className="hp-section-tag">Questions</span>
          <h2 className="hp-section-title">Frequently Asked</h2>
        </div>

        <div className="hp-faq-list">
          {faqItems.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="hp-faq-item">
                <button
                  type="button"
                  className="hp-faq-trigger"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp size={16} color="var(--accent-primary)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                </button>
                {isOpen && (
                  <div className="hp-faq-body">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------------------------
          CLOSING ACTION CARD
          -------------------------------------------------------------------- */}
      <div style={{ padding: '0 1.25rem' }}>
        <div className="hp-closing-card">
          <h3 className="hp-closing-title">Experience EstatePulse in action.</h3>
          <p className="hp-closing-sub">
            Test the live owner ledger or resident portal instantly without setup.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onQuickDemoAdmin && onQuickDemoAdmin()}
              className="hp-btn-solid"
            >
              Launch Owner Demo <ArrowRight size={14} />
            </button>
            <button
              type="button"
              onClick={() => onOpenLogin && onOpenLogin('tenant')}
              className="hp-btn-outline"
            >
              Resident Sign In
            </button>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------
          MINIMAL FOOTER
          -------------------------------------------------------------------- */}
      <footer className="hp-footer">
        <div className="hp-footer-inner">
          <div>
            &copy; {new Date().getFullYear()} EstatePulse Ledger. Built by Yashodhan Gurav.
          </div>
          <div className="hp-footer-links">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-success)' }} />
              Operational
            </span>
            <button 
              type="button" 
              onClick={() => onOpenLogin && onOpenLogin('admin')} 
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
            >
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
