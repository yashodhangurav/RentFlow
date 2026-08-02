import React, { useState } from 'react';
import { formatINR } from '../utils/formatters';
import { Building, MapPin, Plus, CheckCircle2, Home, Layers, Users, ExternalLink, ShieldCheck } from 'lucide-react';
import { PropertyModal } from '../components/PropertyModal';

export const Properties = ({ properties = [], tenants = [], onAddProperty }) => {
  const [isPropModalOpen, setIsPropModalOpen] = useState(false);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Property Portfolio Header Banner */}
      <div className="glass-card" style={{
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(30, 27, 75, 0.5) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={24} color="var(--accent-primary)" /> Property & Room Roster Manager 🏢
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Manage properties, addresses, available room units, and tenant allocations.
          </p>
        </div>

        <button
          onClick={() => setIsPropModalOpen(true)}
          className="btn btn-primary"
          style={{ fontWeight: '700' }}
        >
          <Plus size={16} /> Add New Property & Units
        </button>
      </div>

      {/* Properties Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {properties.map((prop) => {
          const propTenants = tenants.filter(t => t.propertyId === prop.id || t.propertyName === prop.name);
          const occupiedCount = propTenants.length;
          const availableRoomsList = prop.availableRooms || ['Room 101', 'Room 102', 'Room 201', 'Room 202', 'Room 301'];
          const totalRevenue = propTenants.reduce((acc, t) => acc + (t.rentAmount || 0), 0);

          return (
            <div key={prop.id} className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                <img
                  src={prop.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80"}
                  alt={prop.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.2) 100%)'
                }} />
                <div style={{ position: 'absolute', bottom: '1rem', left: '1.25rem', right: '1.25rem' }}>
                  <span className="badge badge-info" style={{ marginBottom: '0.35rem', display: 'inline-block' }}>{prop.type || 'Residential'}</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff' }}>{prop.name}</h3>
                </div>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={15} color="var(--accent-primary)" /> {prop.address || 'Maharashtra, India'}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.725rem' }}>Occupied / Total Units</span>
                    <div style={{ fontWeight: '800', color: 'var(--accent-primary)', fontSize: '1rem' }}>
                      {occupiedCount} / {prop.units || availableRoomsList.length} Units
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.725rem' }}>Monthly Revenue</span>
                    <div style={{ fontWeight: '800', color: 'var(--accent-success)', fontSize: '1rem' }}>
                      {formatINR(totalRevenue)}
                    </div>
                  </div>
                </div>

                {/* Available Room Units Tags */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    Configured Room Units:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {availableRoomsList.map((rm) => {
                      const isOccupied = propTenants.some(t => (t.roomNo || t.unit) === rm);
                      return (
                        <span
                          key={rm}
                          style={{
                            fontSize: '0.725rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: '700',
                            background: isOccupied ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                            color: isOccupied ? 'var(--accent-success)' : 'var(--accent-primary)',
                            border: `1px solid ${isOccupied ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`
                          }}
                        >
                          {rm} {isOccupied ? '• Occupied' : '• Vacant'}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <PropertyModal
        isOpen={isPropModalOpen}
        onClose={() => setIsPropModalOpen(false)}
        onSave={onAddProperty}
      />
    </div>
  );
};
