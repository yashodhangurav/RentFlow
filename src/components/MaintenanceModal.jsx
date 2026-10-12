import React, { useState, useEffect } from 'react';
import { X, Wrench, AlertTriangle, User, DollarSign } from 'lucide-react';

export const MaintenanceModal = ({ isOpen, onClose, onSave, tenants = [], ticketToEdit = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    tenantId: '',
    category: 'Plumbing',
    priority: 'Medium',
    status: 'New',
    assignedVendor: 'Unassigned',
    costEstimate: 200,
    description: ''
  });

  useEffect(() => {
    if (ticketToEdit) {
      setFormData(ticketToEdit);
    } else {
      setFormData({
        title: '',
        tenantId: tenants[0]?.id || '',
        category: 'Plumbing',
        priority: 'Medium',
        status: 'New',
        assignedVendor: 'Unassigned',
        costEstimate: 200,
        description: ''
      });
    }
  }, [ticketToEdit, tenants, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const selTenant = tenants.find(t => t.id === formData.tenantId) || tenants[0];
    onSave({
      ...formData,
      id: ticketToEdit ? ticketToEdit.id : `maint-${Date.now()}`,
      tenantName: selTenant ? selTenant.name : 'Resident',
      unit: selTenant ? selTenant.unit : 'Unit',
      propertyName: selTenant ? selTenant.propertyName : 'Property',
      dateReported: ticketToEdit ? ticketToEdit.dateReported : new Date().toISOString().split('T')[0],
      costEstimate: Number(formData.costEstimate)
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '520px' }}>
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
              <Wrench size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                {ticketToEdit ? 'Edit Maintenance Ticket' : 'Create Maintenance Ticket'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Assign technician, dispatch status, and cost estimates
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
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="maint-title">Issue Headline *</label>
              <input
                id="maint-title"
                type="text"
                className="form-input"
                required
                placeholder="e.g. Kitchen sink drain leakage"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="maint-tenant">Tenant & Unit *</label>
                <select
                  id="maint-tenant"
                  className="form-select"
                  value={formData.tenantId}
                  onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                  style={{ fontWeight: 600 }}
                >
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.unit})</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="maint-category">Trade Category</label>
                <select
                  id="maint-category"
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Plumbing">Plumbing</option>
                  <option value="HVAC / Climate">HVAC / Climate</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Appliance Repair">Appliance Repair</option>
                  <option value="Security & Locks">Security & Locks</option>
                  <option value="Structural / Roofing">Structural / Roofing</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="maint-priority">Priority</label>
                <select
                  id="maint-priority"
                  className="form-select"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Emergency">Emergency</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="maint-status">Workflow Status</label>
                <select
                  id="maint-status"
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="New">New Request</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="maint-cost">Est. Cost (₹)</label>
                <input
                  id="maint-cost"
                  type="number"
                  className="form-input tabular-nums"
                  min="0"
                  value={formData.costEstimate}
                  onChange={(e) => setFormData({ ...formData, costEstimate: e.target.value })}
                  style={{ fontWeight: 600 }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="maint-vendor">Assigned Technician / Vendor</label>
              <input
                id="maint-vendor"
                type="text"
                className="form-input"
                placeholder="e.g. Apex Plumbing Specialists"
                value={formData.assignedVendor}
                onChange={(e) => setFormData({ ...formData, assignedVendor: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="maint-desc">Scope Description</label>
              <textarea
                id="maint-desc"
                className="form-textarea"
                rows="3"
                placeholder="Provide work order details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" id="save-maint-submit-btn" className="btn btn-primary">
              Save Work Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
