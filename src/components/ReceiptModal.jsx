import React from 'react';
import { formatINR } from '../utils/formatters';
import { X, Printer, Download, CheckCircle, Building2 } from 'lucide-react';

export const ReceiptModal = ({ isOpen, onClose, payment }) => {
  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const amount = payment.amountPaid || payment.amount || 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--status-paid-bg)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--status-paid-text)'
            }}>
              <Building2 size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Rent Payment Receipt
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Verified Settlement Remittance
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="btn btn-secondary btn-sm"
            style={{ width: '28px', height: '28px', padding: 0, borderRadius: 'var(--radius-sm)' }}
          >
            <X size={15} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem' }}>
          {/* Status Badge */}
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              background: 'var(--status-paid-bg)',
              color: 'var(--status-paid-text)',
              fontWeight: 600,
              fontSize: '0.75rem',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-color)'
            }}>
              <CheckCircle size={13} /> Payment Cleared & Verified
            </div>
            <h2 className="tabular-nums" style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.5rem 0 0.25rem' }}>
              {formatINR(amount)}
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} className="tabular-nums">
              Receipt #{payment.id || payment._id || 'RCP-8812'} • {payment.period || payment.month || 'Current Cycle'}
            </div>
          </div>

          <div style={{
            background: 'var(--bg-hover)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            border: '1px solid var(--border-color)',
            fontSize: '0.825rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tenant Name</span>
              <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{payment.tenantName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Room & Property</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{payment.unit || payment.roomNo || payment.roomNumber}, {payment.propertyName || 'Property'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Settlement Method</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{payment.paymentMethod || payment.method || 'UPI'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Transaction Reference</span>
              <code className="tabular-nums" style={{ color: 'var(--text-primary)', background: 'var(--bg-card)', padding: '1px 6px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}>
                {payment.reference || 'UPI-984210'}
              </code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Settlement Date</span>
              <span className="tabular-nums" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                {payment.paidDate || payment.paymentDate ? new Date(payment.paidDate || payment.paymentDate).toLocaleDateString() : 'Paid'}
              </span>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', fontSize: '0.725rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Official electronic receipt generated by EstatePulse.
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handlePrint} className="btn btn-secondary btn-sm">
            <Printer size={14} /> Print Receipt
          </button>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
