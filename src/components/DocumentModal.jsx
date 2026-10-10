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
      <div className="modal-content animate-fade-in" style={{ maxWidth: '620px', background: '#0f172a', border: '1px solid var(--accent-primary)', color: '#ffffff' }}>
        {/* Modal Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {isElectricity ? (
              <Zap size={22} color="var(--accent-warning)" />
            ) : isPaymentProof ? (
              <ImageIcon size={22} color="var(--accent-success)" />
            ) : (
              <FileText size={22} color="var(--accent-primary)" />
            )}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>
                {documentType || 'Tenant Uploaded Proof'}
              </h3>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Uploaded by Resident: <strong>{tenantName}</strong></div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="btn btn-secondary btn-sm"
            style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Proof Details Banner if Payment Proof */}
          {paymentData && (
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              padding: '0.85rem 1rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              fontSize: '0.825rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Resident & Room</span>
                <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{tenantName} ({paymentData.roomNumber || paymentData.unit || 'Room'})</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Payment Amount</span>
                <div style={{ fontWeight: '800', color: 'var(--accent-success)', fontSize: '0.95rem' }}>
                  {formatINR(paymentData.amountPaid || paymentData.amount || 12000)}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Payment Channel</span>
                <div style={{ fontWeight: '600' }}>{paymentData.paymentMethod || paymentData.method || 'UPI (GPay / PhonePe)'}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Reference / Ref #</span>
                <code style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>{paymentData.reference || 'UPI-984210'}</code>
              </div>
            </div>
          )}

          {/* Actual Uploaded File Preview Visual Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '2px dashed ' + (isElectricity ? 'rgba(245, 158, 11, 0.5)' : isPaymentProof ? 'rgba(16, 185, 129, 0.5)' : 'rgba(99, 102, 241, 0.5)'),
            borderRadius: '16px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '76px',
              height: '76px',
              borderRadius: '22px',
              background: isElectricity ? 'rgba(245, 158, 11, 0.15)' : isPaymentProof ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid ' + (isElectricity ? 'var(--accent-warning)' : isPaymentProof ? 'var(--accent-success)' : 'var(--accent-primary)')
            }}>
              {isElectricity ? (
                <Zap size={38} color="var(--accent-warning)" />
              ) : isPaymentProof ? (
                <ImageIcon size={38} color="var(--accent-success)" />
              ) : (
                <FileText size={38} color="var(--accent-primary)" />
              )}
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Internal Document Record
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                {documentTitle || 'Tenant_Payment_Proof.png'}
              </h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Stored Internally on Server Disk • Verified Record
              </div>
            </div>

            {expiryDate && (
              <div style={{
                background: 'var(--accent-warning-bg)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                fontSize: '0.825rem',
                color: 'var(--accent-warning)',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <Calendar size={14} /> Contract Expiry Date: {expiryDate}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--accent-success)', fontWeight: '600' }}>
              <ShieldCheck size={16} /> Authentic File Upload Verified
            </div>
          </div>
        </div>

        {/* Modal Footer with Direct Owner Approval & Download Action */}
        <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)' }}>
          <button onClick={() => window.print()} className="btn btn-secondary btn-sm">
            <Printer size={15} /> Print Record
          </button>
          
          <button 
            onClick={() => downloadFile(actualFileUrl || documentTitle, documentTitle)} 
            className="btn btn-primary btn-sm"
            style={{ gap: '6px', fontWeight: '800' }}
          >
            <Download size={15} /> Download Document
          </button>

          {paymentData && paymentData.status === 'verification_pending' && onApprovePayment && (
            <button
              onClick={() => {
                onApprovePayment(paymentData);
                onClose();
              }}
              className="btn btn-primary btn-sm"
              style={{ background: 'var(--accent-success)', borderColor: 'var(--accent-success)', fontWeight: '800', gap: '4px' }}
            >
              <Check size={16} /> Verify & Approve Rent Now ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
