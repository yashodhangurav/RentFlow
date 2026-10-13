import React, { useState, useEffect } from 'react';
import { X, Printer, Download, Building2, Check, Edit3, RotateCcw, ShieldCheck } from 'lucide-react';
import { getCurrentMonthYear } from '../utils/dateUtils';

export const HOUSE_CONFIGS = {
  krishnaarjun: {
    id: 'krishnaarjun',
    displayName: 'KrishnaArjun',
    englishName: 'KRISHNARJUN',
    marathiName: 'कृष्णाअर्जुन',
    marathiColor: '#1d3a8a', // Deep Blue
    subtitle: 'RESIDENTIAL BUILDING • RENT RECEIPT',
    logo: '/logos/logo_krishnarjun.png',
    footerText: 'कृष्णाअर्जुन (Krishnarjun) • Standard Rent Receipt Form',
    defaultOwner: 'Chandrashekhar Laxman Gurav',
    defaultHouseNo: '1000/C',
    defaultAddress: '1000/C Laxmi Nagar Khanapur, Belgaum 591302'
  },
  saaipawan: {
    id: 'saaipawan',
    displayName: 'Saai Pawan',
    englishName: 'SAAI PAWAN',
    marathiName: 'साई पवन',
    marathiColor: '#b45309', // Warm Ochre / Amber
    subtitle: 'RESIDENTIAL BUILDING • RENT RECEIPT',
    logo: '/logos/logo_saai_pawan.png',
    footerText: 'साई पवन (Saai Pawan) • Standard Rent Receipt Form',
    defaultOwner: 'Chandrashekhar Laxman Gurav',
    defaultHouseNo: '1585/A-1-B',
    defaultAddress: '1585/A-1-B Laxmi Nagar khanapur, belgaum 591302'
  }
};

const formatINRNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return Number(num).toLocaleString('en-IN');
};

