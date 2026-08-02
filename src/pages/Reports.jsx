import React from 'react';
import { FileSpreadsheet, Download, RefreshCw, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Reports = ({ tenants = [], properties = [], payments = [], onResetData }) => {
  const exportRentRollCSV = () => {
    const headers = ['Tenant ID', 'Name', 'Email', 'Phone', 'Property', 'Unit', 'Monthly Rent', 'Lease End', 'Rent Status'];
    const rows = tenants.map(t => [
      t.id,
      `"${t.name}"`,
      t.email,
      t.phone,
      `"${t.propertyName}"`,
      t.unit,
      t.rentAmount,
      t.leaseEnd,
      t.paymentStatus
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EstatePulse_Rent_Roll_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Overview Card */}
      <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileSpreadsheet size={22} color="var(--accent-primary)" /> Property Reports & Ledger Exports
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Generate real-time Rent Rolls, Occupancy Statements, and CSV Data Audits.
          </p>
        </div>

        <button 
          onClick={exportRentRollCSV}
          className="btn btn-primary"
          id="export-rent-roll-btn"
        >
          <Download size={16} /> Export Rent Roll (CSV)
        </button>
      </div>

      {/* Grid of Available Reports */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.5rem' }}>Monthly Financial Rent Roll</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Comprehensive list of active leases, monthly rent rates, security deposit escrow, and tenant contact details.
          </p>
          <button onClick={exportRentRollCSV} className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            <Download size={14} /> Download CSV Document
          </button>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.5rem' }}>Maintenance Cost Summary</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Breakdown of vendor labor, appliance replacements, HVAC repairs, and emergency callout fees.
          </p>
          <button onClick={() => window.print()} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            <Printer size={14} /> Print Summary Report
          </button>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--accent-danger)' }}>Demo Dataset Settings</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Reset local storage to original seed properties, tenants, rent payments, and work orders.
          </p>
          <button onClick={onResetData} className="btn btn-danger btn-sm" id="reset-demo-data-btn" style={{ width: '100%', justifyContent: 'center' }}>
            <RefreshCw size={14} /> Reset Demo Dataset
          </button>
        </div>
      </div>
    </div>
  );
};
