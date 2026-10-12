import React from 'react';
import { AlertTriangle, Trash2, X, Building, Users } from 'lucide-react';

export const DeletePropertyModal = ({
  isOpen,
  onClose,
  onConfirmDelete,
  property,
  tenants = []
}) => {
  if (!isOpen || !property) return null;

  const propTenants = tenants.filter(t => t.propertyId === property.id || t.propertyId === property._id || t.propertyName === property.name);

  return (
    <div className="modal-overlay animate-fade-in" style={{ zIndex: 1200 }}>
      <div className="modal-content" style={{ maxWidth: '460px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--status-alert-bg)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--status-alert-text)'
            }}>
              <AlertTriangle size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                Delete Property
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Permanent removal from portfolio
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

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            Are you sure you want to permanently delete <strong>{property.name}</strong> from your portfolio? This action cannot be reversed.
          </p>

          <div style={{
            background: 'var(--bg-hover)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 1rem',
            fontSize: '0.8rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
              <Building size={13} color="var(--accent-primary)" />
              <span>Location: {property.address}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
              <Users size={13} color="var(--accent-primary)" />
              <span className="tabular-nums">Configured Units: {property.availableRooms?.length || property.units} Units</span>
            </div>
          </div>

          {propTenants.length > 0 ? (
            <div style={{
              background: 'var(--status-alert-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              color: 'var(--status-alert-text)',
              fontSize: '0.775rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.375rem'
            }}>
              <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={14} />
                Notice: {propTenants.length} Active Resident(s) Assigned:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: '1.45' }}>
                {propTenants.map(t => (
                  <li key={t.id || t._id} style={{ marginBottom: '2px' }}>
                    <strong>{t.name}</strong> • <span className="tabular-nums">{t.roomNo || t.roomNumber || t.unit}</span>
                  </li>
                ))}
              </ul>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Deleting will remove the property reference from these tenant records.
              </div>
            </div>
          ) : (
            <div style={{
              background: 'var(--status-paid-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.625rem 0.875rem',
              color: 'var(--status-paid-text)',
              fontSize: '0.775rem',
              fontWeight: 500
            }}>
              ✓ Zero active tenants assigned. Safe to remove.
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button 
            type="button" 
            onClick={() => {
              onConfirmDelete(property.id || property._id);
              onClose();
            }} 
            className="btn btn-danger"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Trash2 size={14} /> Delete Property
          </button>
        </div>
      </div>
    </div>
  );
};
