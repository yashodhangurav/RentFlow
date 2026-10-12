import React, { useState, useMemo } from 'react';
import { formatINR } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { 
  Building, 
  MapPin, 
  Plus, 
  DoorClosed, 
  Edit3, 
  Trash2, 
  Lock,
  Search,
  Filter
} from 'lucide-react';
import { PropertyModal } from '../components/PropertyModal';
import { RoomManagerModal } from '../components/RoomManagerModal';
import { DeletePropertyModal } from '../components/DeletePropertyModal';

export const Properties = ({ 
  properties = [], 
  tenants = [], 
  onAddProperty,
  onEditProperty,
  onDeleteProperty,
  onUpdateRooms
}) => {
  const { user, isAdmin } = useAuth();

  const [isPropModalOpen, setIsPropModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [roomManagerProperty, setRoomManagerProperty] = useState(null);
  const [deletingProperty, setDeletingProperty] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      const matchesSearch = !searchTerm || 
        prop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.address?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'ALL' || prop.type?.toLowerCase().includes(typeFilter.toLowerCase());

      return matchesSearch && matchesType;
    });
  }, [properties, searchTerm, typeFilter]);

  // Handle open add modal (Owner only)
  const handleOpenAdd = () => {
    if (!isAdmin) {
      alert('Unauthorized: Only property owner Yashodhan Gurav can add new properties.');
      return;
    }
    setEditingProperty(null);
    setIsPropModalOpen(true);
  };

  // Handle open edit modal (Owner only)
  const handleOpenEdit = (prop) => {
    if (!isAdmin) {
      alert('Unauthorized: Only property owner Yashodhan Gurav can edit properties.');
      return;
    }
    setEditingProperty(prop);
    setIsPropModalOpen(true);
  };

  // Handle open room manager (Owner only)
  const handleOpenRoomManager = (prop) => {
    if (!isAdmin) {
      alert('Unauthorized: Only property owner Yashodhan Gurav can modify room numbers.');
      return;
    }
    setRoomManagerProperty(prop);
  };

  // Handle open delete modal (Owner only)
  const handleOpenDelete = (prop) => {
    if (!isAdmin) {
      alert('Unauthorized: Only property owner Yashodhan Gurav can delete properties.');
      return;
    }
    setDeletingProperty(prop);
  };

  // Save property (add or edit)
  const handleSavePropertyModal = (savedData) => {
    if (editingProperty) {
      if (onEditProperty) {
        onEditProperty(savedData);
      } else if (onAddProperty) {
        onAddProperty(savedData);
      }
    } else {
      onAddProperty(savedData);
    }
    setIsPropModalOpen(false);
    setEditingProperty(null);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Property Portfolio Header Banner */}
      <div className="fintech-card" style={{
        padding: '1.15rem 1.4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <h1 style={{ fontSize: '1.15rem', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Building size={18} color="var(--accent-primary)" /> Properties & Units Portfolio
            </h1>
            {isAdmin ? (
              <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                Owner Access Active
              </span>
            ) : (
              <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>
                Read-Only
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: '2px 0 0 0' }}>
            {isAdmin
              ? "Owner Yashodhan Gurav • Manage property listings, unit allocations, and room numbering rosters."
              : "Read-only portfolio directory. Management operations are restricted to the property owner."}
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={handleOpenAdd}
            className="btn btn-primary btn-sm"
            style={{ height: '32px' }}
          >
            <Plus size={14} /> Add Property
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            <Lock size={13} /> Owner Restricted
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '260px', maxWidth: '380px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '32px', marginBottom: 0, width: '100%', height: '32px', fontSize: '0.775rem' }}
              placeholder="Search properties or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <Filter size={13} color="var(--text-muted)" />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '2px' }}>Category:</span>
          {['ALL', 'Residential', 'Flats', 'PG', 'Commercial'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`btn btn-sm ${typeFilter === t ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.725rem', padding: '0.2rem 0.55rem' }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Properties Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {filteredProperties.map((prop) => {
          const propId = prop.id || prop._id;
          const propTenants = tenants.filter(t => t.propertyId === propId || t.propertyId === prop.id || t.propertyName === prop.name);
          const occupiedCount = propTenants.length;
          const availableRoomsList = prop.availableRooms && prop.availableRooms.length > 0
            ? prop.availableRooms
            : ['Room 101', 'Room 102', 'Room 201', 'Room 202', 'Room 301'];
          const totalRevenue = propTenants.reduce((acc, t) => acc + (t.rentAmount || 0), 0);

          return (
            <div 
              key={propId} 
              className="fintech-card hover-lift" 
              style={{ 
                padding: '0', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between'
              }}
            >
              {/* Card Photo Header */}
              <div style={{ position: 'relative', height: '145px', overflow: 'hidden' }}>
                <img
                  src={prop.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80"}
                  alt={prop.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(13, 17, 23, 0.92) 0%, rgba(13, 17, 23, 0.25) 100%)'
                }} />
                
                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                  <span className="badge badge-neutral" style={{ background: 'rgba(15, 23, 42, 0.85)', color: '#F1F5F9', borderColor: 'rgba(255, 255, 255, 0.15)' }}>
                    {prop.type || 'Residential'}
                  </span>
                </div>

                <div style={{ position: 'absolute', bottom: '0.75rem', left: '1rem', right: '1rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#FFFFFF', margin: 0 }}>
                    {prop.name}
                  </h3>
                  <div style={{ fontSize: '0.725rem', color: 'rgba(241, 245, 249, 0.8)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                    <MapPin size={12} color="var(--accent-primary)" /> {prop.address || 'Maharashtra, India'}
                  </div>
                </div>
              </div>

              {/* Card Main Info */}
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
                {/* Metrics Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', background: 'var(--bg-subtle)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Occupancy</span>
                    <div className="tabular-nums" style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem', marginTop: '1px' }}>
                      {occupiedCount} / {availableRoomsList.length} Units
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Monthly Yield</span>
                    <div className="tabular-nums" style={{ fontWeight: '600', color: 'var(--status-success)', fontSize: '0.95rem', marginTop: '1px' }}>
                      {formatINR(totalRevenue)}
                    </div>
                  </div>
                </div>

                {/* Available Room Units Tags */}
                <div>
                  <div style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: '600', 
                    color: 'var(--text-muted)', 
                    marginBottom: '0.35rem', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>Configured Units ({availableRoomsList.length}):</span>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleOpenRoomManager(prop)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-primary)',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          padding: 0
                        }}
                      >
                        Edit Roster
                      </button>
                    )}
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.35rem', 
                    maxHeight: '140px', 
                    overflowY: 'auto', 
                    padding: '2px 0',
                    alignItems: 'center'
                  }}>
                    {availableRoomsList.map((rm) => {
                      const occupyingTenant = propTenants.find(t => (t.roomNo === rm || t.roomNumber === rm || t.unit === rm));
                      const isOccupied = !!occupyingTenant;

                      return (
                        <span
                          key={rm}
                          title={isOccupied ? `Occupied by ${occupyingTenant.name} (${formatINR(occupyingTenant.rentAmount || 0)}/mo)` : `Vacant`}
                          style={{
                            fontSize: '0.725rem',
                            lineHeight: '1.35',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-xs)',
                            fontWeight: '500',
                            background: isOccupied ? 'var(--status-success-bg)' : 'var(--bg-subtle)',
                            color: isOccupied ? 'var(--status-success)' : 'var(--text-secondary)',
                            border: `1px solid ${isOccupied ? 'var(--status-success-border)' : 'var(--border-color)'}`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <span className="tabular-nums" style={{ fontWeight: 600 }}>{rm}</span>
                          <span style={{ fontSize: '0.625rem', opacity: 0.85 }}>{isOccupied ? '•' : '○'}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Amenities Badges if available */}
                {prop.amenities && prop.amenities.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {prop.amenities.slice(0, 3).map((amenity, idx) => (
                      <span 
                        key={idx}
                        style={{ 
                          fontSize: '0.65rem', 
                          padding: '1px 5px', 
                          borderRadius: 'var(--radius-xs)', 
                          background: 'var(--bg-subtle)',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        ✓ {amenity}
                      </span>
                    ))}
                    {prop.amenities.length > 3 && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                        +{prop.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* CARD FOOTER WITH OWNER CONTROLS */}
              <div style={{ 
                padding: '0.65rem 1rem', 
                borderTop: '1px solid var(--border-color)', 
                background: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.4rem'
              }}>
                {isAdmin ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenRoomManager(prop)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '4px 8px', gap: '4px', flex: 1 }}
                      title="Manage room numbers"
                    >
                      <DoorClosed size={13} color="var(--accent-primary)" /> Units
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(prop)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '4px 8px', gap: '4px' }}
                      title="Edit property details"
                    >
                      <Edit3 size={13} color="var(--text-secondary)" /> Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenDelete(prop)}
                      className="btn btn-sm btn-danger"
                      style={{ fontSize: '0.75rem', padding: '4px 8px', gap: '4px' }}
                      title="Delete property"
                    >
                      <Trash2 size={13} />
                    </button>
                  </>
                ) : (
                  <div style={{ width: '100%', textAlign: 'center', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    Owner Protected
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProperties.length === 0 && (
        <div className="fintech-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Building size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: '600' }}>No Properties Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.775rem' }}>
            No properties match your filter criteria or search term.
          </p>
        </div>
      )}

      {/* Property Modal (Add & Edit) */}
      <PropertyModal
        isOpen={isPropModalOpen}
        onClose={() => {
          setIsPropModalOpen(false);
          setEditingProperty(null);
        }}
        onSave={handleSavePropertyModal}
        propertyToEdit={editingProperty}
      />

      {/* Dedicated Room Manager Modal */}
      <RoomManagerModal
        isOpen={!!roomManagerProperty}
        onClose={() => setRoomManagerProperty(null)}
        property={roomManagerProperty}
        tenants={tenants}
        onSaveRooms={(propId, updatedRooms, renamedMap) => {
          if (onUpdateRooms) {
            onUpdateRooms(propId, updatedRooms, renamedMap);
          }
          setRoomManagerProperty(null);
        }}
      />

      {/* Delete Property Confirmation Modal */}
      <DeletePropertyModal
        isOpen={!!deletingProperty}
        onClose={() => setDeletingProperty(null)}
        property={deletingProperty}
        tenants={tenants}
        onConfirmDelete={(propId) => {
          if (onDeleteProperty) {
            onDeleteProperty(propId);
          }
          setDeletingProperty(null);
        }}
      />
    </div>
  );
};
