import React, { useState, useEffect } from 'react';
import { X, CreditCard, DollarSign, Calendar, CheckCircle2 } from 'lucide-react';
import { getCurrentMonthYear, getDynamicMonthOptions } from '../utils/dateUtils';

export const PaymentModal = ({ isOpen, onClose, onSave, tenants = [], preselectedTenant = null }) => {
  const [tenantId, setTenantId] = useState('');
  const [amount, setAmount] = useState(2450);
  const [method, setMethod] = useState('Bank Transfer (ACH)');
  const [period, setPeriod] = useState(() => getCurrentMonthYear());
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
      <div className="modal-content animate-fade-in" style={{ maxWidth: '480px' }}>
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
              <CreditCard size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Record Rent Payment
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Record manual settlement to tenant ledger
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minHeight: 0, overflowY: 'auto' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="payment-tenant-select">Tenant & Assigned Unit *</label>
              <select
                id="payment-tenant-select"
                className="form-select"
                value={tenantId}
                onChange={(e) => handleTenantChange(e.target.value)}
                required
                style={{ fontWeight: 600 }}
              >
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.unit} - {t.propertyName})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="payment-amount">Payment Amount (₹) *</label>
                <input
                  id="payment-amount"
                  type="number"
                  className="form-input tabular-nums"
                  required
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ fontWeight: 600 }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="payment-period">Billing Period *</label>
                <select
                  id="payment-period"
                  className="form-select"
                  required
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  {getDynamicMonthOptions(6, 2).map((m) => (
                    <option key={m} value={m}>
                      {m} {m === getCurrentMonthYear() ? '• Current' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="payment-method">Payment Method</label>
                <select
                  id="payment-method"
                  className="form-select"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <option value="UPI (GPay / PhonePe)">UPI (GPay / PhonePe)</option>
                  <option value="Bank Transfer (NEFT/IMPS)">Bank Transfer (NEFT/IMPS)</option>
                  <option value="Direct Cash">Direct Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Auto Debit">Auto Debit</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="payment-date">Settlement Date</label>
                <input
                  id="payment-date"
                  type="date"
                  className="form-input tabular-nums"
                  value={paidDate}
                  onChange={(e) => setPaidDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="payment-reference">Transaction / Reference Number</label>
              <input
                id="payment-reference"
                type="text"
                className="form-input tabular-nums"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. UPI-984120"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" id="save-payment-submit-btn" className="btn btn-primary">
              <CheckCircle2 size={15} /> Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
