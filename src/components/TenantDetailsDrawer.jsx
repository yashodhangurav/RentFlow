import React from 'react';
import { downloadFile } from '../utils/downloadHelper';
import { 
  X, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  CreditCard, 
  DollarSign, 
  Edit, 
  Eye, 
  History, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Download
} from 'lucide-react';

export const TenantDetailsDrawer = ({ 
  tenant, 
  onClose, 
  onEdit, 
  onRecordPayment, 
  onViewReceipt,
  onOpenDocument,
  payments = [] 
}) => {
  if (!tenant) return null;

  const tenantPayments = payments.filter(p => p.tenantId === tenant.id);
  const roomName = tenant.roomNo || tenant.unit || 'Room';

  // Calculate Agreement Expiry Countdown
  const today = new Date();
  const expiryDate = new Date(tenant.agreementExpiryDate || tenant.leaseEnd);
  const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

  const idDocUrl = (tenant.idProofCloudUrl && tenant.idProofCloudUrl.length > 5)
    ? tenant.idProofCloudUrl
    : (tenant.idProof && (tenant.idProof.startsWith('http') || tenant.idProof.startsWith('data:') || tenant.idProof.includes('/uploads')))
      ? tenant.idProof
      : tenant.idProofDoc || tenant.idProof || `${tenant.name}_Aadhar.pdf`;

  const idDocName = tenant.idProofDocName || tenant.idProofDoc || `${tenant.name}_Aadhar.pdf`;

  const agreementUrl = (tenant.agreementCloudUrl && tenant.agreementCloudUrl.length > 5)
    ? tenant.agreementCloudUrl
    : (tenant.agreementFile && (tenant.agreementFile.startsWith('http') || tenant.agreementFile.startsWith('data:') || tenant.agreementFile.includes('/uploads')))
      ? tenant.agreementFile
      : tenant.agreementPdf || tenant.agreementFile || `Agreement_${roomName}.pdf`;

  const agreementName = tenant.agreementPdfName || tenant.agreementPdf || `Agreement_${roomName}.pdf`;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      maxWidth: '480px',
      background: 'var(--bg-card)',
      borderLeft: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-xl)',
      zIndex: 120,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      {/* Drawer Header */}
      <div style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-hover)'
      }}>
        <div>
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tenant Profile & Ledger
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {tenant.name} ({roomName})
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

      {/* Drawer Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Profile Card Summary */}
        <div style={{
          padding: '1rem',
          background: 'var(--bg-hover)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem'
        }}>
          <img
            src={tenant.avatar}
            alt={tenant.name}
            style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-color)' }}
          />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{tenant.name}</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 6px 0' }}>
              {roomName} • {tenant.propertyName}
            </div>
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
              <span className={`badge ${tenant.paymentStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                {tenant.paymentStatus === 'Paid' ? 'Rent Paid' : 'Payment Pending'}
              </span>
              {daysUntilExpiry <= 15 ? (
                <span className="badge badge-warning tabular-nums">
                  Lease Expiring ({daysUntilExpiry}d)
                </span>
              ) : (
                <span className="badge badge-info">
                  Active Lease
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Action Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <button 
            onClick={() => onRecordPayment(tenant)}
            className="btn btn-primary btn-sm"
            style={{ justifyContent: 'center' }}
          >
            <DollarSign size={14} /> Record Payment
          </button>
          <button 
            onClick={() => onEdit(tenant)}
            className="btn btn-secondary btn-sm"
            style={{ justifyContent: 'center' }}
          >
            <Edit size={14} /> Edit Record
          </button>
        </div>

        {/* Contact & ID Details */}
        <div className="fintech-card" style={{ padding: '0.875rem' }}>
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Identification & Contact
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.825rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Phone Number:</span>
              <strong style={{ color: 'var(--text-primary)' }} className="tabular-nums">{tenant.phone}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Aadhar / National ID:</span>
              <code style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', fontSize: '0.75rem' }} className="tabular-nums">
                {tenant.aadharId || 'Not Provided'}
              </code>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Commencement Date:</span>
              <span className="tabular-nums" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{tenant.joiningDate || tenant.leaseStart}</span>
            </div>

            {/* ID Proof Document View & Download Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => onOpenDocument(idDocName, 'Aadhar / Govt ID Proof', tenant.name, '', null, null, idDocUrl)}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'center', gap: '0.375rem', fontSize: '0.75rem' }}
              >
                <ShieldCheck size={13} /> View ID
              </button>

              <button
                onClick={() => downloadFile(idDocUrl, idDocName)}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'center', gap: '0.375rem', fontSize: '0.75rem' }}
              >
                <Download size={13} /> Download
              </button>
            </div>
          </div>
        </div>

        {/* Agreement Management Box */}
        <div className="fintech-card" style={{ padding: '0.875rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Lease Terms & Agreement
            </div>
            <span style={{ fontSize: '0.725rem', color: daysUntilExpiry <= 15 ? 'var(--status-pending-text)' : 'var(--status-paid-text)', fontWeight: 600 }} className="tabular-nums">
              {daysUntilExpiry > 0 ? `${daysUntilExpiry} Days Remaining` : 'Expired'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.825rem', marginBottom: '0.75rem' }}>
            <div style={{ background: 'var(--bg-hover)', padding: '0.625rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Monthly Rent</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }} className="tabular-nums">
                ₹{tenant.rentAmount?.toLocaleString()}
              </div>
            </div>
            <div style={{ background: 'var(--bg-hover)', padding: '0.625rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Lease Expiry</div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: daysUntilExpiry <= 15 ? 'var(--status-pending-text)' : 'var(--text-primary)' }} className="tabular-nums">
                {tenant.agreementExpiryDate || tenant.leaseEnd}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              onClick={() => onOpenDocument(agreementName, 'Rental Agreement PDF', tenant.name, tenant.agreementExpiryDate, null, null, agreementUrl)}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center', gap: '0.375rem', fontSize: '0.75rem' }}
            >
              <FileText size={13} /> View Lease PDF
            </button>

            <button
              onClick={() => downloadFile(agreementUrl, agreementName)}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center', gap: '0.375rem', fontSize: '0.75rem' }}
            >
              <Download size={13} /> Download
            </button>
          </div>
        </div>

        {/* History System Section */}
        <div className="fintech-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <History size={14} color="var(--accent-primary)" /> Activity & Settlement Timeline
          </div>

          {/* Payment History Log */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {tenant.history && tenant.history.map((event, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                fontSize: '0.75rem',
                lineHeight: '1.45',
                padding: '0.625rem 0.75rem',
                background: 'var(--bg-hover)',
                borderRadius: 'var(--radius-xs)',
                borderLeft: '3px solid var(--accent-primary)'
              }}>
                <div style={{ fontWeight: 600, color: 'var(--text-secondary)', minWidth: '85px', flexShrink: 0, whiteSpace: 'nowrap' }} className="tabular-nums">
                  {event.date}
                </div>
                <div style={{ flex: 1, color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                  <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>[{event.type}]</span> {event.details}
                </div>
              </div>
            ))}

            {tenantPayments.map((pay) => (
              <div key={pay.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.625rem 0.85rem',
                lineHeight: '1.45',
                background: 'var(--bg-hover)',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-color)',
                gap: '0.75rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.3' }}>{pay.period} Rent Settled</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '2px' }}>{pay.method} • Ref: {pay.reference}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ color: 'var(--status-paid-text)', fontSize: '0.875rem', fontWeight: 700 }} className="tabular-nums">₹{pay.amount?.toLocaleString()}</span>
                  <div style={{ marginTop: '2px' }}>
                    <button
                      onClick={() => onViewReceipt(pay)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.7rem', padding: '2px 8px', minHeight: '22px' }}
                    >
                      Receipt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
