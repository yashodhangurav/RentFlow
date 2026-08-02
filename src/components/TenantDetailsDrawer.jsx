import React from 'react';
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
  Clock 
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

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      maxWidth: '520px',
      background: 'var(--bg-surface)',
      borderLeft: '1px solid var(--border-color-hover)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 120,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      {/* Drawer Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Tenant Complete Record & History
        </div>
        <button 
          onClick={onClose}
          className="btn btn-secondary btn-sm"
          style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Drawer Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Profile Card Summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src={tenant.avatar}
            alt={tenant.name}
            style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-primary)' }}
          />
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>{tenant.name}</h3>
            <div style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: '700', margin: '2px 0' }}>
              {roomName} • {tenant.propertyName}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
              <span className={`badge ${tenant.paymentStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                {tenant.paymentStatus === 'Paid' ? 'Rent Paid' : '🚨 Rent Pending'}
              </span>
              {daysUntilExpiry <= 15 ? (
                <span className="badge badge-warning">
                  ⚠️ Agreement Expiring ({daysUntilExpiry} days left)
                </span>
              ) : (
                <span className="badge badge-info">
                  Agreement Active
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Action Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <button 
            onClick={() => onRecordPayment(tenant)}
            className="btn btn-primary btn-sm"
            style={{ justifyContent: 'center' }}
          >
            <DollarSign size={15} /> Record Rent
          </button>
          <button 
            onClick={() => onEdit(tenant)}
            className="btn btn-secondary btn-sm"
            style={{ justifyContent: 'center' }}
          >
            <Edit size={15} /> Edit Details
          </button>
        </div>

        {/* Contact & ID Details */}
        <div className="glass-card" style={{ padding: '1rem' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Personal & Identification
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Phone Number:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{tenant.phone}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Aadhar / Govt ID:</span>
              <code style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent-primary)', fontWeight: '700' }}>
                {tenant.aadharId || 'Not Provided'}
              </code>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Joining Date:</span>
              <strong>{tenant.joiningDate || tenant.leaseStart}</strong>
            </div>

            {/* ID Proof Document View Button */}
            <div style={{ marginTop: '0.4rem' }}>
              <button
                onClick={() => onOpenDocument(tenant.idProofDoc || `${tenant.name}_Aadhar.pdf`, 'Aadhar / Govt ID Proof', tenant.name)}
                className="btn btn-outline btn-sm"
                style={{ width: '100%', justifyContent: 'center', gap: '0.4rem', fontSize: '0.775rem' }}
              >
                <ShieldCheck size={14} /> View Uploaded ID Proof ({tenant.idProofDoc || 'Aadhar.pdf'})
              </button>
            </div>
          </div>
        </div>

        {/* Agreement Management Box */}
        <div className="glass-card" style={{ padding: '1rem', border: daysUntilExpiry <= 15 ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Agreement PDF & Expiry
            </h4>
            <span style={{ fontSize: '0.75rem', color: daysUntilExpiry <= 15 ? 'var(--accent-warning)' : 'var(--accent-success)', fontWeight: '700' }}>
              {daysUntilExpiry > 0 ? `${daysUntilExpiry} Days Remaining` : 'Expired'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Monthly Rent</div>
              <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--accent-success)' }}>
                ₹{tenant.rentAmount?.toLocaleString()}/mo
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Agreement Expiry</div>
              <div style={{ fontWeight: '700', color: daysUntilExpiry <= 15 ? 'var(--accent-warning)' : 'inherit' }}>
                {tenant.agreementExpiryDate || tenant.leaseEnd}
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenDocument(tenant.agreementPdf || `Agreement_${roomName}.pdf`, 'Rental Agreement PDF', tenant.name, tenant.agreementExpiryDate)}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center', gap: '0.4rem', fontSize: '0.775rem' }}
          >
            <FileText size={14} color="var(--accent-warning)" /> Open Agreement Document ({tenant.agreementPdf || 'Agreement.pdf'})
          </button>
        </div>

        {/* History System Section */}
        <div className="glass-card" style={{ padding: '1rem' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <History size={15} color="var(--accent-primary)" /> Tenant History Timeline
          </h4>

          {/* Payment History Log */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {tenant.history && tenant.history.map((event, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                fontSize: '0.775rem',
                padding: '0.5rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '6px',
                borderLeft: '3px solid var(--accent-primary)'
              }}>
                <div style={{ fontWeight: '700', color: 'var(--text-primary)', width: '80px', flexShrink: 0 }}>
                  {event.date}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>[{event.type}]</span> {event.details}
                </div>
              </div>
            ))}

            {tenantPayments.map((pay) => (
              <div key={pay.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>{pay.period} Rent Paid</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{pay.method} • Ref: {pay.reference}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ color: 'var(--accent-success)', fontSize: '0.85rem' }}>₹{pay.amount?.toLocaleString()}</strong>
                  <div>
                    <button
                      onClick={() => onViewReceipt(pay)}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.7rem', cursor: 'pointer', textDecoration: 'underline' }}
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
