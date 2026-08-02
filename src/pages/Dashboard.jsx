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
  FileText,
  ShieldAlert,
  Building2,
  Landmark,
  Plus
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

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Clean Executive Header */}
      <div className="glass-card" style={{
        padding: '1.5rem 1.75rem',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(30, 27, 75, 0.5) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={24} color="var(--accent-primary)" /> Property Executive Overview
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Portfolio Summary • <strong>{totalTenants} Active Tenants</strong> • <strong>{paidTenants.length} Settled</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={onOpenAddTenant}
            className="btn btn-primary"
            id="dash-add-tenant-btn"
            style={{ fontWeight: '700' }}
          >
            <Plus size={16} /> Register Tenant & Deposit
          </button>
          <button 
            onClick={() => onRecordPayment(null)}
            className="btn btn-secondary"
            id="dash-record-pay-btn"
          >
            <DollarSign size={16} /> Record Rent
          </button>
        </div>
      </div>

      {/* 4 Clean Primary Financial Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem' }}>
        <StatsCard
          title="Active Tenants"
          value={`${totalTenants}`}
          subtext="Occupied Rooms / Units"
          icon={Users}
          trend="up"
          trendValue="100% Occupied"
          color="var(--accent-primary)"
        />
        <StatsCard
          title="Rent Collected"
          value={formatINR(totalRevenueCollected)}
          subtext={`${paidTenants.length} tenants settled`}
          icon={CheckCircle2}
          trend="up"
          trendValue="August 2026"
          color="var(--accent-success)"
        />
        <StatsCard
          title="Pending Dues"
          value={formatINR(pendingDuesTotal)}
          subtext={`${pendingTenants.length} tenants unpaid`}
          icon={ShieldAlert}
          trend={pendingTenants.length > 0 ? "down" : "up"}
          trendValue={pendingTenants.length > 0 ? "Outstanding Dues" : "Clear"}
          color="var(--accent-danger)"
        />
        <StatsCard
          title="Advance Security Deposits"
          value={formatINR(totalAdvanceDeposits)}
          subtext="Total Advance Held"
          icon={Landmark}
          trend="up"
          trendValue="Security Reserves"
          color="var(--accent-warning)"
        />
      </div>

      {/* 2-Column Clean Section: Revenue Trends + Urgent Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <RevenueChart />

        {/* Clean Expiry & Verification Alerts */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={17} color="var(--accent-warning)" /> Agreement Expirations (&lt; 7 Days)
            </h3>
            <span className="badge badge-warning">{expiringWithin7Days.length} Alert</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto', maxHeight: '280px' }}>
            {expiringWithin7Days.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle2 size={24} color="var(--accent-success)" style={{ display: 'block', margin: '0 auto 0.5rem' }} />
                All agreements up to date
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
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      cursor: 'pointer',
                      fontSize: '0.825rem'
                    }}
                  >
                    <div style={{ fontWeight: '800', color: 'var(--accent-warning)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Expires in {daysLeft} Days</span>
                      <span style={{ fontSize: '0.725rem' }}>{expiry.toLocaleDateString()}</span>
                    </div>
                    <div style={{ color: 'var(--text-primary)', marginTop: '4px', fontWeight: '700' }}>
                      {t.name} • {t.roomNo || t.roomNumber || t.unit}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Clean Tenants Directory Roster Table */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>Tenants Directory & Financial Roster</h3>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Overview of room assignments, monthly rent, and security deposit amounts</p>
          </div>
          <button 
            onClick={() => onNavigate('tenants')}
            className="btn btn-secondary btn-sm"
          >
            All Tenants <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tenant Name</th>
                <th>Room No</th>
                <th>Phone</th>
                <th>Monthly Rent</th>
                <th>Advance Security Deposit</th>
                <th>Rent Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => {
                const isPending = tenant.paymentStatus !== 'Paid';
                const room = tenant.roomNo || tenant.roomNumber || tenant.unit;

                return (
                  <tr key={tenant.id || tenant._id} style={{ background: isPending ? 'rgba(244, 63, 94, 0.04)' : 'transparent' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img src={tenant.avatar} alt={tenant.name} style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} />
                        <strong 
                          onClick={() => onViewTenant(tenant)}
                          style={{ cursor: 'pointer', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                        >
                          {tenant.name}
                        </strong>
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}>{room}</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{tenant.phone}</span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--accent-success)', fontSize: '0.9rem' }}>{formatINR(tenant.rentAmount)}</strong>
                    </td>
                    <td>
                      <span style={{ color: 'var(--accent-warning)', fontWeight: '700', fontSize: '0.875rem' }}>
                        {formatINR(tenant.deposit || tenant.rentAmount * 2)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${isPending ? 'badge-danger' : 'badge-success'}`} style={{ fontWeight: '800' }}>
                        {isPending ? 'Pending' : 'Paid'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => onViewTenant(tenant)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.725rem' }}
                        >
                          View Record
                        </button>
                        {isPending && (
                          <button
                            onClick={() => onRecordPayment(tenant)}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.725rem' }}
                          >
                            Collect Rent
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
      </div>
    </div>
  );
};
