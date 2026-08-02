import React, { useState } from 'react';
import { formatINR } from '../utils/formatters';
import { CreditCard, DollarSign, Plus, Download, Printer, Search, CheckCircle2, Clock, AlertTriangle, Calendar, RefreshCw, FileText, Check, Zap, Eye, Image as ImageIcon } from 'lucide-react';

export const Payments = ({ payments = [], tenants = [], onToggleRentStatus, onVerifyPayment, onRecordPayment, onViewReceipt, onOpenDocument }) => {
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(30, 27, 75, 0.5) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={24} color="var(--accent-primary)" /> Monthly Rent & Current Bill Collection
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Verify tenant payment proof submissions or mark rent as Settled/Pending.
          </p>
        </div>

        {/* Month Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label htmlFor="rent-month-selector" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Billing Period:</label>
          <select
            id="rent-month-selector"
            className="form-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ width: '170px', fontWeight: '700', borderRadius: '20px', padding: '0.5rem 1rem' }}
          >
            <option value="August 2026">August 2026</option>
            <option value="July 2026">July 2026</option>
            <option value="June 2026">June 2026</option>
            <option value="September 2026">September 2026</option>
          </select>
        </div>
      </div>

      {/* 10-DAY DEADLINE OWNER ALERT BANNER */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.825rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-warning)', fontWeight: '700' }}>
          <Clock size={18} /> Owner Grace Period Policy: Monthly rent & electricity bill due by 10th of every month.
        </div>
        <span style={{ color: 'var(--text-secondary)' }}>
          {pendingCount} tenant(s) approaching deadline
        </span>
      </div>

      {/* Top Collection Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-success)' }}>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Verified Paid Rents
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--accent-success)', margin: '0.2rem 0' }}>
            {formatINR(totalPaidAmount)}
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
            <strong>{paidCount}</strong> tenants settled
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-warning)' }}>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Pending Proof Verifications
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--accent-warning)', margin: '0.2rem 0' }}>
            {verificationCount} Proofs
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
            Proof submissions awaiting approval
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-danger)' }}>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            Pending Rent Dues
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--accent-danger)', margin: '0.2rem 0' }}>
            {formatINR(totalPendingAmount)}
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
            <strong>{pendingCount}</strong> tenants unpaid
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'All', label: 'All Rooms' },
            { id: 'Verification', label: `Pending Verification (${verificationCount})` },
            { id: 'Paid', label: 'Verified Paid' },
            { id: 'Pending', label: 'Rent Pending' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id)}
              className="btn btn-sm"
              style={{
                borderRadius: '20px',
                background: filterStatus === st.id ? (st.id === 'Verification' ? 'var(--accent-warning)' : st.id === 'Pending' ? 'var(--accent-danger)' : 'var(--accent-primary)') : 'rgba(255,255,255,0.05)',
                color: '#ffffff',
                border: '1px solid var(--border-color)',
                fontWeight: filterStatus === st.id ? '700' : '500'
              }}
            >
              {st.label}
            </button>
          ))}
        </div>

        <button 
          onClick={() => onRecordPayment(null)}
          className="btn btn-primary btn-sm"
        >
          <DollarSign size={16} /> Log Manual Payment
        </button>
      </div>

      {/* Rent & Electricity Proof Matrix Table */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Room No</th>
                <th>Tenant Name</th>
                <th>Monthly Rent</th>
                <th>Rent Status</th>
                <th>Uploaded Proof Records</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatrix.map(({ tenant, payment, isPaid, isVerificationPending, roomNo, rentAmount }) => (
                <tr key={tenant.id || tenant._id} style={{ background: isVerificationPending ? 'rgba(245, 158, 11, 0.06)' : !isPaid ? 'rgba(244, 63, 94, 0.04)' : 'transparent' }}>
                  <td>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--accent-primary)' }}>{roomNo}</strong>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img src={tenant.avatar} alt={tenant.name} style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <strong style={{ fontSize: '0.9rem' }}>{tenant.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tenant.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{formatINR(rentAmount)}</strong>
                  </td>
                  <td>
                    <span className={`badge ${isPaid ? 'badge-success' : isVerificationPending ? 'badge-warning' : 'badge-danger'}`} style={{ fontWeight: '800' }}>
                      {isPaid ? 'Verified Paid' : isVerificationPending ? 'Verification Pending' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {payment?.proofFile ? (
                        <button
                          onClick={() => onOpenDocument(payment.proofFile, 'Uploaded Rent Payment Screenshot', tenant.name, '', payment, () => onVerifyPayment(tenant, payment))}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.725rem', gap: '5px', borderColor: 'var(--accent-success)', color: 'var(--accent-success)' }}
                        >
                          <ImageIcon size={14} /> View Rent Proof File
                        </button>
                      ) : null}

                      {payment?.electricityProofFile ? (
                        <button
                          onClick={() => onOpenDocument(payment.electricityProofFile, 'Uploaded Electricity / Current Bill Receipt', tenant.name, '', payment, () => onVerifyPayment(tenant, payment))}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.725rem', gap: '5px', borderColor: 'var(--accent-warning)', color: 'var(--accent-warning)' }}
                        >
                          <Zap size={14} /> View Current Bill File
                        </button>
                      ) : null}

                      {!payment?.proofFile && !payment?.electricityProofFile && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No Proofs Attached</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {isVerificationPending ? (
                      <button
                        onClick={() => onVerifyPayment ? onVerifyPayment(tenant, payment) : onToggleRentStatus(tenant, selectedMonth, false)}
                        className="btn btn-primary btn-sm"
                        style={{ background: 'var(--accent-success)', borderColor: 'var(--accent-success)', fontSize: '0.775rem', padding: '0.35rem 0.75rem', gap: '4px', fontWeight: '800' }}
                      >
                        <Check size={15} /> Verify & Approve Rent
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => onToggleRentStatus(tenant, selectedMonth, isPaid)}
                          className={`btn btn-sm ${isPaid ? 'btn-secondary' : 'btn-primary'}`}
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.3rem 0.75rem',
                            background: !isPaid ? 'var(--accent-success)' : undefined,
                            borderColor: !isPaid ? 'var(--accent-success)' : undefined
                          }}
                        >
                          {isPaid ? 'Mark Pending' : 'Mark Paid'}
                        </button>

                        {isPaid && payment && (
                          <button
                            onClick={() => onViewReceipt(payment)}
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.725rem', padding: '0.3rem 0.5rem' }}
                          >
                            Receipt
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
    </div>
  );
};
