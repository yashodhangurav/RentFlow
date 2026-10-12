import React from 'react';
import { FileSpreadsheet, Download, RefreshCw, Printer } from 'lucide-react';

export const Reports = ({ tenants = [], properties = [], payments = [], onResetData }) => {
  const exportRentRollCSV = () => {
    const headers = ['Tenant ID', 'Name', 'Email', 'Phone', 'Property', 'Unit', 'Monthly Rent', 'Lease End', 'Rent Status'];
    const rows = tenants.map(t => [
      t.id || t._id,
      `"${t.name}"`,
      t.email,
      t.phone,
      `"${t.propertyName}"`,
      t.unit || t.roomNo,
      t.rentAmount,
      t.leaseEnd || t.agreementExpiryDate,
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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Overview Card */}
      <div className="fintech-card" style={{ padding: '1.25rem 1.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0 }}>
            <FileSpreadsheet size={18} color="var(--accent-primary)" /> Reports & Ledger Exports
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
            Generate real-time Rent Rolls, Occupancy Statements, and CSV Data Audits.
          </p>
        </div>

        <button 
          onClick={exportRentRollCSV}
          className="btn btn-primary btn-sm"
          id="export-rent-roll-btn"
          style={{ height: '32px' }}
        >
          <Download size={14} /> Export Rent Roll (CSV)
        </button>
      </div>

      {/* Grid of Available Reports */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div className="fintech-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>Monthly Financial Rent Roll</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
              Comprehensive list of active leases, monthly rent rates, security deposit escrow, and tenant contact details.
            </p>
          </div>
          <button onClick={exportRentRollCSV} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            <Download size={13} /> Download CSV Document
          </button>
        </div>

        <div className="fintech-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>Maintenance Cost Summary</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
              Breakdown of vendor labor, appliance replacements, HVAC repairs, and emergency callout fees.
            </p>
          </div>
          <button onClick={() => window.print()} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            <Printer size={13} /> Print Summary Report
          </button>
        </div>

        <div className="fintech-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderColor: 'var(--status-danger-border)' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.35rem', color: 'var(--status-danger)' }}>Database Reset Options</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
              Re-seed MongoDB Atlas database back to original demo properties, tenants, and ledger entries.
            </p>
          </div>
          <button onClick={onResetData} className="btn btn-danger btn-sm" id="reset-demo-data-btn" style={{ width: '100%', justifyContent: 'center' }}>
            <RefreshCw size={13} /> Reset Demo Dataset
          </button>
        </div>
      </div>
    </div>
  );
};
