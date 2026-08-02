import React, { useState } from 'react';
import { apiService } from '../api/index';
import { X, Building, MapPin, Home, Layers, Plus, Check, Upload, Image as ImageIcon, Camera, CheckCircle2 } from 'lucide-react';

export const PropertyModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    houseNo: '',
    address: '',
    type: 'Residential Apartments',
    units: 10,
    roomsInput: 'Room 101, Room 102, Room 201, Room 202, Room 301',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
    manager: 'Yashodhan Gurav (Owner)'
  });

  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  if (!isOpen) return null;

  const handlePropertyPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPhotoPreview(localUrl);
      setUploading(true);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const cloudUrl = await apiService.uploadToCloudinary(reader.result, 'tenant_properties');
        const finalUrl = (cloudUrl && cloudUrl.startsWith('http')) ? cloudUrl : reader.result;
        setFormData(prev => ({ ...prev, image: finalUrl }));
        setPhotoPreview(finalUrl);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const roomList = formData.roomsInput.split(',').map(r => r.trim()).filter(Boolean);
    
    onSave({
      id: `prop-${Date.now()}`,
      name: formData.name,
      houseNo: formData.houseNo || 'Building 1',
      address: `${formData.houseNo ? formData.houseNo + ', ' : ''}${formData.address}`,
      type: formData.type,
      units: roomList.length || Number(formData.units),
      availableRooms: roomList.length > 0 ? roomList : ['Room 101', 'Room 102', 'Room 201', 'Room 202'],
      occupied: 0,
      monthlyRevenue: 0,
      image: formData.image,
      manager: formData.manager,
      amenities: ["Wi-Fi", "24/7 CCTV", "Parking", "Water Purifier"]
    });
    
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={20} color="var(--accent-primary)" /> Register Property & Configured Units
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
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* PHOTO UPLOADER */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
              border: '1px dashed var(--accent-primary)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <img
                  src={photoPreview || formData.image}
                  alt="Property"
                  style={{ width: '70px', height: '50px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--accent-primary)' }}
                />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.875rem' }}>Property Exterior Photo</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Uploads to Cloudinary (dysl5mfsh)</div>
                </div>
              </div>

              <div>
                <input
                  type="file"
                  id="prop-photo-picker"
                  style={{ display: 'none' }}
                  onChange={handlePropertyPhotoUpload}
                  accept="image/*"
                />
                <label htmlFor="prop-photo-picker" className="btn btn-primary btn-sm" style={{ cursor: 'pointer', gap: '4px' }}>
                  <Upload size={14} /> {uploading ? 'Uploading...' : 'Browse Photo'}
                </label>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="prop-name">Property Name *</label>
                <input
                  id="prop-name"
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Sai Kripa Nivas / Ganesh Heights"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="prop-house-no">House / Plot / Building #</label>
                <input
                  id="prop-house-no"
                  type="text"
                  className="form-input"
                  placeholder="e.g. House #42 or Building A"
                  value={formData.houseNo}
                  onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="prop-address">Property Address / City *</label>
              <input
                id="prop-address"
                type="text"
                className="form-input"
                required
                placeholder="e.g. Sector 17, Vashi, Navi Mumbai, Maharashtra"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="prop-type">Property Category</label>
                <select
                  id="prop-type"
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Residential Apartments">Residential Apartments</option>
                  <option value="PG / Room Rentals">PG / Room Rentals</option>
                  <option value="Commercial Shops / Offices">Commercial Shops / Offices</option>
                  <option value="Independent House / Villa">Independent House / Villa</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="prop-manager">Owner / Property Manager</label>
                <input
                  id="prop-manager"
                  type="text"
                  className="form-input"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="prop-rooms">
                Configured Room Units List (comma-separated) *
              </label>
              <textarea
                id="prop-rooms"
                className="form-input"
                rows={3}
                required
                placeholder="Room 101, Room 102, Room 201, Room 202, Room 301"
                value={formData.roomsInput}
                onChange={(e) => setFormData({ ...formData, roomsInput: e.target.value })}
              />
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                These room units will be selectable when assigning tenants to this property.
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              Register Property & Save Photo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
