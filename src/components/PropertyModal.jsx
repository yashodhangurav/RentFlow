import React, { useState, useEffect } from 'react';
import { apiService } from '../api/index';
import { X, Building, MapPin, Home, Layers, Plus, Check, Upload, Image as ImageIcon, Camera, CheckCircle2, Sparkles, Tag } from 'lucide-react';

export const PropertyModal = ({ isOpen, onClose, onSave, propertyToEdit = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    houseNo: '',
    address: '',
    type: 'Residential Apartments',
    units: 10,
    roomsInput: 'Room 101, Room 102, Room 201, Room 202, Room 301',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
    manager: 'Yashodhan Gurav (Owner)',
    amenitiesInput: 'High-speed Wi-Fi, 24/7 CCTV Security, Power Backup, 2-Wheeler / Car Parking'
  });

  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (propertyToEdit) {
      setFormData({
        name: propertyToEdit.name || '',
        houseNo: propertyToEdit.houseNo || '',
        address: propertyToEdit.address || '',
        type: propertyToEdit.type || 'Residential Apartments',
        units: propertyToEdit.units || propertyToEdit.availableRooms?.length || 10,
        roomsInput: (propertyToEdit.availableRooms || ['Room 101', 'Room 102', 'Room 201']).join(', '),
        image: propertyToEdit.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
        manager: propertyToEdit.manager || 'Yashodhan Gurav (Owner)',
        amenitiesInput: (propertyToEdit.amenities || ['High-speed Wi-Fi', '24/7 CCTV Security']).join(', ')
      });
      setPhotoPreview(propertyToEdit.image || null);
    } else {
      setFormData({
        name: '',
        houseNo: '',
        address: '',
        type: 'Residential Apartments',
        units: 10,
        roomsInput: 'Room 101, Room 102, Room 201, Room 202, Room 301',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
        manager: 'Yashodhan Gurav (Owner)',
        amenitiesInput: 'High-speed Wi-Fi, 24/7 CCTV Security, Power Backup, 2-Wheeler / Car Parking'
      });
      setPhotoPreview(null);
    }
  }, [propertyToEdit, isOpen]);

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
    const amenitiesList = formData.amenitiesInput.split(',').map(a => a.trim()).filter(Boolean);
    
    const payload = {
      id: propertyToEdit?.id || propertyToEdit?._id || `prop-${Date.now()}`,
      _id: propertyToEdit?._id,
      name: formData.name,
      houseNo: formData.houseNo || '',
      address: formData.address,
      type: formData.type,
      units: roomList.length || Number(formData.units),
      availableRooms: roomList.length > 0 ? roomList : ['Room 101', 'Room 102', 'Room 201', 'Room 202'],
      occupied: propertyToEdit?.occupied || 0,
      monthlyRevenue: propertyToEdit?.monthlyRevenue || 0,
      image: formData.image,
      manager: formData.manager,
      amenities: amenitiesList.length > 0 ? amenitiesList : ["Wi-Fi", "24/7 CCTV", "Parking", "Water Purifier"],
      yearBuilt: propertyToEdit?.yearBuilt || 2024
    };

    onSave(payload);
    onClose();
  };

  const currentRoomsList = formData.roomsInput.split(',').map(r => r.trim()).filter(Boolean);

  return (
    <div className="modal-overlay animate-fade-in" style={{ zIndex: 1050 }}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
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
              <Building size={16} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  {propertyToEdit ? 'Edit Property & Units' : 'Register New Property'}
                </h3>
                <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                  Owner Access
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                {propertyToEdit ? `Updating portfolio entry for ${propertyToEdit.name}` : 'Add a real estate building or apartment complex to your portfolio.'}
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* PHOTO UPLOADER */}
            <div style={{
              background: 'var(--bg-hover)',
              border: '1px dashed var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={photoPreview || formData.image}
                  alt="Property"
                  style={{ width: '64px', height: '48px', borderRadius: 'var(--radius-xs)', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--text-primary)' }}>Property Exterior Image</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Cloudinary Media Service</div>
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
                <label htmlFor="prop-photo-picker" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', gap: '4px' }}>
                  <Upload size={13} /> {uploading ? 'Uploading...' : 'Upload Photo'}
                </label>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
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
                  style={{ fontWeight: 600 }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="prop-house-no">House / Building #</label>
                <input
                  id="prop-house-no"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Plot 42 or Building A"
                  value={formData.houseNo}
                  onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="prop-address">Full Location Address *</label>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="prop-type">Property Category</label>
                <select
                  id="prop-type"
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Residential Apartments">Residential Apartments</option>
                  <option value="Residential Rental Rooms & Apartments">Residential Rental Rooms & Apartments</option>
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

            {/* ROOM UNITS LIST */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label" htmlFor="prop-rooms" style={{ marginBottom: 0 }}>
                  Configured Room Units (comma-separated) *
                </label>
                <span className="tabular-nums" style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {currentRoomsList.length} Units Configured
                </span>
              </div>
              <textarea
                id="prop-rooms"
                className="form-textarea"
                rows={2}
                required
                placeholder="Room 101, Room 102, Room 201, Room 202, Room 301"
                value={formData.roomsInput}
                onChange={(e) => setFormData({ ...formData, roomsInput: e.target.value })}
              />
              {currentRoomsList.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                  {currentRoomsList.map((rm, idx) => (
                    <span 
                      key={idx} 
                      className="tabular-nums"
                      style={{
                        fontSize: '0.7rem',
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-xs)',
                        background: 'var(--bg-hover)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        fontWeight: 500
                      }}
                    >
                      {rm}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* AMENITIES */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="prop-amenities">
                Amenities & Features (comma-separated)
              </label>
              <input
                id="prop-amenities"
                type="text"
                className="form-input"
                placeholder="e.g. Wi-Fi, 24/7 CCTV, Power Backup, Parking, Water Purifier"
                value={formData.amenitiesInput}
                onChange={(e) => setFormData({ ...formData, amenitiesInput: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              Owner Authorized Modification
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={uploading}>
                <Check size={14} /> {propertyToEdit ? 'Save Changes' : 'Register Property'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
