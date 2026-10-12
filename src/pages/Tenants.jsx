import React, { useState, useMemo } from 'react';
import { formatINR } from '../utils/formatters';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Grid, 
  List, 
  DollarSign, 
  Edit, 
  Trash2, 
  Eye, 
  FileText, 
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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Search & Filter Control Bar */}
      <div className="fintech-card" style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Filter size={16} color="var(--accent-primary)" /> Tenants Directory
            </h3>
            <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Search across active tenants, units, phone numbers, and lease status
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* View Mode Segmented Switcher */}
            <div style={{ display: 'flex', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
              <button
                onClick={() => setViewMode('grid')}
                title="Card View"
                style={{
                  background: viewMode === 'grid' ? 'var(--bg-surface)' : 'transparent',
                  border: 'none',
                  color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer',
                  boxShadow: viewMode === 'grid' ? 'var(--shadow-xs)' : 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Grid size={14} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                title="Table View"
                style={{
                  background: viewMode === 'table' ? 'var(--bg-surface)' : 'transparent',
                  border: 'none',
                  color: viewMode === 'table' ? 'var(--text-primary)' : 'var(--text-muted)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer',
                  boxShadow: viewMode === 'table' ? 'var(--shadow-xs)' : 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <List size={14} />
              </button>
            </div>

            <button 
              onClick={onOpenAddTenant}
              className="btn btn-primary btn-sm"
              id="tenants-add-tenant-btn"
              style={{ height: '32px' }}
            >
              <Plus size={14} /> Add Tenant
            </button>
          </div>
        </div>

        {/* Search Controls Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {/* Search by Tenant Name */}
          <div>
            <label className="form-label" style={{ fontSize: '0.725rem' }}>Search by Name</label>
            <div style={{ position: 'relative' }}>
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search tenant name..."
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                style={{ paddingLeft: '32px', height: '36px', fontSize: '0.8125rem' }}
              />
            </div>
          </div>

          {/* Filter by Room Number */}
          <div>
            <label className="form-label" style={{ fontSize: '0.725rem' }}>Unit / Room Number</label>
            <select
              className="form-select"
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              style={{ height: '36px', fontSize: '0.8125rem' }}
            >
              <option value="ALL">All Units ({tenants.length})</option>
              {availableRooms.map(rm => (
                <option key={rm} value={rm}>{rm}</option>
              ))}
            </select>
          </div>

          {/* Filter by Rent Payment Status */}
          <div>
            <label className="form-label" style={{ fontSize: '0.725rem' }}>Settlement Status</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ height: '36px', fontSize: '0.8125rem' }}
            >
              <option value="ALL">All Settlement Statuses</option>
              <option value="PAID">Rent Paid (Settled)</option>
              <option value="PENDING">Rent Pending (Arrears)</option>
              <option value="EXPIRING">Agreement Expiring (&lt; 7 Days)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filtered Count Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div>
          Showing <strong className="tabular-nums" style={{ color: 'var(--text-primary)' }}>{filteredTenants.length}</strong> of <strong className="tabular-nums" style={{ color: 'var(--text-primary)' }}>{tenants.length}</strong> records
        </div>
        {(nameSearch || roomFilter !== 'ALL' || statusFilter !== 'ALL') && (
          <button
            onClick={() => {
              setNameSearch('');
              setRoomFilter('ALL');
              setStatusFilter('ALL');
            }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: '500', fontSize: '0.75rem' }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Tenants Display (Grid or Table) */}
      {filteredTenants.length === 0 ? (
        <div className="fintech-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Users size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: '600' }}>No Matching Tenants</h3>
          <p style={{ fontSize: '0.775rem', marginTop: '2px' }}>
            Try adjusting your search criteria or clearing active filters.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1rem' }}>
          {filteredTenants.map((tenant) => {
            const isPending = tenant.paymentStatus !== 'Paid';
            const roomName = tenant.roomNo || tenant.roomNumber || tenant.unit;

            return (
              <div 
                key={tenant.id || tenant._id}
                className="fintech-card hover-lift"
                style={{
                  padding: '1.15rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.85rem'
                }}
              >
                <div>
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img
                        src={tenant.avatar}
                        alt={tenant.name}
                        style={{ 
                          width: '38px', 
                          height: '38px', 
                          borderRadius: 'var(--radius-sm)', 
                          objectFit: 'cover', 
                          border: '1px solid var(--border-color)' 
                        }}
                      />
                      <div>
                        <h4 
                          onClick={() => onViewTenant(tenant)}
                          style={{ fontSize: '0.925rem', fontWeight: '600', cursor: 'pointer', color: 'var(--text-primary)', margin: 0 }}
                        >
                          {tenant.name}
                        </h4>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', lineHeight: '1.4' }}>
                          <Home size={13} color="var(--accent-primary)" />
                          <span className="tabular-nums" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{roomName}</span>
                        </div>
                      </div>
                    </div>

                    <span className={`badge ${isPending ? 'badge-warning' : 'badge-success'}`}>
                      {isPending ? 'Pending' : 'Settled'}
                    </span>
                  </div>

                  {/* Contact & ID Row */}
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Phone: <strong className="tabular-nums" style={{ color: 'var(--text-primary)' }}>{tenant.phone}</strong></span>
                      <code style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', padding: '1px 5px', borderRadius: 'var(--radius-xs)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {tenant.aadharId || 'ID Verified'}
                      </code>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      <span>Lease: <span className="tabular-nums">{new Date(tenant.joiningDate || tenant.leaseStart || '2024-01-01').toLocaleDateString()}</span></span>
                      <span>Expiry: <span className="tabular-nums">{new Date(tenant.agreementExpiryDate || tenant.leaseEnd || '2026-12-31').toLocaleDateString()}</span></span>
                    </div>
                  </div>

                  {/* Rent Box in INR */}
                  <div style={{
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Monthly Rate</span>
                      <div className="tabular-nums" style={{ fontWeight: '600', color: isPending ? 'var(--status-warning)' : 'var(--status-success)', fontSize: '0.95rem' }}>
                        {formatINR(tenant.rentAmount)}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const agreementUrl = tenant.agreementCloudUrl || tenant.agreementPdfName || tenant.agreementFile || tenant.agreementPdf;
                        const agreementName = tenant.agreementPdfName || tenant.agreementPdf || `Agreement_${roomName}.pdf`;
                        onOpenDocument(agreementName, 'Rental Agreement PDF', tenant.name, tenant.agreementExpiryDate, null, null, agreementUrl);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', gap: '3px' }}
                    >
                      <FileText size={12} /> Agreement
                    </button>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '0.65rem'
                }}>
                  <button
                    onClick={() => onViewTenant(tenant)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem', gap: '4px' }}
                  >
                    <Eye size={12} /> Details
                  </button>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {isPending && (
                      <button
                        onClick={() => onRecordPayment(tenant)}
                        className="btn btn-primary btn-sm"
                        title="Record Rent Payment"
                        style={{ padding: '0.25rem 0.55rem', fontSize: '0.725rem' }}
                      >
                        <DollarSign size={12} /> Collect
                      </button>
                    )}
                    <button
                      onClick={() => onEditTenant(tenant)}
                      className="btn btn-secondary btn-sm"
                      title="Edit Tenant"
                      style={{ padding: '0.25rem 0.45rem' }}
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      onClick={() => onDeleteTenant(tenant.id || tenant._id)}
                      className="btn btn-danger btn-sm"
                      title="Delete Tenant"
                      style={{ padding: '0.25rem 0.45rem' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tenant Profile</th>
                <th>Unit</th>
                <th>Phone Number</th>
                <th>Aadhar / ID</th>
                <th style={{ textAlign: 'right' }}>Monthly Rent</th>
                <th>Status</th>
                <th>Expiry</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((tenant) => {
                const isPending = tenant.paymentStatus !== 'Paid';
                const room = tenant.roomNo || tenant.roomNumber || tenant.unit;
                return (
                  <tr key={tenant.id || tenant._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img 
                          src={tenant.avatar} 
                          alt={tenant.name} 
                          style={{ 
                            width: '28px', 
                            height: '28px', 
                            borderRadius: 'var(--radius-sm)', 
                            objectFit: 'cover',
                            border: '1px solid var(--border-color)'
                          }} 
                        />
                        <div>
                          <span 
                            onClick={() => onViewTenant(tenant)}
                            style={{ cursor: 'pointer', color: 'var(--text-primary)', fontWeight: '500' }}
                          >
                            {tenant.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="tabular-nums" style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.825rem', whiteSpace: 'nowrap' }}>
                        {room}
                      </span>
                    </td>
                    <td>
                      <span className="tabular-nums" style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                        {tenant.phone}
                      </span>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        {tenant.aadharId || 'N/A'}
                      </code>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="tabular-nums" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                        {formatINR(tenant.rentAmount)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${isPending ? 'badge-warning' : 'badge-success'}`}>
                        {isPending ? 'Pending' : 'Paid'}
                      </span>
                    </td>
                    <td>
                      <span className="tabular-nums" style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                        {new Date(tenant.agreementExpiryDate || tenant.leaseEnd || '2026-12-31').toLocaleDateString()}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          onClick={() => onViewTenant(tenant)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem', lineHeight: '1.25' }}
                          title="View Full History"
                        >
                          <Eye size={12} />
                        </button>
                        {isPending && (
                          <button
                            onClick={() => onRecordPayment(tenant)}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem', lineHeight: '1.25' }}
                          >
                            Collect
                          </button>
                        )}
                        <button
                          onClick={() => onEditTenant(tenant)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem', lineHeight: '1.25' }}
                          title="Edit Tenant"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => onDeleteTenant(tenant.id || tenant._id)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem', lineHeight: '1.25' }}
                          title="Delete Tenant"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
