import React, { useState, useEffect } from 'react';
import { apiService } from '../api/index';
import { X, UserPlus, Building, Mail, FileText, Upload, CheckCircle2, Cloud, Camera, Key, Lock, RefreshCw } from 'lucide-react';

export const TenantModal = ({ isOpen, onClose, onSave, properties = [], tenantToEdit }) => {
  const defaultProperty = properties[0] || { id: 'prop-1', name: 'Sai Kripa Nivas' };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    roomNo: '',
    propertyId: defaultProperty.id,
    propertyName: defaultProperty.name,
    aadharId: '',
    joiningDate: new Date().toISOString().split('T')[0],
    agreementExpiryDate: '2026-08-15',
    rentAmount: 12000,
    deposit: 24000,
    emergencyContact: '',
    occupation: '',
    idProofDocName: '',
    agreementPdfName: '',
    idProofCloudUrl: '',
    agreementCloudUrl: '',
    avatarCloudUrl: '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    status: 'Active'
  });

  const [idFilePreview, setIdFilePreview] = useState(null);
  const [agreementFilePreview, setAgreementFilePreview] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingCloud, setUploadingCloud] = useState(false);
  const [photoStatusMsg, setPhotoStatusMsg] = useState('');

  // Selected Property Object
  const selectedProperty = properties.find(p => p.id === formData.propertyId || p._id === formData.propertyId) || properties[0] || {
    name: 'Sai Kripa Nivas',
    availableRooms: ['Room 101', 'Room 102', 'Room 201', 'Room 202', 'Room 301']
  };

  const roomOptions = selectedProperty.availableRooms || ['Room 101', 'Room 102', 'Room 201', 'Room 202', 'Room 301'];

  useEffect(() => {
    if (tenantToEdit) {
      const existingAvatar = tenantToEdit.avatarCloudUrl || tenantToEdit.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
      setFormData({
        ...tenantToEdit,
        propertyId: tenantToEdit.propertyId || defaultProperty.id,
        propertyName: tenantToEdit.propertyName || defaultProperty.name,
        email: tenantToEdit.email || `${tenantToEdit.name.toLowerCase().replace(/\s+/g, '.')}@home.com`,
        password: tenantToEdit.password || `Tenant@${tenantToEdit.roomNo?.replace(/\D/g, '') || '101'}`,
        roomNo: tenantToEdit.roomNo || tenantToEdit.roomNumber || tenantToEdit.unit || '',
        aadharId: tenantToEdit.aadharId || '',
        joiningDate: tenantToEdit.joiningDate || tenantToEdit.leaseStart || new Date().toISOString().split('T')[0],
        agreementExpiryDate: tenantToEdit.agreementExpiryDate || tenantToEdit.leaseEnd || '2026-08-15',
        rentAmount: tenantToEdit.rentAmount || 12000,
        deposit: tenantToEdit.deposit || tenantToEdit.rentAmount * 2 || 24000,
        idProofDocName: tenantToEdit.idProofDoc || tenantToEdit.idProof || 'Aadhar_Card.pdf',
        agreementPdfName: tenantToEdit.agreementPdf || tenantToEdit.agreementFile || 'Agreement.pdf',
        idProofCloudUrl: tenantToEdit.idProofCloudUrl || '',
        agreementCloudUrl: tenantToEdit.agreementCloudUrl || '',
        avatarCloudUrl: existingAvatar,
        avatar: existingAvatar
      });
      setIdFilePreview(tenantToEdit.idProofCloudUrl || tenantToEdit.idProofDoc || tenantToEdit.idProof || null);
      setAgreementFilePreview(tenantToEdit.agreementCloudUrl || tenantToEdit.agreementPdf || tenantToEdit.agreementFile || null);
      setAvatarPreview(existingAvatar);
      setPhotoStatusMsg('');
    } else {
      const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
      setFormData({
        name: '',
        phone: '',
        email: '',
        password: 'Tenant@' + Math.floor(100 + Math.random() * 900),
        roomNo: roomOptions[0] || 'Room 101',
        propertyId: defaultProperty.id,
        propertyName: defaultProperty.name,
        aadharId: '',
        joiningDate: new Date().toISOString().split('T')[0],
        agreementExpiryDate: '2026-08-15',
        rentAmount: 12000,
        deposit: 24000,
        emergencyContact: '',
        occupation: '',
        idProofDocName: '',
        agreementPdfName: '',
        idProofCloudUrl: '',
        agreementCloudUrl: '',
        avatarCloudUrl: defaultAvatar,
        avatar: defaultAvatar,
        status: 'Active'
      });
      setIdFilePreview(null);
      setAgreementFilePreview(null);
      setAvatarPreview(defaultAvatar);
      setPhotoStatusMsg('');
    }
  }, [tenantToEdit, properties, isOpen]);

  if (!isOpen) return null;

  const handlePropertyChange = (e) => {
    const propId = e.target.value;
    const propObj = properties.find(p => p.id === propId || p._id === propId);
    const rooms = propObj?.availableRooms || ['Room 101', 'Room 102', 'Room 201'];
    setFormData(prev => ({
      ...prev,
      propertyId: propId,
      propertyName: propObj ? propObj.name : 'Sai Kripa Nivas',
      roomNo: rooms[0] || 'Room 101'
    }));
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let newPass = 'Tenant@';
    for (let i = 0; i < 5; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: newPass }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
      setPhotoStatusMsg('Uploading photo to Cloudinary...');
      setUploadingCloud(true);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result;
        const cloudUrl = await apiService.uploadToCloudinary(base64Data, 'tenant_photos');
        const finalUrl = (cloudUrl && cloudUrl.startsWith('http')) ? cloudUrl : base64Data;

        setFormData(prev => ({
          ...prev,
          avatar: finalUrl,
          avatarCloudUrl: finalUrl
        }));
        setAvatarPreview(finalUrl);
        setPhotoStatusMsg('✓ Photo saved to Cloudinary');
        setUploadingCloud(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingCloud(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const fileUrl = await apiService.uploadToCloudinary(reader.result, 'tenant_id_proofs', file.name);
        const resolvedUrl = (fileUrl && (fileUrl.startsWith('http') || fileUrl.startsWith('data:'))) ? fileUrl : reader.result;
        setFormData(prev => ({ 
          ...prev, 
          idProofDocName: file.name, 
          idProofCloudUrl: resolvedUrl,
          idProof: resolvedUrl,
          idProofDoc: file.name
        }));
        setIdFilePreview(file.name);
        setUploadingCloud(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAgreementFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingCloud(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const fileUrl = await apiService.uploadToCloudinary(reader.result, 'tenant_agreements', file.name);
        const resolvedUrl = (fileUrl && (fileUrl.startsWith('http') || fileUrl.startsWith('data:'))) ? fileUrl : reader.result;
        setFormData(prev => ({ 
          ...prev, 
          agreementPdfName: file.name, 
          agreementCloudUrl: resolvedUrl,
          agreementFile: resolvedUrl,
          agreementPdf: file.name
        }));
        setAgreementFilePreview(file.name);
        setUploadingCloud(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const propObj = properties.find(p => p.id === formData.propertyId);
    const roomFormatted = formData.roomNo.toLowerCase().includes('room') ? formData.roomNo : `Room ${formData.roomNo}`;
    const finalAvatar = formData.avatarCloudUrl || formData.avatar || avatarPreview || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;

    const finalIdProofUrl = formData.idProofCloudUrl || (formData.idProof && (formData.idProof.startsWith('http') || formData.idProof.startsWith('data:')) ? formData.idProof : '');
    const finalAgreementUrl = formData.agreementCloudUrl || (formData.agreementFile && (formData.agreementFile.startsWith('http') || formData.agreementFile.startsWith('data:')) ? formData.agreementFile : '');

    onSave({
      ...formData,
      id: tenantToEdit ? tenantToEdit.id : `ten-${Date.now()}`,
      propertyId: formData.propertyId,
      propertyName: propObj ? propObj.name : formData.propertyName,
      roomNo: roomFormatted,
      roomNumber: roomFormatted,
      unit: roomFormatted,
      paymentStatus: tenantToEdit ? tenantToEdit.paymentStatus : 'Pending',
      leaseStart: formData.joiningDate,
      leaseEnd: formData.agreementExpiryDate,
      rentAmount: Number(formData.rentAmount),
      deposit: Number(formData.deposit),
      idProofDocName: formData.idProofDocName || `${formData.name.replace(/\s+/g, '_')}_Aadhar.pdf`,
      idProofDoc: formData.idProofDocName || `${formData.name.replace(/\s+/g, '_')}_Aadhar.pdf`,
      idProof: finalIdProofUrl || formData.idProofDocName || `${formData.name.replace(/\s+/g, '_')}_Aadhar.pdf`,
      idProofCloudUrl: finalIdProofUrl,
      agreementPdfName: formData.agreementPdfName || `Agreement_${roomFormatted.replace(/\s+/g, '_')}.pdf`,
      agreementPdf: formData.agreementPdfName || `Agreement_${roomFormatted.replace(/\s+/g, '_')}.pdf`,
      agreementFile: finalAgreementUrl || formData.agreementPdfName || `Agreement_${roomFormatted.replace(/\s+/g, '_')}.pdf`,
      agreementCloudUrl: finalAgreementUrl,
      avatar: finalAvatar,
      avatarCloudUrl: finalAvatar
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-primary-subtle)',
              border: '1px solid var(--accent-primary-ring)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)'
            }}>
              <UserPlus size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                {tenantToEdit ? 'Edit Tenant Details' : 'Register New Tenant'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Assign room, financial terms, and residency credentials
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

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* PHOTO UPLOADER HEADER BOX */}
            <div style={{
              background: 'var(--bg-hover)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={avatarPreview || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                    alt="Tenant Profile"
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-sm)',
                      objectFit: 'cover',
                      border: '1px solid var(--border-color)'
                    }}
                  />
                  <label htmlFor="tenant-photo-file-picker" style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    width: '24px',
                    height: '24px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <Camera size={13} />
                  </label>
                </div>

                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    Tenant Identity Photo
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Stored securely via Cloudinary
                  </div>
                  {photoStatusMsg && (
                    <div style={{ fontSize: '0.725rem', color: 'var(--status-paid-text)', fontWeight: 600, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> {photoStatusMsg}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <input
                  type="file"
                  id="tenant-photo-file-picker"
                  style={{ display: 'none' }}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                />
                <label htmlFor="tenant-photo-file-picker" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', gap: '6px' }}>
                  <Upload size={13} /> Upload Photo
                </label>
              </div>
            </div>

            {/* SECTION 1: PROPERTY & ROOM ALLOCATION */}
            <div style={{
              background: 'var(--bg-hover)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem'
            }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building size={14} /> 1. Property & Assigned Room Unit
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="select-property-id">Building / Property *</label>
                  <select
                    id="select-property-id"
                    className="form-select"
                    value={formData.propertyId}
                    onChange={handlePropertyChange}
                    style={{ fontWeight: 600 }}
                  >
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.address || 'Property'})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="select-room-unit">Room / Unit Number *</label>
                  <select
                    id="select-room-unit"
                    className="form-select"
                    value={formData.roomNo}
                    onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                    style={{ fontWeight: 600 }}
                  >
                    {roomOptions.map(rm => (
                      <option key={rm} value={rm}>{rm}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: TENANT LOGIN CREDENTIALS */}
            <div style={{
              background: 'var(--bg-hover)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem'
            }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={14} /> 2. Tenant Portal Access
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="tenant-login-email">Portal Username / Email *</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      id="tenant-login-email"
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '32px', fontSize: '0.825rem' }}
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="form-label" htmlFor="tenant-login-password" style={{ marginBottom: 0 }}>Password *</label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.725rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                    >
                      <RefreshCw size={11} /> Generate
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      id="tenant-login-password"
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '32px', fontSize: '0.825rem', fontWeight: 600 }}
                      required
                      placeholder="Assign Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: RESIDENT INFO & FINANCIALS */}
            <div>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                3. Resident Details & Financial Terms
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '0.875rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="tenant-name">Full Legal Name *</label>
                  <input
                    id="tenant-name"
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="tenant-phone">Phone Number *</label>
                  <input
                    id="tenant-phone"
                    type="tel"
                    className="form-input"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0.875rem' }}>
                <label className="form-label" htmlFor="tenant-aadhar">Aadhar / National ID Number *</label>
                <input
                  id="tenant-aadhar"
                  type="text"
                  className="form-input tabular-nums"
                  required
                  placeholder="e.g. 9876-5432-1098"
                  value={formData.aadharId}
                  onChange={(e) => setFormData({ ...formData, aadharId: e.target.value })}
                />
              </div>

              {/* RENT AND ADVANCE DEPOSIT FIELDS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', background: 'var(--bg-hover)', padding: '0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '0.875rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="tenant-rent">Monthly Rent (₹) *</label>
                  <input
                    id="tenant-rent"
                    type="number"
                    className="form-input tabular-nums"
                    required
                    min="1000"
                    placeholder="12000"
                    value={formData.rentAmount}
                    onChange={(e) => setFormData({ ...formData, rentAmount: Number(e.target.value) })}
                    style={{ fontWeight: 600 }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="tenant-deposit">Security Deposit (₹) *</label>
                  <input
                    id="tenant-deposit"
                    type="number"
                    className="form-input tabular-nums"
                    required
                    min="0"
                    placeholder="24000"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: Number(e.target.value) })}
                    style={{ fontWeight: 600 }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="tenant-joining">Move-in / Lease Commencement Date *</label>
                <input
                  id="tenant-joining"
                  type="date"
                  className="form-input tabular-nums"
                  required
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                />
              </div>
            </div>

            {/* SECTION 4: CLOUDINARY DOCUMENT UPLOADS */}
            <div>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cloud size={14} /> 4. Verification Documents
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '0.875rem' }}>
                {/* File Upload 1: ID Proof */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">ID Proof (Aadhar/Passport) *</label>
                  <div style={{
                    padding: '0.75rem',
                    background: 'var(--bg-hover)',
                    border: '1px dashed var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'center'
                  }}>
                    <input
                      type="file"
                      id="id-proof-file-picker"
                      style={{ display: 'none' }}
                      onChange={handleIdFileUpload}
                      accept=".pdf,.png,.jpg,.jpeg"
                    />
                    <label htmlFor="id-proof-file-picker" style={{ cursor: 'pointer', display: 'block' }}>
                      <Upload size={16} color="var(--accent-primary)" style={{ margin: '0 auto 0.25rem' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                        Select File
                      </span>
                    </label>
                    {idFilePreview && (
                      <div style={{ marginTop: '0.375rem', background: 'var(--status-paid-bg)', padding: '2px 6px', borderRadius: 'var(--radius-xs)', fontSize: '0.7rem', color: 'var(--status-paid-text)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={11} /> {formData.idProofDocName || 'Uploaded'}
                      </div>
                    )}
                  </div>
                </div>

                {/* File Upload 2: Agreement PDF */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Lease Agreement (PDF) *</label>
                  <div style={{
                    padding: '0.75rem',
                    background: 'var(--bg-hover)',
                    border: '1px dashed var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'center'
                  }}>
                    <input
                      type="file"
                      id="agreement-file-picker"
                      style={{ display: 'none' }}
                      onChange={handleAgreementFileUpload}
                      accept=".pdf,.png,.jpg"
                    />
                    <label htmlFor="agreement-file-picker" style={{ cursor: 'pointer', display: 'block' }}>
                      <FileText size={16} color="var(--accent-primary)" style={{ margin: '0 auto 0.25rem' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                        Select PDF
                      </span>
                    </label>
                    {agreementFilePreview && (
                      <div style={{ marginTop: '0.375rem', background: 'var(--status-paid-bg)', padding: '2px 6px', borderRadius: 'var(--radius-xs)', fontSize: '0.7rem', color: 'var(--status-paid-text)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={11} /> {formData.agreementPdfName || 'Uploaded'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="tenant-expiry-date">Lease Expiry Date *</label>
                <input
                  id="tenant-expiry-date"
                  type="date"
                  className="form-input tabular-nums"
                  required
                  value={formData.agreementExpiryDate}
                  onChange={(e) => setFormData({ ...formData, agreementExpiryDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={uploadingCloud}>
              {tenantToEdit ? 'Save Changes' : 'Register Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
