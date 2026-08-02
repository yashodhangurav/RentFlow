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
      <div className="modal-content animate-fade-in" style={{ maxWidth: '520px', background: '#ffffff', color: '#0f172a' }}>
        <div className="modal-header" style={{ borderColor: '#e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Building2 size={22} color="#6366f1" />
            <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#0f172a' }}>
              Official Rent Receipt (INR)
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="btn btn-secondary btn-sm"
            style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%', background: '#f1f5f9', color: '#475569', border: 'none' }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '2rem' }}>
          {/* Status Badge */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#dcfce7',
              color: '#15803d',
              fontWeight: '700',
              fontSize: '0.85rem',
              padding: '0.35rem 1rem',
              borderRadius: '20px'
            }}>
              <CheckCircle size={16} /> Payment Received & Cleared
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginTop: '0.5rem' }}>
              {formatINR(amount)}
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Receipt #{payment.id || payment._id || 'RCP-8812'} • {payment.period || payment.month || 'August 2026'}
            </div>
          </div>

          <div style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '1.25rem',
            border: '1px solid #e2e8f0',
            fontSize: '0.875rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.6rem', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b' }}>Tenant Name</span>
              <strong style={{ color: '#0f172a' }}>{payment.tenantName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b' }}>Room & Property</span>
              <strong style={{ color: '#0f172a' }}>{payment.unit || payment.roomNo || payment.roomNumber}, {payment.propertyName || 'Sai Kripa Nivas'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b' }}>Payment Mode</span>
              <strong style={{ color: '#0f172a' }}>{payment.paymentMethod || payment.method || 'UPI'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b' }}>Transaction Reference</span>
              <strong style={{ color: '#0f172a' }}>{payment.reference || 'UPI-984210'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.6rem' }}>
              <span style={{ color: '#64748b' }}>Payment Date</span>
              <strong style={{ color: '#0f172a' }}>{payment.paidDate || payment.paymentDate ? new Date(payment.paidDate || payment.paymentDate).toLocaleDateString() : 'Paid'}</strong>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
            Thank you for prompt rent payment! Verified by Owner (Yashodhan Gurav).
          </div>
        </div>

        <div className="modal-footer" style={{ borderColor: '#e2e8f0', background: '#f8fafc' }}>
          <button onClick={handlePrint} className="btn btn-secondary btn-sm" style={{ background: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1' }}>
            <Printer size={15} /> Print Receipt
          </button>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
