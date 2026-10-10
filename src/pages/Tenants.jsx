import React, { useState, useMemo } from 'react';
import { formatINR } from '../utils/formatters';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Grid, 
  List, 
  Phone, 
  Mail, 
  DollarSign, 
  Edit, 
  Trash2, 
  Eye, 
  ShieldAlert, 
  FileText, 
  ShieldCheck, 
  Calendar,
  Home
} from 'lucide-react';

export const Tenants = ({ 
  tenants = [], 
  searchTerm = '', 
  onOpenAddTenant, 
  onEditTenant, 
  onViewTenant, 
  onRecordPayment, 
  onDeleteTenant,
  onOpenDocument
}) => {
  const [nameSearch, setNameSearch] = useState('');
  const [roomFilter, setRoomFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid');

  // Extract unique room numbers dynamically from tenants list
  const availableRooms = useMemo(() => {
    const rooms = tenants.map(t => t.roomNo || t.roomNumber || t.unit).filter(Boolean);
    return Array.from(new Set(rooms)).sort();
  }, [tenants]);

  // Combine top navbar search with page-level name search and room filter
  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const room = (tenant.roomNo || tenant.roomNumber || tenant.unit || '').toLowerCase();
      const name = (tenant.name || '').toLowerCase();
      const phone = (tenant.phone || '').toLowerCase();
      const aadhar = (tenant.aadharId || '').toLowerCase();

      // Top navbar search match
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesGlobal = name.includes(query) || room.includes(query) || phone.includes(query) || aadhar.includes(query);
        if (!matchesGlobal) return false;
      }

      // Dedicated Name Search
      if (nameSearch) {
        const nQuery = nameSearch.toLowerCase();
        const matchesName = name.includes(nQuery);
        if (!matchesName) return false;
      }

      // Dedicated Room Number Filter
      if (roomFilter !== 'ALL') {
        if (room !== roomFilter.toLowerCase()) return false;
      }

      // Status Filter
      if (statusFilter === 'PAID') return tenant.paymentStatus === 'Paid';
      if (statusFilter === 'PENDING') return tenant.paymentStatus !== 'Paid';
      if (statusFilter === 'EXPIRING') {
        const today = new Date('2026-08-02T00:00:00');
        const expiry = new Date(tenant.agreementExpiryDate || tenant.leaseEnd);
        const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays >= 0;
      }

      return true;
    });
  }, [tenants, searchTerm, nameSearch, roomFilter, statusFilter]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Search & Filter Control Bar */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} color="var(--accent-primary)" /> Search & Filter Tenants
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Grid/Table Switcher */}
            <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: '8px', padding: '2px' }}>
              <button
                onClick={() => setViewMode('grid')}
                title="Grid View"
                style={{
                  background: viewMode === 'grid' ? 'var(--accent-primary)' : 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                title="Table View"
                style={{
                  background: viewMode === 'table' ? 'var(--accent-primary)' : 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <List size={16} />
              </button>
            </div>

            <button 
              onClick={onOpenAddTenant}
              className="btn btn-primary btn-sm"
              id="tenants-add-tenant-btn"
            >
              <Plus size={16} /> Add New Tenant
            </button>
          </div>
        </div>

        {/* Dynamic Search Controls Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {/* Search by Tenant Name */}
          <div style={{ position: 'relative' }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Search by Tenant Name</label>
            <div style={{ position: 'relative' }}>
              <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Rahul, Priya, Amit..."
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                style={{ paddingLeft: '34px', fontSize: '0.825rem' }}
              />
            </div>
          </div>

          {/* Filter by Room Number */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Filter by Room Number</label>
            <select
              className="form-select"
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              style={{ fontSize: '0.825rem', fontWeight: '600' }}
            >
              <option value="ALL">All Rooms ({tenants.length})</option>
              {availableRooms.map(rm => (
                <option key={rm} value={rm}>{rm}</option>
              ))}
            </select>
          </div>

          {/* Filter by Rent Payment Status */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Rent Payment Status</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ fontSize: '0.825rem', fontWeight: '600' }}
            >
              <option value="ALL">All Rent Statuses</option>
              <option value="PAID">Rent Paid</option>
              <option value="PENDING">🚨 Rent Pending (Red Warning)</option>
              <option value="EXPIRING">⚠️ Agreement Expiring (&lt; 7 Days)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filtered Count Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <div>
          Showing <strong>{filteredTenants.length}</strong> of <strong>{tenants.length}</strong> total tenants
        </div>
        {(nameSearch || roomFilter !== 'ALL' || statusFilter !== 'ALL') && (
          <button
            onClick={() => {
              setNameSearch('');
              setRoomFilter('ALL');
              setStatusFilter('ALL');
            }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Tenants Display (Grid or Table) */}
      {filteredTenants.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Users size={40} color="var(--accent-primary)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No Tenants Found Matching Filter</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Try clearing or changing your search criteria.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredTenants.map((tenant) => {
            const isPending = tenant.paymentStatus !== 'Paid';
            const roomName = tenant.roomNo || tenant.roomNumber || tenant.unit;

            return (
              <div 
                key={tenant.id || tenant._id}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isPending ? '2px solid rgba(244, 63, 94, 0.6)' : '1px solid var(--border-color)',
                  boxShadow: isPending ? '0 4px 20px rgba(244, 63, 94, 0.15)' : undefined
                }}
              >
                <div>
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={tenant.avatar}
                        alt={tenant.name}
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
                      />
                      <div>
                        <h4 
                          onClick={() => onViewTenant(tenant)}
                          style={{ fontSize: '1.05rem', fontWeight: '800', cursor: 'pointer', color: 'var(--text-primary)' }}
                        >
                          {tenant.name}
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Home size={14} /> {roomName}
                        </div>
                      </div>
                    </div>

                    <span className={`badge ${isPending ? 'badge-danger' : 'badge-success'}`} style={{ fontWeight: '800' }}>
                      {isPending ? '🚨 Rent Pending' : 'Paid'}
                    </span>
                  </div>

                  {/* Contact & ID Row */}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Phone: <strong>{tenant.phone}</strong></span>
                      <code style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1px 6px', borderRadius: '4px', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        Aadhar: {tenant.aadharId || tenant.idProof || 'N/A'}
                      </code>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>Joined: {new Date(tenant.joiningDate || tenant.leaseStart || '2024-01-01').toLocaleDateString()}</span>
                      <span>Expiry: {new Date(tenant.agreementExpiryDate || tenant.leaseEnd || '2026-12-31').toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Rent Box in INR */}
                  <div style={{
                    background: isPending ? 'var(--accent-danger-bg)' : 'rgba(255, 255, 255, 0.03)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.825rem'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.725rem' }}>Monthly Rent:</span>
                      <div style={{ fontWeight: '800', color: isPending ? 'var(--accent-danger)' : 'var(--accent-success)', fontSize: '1.05rem' }}>
                        {formatINR(tenant.rentAmount)}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const agreementUrl = tenant.agreementCloudUrl || tenant.agreementPdfName || tenant.agreementFile || tenant.agreementPdf;
                        const agreementName = tenant.agreementPdfName || tenant.agreementPdf || `Agreement_${roomName}.pdf`;
                        onOpenDocument(agreementName, 'Rental Agreement PDF', tenant.name, tenant.agreementExpiryDate, null, null, agreementUrl);
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem', gap: '4px' }}
                    >
                      <FileText size={13} /> Agreement PDF
                    </button>
                  </div>
                </div>

                {/* Card Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '1rem',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '0.75rem'
                }}>
                  <button
                    onClick={() => onViewTenant(tenant)}
                    className="btn btn-outline btn-sm"
                    style={{ gap: '0.35rem', fontSize: '0.775rem' }}
                  >
                    <Eye size={14} /> Full History
                  </button>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {isPending && (
                      <button
                        onClick={() => onRecordPayment(tenant)}
                        className="btn btn-primary btn-sm"
                        title="Record Rent Payment"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                      >
                        <DollarSign size={14} /> Collect Rent
                      </button>
                    )}
                    <button
                      onClick={() => onEditTenant(tenant)}
                      className="btn btn-secondary btn-sm"
                      title="Edit Tenant"
                      style={{ padding: '0.35rem 0.5rem' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteTenant(tenant.id || tenant._id)}
                      className="btn btn-danger btn-sm"
                      title="Delete Tenant"
                      style={{ padding: '0.35rem 0.5rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="glass-card" style={{ padding: '1rem' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Tenant Profile</th>
                  <th>Room No</th>
                  <th>Phone Number</th>
                  <th>Aadhar ID / Proof</th>
                  <th>Monthly Rent</th>
                  <th>Rent Status</th>
                  <th>Agreement Expiry</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map((tenant) => {
                  const isPending = tenant.paymentStatus !== 'Paid';
                  const room = tenant.roomNo || tenant.roomNumber || tenant.unit;
                  return (
                    <tr key={tenant.id || tenant._id} style={{ background: isPending ? 'rgba(244, 63, 94, 0.05)' : 'transparent' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <img src={tenant.avatar} alt={tenant.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <strong 
                              onClick={() => onViewTenant(tenant)}
                              style={{ cursor: 'pointer', color: 'var(--text-primary)' }}
                            >
                              {tenant.name}
                            </strong>
                            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Joined: {new Date(tenant.joiningDate || tenant.leaseStart || '2024-01-01').toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--accent-primary)', fontSize: '0.95rem' }}>{room}</strong>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem' }}>{tenant.phone}</span>
                      </td>
                      <td>
                        <code style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tenant.aadharId || tenant.idProof || 'N/A'}</code>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--accent-success)' }}>{formatINR(tenant.rentAmount)}</strong>
                      </td>
                      <td>
                        <span className={`badge ${isPending ? 'badge-danger' : 'badge-success'}`} style={{ fontWeight: '800' }}>
                          {isPending ? '🚨 Pending' : 'Paid'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem' }}>{new Date(tenant.agreementExpiryDate || tenant.leaseEnd || '2026-12-31').toLocaleDateString()}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            onClick={() => onViewTenant(tenant)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.25rem 0.5rem' }}
                            title="View Full History"
                          >
                            <Eye size={14} />
                          </button>
                          {isPending && (
                            <button
                              onClick={() => onRecordPayment(tenant)}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem' }}
                            >
                              Settle
                            </button>
                          )}
                          <button
                            onClick={() => onEditTenant(tenant)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.25rem 0.5rem' }}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => onDeleteTenant(tenant.id || tenant._id)}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.25rem 0.5rem' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
