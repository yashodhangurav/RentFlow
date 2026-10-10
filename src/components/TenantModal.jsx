import React, { useState, useEffect } from 'react';
import { apiService } from '../api/index';
import { X, UserPlus, Building, DollarSign, Calendar, Phone, Mail, FileText, CreditCard, ShieldCheck, Upload, CheckCircle2, Image as ImageIcon, Cloud, Camera, Key, Lock, RefreshCw, Landmark, Home } from 'lucide-react';

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
  const selectedProperty = properties.find(p => p.id === formData.propertyId) || properties[0] || {
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
    const propObj = properties.find(p => p.id === propId);
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
      <div className="modal-content animate-fade-in" style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={22} color="var(--accent-primary)" />
            {tenantToEdit ? 'Edit Tenant Details' : 'Register Tenant (Select Property & Room Unit)'}
          </h3>
          <button 
            onClick={onClose} 
            className="btn btn-secondary btn-sm"
            style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* PHOTO UPLOADER HEADER BOX */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
              border: '2px dashed var(--accent-primary)',
              borderRadius: '16px',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={avatarPreview || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                    alt="Tenant Profile"
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid var(--accent-primary)',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
                    }}
                  />
                  <label htmlFor="tenant-photo-file-picker" style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                  }}>
                    <Camera size={15} />
                  </label>
                </div>

                <div>
                  <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>
                    Tenant Profile Photo
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                    Cloudinary Storage: <strong>dysl5mfsh</strong>
                  </div>
                  {photoStatusMsg && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-success)', fontWeight: '700', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} /> {photoStatusMsg}
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
                <label htmlFor="tenant-photo-file-picker" className="btn btn-primary btn-sm" style={{ cursor: 'pointer', gap: '6px', fontWeight: '700' }}>
                  <Upload size={15} /> Upload Photo
                </label>
              </div>
            </div>

            {/* 🏢 DYNAMIC PROPERTY & ROOM UNIT SELECTOR SECTION */}
            <div style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--accent-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building size={16} /> 1. Select Property & Assigned Room Unit
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Select Property */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="select-property-id">Select Building / Property *</label>
                  <select
                    id="select-property-id"
                    className="form-select"
                    value={formData.propertyId}
                    onChange={handlePropertyChange}
                    style={{ fontWeight: '700' }}
                  >
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.address || 'Property'})</option>
                    ))}
                  </select>
                </div>

                {/* Select Room Unit dynamically from property */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="select-room-unit">Select Room / Unit Number *</label>
                  <select
                    id="select-room-unit"
                    className="form-select"
                    value={formData.roomNo}
                    onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                    style={{ fontWeight: '700' }}
                  >
                    {roomOptions.map(rm => (
                      <option key={rm} value={rm}>{rm}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 🔑 SECTION 2: TENANT LOGIN CREDENTIALS */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--accent-success)', marginBottom: '0.75rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={16} /> 2. Assign Tenant Portal Login Credentials
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="tenant-login-email">Tenant Login Email / Username *</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      id="tenant-login-email"
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '34px', fontSize: '0.825rem' }}
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="form-label" htmlFor="tenant-login-password" style={{ marginBottom: 0 }}>Tenant Password *</label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.725rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                    >
                      <RefreshCw size={11} /> Auto-Generate
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      id="tenant-login-password"
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: '34px', fontSize: '0.825rem', fontWeight: '700' }}
                      required
                      placeholder="Assign Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Resident Details & Financials */}
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              3. Resident Info, Rent & Advance Security Deposit
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="tenant-name">Tenant Full Name *</label>
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

              <div className="form-group">
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

            <div className="form-group">
              <label className="form-label" htmlFor="tenant-aadhar">Aadhar / Govt ID Number *</label>
              <input
                id="tenant-aadhar"
                type="text"
                className="form-input"
                required
                placeholder="e.g. 9876-5432-1098"
                value={formData.aadharId}
                onChange={(e) => setFormData({ ...formData, aadharId: e.target.value })}
              />
            </div>

            {/* RENT AND ADVANCE DEPOSIT FIELDS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(16, 185, 129, 0.05)', padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="tenant-rent" style={{ color: 'var(--accent-success)', fontWeight: '700' }}>Monthly Rent Amount (₹) *</label>
                <input
                  id="tenant-rent"
                  type="number"
                  className="form-input"
                  required
                  min="1000"
                  placeholder="12000"
                  value={formData.rentAmount}
                  onChange={(e) => setFormData({ ...formData, rentAmount: Number(e.target.value) })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="tenant-deposit" style={{ color: 'var(--accent-warning)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Landmark size={14} /> Advance Security Deposit (₹) *
                </label>
                <input
                  id="tenant-deposit"
                  type="number"
                  className="form-input"
                  required
                  min="0"
                  placeholder="24000"
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tenant-joining">Joining / Move-in Date *</label>
              <input
                id="tenant-joining"
                type="date"
                className="form-input"
                required
                value={formData.joiningDate}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
              />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />

            {/* Section 4: Cloudinary Document File Uploads */}
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-warning)', marginBottom: '0.75rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Cloud size={15} /> 4. Upload ID Proof & Agreement PDF to Cloudinary
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* File Upload 1: ID Proof */}
              <div className="form-group">
                <label className="form-label">Aadhar / ID Proof (Cloudinary) *</label>
                <div style={{
                  padding: '0.85rem',
                  background: 'var(--bg-input)',
                  border: '2px dashed var(--border-color-hover)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}>
                  <Upload size={22} color="var(--accent-primary)" style={{ margin: '0 auto 0.3rem' }} />
                  <input
                    type="file"
                    id="id-proof-file-picker"
                    style={{ display: 'none' }}
                    onChange={handleIdFileUpload}
                    accept=".pdf,.png,.jpg,.jpeg"
                  />
                  <label htmlFor="id-proof-file-picker" style={{ cursor: 'pointer', display: 'block' }}>
                    <span style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                      Browse ID File
                    </span>
                  </label>
                  {idFilePreview && (
                    <div style={{ marginTop: '0.4rem', background: 'rgba(99, 102, 241, 0.15)', padding: '3px 6px', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> {formData.idProofDocName || 'Uploaded'}
                    </div>
                  )}
                </div>
              </div>

              {/* File Upload 2: Agreement PDF */}
              <div className="form-group">
                <label className="form-label">Agreement PDF (Cloudinary) *</label>
                <div style={{
                  padding: '0.85rem',
                  background: 'var(--bg-input)',
                  border: '2px dashed rgba(245, 158, 11, 0.5)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}>
                  <FileText size={22} color="var(--accent-warning)" style={{ margin: '0 auto 0.3rem' }} />
                  <input
                    type="file"
                    id="agreement-file-picker"
                    style={{ display: 'none' }}
                    onChange={handleAgreementFileUpload}
                    accept=".pdf,.png,.jpg"
                  />
                  <label htmlFor="agreement-file-picker" style={{ cursor: 'pointer', display: 'block' }}>
                    <span style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--accent-warning)' }}>
                      Browse Agreement PDF
                    </span>
                  </label>
                  {agreementFilePreview && (
                    <div style={{ marginTop: '0.4rem', background: 'rgba(245, 158, 11, 0.15)', padding: '3px 6px', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--accent-warning)', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> {formData.agreementPdfName || 'Uploaded'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="tenant-expiry-date">Agreement Expiry Date *</label>
              <input
                id="tenant-expiry-date"
                type="date"
                className="form-input"
                required
                value={formData.agreementExpiryDate}
                onChange={(e) => setFormData({ ...formData, agreementExpiryDate: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={uploadingCloud}>
              {tenantToEdit ? 'Save Changes' : 'Register Tenant to Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