const formatDateToReceipt = (dateVal) => {
  if (!dateVal) {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  }
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

export const ReceiptModal = (props) => {
  if (!props.isOpen || !props.payment) return null;
  return <ReceiptModalContent {...props} />;
};

const ReceiptModalContent = ({ isOpen, onClose, payment, tenants = [], properties = [] }) => {

  // 1. Resolve Tenant & Property Records
  const matchedTenant = (tenants && tenants.length > 0)
    ? tenants.find(t => 
        (t._id && t._id === payment.tenantId) ||
        (t.id && t.id === payment.tenantId) ||
        (typeof payment.tenantId === 'object' && payment.tenantId?._id && t._id === payment.tenantId._id) ||
        (t.name && payment.tenantName && t.name.trim().toLowerCase() === payment.tenantName.trim().toLowerCase())
      ) || (typeof payment.tenantId === 'object' ? payment.tenantId : null)
    : (typeof payment.tenantId === 'object' ? payment.tenantId : null);

  const propName = payment.propertyName || matchedTenant?.propertyName || payment.tenantId?.propertyName || '';
  const propId = payment.propertyId || matchedTenant?.propertyId || payment.tenantId?.propertyId || '';

  const matchedProperty = (properties && properties.length > 0)
    ? properties.find(p => 
        (propId && (p.id === propId || p._id === propId || p.customId === propId)) ||
        (propName && p.name && p.name.trim().toLowerCase() === propName.trim().toLowerCase())
      )
    : null;

  // 2. Detect House Configuration (KrishnaArjun vs Saai Pawan)
  const resolveInitialHouse = () => {
    const rawSearch = `${payment.propertyName || ''} ${matchedTenant?.propertyName || ''} ${matchedProperty?.name || ''} ${payment.tenantName || ''} ${payment.roomNumber || ''}`.toLowerCase();
    if (rawSearch.includes('saai') || rawSearch.includes('sai') || rawSearch.includes('pawan')) {
      return 'saaipawan';
    }
    return 'krishnaarjun';
  };

  const [selectedHouseKey, setSelectedHouseKey] = useState(resolveInitialHouse);
  const [isEditing, setIsEditing] = useState(false);

  // 3. Prepare initial auto-filled receipt values
  const getAutoFilledData = (houseKey) => {
    const houseConfig = HOUSE_CONFIGS[houseKey] || HOUSE_CONFIGS.krishnaarjun;
    const amount = Number(payment.amountPaid || payment.amount || matchedTenant?.rentAmount || 0);
    const totalRent = Number(payment.totalAmount || matchedTenant?.rentAmount || amount);
    const balanceDue = Math.max(0, totalRent - amount);

    let monthStr = payment.month || payment.period || '';
    if (!monthStr && payment.paymentDate) {
      const d = new Date(payment.paymentDate);
      if (!isNaN(d.getTime())) {
        monthStr = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      }
    }
    if (!monthStr) monthStr = getCurrentMonthYear();

    const receiptNo = payment.reference || payment.receiptNumber || 
      (payment._id || payment.id ? `RCP-${String(payment._id || payment.id).slice(-6).toUpperCase()}` : 'RCP-921355');

    const tenantName = payment.tenantName || matchedTenant?.name || 'Tenant Name';
    const roomStr = payment.roomNumber || payment.unit || matchedTenant?.roomNumber || matchedTenant?.roomNo || '';
    const ownerName = matchedProperty?.manager || houseConfig.defaultOwner;
    const houseName = houseConfig.displayName;
    const ownerLine = roomStr ? `${ownerName} (${houseName}, ${roomStr})` : `${ownerName} (${houseName})`;

    return {
      month: monthStr,
      receiptNo: receiptNo,
      date: formatDateToReceipt(payment.paymentDate || payment.paidDate || payment.createdAt),
      tenantName: tenantName,
      amount: amount,
      totalRent: totalRent,
      balanceDue: balanceDue,
      ownerLine: ownerLine
    };
  };

  const [receiptData, setReceiptData] = useState(() => getAutoFilledData(resolveInitialHouse()));

  // Sync state whenever payment or selected house changes
  useEffect(() => {
    const autoHouse = resolveInitialHouse();
    setSelectedHouseKey(autoHouse);
    setReceiptData(getAutoFilledData(autoHouse));
    setIsEditing(false);
  }, [payment, isOpen]);

  const handleHouseChange = (newHouseKey) => {
    setSelectedHouseKey(newHouseKey);
    setReceiptData(prev => {
      const fresh = getAutoFilledData(newHouseKey);
      return {
        ...prev,
        ownerLine: fresh.ownerLine
      };
    });
  };

  const handleResetToAuto = () => {
    setReceiptData(getAutoFilledData(selectedHouseKey));
    setIsEditing(false);
  };

  const activeHouse = HOUSE_CONFIGS[selectedHouseKey] || HOUSE_CONFIGS.krishnaarjun;

  // Print function (Dedicated clean window print for 100% pixel-perfect A4 printing)
  const handlePrint = () => {
    const printContent = document.getElementById('printable-rent-receipt-sheet');
    if (!printContent) {
      window.print();
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Rent Receipt - ${activeHouse.displayName} - ${receiptData.receiptNo}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;600;700;800&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              background: #ffffff;
              color: #0e1729;
              padding: 0;
            }
            .sheet-container {
              width: 100%;
              max-width: 780px;
              margin: 0 auto;
              background: #ffffff;
              padding: 10px 15px;
            }
            .receipt-box {
              border: 1.5px solid #1d293b;
              border-radius: 10px;
              padding: 18px 24px;
              background: #ffffff;
            }
            .header-flex {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .header-left {
              display: flex;
              align-items: center;
              gap: 14px;
            }
            .brand-logo {
              width: 48px;
              height: 48px;
              border-radius: 8px;
              object-fit: contain;
            }
            .brand-devanagari {
              font-family: 'Noto Sans Devanagari', sans-serif;
              font-size: 16px;
              font-weight: 700;
              line-height: 1.2;
            }
            .brand-english {
              font-family: Georgia, 'Times New Roman', serif;
              font-size: 21px;
              font-weight: 800;
              color: #0e1729;
              letter-spacing: 0.5px;
              line-height: 1.1;
            }
            .brand-sub {
              font-size: 9.5px;
              font-weight: 600;
              color: #64738b;
              letter-spacing: 1.2px;
              text-transform: uppercase;
              margin-top: 2px;
            }
            .header-right {
              text-align: right;
            }
            .receipt-title {
              font-family: Georgia, 'Times New Roman', serif;
              font-size: 22px;
              font-weight: 800;
              letter-spacing: 1px;
              color: #0e1729;
            }
            .copy-type {
              font-size: 11px;
              font-weight: 700;
              color: #334155;
              letter-spacing: 0.5px;
              margin-top: 2px;
            }
            .header-line {
              height: 2px;
              background-color: #0e1729;
              margin: 10px 0 12px 0;
            }
            .meta-row {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              font-size: 13px;
              margin-bottom: 4px;
            }
            .meta-col {
              display: flex;
              align-items: baseline;
            }
            .meta-label {
              font-weight: 700;
              color: #0e1729;
              margin-right: 6px;
            }
            .meta-underline {
              border-bottom: 1px solid #1d293b;
              min-width: 130px;
              padding: 0 8px;
              font-weight: 600;
              color: #0e1729;
              text-align: center;
            }
            .inner-card {
              border: 1px solid #cbd5e1;
              border-radius: 6px;
              background: #fafafa;
              padding: 12px 18px;
              margin: 12px 0 14px 0;
            }
            .card-line {
              display: flex;
              align-items: baseline;
              margin-bottom: 10px;
              font-size: 13px;
            }
            .card-label {
              font-weight: 700;
              color: #0e1729;
              white-space: nowrap;
              margin-right: 8px;
            }
            .line-fill {
              flex: 1;
              border-bottom: 1px solid #1d293b;
              padding: 0 8px;
              font-weight: 600;
              color: #0e1729;
            }
            .amt-fill {
              min-width: 140px;
              border-bottom: 1px solid #1d293b;
              padding: 0 8px;
              font-weight: 700;
              color: #0e1729;
              text-align: center;
            }
            .calc-table {
              width: 65%;
              margin: 12px auto 4px auto;
              border-collapse: collapse;
              border: 1.5px solid #1d293b;
              background: #ffffff;
            }
            .calc-table td {
              border: 1px solid #1d293b;
              padding: 6px 12px;
              font-size: 12.5px;
            }
            .calc-table .col-desc {
              font-weight: 600;
              color: #0e1729;
            }
            .calc-table .col-val {
              font-weight: 700;
              color: #0e1729;
              width: 38%;
              text-align: left;
            }
            .signatures-row {
              display: flex;
              justify-content: space-between;
              margin-top: 16px;
              padding: 0 10px;
            }
            .sig-block {
              text-align: left;
            }
            .sig-line {
              width: 180px;
              border-bottom: 1px solid #1d293b;
              margin-bottom: 5px;
            }
            .sig-text {
              font-size: 11px;
              font-weight: 700;
              color: #0e1729;
            }
            .tear-line {
              display: flex;
              align-items: center;
              margin: 16px 0;
              gap: 12px;
            }
            .tear-dashed {
              flex: 1;
              border-top: 1px dashed #94a3b8;
            }
            .tear-text {
              font-size: 9.5px;
              font-weight: 600;
              color: #64738b;
              letter-spacing: 1px;
              white-space: nowrap;
            }
            .sheet-footer {
              display: flex;
              justify-content: space-between;
              margin-top: 12px;
              padding: 0 4px;
              font-size: 10px;
              color: #64738b;
              font-family: 'Noto Sans Devanagari', 'Inter', sans-serif;
            }
          </style>
        </head>
        <body>
          <div class="sheet-container">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Reusable Single Receipt Card Render (Tenant Copy or Owner Copy)
  const renderReceiptCard = (copyType) => (
    <div className="receipt-box" style={{
      border: '1.5px solid #1d293b',
      borderRadius: '10px',
      padding: '18px 24px',
      background: '#ffffff',
      color: '#0e1729'
    }}>
      {/* 1. Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img 
            src={activeHouse.logo} 
            alt={activeHouse.englishName} 
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              objectFit: 'contain',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <div>
            <div style={{
              fontFamily: "'Noto Sans Devanagari', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              color: activeHouse.marathiColor,
              lineHeight: 1.2
            }}>
              {activeHouse.marathiName}
            </div>
            <div style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: '21px',
              fontWeight: 800,
              color: '#0e1729',
              letterSpacing: '0.5px',
              lineHeight: 1.1
            }}>
              {activeHouse.englishName}
            </div>
            <div style={{
              fontSize: '9.5px',
              fontWeight: 600,
              color: '#64738b',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              marginTop: '2px'
            }}>
              {activeHouse.subtitle}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '1px',
            color: '#0e1729'
          }}>
            RENT RECEIPT
          </div>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#334155',
            letterSpacing: '0.5px',
            marginTop: '2px'
          }}>
            [ {copyType} ]
          </div>
        </div>
      </div>

      {/* 2. Top Solid Divider */}
      <div style={{ height: '2px', backgroundColor: '#0e1729', margin: '10px 0 12px 0' }} />

      {/* 3. Meta Row (Month, Receipt #, Date) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        fontSize: '13px',
        marginBottom: '4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontWeight: 700, color: '#0e1729', marginRight: '6px' }}>Month :</span>
          {isEditing ? (
            <input 
              type="text" 
              value={receiptData.month}
              onChange={(e) => setReceiptData({ ...receiptData, month: e.target.value })}
              style={{
                border: 'none',
                borderBottom: '1px solid #1d293b',
                minWidth: '130px',
                padding: '1px 6px',
                fontWeight: 600,
                color: '#0e1729',
                background: '#f1f5f9',
                borderRadius: '2px'
              }}
            />
          ) : (
            <span style={{
              borderBottom: '1px solid #1d293b',
              minWidth: '130px',
              padding: '0 8px',
              fontWeight: 600,
              color: '#0e1729',
              textAlign: 'center',
              display: 'inline-block'
            }}>
              {receiptData.month}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontWeight: 700, color: '#0e1729', marginRight: '6px' }}>Receipt # :</span>
          {isEditing ? (
            <input 
              type="text" 
              value={receiptData.receiptNo}
              onChange={(e) => setReceiptData({ ...receiptData, receiptNo: e.target.value })}
              style={{
                border: 'none',
                borderBottom: '1px solid #1d293b',
                minWidth: '130px',
                padding: '1px 6px',
                fontWeight: 600,
                color: '#0e1729',
                background: '#f1f5f9',
                borderRadius: '2px'
              }}
            />
          ) : (
            <span style={{
              borderBottom: '1px solid #1d293b',
              minWidth: '130px',
              padding: '0 8px',
              fontWeight: 600,
              color: '#0e1729',
              textAlign: 'center',
              display: 'inline-block'
            }}>
              {receiptData.receiptNo}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontWeight: 700, color: '#0e1729', marginRight: '6px' }}>Date :</span>
          {isEditing ? (
            <input 
              type="text" 
              value={receiptData.date}
              onChange={(e) => setReceiptData({ ...receiptData, date: e.target.value })}
              style={{
                border: 'none',
                borderBottom: '1px solid #1d293b',
                minWidth: '110px',
                padding: '1px 6px',
                fontWeight: 600,
                color: '#0e1729',
                background: '#f1f5f9',
                borderRadius: '2px'
              }}
            />
          ) : (
            <span style={{
              borderBottom: '1px solid #1d293b',
              minWidth: '110px',
              padding: '0 8px',
              fontWeight: 600,
              color: '#0e1729',
              textAlign: 'center',
              display: 'inline-block'
            }}>
              {receiptData.date}
            </span>
          )}
        </div>
      </div>

      {/* 4. Inner Card Box */}
      <div style={{
        border: '1px solid #cbd5e1',
        borderRadius: '6px',
        background: '#fafafa',
        padding: '12px 18px',
        margin: '12px 0 14px 0'
      }}>
        {/* Line 1: Rent received From ... */}
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '10px', fontSize: '13px' }}>
          <span style={{ fontWeight: 700, color: '#0e1729', whiteSpace: 'nowrap', marginRight: '8px' }}>
            Rent received From
          </span>
          {isEditing ? (
            <input 
              type="text" 
              value={receiptData.tenantName}
              onChange={(e) => setReceiptData({ ...receiptData, tenantName: e.target.value })}
              style={{
                flex: 1,
                border: 'none',
                borderBottom: '1px solid #1d293b',
                padding: '1px 6px',
                fontWeight: 600,
                color: '#0e1729',
                background: '#f1f5f9',
                borderRadius: '2px'
              }}
            />
          ) : (
            <span style={{
              flex: 1,
              borderBottom: '1px solid #1d293b',
              padding: '0 8px',
              fontWeight: 600,
              color: '#0e1729'
            }}>
              {receiptData.tenantName}
            </span>
          )}
        </div>

        {/* Line 2: of ₹ ... To the Owner ... */}
        <div style={{ display: 'flex', alignItems: 'baseline', fontSize: '13px' }}>
          <span style={{ fontWeight: 700, color: '#0e1729', whiteSpace: 'nowrap', marginRight: '6px' }}>
            of ₹
          </span>
          {isEditing ? (
            <input 
              type="number" 
              value={receiptData.amount}
              onChange={(e) => {
                const val = Number(e.target.value);
                setReceiptData({ 
                  ...receiptData, 
                  amount: val,
                  balanceDue: Math.max(0, receiptData.totalRent - val)
                });
              }}
              style={{
                minWidth: '140px',
                border: 'none',
                borderBottom: '1px solid #1d293b',
                padding: '1px 6px',
                fontWeight: 700,
                color: '#0e1729',
                background: '#f1f5f9',
                borderRadius: '2px'
              }}
            />
          ) : (
            <span style={{
              minWidth: '140px',
              borderBottom: '1px solid #1d293b',
              padding: '0 8px',
              fontWeight: 700,
              color: '#0e1729',
              textAlign: 'center'
            }}>
              {formatINRNumber(receiptData.amount)}
            </span>
          )}

          <span style={{ fontWeight: 700, color: '#0e1729', whiteSpace: 'nowrap', margin: '0 8px 0 16px' }}>
            To the Owner
          </span>

          {isEditing ? (
            <input 
              type="text" 
              value={receiptData.ownerLine}
              onChange={(e) => setReceiptData({ ...receiptData, ownerLine: e.target.value })}
              style={{
                flex: 1,
                border: 'none',
                borderBottom: '1px solid #1d293b',
                padding: '1px 6px',
                fontWeight: 600,
                color: '#0e1729',
                background: '#f1f5f9',
                borderRadius: '2px'
              }}
            />
          ) : (
            <span style={{
              flex: 1,
              borderBottom: '1px solid #1d293b',
              padding: '0 8px',
              fontWeight: 600,
              color: '#0e1729'
            }}>
              {receiptData.ownerLine}
            </span>
          )}
        </div>

        {/* 5. Financial Summary Table */}
        <table style={{
          width: '65%',
          margin: '14px auto 4px auto',
          borderCollapse: 'collapse',
          border: '1.5px solid #1d293b',
          background: '#ffffff'
        }}>
          <tbody>
            <tr>
              <td style={{
                border: '1px solid #1d293b',
                padding: '6px 12px',
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#0e1729'
              }}>
                Total amount to be Received
              </td>
              <td style={{
                border: '1px solid #1d293b',
                padding: '6px 12px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#0e1729',
                width: '38%'
              }}>
                ₹ {formatINRNumber(receiptData.totalRent)}
              </td>
            </tr>
            <tr>
              <td style={{
                border: '1px solid #1d293b',
                padding: '6px 12px',
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#0e1729'
              }}>
                Amount Received
              </td>
              <td style={{
                border: '1px solid #1d293b',
                padding: '6px 12px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#0e1729'
              }}>
                ₹ {formatINRNumber(receiptData.amount)}
              </td>
            </tr>
            <tr>
              <td style={{
                border: '1px solid #1d293b',
                padding: '6px 12px',
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#0e1729'
              }}>
                Balance Due
              </td>
              <td style={{
                border: '1px solid #1d293b',
                padding: '6px 12px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#0e1729'
              }}>
                ₹ {formatINRNumber(receiptData.balanceDue)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 6. Signatures Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '16px',
        padding: '0 10px'
      }}>
        <div>
          <div style={{ width: '180px', borderBottom: '1px solid #1d293b', marginBottom: '5px' }} />
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#0e1729' }}>
            Signed By Tenant
          </div>
        </div>
        <div>
          <div style={{ width: '180px', borderBottom: '1px solid #1d293b', marginBottom: '5px' }} />
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#0e1729' }}>
            Signed By Owner
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" style={{ zIndex: 1200, padding: '1rem' }}>
      <div 
        className="modal-content animate-fade-in" 
        style={{ 
          maxWidth: '860px', 
          width: '100%', 
          maxHeight: '94vh', 
          display: 'flex', 
          flexDirection: 'column',
          padding: 0,
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Top Control Bar */}
        <div className="modal-header no-print" style={{ 
          padding: '0.875rem 1.25rem', 
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}>
          {/* Title & House Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-primary-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)'
              }}>
                <Building2 size={16} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Rent Payment Receipt
                </h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Same format as bills folder • Dual copies
                </span>
              </div>
            </div>

            {/* Quick House Selector Pills */}
            <div style={{
              display: 'inline-flex',
              background: 'var(--bg-hover)',
              padding: '3px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              gap: '4px'
            }}>
              {Object.keys(HOUSE_CONFIGS).map((key) => {
                const conf = HOUSE_CONFIGS[key];
                const isSelected = selectedHouseKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleHouseChange(key)}
                    className="btn btn-xs"
                    style={{
                      border: 'none',
                      background: isSelected ? 'var(--accent-primary)' : 'transparent',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      fontWeight: isSelected ? 600 : 500,
                      borderRadius: 'var(--radius-xs)',
                      padding: '4px 10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <img 
                      src={conf.logo} 
                      alt="" 
                      style={{ width: '14px', height: '14px', borderRadius: '2px', objectFit: 'contain' }} 
                    />
                    <span>{conf.displayName}</span>
                    {isSelected && <Check size={12} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-secondary btn-sm"
              title={isEditing ? 'Save and preview clean receipt' : 'Customize receipt values'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.75rem',
                borderColor: isEditing ? 'var(--accent-primary)' : undefined,
                color: isEditing ? 'var(--accent-primary)' : undefined
              }}
            >
              <Edit3 size={13} />
              {isEditing ? 'Done Editing' : 'Customize'}
            </button>

            {isEditing && (
              <button
                onClick={handleResetToAuto}
                className="btn btn-secondary btn-sm"
                title="Reset to original auto-filled data"
                style={{ padding: '0.375rem 0.5rem' }}
              >
                <RotateCcw size={13} />
              </button>
            )}

            <button
              onClick={handlePrint}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem' }}
            >
              <Printer size={13} /> Print / Save PDF
            </button>

            <button 
              onClick={onClose} 
              className="btn btn-secondary btn-sm"
              style={{ width: '28px', height: '28px', padding: 0, borderRadius: 'var(--radius-sm)' }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body with Clean Paper Preview */}
        <div 
          className="modal-body" 
          style={{ 
            padding: '1.25rem', 
            overflowY: 'auto', 
            background: 'var(--bg-primary)',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {/* Printable A4 Sheet Paper Preview */}
          <div 
            id="printable-rent-receipt-sheet"
            className="rent-receipt-print-sheet"
            style={{
              width: '100%',
              maxWidth: '760px',
              background: '#ffffff',
              borderRadius: '8px',
              padding: '24px 28px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
            }}
          >
            {/* Top Receipt: TENANT COPY */}
            {renderReceiptCard('TENANT COPY')}

            {/* Middle Perforated Cut Line */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '16px 0',
              gap: '12px'
            }}>
              <div style={{ flex: 1, borderTop: '1px dashed #94a3b8' }} />
              <div style={{
                fontSize: '9.5px',
                fontWeight: 600,
                color: '#64738b',
                letterSpacing: '1px',
                whiteSpace: 'nowrap'
              }}>
                ✂ TEAR HERE • LANDLORD / OFFICE RECORD BELOW
              </div>
              <div style={{ flex: 1, borderTop: '1px dashed #94a3b8' }} />
            </div>

            {/* Bottom Receipt: OWNER COPY */}
            {renderReceiptCard('OWNER COPY')}

            {/* Sheet Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '12px',
              padding: '0 4px',
              fontSize: '10px',
              color: '#64738b',
              fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif"
            }}>
              <span>{activeHouse.footerText}</span>
              <span>Original + Office Duplicate Copy</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Bar */}
        <div className="modal-footer no-print" style={{
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <ShieldCheck size={14} color="var(--status-success)" />
            <span>Official Rent Receipt • Separate branding for {HOUSE_CONFIGS.krishnaarjun.displayName} & {HOUSE_CONFIGS.saaipawan.displayName}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handlePrint} className="btn btn-primary btn-sm">
              <Printer size={13} /> Print Sheet
            </button>
            <button onClick={onClose} className="btn btn-secondary btn-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
