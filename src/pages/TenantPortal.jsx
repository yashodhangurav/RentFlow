import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/formatters';
import { getCurrentMonthYear, getDynamicMonthOptions, formatDisplayDate } from '../utils/dateUtils';
import { apiService } from '../api/index';
import { 
  Home, 
  FileText, 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  Clock, 
  LogOut, 
  History,
  Zap,
  Building2
} from 'lucide-react';

export const TenantPortal = ({ 
  tenants = [], 
  payments = [], 
  onSubmitPaymentProof, 
  onViewReceipt,
  onOpenDocument 
}) => {
  const { user, logout } = useAuth();
  
  const myTenant = tenants.find(t => t.id === user?.tenantId || t._id === user?.tenantId || t.name === user?.name) || tenants[0];
  
  const extraMonths = useMemo(() => {
    return Array.from(new Set(payments.map(p => p.month || p.period).filter(Boolean)));
  }, [payments]);

  const monthOptions = useMemo(() => {
    return getDynamicMonthOptions(6, 1, new Date(), extraMonths);
  }, [extraMonths]);

  const [selectedMonth, setSelectedMonth] = useState(() => getCurrentMonthYear());
  
  // Rent Proof & Electricity Bill Proof
  const [rentRef, setRentRef] = useState('');
  const [rentMethod, setRentMethod] = useState('UPI (Google Pay / PhonePe)');
  const [rentProofName, setRentProofName] = useState('');
  const [rentCloudUrl, setRentCloudUrl] = useState('');

  const [electricityAmount, setElectricityAmount] = useState(1450);
  const [electricityRef, setElectricityRef] = useState('');
  const [electricityProofName, setElectricityProofName] = useState('');
  const [electricityCloudUrl, setElectricityCloudUrl] = useState('');

  const [uploadingCloud, setUploadingCloud] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const myPayments = payments.filter(p => 
    p.tenantId === myTenant?.id || p.tenantId === myTenant?._id || p.tenantName === myTenant?.name
  );

  const currentMonthPayment = myPayments.find(p => p.month === selectedMonth || p.period === selectedMonth);
  const roomName = myTenant?.roomNo || myTenant?.roomNumber || myTenant?.unit || 'Room 101';

  const isPaid = (currentMonthPayment && (currentMonthPayment.status === 'paid' || currentMonthPayment.status === 'Paid')) || myTenant?.paymentStatus === 'Paid';
  const isVerificationPending = currentMonthPayment?.status === 'verification_pending';

  const today = new Date();
  const currentDay = today.getDate();
  const deadlineDay = 10;
  const daysLeftToDeadline = Math.max(0, deadlineDay - currentDay);
  const isPastDeadline = currentDay > deadlineDay;

  // Handle Rent Screenshot Upload to Cloudinary
  const handleRentProofUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingCloud(true);
      setRentProofName(file.name);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const cloudUrl = await apiService.uploadToCloudinary(reader.result, 'rent_payment_proofs');
        setRentCloudUrl(cloudUrl);
        setUploadingCloud(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Electricity Bill Receipt Upload to Cloudinary
  const handleElectricityProofUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingCloud(true);
      setElectricityProofName(file.name);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const cloudUrl = await apiService.uploadToCloudinary(reader.result, 'electricity_bill_proofs');
        setElectricityCloudUrl(cloudUrl);
        setUploadingCloud(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = (e) => {
    e.preventDefault();
    if (!rentProofName && !rentRef) {
      alert('Please upload a rent payment screenshot or enter transaction ref.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitPaymentProof({
        tenantId: myTenant.id || myTenant._id,
        tenantName: myTenant.name,
        roomNumber: roomName,
        month: selectedMonth,
        amountPaid: myTenant.rentAmount || 12000,
        paymentDate: new Date().toISOString().split('T')[0],
        status: 'verification_pending',
        paymentMethod: rentMethod,
        reference: rentRef || `UPI-${Math.floor(100000 + Math.random() * 900000)}`,
        proofFile: rentCloudUrl || rentProofName || 'Rent_UPI_Screenshot.png',
        electricityAmount: Number(electricityAmount),
        electricityRef: electricityRef || `ELEC-REF-${Math.floor(10000 + Math.random() * 90000)}`,
        electricityProofFile: electricityCloudUrl || electricityProofName || 'Electricity_Bill_Receipt.png'
      });
      setIsSubmitting(false);
      setRentProofName('');
      setRentRef('');
      setRentCloudUrl('');
      setElectricityProofName('');
      setElectricityRef('');
      setElectricityCloudUrl('');
    }, 400);
  };

  const expiryDate = myTenant?.agreementExpiryDate || myTenant?.leaseEnd;
  const daysUntilExpiry = expiryDate ? Math.ceil((new Date(expiryDate) - today) / (1000 * 60 * 60 * 24)) : 365;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem 1rem' }}>
      {/* Brand Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(37, 99, 235, 0.35)'
          }}>
            <Building2 size={16} />
          </div>
          <div>
            <span style={{ fontWeight: '700', fontSize: '0.9rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              EstatePulse
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
              • Resident Portal
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="fintech-card" style={{
        padding: '1.25rem 1.4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img
            src={myTenant?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
            alt={myTenant?.name}
            style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-color)' }}
          />
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>
              Welcome, {myTenant?.name}
            </h1>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', fontWeight: '500', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Home size={13} color="var(--accent-primary)" />
              <span className="tabular-nums">{roomName}</span> • {myTenant?.propertyName || 'Sai Kripa Nivas'}
            </div>
          </div>
        </div>

        <button onClick={logout} className="btn btn-secondary btn-sm" id="tenant-logout-btn">
          <LogOut size={13} /> Sign Out
        </button>
      </div>

      {/* MONTHLY DEADLINE ALERT BANNER */}
      {!isPaid && (
        <div style={{
          background: isPastDeadline ? 'var(--status-danger-bg)' : 'var(--status-warning-bg)',
          border: `1px solid ${isPastDeadline ? 'var(--status-danger-border)' : 'var(--status-warning-border)'}`,
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1.15rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Clock size={18} color={isPastDeadline ? 'var(--status-danger)' : 'var(--status-warning)'} />
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.85rem', color: isPastDeadline ? 'var(--status-danger)' : 'var(--status-warning)' }}>
                Rent & Electricity Dues Scheduled by 10th
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)', marginTop: '1px' }}>
                {isPastDeadline ? (
                  <span>Grace period ended. Please upload transaction proofs below.</span>
                ) : (
                  <span>You have <strong className="tabular-nums">{daysLeftToDeadline} day(s)</strong> remaining before the monthly 10th deadline.</span>
                )}
              </div>
            </div>
          </div>

          <span className={`badge ${isPastDeadline ? 'badge-danger' : 'badge-warning'} tabular-nums`}>
            {isPastDeadline ? 'Past Due' : `${daysLeftToDeadline} Days Left`}
          </span>
        </div>
      )}

      {/* Grid Row: My Room Info | Pay Rent & Upload Electricity Bill */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.15rem' }}>
        {/* Card 1: My Room Info & Agreement */}
        <div className="fintech-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0 }}>
              <Home size={15} color="var(--accent-primary)" /> Tenancy Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.8rem', marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Assigned Unit</span>
                <span className="tabular-nums" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{roomName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Monthly Rent</span>
                <span className="tabular-nums" style={{ color: 'var(--status-success)', fontWeight: '600' }}>{formatINR(myTenant?.rentAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Due</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>10th of Every Month</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Govt / Aadhar ID</span>
                <code style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', padding: '1px 5px', borderRadius: 'var(--radius-xs)', fontSize: '0.725rem', color: 'var(--text-primary)' }}>
                  {myTenant?.aadharId || 'Verified ID'}
                </code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.2rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Agreement Expiry</span>
                <span className="tabular-nums" style={{ color: daysUntilExpiry <= 7 ? 'var(--status-warning)' : 'var(--text-primary)', fontWeight: '500' }}>
                  {formatDisplayDate(expiryDate) || 'Active'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem' }}>
            <button
              onClick={() => onOpenDocument(myTenant?.idProofCloudUrl || myTenant?.idProofDoc || 'Aadhar_Card.pdf', 'My Aadhar ID Proof', myTenant?.name)}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.725rem', gap: '3px' }}
            >
              <ShieldCheck size={13} /> View ID
            </button>
            <button
              onClick={() => onOpenDocument(myTenant?.agreementCloudUrl || myTenant?.agreementPdf || 'Agreement.pdf', 'My Rental Agreement', myTenant?.name, myTenant?.agreementExpiryDate)}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.725rem', gap: '3px' }}
            >
              <FileText size={13} /> Agreement PDF
            </button>
          </div>
        </div>

        {/* Card 2: MONTHLY RENT & ELECTRICITY BILL PROOF SUBMISSION */}
        <div className="fintech-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '600', margin: 0 }}>
                Submit Payment Proof
              </h3>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Billing Period: <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{selectedMonth}</span>
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select
                className="form-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{ height: '30px', fontSize: '0.75rem', padding: '0 0.5rem' }}
                aria-label="Billing Month"
              >
                {monthOptions.map((m) => (
                  <option key={m} value={m}>
                    {m} {m === getCurrentMonthYear() ? '• Current' : ''}
                  </option>
                ))}
              </select>
              <span className={`badge ${isPaid ? 'badge-success' : isVerificationPending ? 'badge-warning' : 'badge-danger'}`}>
                {isPaid ? 'Verified' : isVerificationPending ? 'Audit Pending' : 'Action Required'}
              </span>
            </div>
          </div>

          {uploadingCloud && (
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: 'var(--accent-primary)', fontSize: '0.725rem', textAlign: 'center', marginBottom: '0.65rem', fontWeight: '500' }}>
              Uploading screenshot...
            </div>
          )}

          {isPaid ? (
            <div style={{ background: 'var(--status-success-bg)', border: '1px solid var(--status-success-border)', borderRadius: 'var(--radius-sm)', padding: '1rem', textAlign: 'center' }}>
              <CheckCircle2 size={28} color="var(--status-success)" style={{ margin: '0 auto 0.35rem' }} />
              <h4 style={{ fontWeight: '600', color: 'var(--status-success)', fontSize: '0.95rem' }}>Payment Verified</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Your rent of <strong className="tabular-nums">{formatINR(myTenant?.rentAmount)}</strong> for {selectedMonth} has been audited and approved.
              </p>
              {currentMonthPayment && (
                <button
                  onClick={() => onViewReceipt(currentMonthPayment)}
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '0.75rem', gap: '4px' }}
                >
                  <FileText size={13} /> View Receipt
                </button>
              )}
            </div>
          ) : isVerificationPending ? (
            <div style={{ background: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)', borderRadius: 'var(--radius-sm)', padding: '1rem', textAlign: 'center' }}>
              <Clock size={28} color="var(--status-warning)" style={{ margin: '0 auto 0.35rem' }} />
              <h4 style={{ fontWeight: '600', color: 'var(--status-warning)', fontSize: '0.95rem' }}>Audit In Progress</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Your payment screenshot is awaiting owner verification.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitProof}>
              {/* Step 1: Rent Payment Proof */}
              <div style={{ marginBottom: '0.75rem', background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  1. Rent Payment Screenshot (<span className="tabular-nums">{formatINR(myTenant?.rentAmount)}</span>)
                </div>
                
                <div style={{
                  padding: '0.45rem 0.65rem',
                  background: 'var(--bg-input)',
                  border: '1px dashed var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  marginBottom: '0.45rem'
                }}>
                  <Upload size={13} color="var(--text-muted)" />
                  <input
                    type="file"
                    id="tenant-rent-proof-file"
                    style={{ display: 'none' }}
                    onChange={handleRentProofUpload}
                    accept="image/*,.pdf"
                  />
                  <label htmlFor="tenant-rent-proof-file" style={{ cursor: 'pointer', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '500' }}>
                    {rentProofName ? `File: ${rentProofName}` : 'Upload Rent Screenshot'}
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.4rem' }}>
                  <select
                    className="form-select"
                    value={rentMethod}
                    onChange={(e) => setRentMethod(e.target.value)}
                    style={{ fontSize: '0.75rem', height: '30px' }}
                    aria-label="Payment Method"
                  >
                    <option value="UPI (Google Pay / PhonePe)">UPI (GPay/PhonePe)</option>
                    <option value="NetBanking (IMPS/NEFT)">NetBanking</option>
                    <option value="Cash / Handover">Cash</option>
                  </select>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="UPI / Ref ID"
                    value={rentRef}
                    onChange={(e) => setRentRef(e.target.value)}
                    style={{ fontSize: '0.75rem', height: '30px' }}
                  />
                </div>
              </div>

              {/* Step 2: Electricity / Current Bill Payment Proof */}
              <div style={{ marginBottom: '0.85rem', background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Zap size={13} color="var(--status-warning)" /> 2. Electricity Bill Receipt
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <input
                    type="number"
                    className="form-input tabular-nums"
                    placeholder="Amount (₹)"
                    value={electricityAmount}
                    onChange={(e) => setElectricityAmount(e.target.value)}
                    style={{ fontSize: '0.75rem', height: '30px' }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Consumer / Bill ID"
                    value={electricityRef}
                    onChange={(e) => setElectricityRef(e.target.value)}
                    style={{ fontSize: '0.75rem', height: '30px' }}
                  />
                </div>

                <div style={{
                  padding: '0.45rem 0.65rem',
                  background: 'var(--bg-input)',
                  border: '1px dashed var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}>
                  <Upload size={13} color="var(--text-muted)" />
                  <input
                    type="file"
                    id="tenant-elec-proof-file"
                    style={{ display: 'none' }}
                    onChange={handleElectricityProofUpload}
                    accept="image/*,.pdf"
                  />
                  <label htmlFor="tenant-elec-proof-file" style={{ cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                    {electricityProofName ? `File: ${electricityProofName}` : 'Upload Bill Receipt'}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.55rem', justifyContent: 'center', fontSize: '0.8125rem' }}
                disabled={isSubmitting || uploadingCloud}
              >
                {isSubmitting ? 'Submitting Proofs...' : 'Submit Payment Proofs'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* My Payment History */}
      <div className="fintech-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0 }}>
          <History size={16} color="var(--accent-primary)" /> My Payment History
        </h3>

        <div className="table-responsive" style={{ marginTop: '0.75rem' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Billing Period</th>
                <th>Payment Date</th>
                <th style={{ textAlign: 'right' }}>Rent Amount</th>
                <th>Current Bill Proof</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {myPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                    No payment records on file yet.
                  </td>
                </tr>
              ) : (
                myPayments.map((pay) => (
                  <tr key={pay.id || pay._id}>
                    <td>
                      <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{pay.month || pay.period}</span>
                    </td>
                    <td>
                      <span className="tabular-nums" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {pay.paymentDate || pay.paidDate ? new Date(pay.paymentDate || pay.paidDate).toLocaleDateString() : 'Submitted'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="tabular-nums" style={{ fontWeight: '600', color: 'var(--status-success)' }}>
                        {formatINR(pay.amountPaid || pay.amount)}
                      </span>
                    </td>
                    <td>
                      {pay.electricityProofFile ? (
                        <button
                          onClick={() => onOpenDocument(pay.electricityProofFile, 'Electricity / Current Bill Receipt', myTenant?.name)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', gap: '3px', lineHeight: '1.25' }}
                        >
                          <Zap size={11} color="var(--status-warning)" /> Receipt
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>None</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${
                        pay.status === 'paid' || pay.status === 'Paid' ? 'badge-success' :
                        pay.status === 'verification_pending' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {pay.status === 'paid' || pay.status === 'Paid' ? 'Verified' :
                         pay.status === 'verification_pending' ? 'Pending Audit' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {(pay.status === 'paid' || pay.status === 'Paid') ? (
                        <button
                          onClick={() => onViewReceipt(pay)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', lineHeight: '1.25' }}
                        >
                          Receipt
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>—</span>
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
