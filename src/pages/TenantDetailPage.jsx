import React from 'react';
import { downloadFile } from '../utils/downloadHelper';
import { formatINR } from '../utils/formatters';
import { formatDisplayDate } from '../utils/dateUtils';
import { 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  DollarSign, 
  Edit, 
  History, 
  Download, 
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
  const rawExpiry = tenant.agreementExpiryDate || tenant.leaseEnd;
  const expiryDate = rawExpiry ? new Date(rawExpiry) : null;
  const daysUntilExpiry = expiryDate && !isNaN(expiryDate.getTime()) ? Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)) : 365;
  const isExpired = daysUntilExpiry <= 0;
  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;

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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Breadcrumb Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button
          onClick={onBack}
          className="btn btn-secondary btn-sm"
          style={{ gap: '0.45rem' }}
        >
          <ArrowLeft size={14} /> Back to Tenants Directory
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onEdit(tenant)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.35rem' }}
          >
            <Edit size={13} /> Edit Profile
          </button>
          <button
            onClick={() => onRecordPayment(tenant)}
            className="btn btn-primary btn-sm"
            style={{ gap: '0.35rem' }}
          >
            <DollarSign size={13} /> Log Rent
          </button>
        </div>
      </div>

      {/* Main Tenant Profile Banner */}
      <div className="fintech-card" style={{
        padding: '1.25rem 1.4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src={tenant.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
            alt={tenant.name}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-sm)',
              objectFit: 'cover',
              border: '1px solid var(--border-color)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
                {tenant.name}
              </h1>
              <span className={`badge ${tenant.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                {tenant.paymentStatus === 'Paid' ? 'Settled' : 'Pending'}
              </span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: '500', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Home size={13} color="var(--accent-primary)" />
              <span className="tabular-nums">{roomName}</span> • {tenant.propertyName || 'Portfolio Residency'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Move-In: <span className="tabular-nums">{new Date(tenant.joiningDate || tenant.leaseStart || '2024-01-01').toLocaleDateString()}</span> • Phone: <span className="tabular-nums">{tenant.phone}</span>
            </div>
          </div>
        </div>

        {/* Quick Rate Counter Card */}
        <div style={{
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem 1.15rem',
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Monthly Rate</div>
          <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: '600', color: 'var(--status-success)', marginTop: '1px' }}>
            {formatINR(tenant.rentAmount)}
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
            Deposit: <span className="tabular-nums">{formatINR(tenant.deposit || tenant.rentAmount * 2)}</span>
          </div>
        </div>
      </div>

      {/* Grid Row: Documents & Identification | Agreement Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.15rem' }}>
        {/* Box 1: Identification & ID Proof */}
        <div className="fintech-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0 }}>
              <ShieldCheck size={16} color="var(--accent-primary)" /> Identity & Verification
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.8rem', marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Full Legal Name</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{tenant.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Contact Phone</span>
                <span className="tabular-nums" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{tenant.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Govt / Aadhar ID</span>
                <code style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', padding: '1px 6px', borderRadius: 'var(--radius-xs)', fontSize: '0.725rem', color: 'var(--text-primary)' }}>
                  {tenant.aadharId || tenant.idProof || 'Verified ID'}
                </code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.2rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Lease Inception</span>
                <span className="tabular-nums" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                  {new Date(tenant.joiningDate || tenant.leaseStart || '2024-01-01').toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.85rem' }}>
            <button
              onClick={() => onOpenDocument(idDocName, 'Aadhar / Govt ID Proof', tenant.name, '', null, null, idDocUrl)}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center', gap: '0.35rem' }}
            >
              <ShieldCheck size={13} /> View ID
            </button>

            <button
              onClick={() => downloadFile(idDocUrl, idDocName)}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center', gap: '0.35rem' }}
            >
              <Download size={13} /> Download
            </button>
          </div>
        </div>

        {/* Box 2: Agreement Management & Expiry Status */}
        <div className="fintech-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0 }}>
                <FileText size={16} color="var(--status-warning)" /> Lease Agreement
              </h3>
              <span className={`badge ${isExpired ? 'badge-danger' : isExpiringSoon ? 'badge-warning' : 'badge-success'} tabular-nums`}>
                {isExpired ? 'Expired' : isExpiringSoon ? `${daysUntilExpiry} Days Left` : 'Active Term'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.8rem', marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Agreement File</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{agreementName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Commencement Date</span>
                <span className="tabular-nums" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                  {formatDisplayDate(tenant.joiningDate || tenant.leaseStart) || 'Active'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.2rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Expiry Date</span>
                <span className="tabular-nums" style={{ color: isExpiringSoon || isExpired ? 'var(--status-warning)' : 'var(--text-primary)', fontWeight: '500' }}>
                  {formatDisplayDate(rawExpiry) || '1 Year Active'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.85rem' }}>
            <button
              onClick={() => onOpenDocument(agreementName, 'Rental Agreement PDF', tenant.name, tenant.agreementExpiryDate || tenant.leaseEnd, null, null, agreementUrl)}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center', gap: '0.35rem' }}
            >
              <FileText size={13} color="var(--status-warning)" /> Preview PDF
            </button>

            <button
              onClick={() => downloadFile(agreementUrl, agreementName)}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center', gap: '0.35rem' }}
            >
              <Download size={13} /> Download
            </button>
          </div>
        </div>
      </div>

      {/* FULL RENT PAYMENT HISTORY TIMELINE TABLE */}
      <div className="fintech-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0 }}>
              <History size={16} color="var(--accent-primary)" /> Payment & Settlement Ledger
            </h3>
            <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Historical payment transactions, reference IDs, and verification receipts
            </p>
          </div>

          <button
            onClick={() => onRecordPayment(tenant)}
            className="btn btn-primary btn-sm"
            style={{ height: '32px' }}
          >
            + Record Rent
          </button>
        </div>

        {/* History Table */}
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Payment Date</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th>Method</th>
                <th>Reference Code</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {tenantPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No payment transactions recorded for this tenant yet.
                  </td>
                </tr>
              ) : (
                tenantPayments.map((pay) => (
                  <tr key={pay.id || pay._id}>
                    <td>
                      <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                        {pay.month || pay.period}
                      </span>
                    </td>
                    <td>
                      <span className="tabular-nums" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {pay.paymentDate ? new Date(pay.paymentDate).toLocaleDateString() : pay.paidDate || 'Pending'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="tabular-nums" style={{ fontWeight: '600', color: 'var(--status-success)' }}>
                        {formatINR(pay.amountPaid || pay.amount)}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {pay.paymentMethod || pay.method}
                      </span>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        {pay.reference || 'N/A'}
                      </code>
                    </td>
                    <td>
                      <span className={`badge ${pay.status === 'paid' || pay.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                        {pay.status === 'paid' || pay.status === 'Paid' ? 'Settled' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {(pay.status === 'paid' || pay.status === 'Paid') ? (
                        <button
                          onClick={() => onViewReceipt(pay)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', lineHeight: '1.25' }}
                        >
                          View Receipt
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.725rem', color: 'var(--status-danger)' }}>Unpaid</span>
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
