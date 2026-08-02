import React, { useState, useEffect } from 'react';
import { X, CreditCard, DollarSign, Calendar, CheckCircle2 } from 'lucide-react';

export const PaymentModal = ({ isOpen, onClose, onSave, tenants = [], preselectedTenant = null }) => {
  const [tenantId, setTenantId] = useState('');
  const [amount, setAmount] = useState(2450);
  const [method, setMethod] = useState('Bank Transfer (ACH)');
  const [period, setPeriod] = useState('August 2026');
  const [reference, setReference] = useState('');
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (preselectedTenant) {
      setTenantId(preselectedTenant.id);
      setAmount(preselectedTenant.rentAmount || 2200);
    } else if (tenants.length > 0) {
      setTenantId(tenants[0].id);
      setAmount(tenants[0].rentAmount || 2200);
    }
    setReference(`REF-${Math.floor(100000 + Math.random() * 900000)}`);
  }, [preselectedTenant, tenants, isOpen]);

  const handleTenantChange = (id) => {
    setTenantId(id);
    const t = tenants.find(item => item.id === id);
    if (t) {
      setAmount(t.rentAmount || 2200);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetTenant = tenants.find(t => t.id === tenantId);
    onSave({
      id: `pay-${Date.now()}`,
      tenantId: tenantId,
      tenantName: targetTenant ? targetTenant.name : 'Selected Tenant',
      unit: targetTenant ? targetTenant.unit : 'Unit',
      propertyName: targetTenant ? targetTenant.propertyName : 'Property',
      amount: Number(amount),
      dueDate: new Date().toISOString().split('T')[0],
      paidDate: paidDate,
      status: 'Paid',
      method: method,
      reference: reference || `REF-${Date.now()}`,
      period: period
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={20} color="var(--accent-success)" />
            Record Rent Payment
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
            <div className="form-group">
              <label className="form-label" htmlFor="payment-tenant-select">Select Tenant & Unit *</label>
              <select
                id="payment-tenant-select"
                className="form-select"
                value={tenantId}
                onChange={(e) => handleTenantChange(e.target.value)}
                required
              >
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.unit} - {t.propertyName})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="payment-amount">Payment Amount ($) *</label>
                <input
                  id="payment-amount"
                  type="number"
                  className="form-input"
                  required
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="payment-period">Billing Period *</label>
                <input
                  id="payment-period"
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. August 2026"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="payment-method">Payment Method</label>
                <select
                  id="payment-method"
                  className="form-select"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <option value="Bank Transfer (ACH)">Bank Transfer (ACH)</option>
                  <option value="Auto Debit">Auto Debit</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Wire Transfer">Wire Transfer</option>
                  <option value="Check / Cash">Check / Cash</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="payment-date">Date Received</label>
                <input
                  id="payment-date"
                  type="date"
                  className="form-input"
                  value={paidDate}
                  onChange={(e) => setPaidDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="payment-reference">Transaction / Reference #</label>
              <input
                id="payment-reference"
                type="text"
                className="form-input"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. ACH-984120"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" id="save-payment-submit-btn" className="btn btn-primary">
              <CheckCircle2 size={16} /> Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
