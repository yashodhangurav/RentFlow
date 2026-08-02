import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/formatters';
import { apiService } from '../api/index';
import { 
  Home, 
  User, 
  Phone, 
  FileText, 
  ShieldCheck, 
  Upload, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  LogOut, 
  Download, 
  Printer, 
  AlertTriangle,
  History,
  Zap,
  Calendar,
  AlertCircle,
  Cloud
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
  
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  
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

  const today = new Date('2026-08-02T00:00:00');
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

  const expiryDate = new Date(myTenant?.agreementExpiryDate || myTenant?.leaseEnd || '2026-12-31');
  const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 1rem' }}>
      {/* Header */}
      <div className="glass-card" style={{
        padding: '1.5rem 1.75rem',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(30, 27, 75, 0.6) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src={myTenant?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
            alt={myTenant?.name}
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-primary)' }}
          />
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
              Welcome, <span className="gradient-text">{myTenant?.name}</span> 👋
            </h1>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '700', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Home size={15} /> Resident of {roomName} • {myTenant?.propertyName || 'Sai Kripa Nivas'}
            </div>
          </div>
        </div>

        <button onClick={logout} className="btn btn-secondary btn-sm" id="tenant-logout-btn">
          <LogOut size={15} /> Sign Out Portal
        </button>
      </div>

      {/* ⏰ AUTOMATIC MONTHLY DEADLINE ALERT BANNER */}
      {!isPaid && (
        <div style={{
          background: isPastDeadline ? 'var(--accent-danger-bg)' : 'var(--accent-warning-bg)',
          border: `2px solid ${isPastDeadline ? 'rgba(244,63,94,0.6)' : 'rgba(245,158,11,0.6)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: isPastDeadline ? 'var(--accent-danger)' : 'var(--accent-warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.05rem', color: isPastDeadline ? 'var(--accent-danger)' : 'var(--accent-warning)' }}>
                ⏰ Monthly Deadline Notice: Rent & Electricity Bill Due by 10th!
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                {isPastDeadline ? (
                  <span>🚨 <strong>10-Day Grace Period Ended!</strong> Please upload rent & electricity bill proofs immediately.</span>
                ) : (
                  <span>Owner Grace Period: You have <strong>{daysLeftToDeadline} day(s) remaining</strong> before the 10th August deadline. Upload receipts below to Cloudinary.</span>
                )}
              </div>
            </div>
          </div>

          <span className={`badge ${isPastDeadline ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.85rem', padding: '0.4rem 1rem', fontWeight: '800' }}>
            {isPastDeadline ? 'Past Deadline' : `${daysLeftToDeadline} Days Left`}
          </span>
        </div>
      )}

      {/* Grid Row: My Room Info | Pay Rent & Upload Electricity Bill */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* Card 1: My Room Info & Agreement */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Home size={18} color="var(--accent-primary)" /> My Tenancy Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Assigned Room</span>
                <strong style={{ color: 'var(--accent-primary)' }}>{roomName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Monthly Rent</span>
                <strong style={{ color: 'var(--accent-success)', fontSize: '1.05rem' }}>{formatINR(myTenant?.rentAmount)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Monthly Deadline</span>
                <strong style={{ color: 'var(--accent-warning)' }}>10th of Every Month</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Aadhar / Govt ID No.</span>
                <code style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent-primary)' }}>
                  {myTenant?.aadharId || 'Verified ID'}
                </code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Agreement Expiry</span>
                <strong style={{ color: daysUntilExpiry <= 7 ? 'var(--accent-warning)' : 'inherit' }}>
                  {new Date(myTenant?.agreementExpiryDate || myTenant?.leaseEnd || '2026-12-31').toLocaleDateString()}
                  {daysUntilExpiry <= 7 && <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--accent-warning)' }}>⚠️ Expires in {daysUntilExpiry} days</span>}
                </strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button
              onClick={() => onOpenDocument(myTenant?.idProofCloudUrl || myTenant?.idProofDoc || 'Aadhar_Card.pdf', 'My Aadhar ID Proof', myTenant?.name)}
              className="btn btn-outline btn-sm"
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem', gap: '4px' }}
            >
              <ShieldCheck size={14} /> ID Proof
            </button>
            <button
              onClick={() => onOpenDocument(myTenant?.agreementCloudUrl || myTenant?.agreementPdf || 'Agreement.pdf', 'My Rental Agreement', myTenant?.name, myTenant?.agreementExpiryDate)}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem', gap: '4px' }}
            >
              <FileText size={14} color="var(--accent-warning)" /> Agreement PDF
            </button>
          </div>
        </div>

        {/* Card 2: MONTHLY RENT & ELECTRICITY BILL PROOF SUBMISSION */}
        <div className="glass-card" style={{ padding: '1.5rem', border: isPaid ? '1px solid var(--accent-success)' : isVerificationPending ? '1px solid var(--accent-warning)' : '2px solid rgba(244, 63, 94, 0.6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cloud size={18} color="var(--accent-warning)" /> Upload to Cloudinary (dysl5mfsh)
            </h3>

            <span className={`badge ${isPaid ? 'badge-success' : isVerificationPending ? 'badge-warning' : 'badge-danger'}`} style={{ fontWeight: '800' }}>
              {isPaid ? '✓ Rent & Bill Verified' : isVerificationPending ? '⏳ Awaiting Owner Approval' : '🚨 Action Required'}
            </span>
          </div>

          {uploadingCloud && (
            <div style={{ background: 'rgba(99,102,241,0.15)', padding: '0.5rem', borderRadius: '6px', color: 'var(--accent-primary)', fontSize: '0.75rem', textAlign: 'center', marginBottom: '0.75rem', fontWeight: '700' }}>
              ☁️ Uploading screenshot to Cloudinary...
            </div>
          )}

          {isPaid ? (
            <div style={{ background: 'var(--accent-success-bg)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
              <CheckCircle2 size={36} color="var(--accent-success)" style={{ margin: '0 auto 0.5rem' }} />
              <h4 style={{ fontWeight: '800', color: 'var(--accent-success)', fontSize: '1.1rem' }}>Rent & Electricity Bill Verified!</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Your rent of <strong>{formatINR(myTenant?.rentAmount)}</strong> and monthly current bill for {selectedMonth} have been verified by the owner.
              </p>
              {currentMonthPayment && (
                <button
                  onClick={() => onViewReceipt(currentMonthPayment)}
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: '1rem', gap: '4px' }}
                >
                  <FileText size={14} /> Download Official Receipt
                </button>
              )}
            </div>
          ) : isVerificationPending ? (
            <div style={{ background: 'var(--accent-warning-bg)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
              <Clock size={36} color="var(--accent-warning)" style={{ margin: '0 auto 0.5rem' }} />
              <h4 style={{ fontWeight: '800', color: 'var(--accent-warning)', fontSize: '1.1rem' }}>Proofs Uploaded to Cloudinary!</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                Your payment proof screenshots stored on Cloudinary (dysl5mfsh) are <strong>awaiting owner verification</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitProof}>
              {/* Step 1: Rent Payment Proof */}
              <div style={{ marginBottom: '1rem', background: 'rgba(99, 102, 241, 0.05)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                  1. Monthly Rent Payment Proof (Due: {formatINR(myTenant?.rentAmount)})
                </div>
                
                <div className="form-group" style={{ marginBottom: '0.6rem' }}>
                  <div style={{
                    padding: '0.5rem 0.75rem',
                    background: 'var(--bg-input)',
                    border: '1px dashed var(--accent-primary)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Upload size={15} color="var(--accent-primary)" />
                    <input
                      type="file"
                      id="tenant-rent-proof-file"
                      style={{ display: 'none' }}
                      onChange={handleRentProofUpload}
                      accept="image/*,.pdf"
                    />
                    <label htmlFor="tenant-rent-proof-file" style={{ cursor: 'pointer', fontSize: '0.775rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
                      {rentProofName ? `Cloudinary Uploaded: ${rentProofName}` : 'Upload Rent Payment UPI Screenshot'}
                    </label>
                  </div>
                </div>

                <input
                  type="text"
                  className="form-input"
                  placeholder="UPI Ref ID (e.g. UPI-984210)"
                  value={rentRef}
                  onChange={(e) => setRentRef(e.target.value)}
                  style={{ fontSize: '0.775rem', padding: '0.4rem 0.75rem' }}
                />
              </div>

              {/* Step 2: Electricity / Current Bill Payment Proof */}
              <div style={{ marginBottom: '1.25rem', background: 'rgba(245, 158, 11, 0.05)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--accent-warning)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={14} /> 2. Monthly Electricity / Current Bill Proof
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Bill Amount (₹)"
                    value={electricityAmount}
                    onChange={(e) => setElectricityAmount(e.target.value)}
                    style={{ fontSize: '0.775rem', padding: '0.4rem 0.75rem' }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Bill Consumer / Consumer ID"
                    value={electricityRef}
                    onChange={(e) => setElectricityRef(e.target.value)}
                    style={{ fontSize: '0.775rem', padding: '0.4rem 0.75rem' }}
                  />
                </div>

                <div style={{
                  padding: '0.5rem 0.75rem',
                  background: 'var(--bg-input)',
                  border: '1px dashed var(--accent-warning)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Upload size={15} color="var(--accent-warning)" />
                  <input
                    type="file"
                    id="tenant-elec-proof-file"
                    style={{ display: 'none' }}
                    onChange={handleElectricityProofUpload}
                    accept="image/*,.pdf"
                  />
                  <label htmlFor="tenant-elec-proof-file" style={{ cursor: 'pointer', fontSize: '0.775rem', color: 'var(--accent-warning)', fontWeight: '600' }}>
                    {electricityProofName ? `Cloudinary Uploaded: ${electricityProofName}` : 'Upload Electricity Bill Paid Screenshot'}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', fontSize: '0.875rem' }}
                disabled={isSubmitting || uploadingCloud}
              >
                {isSubmitting ? 'Saving to Cloudinary & Atlas...' : 'Submit Proofs to Cloudinary for Owner Verification ✓'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* My Payment History */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={18} color="var(--accent-primary)" /> My Rent & Electricity Payment History (Cloudinary Backed)
        </h3>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Billing Period</th>
                <th>Payment Date</th>
                <th>Rent Amount</th>
                <th>Cloudinary Electricity Proof</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {myPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                    No payment records yet. Upload your rent and current bill proof above.
                  </td>
                </tr>
              ) : (
                myPayments.map((pay) => (
                  <tr key={pay.id || pay._id}>
                    <td>
                      <strong style={{ fontSize: '0.9rem' }}>{pay.month || pay.period}</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {pay.paymentDate || pay.paidDate ? new Date(pay.paymentDate || pay.paidDate).toLocaleDateString() : 'Submitted'}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--accent-success)', fontSize: '0.95rem' }}>
                        {formatINR(pay.amountPaid || pay.amount)}
                      </strong>
                    </td>
                    <td>
                      {pay.electricityProofFile ? (
                        <button
                          onClick={() => onOpenDocument(pay.electricityProofFile, 'Electricity / Current Bill Receipt', myTenant?.name)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.725rem', gap: '4px' }}
                        >
                          <Zap size={13} color="var(--accent-warning)" /> View Receipt
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No Bill Attached</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${
                        pay.status === 'paid' || pay.status === 'Paid' ? 'badge-success' :
                        pay.status === 'verification_pending' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {pay.status === 'paid' || pay.status === 'Paid' ? '✓ Verified' :
                         pay.status === 'verification_pending' ? '⏳ Verification Pending' : '🚨 Pending'}
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
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending</span>
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
