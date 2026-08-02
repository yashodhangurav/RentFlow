import React from 'react';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  CreditCard, 
  DollarSign, 
  Edit, 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  Printer,
  Download,
  Building,
  Home
} from 'lucide-react';

export const TenantDetailPage = ({ 
  tenant, 
  onBack, 
  onEdit, 
  onRecordPayment, 
  onViewReceipt,
  onOpenDocument,
  payments = [] 
}) => {
  if (!tenant) return null;

  const roomName = tenant.roomNo || tenant.roomNumber || tenant.unit || 'Room';
  const tenantPayments = payments.filter(p => p.tenantId === tenant.id || p.tenantId === tenant._id || p.tenantName === tenant.name);

  // Calculate Agreement Expiry Countdown
  const today = new Date();
  const expiryDate = new Date(tenant.agreementExpiryDate || tenant.leaseEnd || '2026-12-31');
  const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  const isExpired = daysUntilExpiry <= 0;
  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Breadcrumb Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          onClick={onBack}
          className="btn btn-secondary btn-sm"
          style={{ gap: '0.5rem' }}
        >
          <ArrowLeft size={16} /> Back to Tenants Directory
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => onEdit(tenant)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.4rem' }}
          >
            <Edit size={15} /> Edit Details
          </button>
          <button
            onClick={() => onRecordPayment(tenant)}
            className="btn btn-primary btn-sm"
            style={{ gap: '0.4rem' }}
          >
            <DollarSign size={15} /> Log Rent Payment
          </button>
        </div>
      </div>

      {/* Main Tenant Profile Banner */}
      <div className="glass-card" style={{
        padding: '1.75rem',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(30, 27, 75, 0.4) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img
            src={tenant.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
            alt={tenant.name}
            style={{
              width: '85px',
              height: '85px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--accent-primary)',
              boxShadow: '0 8px 20px var(--accent-glow)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '800' }}>{tenant.name}</h1>
              <span className={`badge ${tenant.paymentStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                {tenant.paymentStatus === 'Paid' ? 'Rent Paid' : '🚨 Rent Pending'}
              </span>
            </div>
            <div style={{ fontSize: '1rem', color: 'var(--accent-primary)', fontWeight: '700', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Home size={16} /> {roomName} • {tenant.propertyName || 'Greenwood Residency'}
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Joined: <strong>{new Date(tenant.joiningDate || tenant.leaseStart || '2024-01-01').toLocaleDateString()}</strong> • Phone: <strong>{tenant.phone}</strong>
            </div>
          </div>
        </div>

        {/* Quick Rent Counter Card */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.5rem',
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', uppercase: 'true' }}>Monthly Rent Amount</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-success)' }}>
            ₹{tenant.rentAmount?.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Deposit Held: ₹{(tenant.deposit || tenant.rentAmount * 2)?.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Grid Row: Documents & Identification | Agreement Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Box 1: Identification & ID Proof */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="var(--accent-primary)" /> Identity & Contact Information
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Full Legal Name</span>
                <strong>{tenant.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Phone Number</span>
                <strong>{tenant.phone}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Aadhar / Govt ID No.</span>
                <code style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent-primary)', fontWeight: '700' }}>
                  {tenant.aadharId || tenant.idProof || 'Verified ID'}
                </code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Move-In / Joining Date</span>
                <strong>{new Date(tenant.joiningDate || tenant.leaseStart || '2024-01-01').toLocaleDateString()}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenDocument(tenant.idProofDoc || tenant.idProof || `${tenant.name}_Aadhar.pdf`, 'Aadhar / Govt ID Proof', tenant.name)}
            className="btn btn-outline btn-sm"
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', gap: '0.5rem' }}
          >
            <ShieldCheck size={15} /> View Uploaded ID Proof Document
          </button>
        </div>

        {/* Box 2: Agreement Management & Expiry Status */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: isExpiringSoon || isExpired ? '1px solid rgba(245, 158, 11, 0.6)' : '1px solid var(--border-color)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="var(--accent-warning)" /> Rental Agreement Details
              </h3>
              <span className={`badge ${isExpired ? 'badge-danger' : isExpiringSoon ? 'badge-warning' : 'badge-success'}`}>
                {isExpired ? 'Expired' : isExpiringSoon ? `Expires in ${daysUntilExpiry} Days` : 'Active Contract'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Agreement Document</span>
                <strong>{tenant.agreementPdf || tenant.agreementFile || `Agreement_${roomName}.pdf`}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Contract Start Date</span>
                <strong>{new Date(tenant.joiningDate || tenant.leaseStart || '2024-01-01').toLocaleDateString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Agreement Expiry Date</span>
                <strong style={{ color: isExpiringSoon || isExpired ? 'var(--accent-warning)' : 'inherit' }}>
                  {new Date(tenant.agreementExpiryDate || tenant.leaseEnd || '2026-12-31').toLocaleDateString()}
                </strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenDocument(tenant.agreementPdf || tenant.agreementFile || `Agreement_${roomName}.pdf`, 'Rental Agreement PDF', tenant.name, tenant.agreementExpiryDate || tenant.leaseEnd)}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', gap: '0.5rem' }}
          >
            <FileText size={15} color="var(--accent-warning)" /> Open & Preview Agreement PDF
          </button>
        </div>
      </div>

      {/* FULL RENT PAYMENT HISTORY TIMELINE TABLE */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={18} color="var(--accent-primary)" /> Full Rent Payment & Activity History
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Complete record of all monthly rent settlements, receipts, and tenancy history events.
            </p>
          </div>

          <button
            onClick={() => onRecordPayment(tenant)}
            className="btn btn-primary btn-sm"
          >
            + Record New Rent Payment
          </button>
        </div>

        {/* History Table */}
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Billing Period</th>
                <th>Payment Date</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Reference Code</th>
                <th>Rent Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {tenantPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No payment history recorded yet. Click "Record New Rent Payment" to log rent.
                  </td>
                </tr>
              ) : (
                tenantPayments.map((pay) => (
                  <tr key={pay.id || pay._id}>
                    <td>
                      <strong style={{ fontSize: '0.9rem' }}>{pay.month || pay.period}</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        {pay.paymentDate ? new Date(pay.paymentDate).toLocaleDateString() : pay.paidDate || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--accent-success)', fontSize: '0.95rem' }}>
                        ₹{(pay.amountPaid || pay.amount)?.toLocaleString()}
                      </strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{pay.paymentMethod || pay.method}</span>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--accent-primary)' }}>
                        {pay.reference || 'N/A'}
                      </code>
                    </td>
                    <td>
                      <span className={`badge ${pay.status === 'paid' || pay.status === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                        {pay.status === 'paid' || pay.status === 'Paid' ? 'Paid' : '🚨 Pending'}
                      </span>
                    </td>
                    <td>
                      {(pay.status === 'paid' || pay.status === 'Paid') ? (
                        <button
                          onClick={() => onViewReceipt(pay)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.725rem' }}
                        >
                          View Receipt
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-danger)' }}>Unpaid</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
