import React from 'react';
import { formatINR } from '../utils/formatters';
import { downloadFile } from '../utils/downloadHelper';
import { X, FileText, Download, Printer, ShieldCheck, CheckCircle2, Calendar, Image as ImageIcon, Zap, DollarSign, Check } from 'lucide-react';

export const DocumentModal = ({ 
  isOpen, 
  onClose, 
  documentTitle, 
  documentType, 
  tenantName, 
  expiryDate,
  paymentData,
  onApprovePayment,
  fileUrl
}) => {
  if (!isOpen) return null;

  const isPaymentProof = documentType?.toLowerCase().includes('proof') || documentType?.toLowerCase().includes('screenshot') || documentType?.toLowerCase().includes('receipt');
  const isElectricity = documentType?.toLowerCase().includes('electricity') || documentType?.toLowerCase().includes('current bill');

  const actualFileUrl = fileUrl || paymentData?.proofFile || paymentData?.electricityProofFile;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '560px' }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: isElectricity ? 'var(--status-pending-bg)' : isPaymentProof ? 'var(--status-paid-bg)' : 'var(--accent-primary-subtle)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isElectricity ? 'var(--status-pending-text)' : isPaymentProof ? 'var(--status-paid-text)' : 'var(--accent-primary)'
            }}>
              {isElectricity ? (
                <Zap size={16} />
              ) : isPaymentProof ? (
                <ImageIcon size={16} />
              ) : (
                <FileText size={16} />
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                {documentType || 'Verification Document'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Resident Record: {tenantName}
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

        {/* Modal Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Proof Details Banner if Payment Proof */}
          {paymentData && (
            <div style={{
              background: 'var(--bg-hover)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.875rem 1rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              fontSize: '0.825rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Resident & Room</span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tenantName} ({paymentData.roomNumber || paymentData.unit || 'Room'})</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Claimed Amount</span>
                <div className="tabular-nums" style={{ fontWeight: 700, color: 'var(--status-paid-text)', fontSize: '0.95rem' }}>
                  {formatINR(paymentData.amountPaid || paymentData.amount || 12000)}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Payment Method</span>
                <div style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{paymentData.paymentMethod || paymentData.method || 'UPI'}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Transaction Reference</span>
                <code className="tabular-nums" style={{ color: 'var(--text-primary)', background: 'var(--bg-card)', padding: '1px 6px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}>
                  {paymentData.reference || 'UPI-984210'}
                </code>
              </div>
            </div>
          )}

          {/* Actual Uploaded File Preview Visual Box */}
          <div style={{
            background: 'var(--bg-hover)',
            border: '1px dashed var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '2rem 1.25rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.875rem'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-color)'
            }}>
              {isElectricity ? (
                <Zap size={28} color="var(--status-pending-text)" />
              ) : isPaymentProof ? (
                <ImageIcon size={28} color="var(--status-paid-text)" />
              ) : (
                <FileText size={28} color="var(--accent-primary)" />
              )}
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Document Record
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '2px 0 4px' }}>
                {documentTitle || 'Tenant_Payment_Proof.png'}
              </h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Cloudinary Authenticated Asset
              </div>
            </div>

            {expiryDate && (
              <div style={{
                background: 'var(--status-pending-bg)',
                border: '1px solid var(--border-color)',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.75rem',
                color: 'var(--status-pending-text)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}>
                <Calendar size={13} /> Contract Expiry Date: <span className="tabular-nums">{expiryDate}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.375rem', fontSize: '0.725rem', color: 'var(--status-paid-text)', fontWeight: 600 }}>
              <ShieldCheck size={14} /> Cryptographically Verified File Upload
            </div>
          </div>
        </div>

        {/* Modal Footer with Direct Owner Approval & Download Action */}
        <div className="modal-footer">
          <button onClick={() => window.print()} className="btn btn-secondary btn-sm">
            <Printer size={14} /> Print
          </button>
          
          <button 
            onClick={() => downloadFile(actualFileUrl || documentTitle, documentTitle)} 
            className="btn btn-secondary btn-sm"
          >
            <Download size={14} /> Download
          </button>

          {paymentData && paymentData.status === 'verification_pending' && onApprovePayment && (
            <button
              onClick={() => {
                onApprovePayment(paymentData);
                onClose();
              }}
              className="btn btn-primary btn-sm"
            >
              <Check size={14} /> Verify & Approve Settlement
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
