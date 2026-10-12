import React from 'react';
import { StatsCard } from '../components/StatsCard';
import { RevenueChart } from '../components/RevenueChart';
import { formatINR } from '../utils/formatters';
import { 
  Users, 
  DollarSign, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Building2,
  Landmark,
  Plus,
  AlertCircle,
  CreditCard,
  Wrench,
  ChevronRight,
  Phone
} from 'lucide-react';

export const Dashboard = ({ 
  tenants = [], 
  payments = [], 
  maintenance = [], 
  onNavigate,
  onOpenAddTenant,
  onRecordPayment,
  onViewTenant,
  onViewReceipt,
  onOpenDocument
}) => {
  // Financial & Tenant Metrics
  const totalTenants = tenants.length;
  const paidTenants = tenants.filter(t => t.paymentStatus === 'Paid');
  const pendingTenants = tenants.filter(t => t.paymentStatus !== 'Paid');

  // Auto-calculate Total Pending Dues & Total Security Deposits Held
  const pendingDuesTotal = pendingTenants.reduce((acc, t) => acc + (t.rentAmount || 0), 0);
  const totalAdvanceDeposits = tenants.reduce((acc, t) => acc + (t.deposit || 24000), 0);
  
  // Total Revenue Collected this month
  const totalRevenueCollected = payments
    .filter(p => p.status === 'Paid' || p.status === 'paid')
    .reduce((acc, p) => acc + (p.amount || p.amountPaid || 0), 0);

  // 7-DAY AGREEMENT EXPIRY FILTER
  const today = new Date('2026-08-02T00:00:00');
  const expiringWithin7Days = tenants.filter(t => {
    const expiry = new Date(t.agreementExpiryDate || t.leaseEnd);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  });

  const activeMaintenanceCount = maintenance.filter(m => m.status !== 'Resolved').length;

  return (
    <div className="animate-fade-in dashboard-page-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
      {/* Institutional Executive Header */}
      <div className="fintech-card dashboard-executive-card">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="dashboard-status-indicator">
              <span className="pulse-dot"></span> Active Term • Aug 2026
            </span>
          </div>
          <h1 className="dashboard-title">
            <Building2 size={19} color="var(--accent-primary)" /> Property Executive Ledger
          </h1>
          <p className="dashboard-subtitle">
            Portfolio Overview • <strong className="tabular-nums" style={{ color: 'var(--text-primary)' }}>{totalTenants} Active Units</strong> • <strong className="tabular-nums" style={{ color: 'var(--status-success)' }}>{paidTenants.length} Settled</strong> • <strong className="tabular-nums" style={{ color: pendingTenants.length > 0 ? 'var(--status-danger)' : 'var(--text-muted)' }}>{pendingTenants.length} Arrears</strong>
          </p>
        </div>

        <div className="dashboard-header-actions">
          <button 
            onClick={onOpenAddTenant}
            className="btn btn-primary btn-sm"
            id="dash-add-tenant-btn"
            style={{ height: '36px', gap: '0.45rem', justifyContent: 'center' }}
          >
            <Plus size={15} /> Register Tenant
          </button>
          <button 
            onClick={() => onRecordPayment(null)}
            className="btn btn-secondary btn-sm"
            id="dash-record-pay-btn"
            style={{ height: '36px', gap: '0.45rem', justifyContent: 'center' }}
          >
            <DollarSign size={15} /> Record Rent
          </button>
        </div>
      </div>

      {/* 4 Grounded Institutional KPI Cards (2x2 on Mobile, 4x1 on Desktop) */}
      <div className="dashboard-kpi-grid">
        <StatsCard
          title="Active Tenants"
          value={`${totalTenants}`}
          subtext="Occupied Units"
          icon={Users}
          trend="up"
          trendValue="100% Rate"
        />
        <StatsCard
          title="Rent Collected"
          value={formatINR(totalRevenueCollected)}
          subtext={`${paidTenants.length} units settled`}
          icon={CheckCircle2}
          trend="up"
          trendValue="Aug 2026"
        />
        <StatsCard
          title="Pending Dues"
          value={formatINR(pendingDuesTotal)}
          subtext={`${pendingTenants.length} units unpaid`}
          icon={AlertCircle}
          trend={pendingTenants.length > 0 ? "down" : "up"}
          trendValue={pendingTenants.length > 0 ? "Arrears" : "Clear"}
        />
        <StatsCard
          title="Security Reserves"
          value={formatINR(totalAdvanceDeposits)}
          subtext="Advance Held"
          icon={Landmark}
          trend="up"
          trendValue="Escrow Safe"
        />
      </div>

      {/* Quick Access Hub Shortcuts (Classy App Jump Bar) */}
      <div className="dashboard-quick-hub">
        <button 
          onClick={() => onNavigate('tenants')}
          className="dashboard-hub-btn"
          type="button"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="dashboard-hub-icon" style={{ background: 'rgba(37, 99, 235, 0.12)', color: 'var(--accent-primary)' }}>
              <Users size={16} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600', fontSize: '0.8rem', color: 'var(--text-primary)' }}>Tenants</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{totalTenants} registered</div>
            </div>
          </div>
          <ChevronRight size={14} color="var(--text-muted)" />
        </button>

        <button 
          onClick={() => onNavigate('properties')}
          className="dashboard-hub-btn"
          type="button"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="dashboard-hub-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--status-success)' }}>
              <Building2 size={16} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600', fontSize: '0.8rem', color: 'var(--text-primary)' }}>Properties</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Units & flats</div>
            </div>
          </div>
          <ChevronRight size={14} color="var(--text-muted)" />
        </button>

        <button 
          onClick={() => onNavigate('payments')}
          className="dashboard-hub-btn"
          type="button"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="dashboard-hub-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--status-warning)' }}>
              <CreditCard size={16} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600', fontSize: '0.8rem', color: 'var(--text-primary)' }}>Rent Ledger</div>
              <div style={{ fontSize: '0.68rem', color: pendingTenants.length > 0 ? 'var(--status-danger)' : 'var(--text-muted)' }}>
                {pendingTenants.length > 0 ? `${pendingTenants.length} pending` : 'All cleared'}
              </div>
            </div>
          </div>
          <ChevronRight size={14} color="var(--text-muted)" />
        </button>

        <button 
          onClick={() => onNavigate('maintenance')}
          className="dashboard-hub-btn"
          type="button"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="dashboard-hub-icon" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#818CF8' }}>
              <Wrench size={16} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600', fontSize: '0.8rem', color: 'var(--text-primary)' }}>Maintenance</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                {activeMaintenanceCount > 0 ? `${activeMaintenanceCount} open` : 'Zero issues'}
              </div>
            </div>
          </div>
          <ChevronRight size={14} color="var(--text-muted)" />
        </button>
      </div>

      {/* 2-Column Section: Revenue Trends + Urgent Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.15rem' }}>
        <RevenueChart />

        {/* Expiry Alerts Widget */}
        <div className="fintech-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0 }}>
              <Clock size={16} color="var(--status-warning)" /> Lease Expirations (&lt; 7 Days)
            </h3>
            <span className="badge badge-warning tabular-nums">
              {expiringWithin7Days.length} Alert
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto', maxHeight: '250px' }}>
            {expiringWithin7Days.length === 0 ? (
              <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle2 size={22} color="var(--status-success)" style={{ display: 'block', margin: '0 auto 0.4rem' }} />
                All tenant agreements are within valid active term.
              </div>
            ) : (
              expiringWithin7Days.map((t) => {
                const expiry = new Date(t.agreementExpiryDate || t.leaseEnd);
                const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
                return (
                  <div 
                    key={t.id || t._id}
                    onClick={() => onViewTenant(t)}
                    style={{
                      padding: '0.75rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--status-warning-bg)',
                      border: '1px solid var(--status-warning-border)',
                      cursor: 'pointer',
                      fontSize: '0.775rem',
                      transition: 'background var(--transition-fast)'
                    }}
                  >
                    <div style={{ fontWeight: '600', color: 'var(--status-warning)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Expires in {daysLeft} Days</span>
                      <span className="tabular-nums" style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        {expiry.toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-primary)', marginTop: '2px', fontWeight: '500' }}>
                      {t.name} • <span className="tabular-nums" style={{ color: 'var(--text-secondary)' }}>{t.roomNo || t.roomNumber || t.unit}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Tenants Directory Roster: Table for Desktop, Native Cards for Mobile */}
      <div className="fintech-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', margin: 0 }}>Tenants Directory & Rent Ledger</h3>
            <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Unit assignments, monthly rates, advance security deposits, and settlement status
            </p>
          </div>
          <button 
            onClick={() => onNavigate('tenants')}
            className="btn btn-secondary btn-sm"
          >
            All Tenants <ArrowRight size={13} />
          </button>
        </div>

        {/* Desktop View: Full Custom Table */}
        <div className="table-responsive hide-mobile">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tenant Name</th>
                <th>Unit</th>
                <th>Contact</th>
                <th style={{ textAlign: 'right' }}>Monthly Rent</th>
                <th style={{ textAlign: 'right' }}>Security Deposit</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => {
                const isPending = tenant.paymentStatus !== 'Paid';
                const room = tenant.roomNo || tenant.roomNumber || tenant.unit;

                return (
                  <tr key={tenant.id || tenant._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img 
                          src={tenant.avatar} 
                          alt={tenant.name} 
                          style={{ 
                            width: '28px', 
                            height: '28px', 
                            borderRadius: 'var(--radius-sm)', 
                            objectFit: 'cover',
                            border: '1px solid var(--border-color)'
                          }} 
                        />
                        <span 
                          onClick={() => onViewTenant(tenant)}
                          style={{ cursor: 'pointer', color: 'var(--text-primary)', fontWeight: '500' }}
                        >
                          {tenant.name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="tabular-nums" style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.825rem', whiteSpace: 'nowrap' }}>
                        {room}
                      </span>
                    </td>
                    <td>
                      <span className="tabular-nums" style={{ color: 'var(--text-secondary)', fontSize: '0.775rem' }}>
                        {tenant.phone}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="tabular-nums" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                        {formatINR(tenant.rentAmount)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                        {formatINR(tenant.deposit || tenant.rentAmount * 2)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${isPending ? 'badge-warning' : 'badge-success'}`}>
                        {isPending ? 'Pending' : 'Paid'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => onViewTenant(tenant)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', lineHeight: '1.25' }}
                        >
                          View
                        </button>
                        {isPending && (
                          <button
                            onClick={() => onRecordPayment(tenant)}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', lineHeight: '1.25' }}
                          >
                            Collect
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View: High-End Native Card Feed */}
        <div className="show-mobile dashboard-mobile-tenant-list">
          {tenants.map((tenant) => {
            const isPending = tenant.paymentStatus !== 'Paid';
            const room = tenant.roomNo || tenant.roomNumber || tenant.unit;

            return (
              <div key={tenant.id || tenant._id} className="dashboard-mobile-tenant-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                    <img 
                      src={tenant.avatar} 
                      alt={tenant.name} 
                      style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: 'var(--radius-sm)', 
                        objectFit: 'cover',
                        border: '1px solid var(--border-color)',
                        flexShrink: 0
                      }} 
                    />
                    <div style={{ minWidth: 0 }}>
                      <div 
                        onClick={() => onViewTenant(tenant)}
                        style={{ 
                          fontWeight: '600', 
                          fontSize: '0.875rem', 
                          color: 'var(--text-primary)', 
                          cursor: 'pointer',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {tenant.name}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                        <Phone size={11} />
                        <span className="tabular-nums">{tenant.phone}</span>
                      </div>
                    </div>
                  </div>

                  <span className="badge badge-primary tabular-nums" style={{ fontSize: '0.75rem', fontWeight: '700', padding: '3px 8px', flexShrink: 0 }}>
                    {room}
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.55rem 0.75rem',
                  marginBottom: '0.65rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', fontWeight: '600' }}>
                      Monthly Rent
                    </div>
                    <div className="tabular-nums" style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '1px' }}>
                      {formatINR(tenant.rentAmount)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', fontWeight: '600' }}>
                      Settlement
                    </div>
                    <div style={{ marginTop: '2px' }}>
                      <span className={`badge ${isPending ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.7rem' }}>
                        {isPending ? 'Pending' : 'Settled'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.45rem', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => onViewTenant(tenant)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, justifyContent: 'center', height: '34px', fontSize: '0.75rem' }}
                  >
                    View Details
                  </button>
                  {isPending && (
                    <button
                      onClick={() => onRecordPayment(tenant)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, justifyContent: 'center', height: '34px', fontSize: '0.75rem' }}
                    >
                      Collect Rent
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
