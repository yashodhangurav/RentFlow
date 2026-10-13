import React, { useState, useMemo } from 'react';
import { formatINR } from '../utils/formatters';
import { getCurrentMonthYear, getDynamicMonthOptions } from '../utils/dateUtils';
import { 
  CreditCard, 
  DollarSign, 
  Clock, 
  Check, 
  Zap, 
  ImageIcon,
  Receipt
} from 'lucide-react';

export const Payments = ({ 
  payments = [], 
  tenants = [], 
  onToggleRentStatus, 
  onVerifyPayment, 
  onRecordPayment, 
  onViewReceipt, 
  onOpenDocument 
}) => {
  const extraMonths = useMemo(() => {
    return Array.from(new Set(payments.map(p => p.month || p.period).filter(Boolean)));
  }, [payments]);

  const monthOptions = useMemo(() => {
    return getDynamicMonthOptions(6, 2, new Date(), extraMonths);
  }, [extraMonths]);

  const [selectedMonth, setSelectedMonth] = useState(() => getCurrentMonthYear());
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Combine tenants with their payment status for selected month
  const tenantRentMatrix = tenants.map(t => {
    const payment = payments.find(p => 
      (p.tenantId === t.id || p.tenantId === t._id || p.tenantName === t.name) &&
      (p.month === selectedMonth || p.period === selectedMonth)
    );

    const isPaid = (payment && (payment.status === 'paid' || payment.status === 'Paid')) || t.paymentStatus === 'Paid';
    const isVerificationPending = payment?.status === 'verification_pending';

    return {
      tenant: t,
      payment: payment,
      isPaid: isPaid,
      isVerificationPending: isVerificationPending,
      roomNo: t.roomNo || t.roomNumber || t.unit,
      rentAmount: t.rentAmount || 12000
    };
  });

  const filteredMatrix = tenantRentMatrix.filter(item => {
    const matchesSearch = item.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.roomNo.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'Paid') return item.isPaid;
    if (filterStatus === 'Pending') return !item.isPaid && !item.isVerificationPending;
    if (filterStatus === 'Verification') return item.isVerificationPending;

    return true;
  });

  const totalPaidAmount = tenantRentMatrix
    .filter(i => i.isPaid)
    .reduce((acc, i) => acc + i.rentAmount, 0);

  const totalPendingAmount = tenantRentMatrix
    .filter(i => !i.isPaid)
    .reduce((acc, i) => acc + i.rentAmount, 0);

  const paidCount = tenantRentMatrix.filter(i => i.isPaid).length;
  const pendingCount = tenantRentMatrix.filter(i => !i.isPaid && !i.isVerificationPending).length;
  const verificationCount = tenantRentMatrix.filter(i => i.isVerificationPending).length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner */}
      <div className="fintech-card" style={{
        padding: '1.15rem 1.4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0 }}>
            <CreditCard size={18} color="var(--accent-primary)" /> Rent Collection Ledger
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: '2px 0 0 0' }}>
            Verify payment proofs, audit collection status, and issue rent receipts
          </p>
        </div>

        {/* Dynamic Month Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="rent-month-selector" style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)' }}>
            Billing Period:
          </label>
          <select
            id="rent-month-selector"
            className="form-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ minWidth: '170px', height: '36px', fontSize: '0.8125rem' }}
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {m} {m === getCurrentMonthYear() ? '• Current' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 10-DAY DEADLINE OWNER ALERT BANNER */}
      <div style={{
        background: 'var(--status-warning-bg)',
        border: '1px solid var(--status-warning-border)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.775rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-warning)', fontWeight: '600' }}>
          <Clock size={16} /> Grace Period Policy: Rent & electricity dues are scheduled by 10th of every month.
        </div>
        <span className="tabular-nums" style={{ color: 'var(--text-secondary)' }}>
          {pendingCount} tenant(s) pending settlement
        </span>
      </div>

      {/* Collection Metric KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        <div className="fintech-card" style={{ padding: '1.15rem' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Verified Collections
          </div>
          <div className="tabular-nums" style={{ fontSize: '1.45rem', fontWeight: '600', color: 'var(--status-success)', margin: '0.35rem 0 0.15rem' }}>
            {formatINR(totalPaidAmount)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span className="tabular-nums">{paidCount}</span> settled units
          </div>
        </div>

        <div className="fintech-card" style={{ padding: '1.15rem' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Proof Verifications
          </div>
          <div className="tabular-nums" style={{ fontSize: '1.45rem', fontWeight: '600', color: 'var(--status-warning)', margin: '0.35rem 0 0.15rem' }}>
            {verificationCount} Pending
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Tenant screenshots awaiting audit
          </div>
        </div>

        <div className="fintech-card" style={{ padding: '1.15rem' }}>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Outstanding Arrears
          </div>
          <div className="tabular-nums" style={{ fontSize: '1.45rem', fontWeight: '600', color: 'var(--status-danger)', margin: '0.35rem 0 0.15rem' }}>
            {formatINR(totalPendingAmount)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span className="tabular-nums">{pendingCount}</span> overdue accounts
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { id: 'All', label: 'All Units' },
            { id: 'Verification', label: `Pending Verification (${verificationCount})` },
            { id: 'Paid', label: 'Verified Paid' },
            { id: 'Pending', label: 'Overdue' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id)}
              className={`btn btn-sm ${filterStatus === st.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
            >
              {st.label}
            </button>
          ))}
        </div>

        <button 
          onClick={() => onRecordPayment(null)}
          className="btn btn-secondary btn-sm"
          style={{ height: '32px' }}
        >
          <DollarSign size={14} /> Log Manual Payment
        </button>
      </div>

      {/* Rent & Electricity Proof Matrix Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '12%' }}>Unit</th>
              <th style={{ width: '22%' }}>Tenant</th>
              <th style={{ textAlign: 'right', width: '14%' }}>Monthly Rent</th>
              <th style={{ textAlign: 'center', width: '16%' }}>Status</th>
              <th style={{ width: '22%' }}>Audit Verification Proofs</th>
              <th style={{ textAlign: 'right', width: '14%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMatrix.map(({ tenant, payment, isPaid, isVerificationPending, roomNo, rentAmount }) => (
              <tr key={tenant.id || tenant._id}>
                <td>
                  <span className="tabular-nums" style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.825rem', whiteSpace: 'nowrap' }}>
                    {roomNo}
                  </span>
                </td>
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
                    <div>
                      <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{tenant.name}</span>
                      <div className="tabular-nums" style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{tenant.phone}</div>
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className="tabular-nums" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {formatINR(rentAmount)}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`badge ${isPaid ? 'badge-success' : isVerificationPending ? 'badge-warning' : 'badge-danger'}`}>
                    {isPaid ? 'Paid' : isVerificationPending ? 'Verification Pending' : 'Pending'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {payment?.proofFile ? (
                      <button
                        onClick={() => onOpenDocument(payment.proofFile, 'Uploaded Rent Payment Screenshot', tenant.name, '', payment, () => onVerifyPayment(tenant, payment))}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.725rem', gap: '4px', width: 'fit-content', lineHeight: '1.25' }}
                      >
                        <ImageIcon size={12} color="var(--accent-primary)" /> Rent Proof File
                      </button>
                    ) : null}

                    {payment?.electricityProofFile ? (
                      <button
                        onClick={() => onOpenDocument(payment.electricityProofFile, 'Uploaded Electricity / Current Bill Receipt', tenant.name, '', payment, () => onVerifyPayment(tenant, payment))}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.725rem', gap: '4px', width: 'fit-content', lineHeight: '1.25' }}
                      >
                        <Zap size={12} color="var(--status-warning)" /> Current Bill File
                      </button>
                    ) : null}

                    {!payment?.proofFile && !payment?.electricityProofFile && (
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>No Files Attached</span>
                    )}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {isVerificationPending ? (
                    <button
                      onClick={() => onVerifyPayment ? onVerifyPayment(tenant, payment) : onToggleRentStatus(tenant, selectedMonth, false)}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', gap: '3px', lineHeight: '1.25' }}
                    >
                      <Check size={13} /> Approve
                    </button>
                  ) : (
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button
                        onClick={() => onToggleRentStatus(tenant, selectedMonth, isPaid)}
                        className={`btn btn-sm ${isPaid ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', lineHeight: '1.25' }}
                      >
                        {isPaid ? 'Mark Pending' : 'Mark Paid'}
                      </button>

                      {isPaid && payment && (
                        <button
                          onClick={() => onViewReceipt(payment)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', gap: '3px', lineHeight: '1.25' }}
                        >
                          <Receipt size={12} /> Receipt
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
