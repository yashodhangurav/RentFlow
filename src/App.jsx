import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';

import { Dashboard } from './pages/Dashboard';
import { Tenants } from './pages/Tenants';
import { Properties } from './pages/Properties';
import { Payments } from './pages/Payments';
import { Maintenance } from './pages/Maintenance';
import { Reports } from './pages/Reports';
import { TenantDetailPage } from './pages/TenantDetailPage';
import { TenantPortal } from './pages/TenantPortal';

import { TenantModal } from './components/TenantModal';
import { TenantDetailsDrawer } from './components/TenantDetailsDrawer';
import { PaymentModal } from './components/PaymentModal';
import { MaintenanceModal } from './components/MaintenanceModal';
import { ReceiptModal } from './components/ReceiptModal';
import { DocumentModal } from './components/DocumentModal';

import { apiService } from './api/index';

import { 
  INITIAL_PROPERTIES, 
  INITIAL_TENANTS, 
  INITIAL_PAYMENTS, 
  INITIAL_MAINTENANCE 
} from './mock/initialData';

const MainAppContent = () => {
  const { isAuthenticated, isAdmin, isTenant, user } = useAuth();
  
  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('estatepulse_theme') || 'dark');

  // Tab & Search State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Tenant for Dedicated Detail Page
  const [detailPageTenant, setDetailPageTenant] = useState(null);

  // Domain Data States
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);

  const [tenants, setTenants] = useState(() => {
    const saved = localStorage.getItem('estatepulse_tenants');
    return saved ? JSON.parse(saved) : INITIAL_TENANTS;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('estatepulse_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [maintenance, setMaintenance] = useState(INITIAL_MAINTENANCE);

  // Fetch Data from MongoDB Atlas on Load
  useEffect(() => {
    const fetchMongoData = async () => {
      const dbTenants = await apiService.getTenants();
      if (dbTenants && dbTenants.length > 0) {
        const formattedTenants = dbTenants.map(t => ({
          ...t,
          id: t._id || t.id,
          unit: t.roomNumber || t.unit,
          roomNo: t.roomNumber || t.roomNo || t.unit
        }));
        setTenants(formattedTenants);
      }

      const dbPayments = await apiService.getPayments();
      if (dbPayments && dbPayments.length > 0) {
        const formattedPayments = dbPayments.map(p => ({
          ...p,
          id: p._id || p.id,
          unit: p.roomNumber || p.unit
        }));
        setPayments(formattedPayments);
      }
    };

    fetchMongoData();
  }, []);

  // Toasts Feedback State
  const [toasts, setToasts] = useState([]);

  // Modal & Drawer States
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [tenantToEdit, setTenantToEdit] = useState(null);

  const [drawerTenant, setDrawerTenant] = useState(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentPreselectedTenant, setPaymentPreselectedTenant] = useState(null);

  const [isMaintModalOpen, setIsMaintModalOpen] = useState(false);
  const [maintTicketToEdit, setMaintTicketToEdit] = useState(null);

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState(null);

  // Document Preview Modal State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState('');
  const [docTenantName, setDocTenantName] = useState('');
  const [docExpiryDate, setDocExpiryDate] = useState('');
  const [docPaymentData, setDocPaymentData] = useState(null);
  const [docApproveCallback, setDocApproveCallback] = useState(null);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('estatepulse_theme', theme);
  }, [theme]);

  // LocalStorage Backup Sync
  useEffect(() => {
    localStorage.setItem('estatepulse_tenants', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem('estatepulse_payments', JSON.stringify(payments));
  }, [payments]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleOpenDocument = (title, type, tenantName, expiry = '', paymentData = null, approveCallback = null) => {
    setDocTitle(title);
    setDocType(type);
    setDocTenantName(tenantName);
    setDocExpiryDate(expiry);
    setDocPaymentData(paymentData);
    setDocApproveCallback(() => approveCallback);
    setIsDocModalOpen(true);
  };

  // Open Full Tenant Detail Page
  const handleOpenDetailPage = (tenant) => {
    setDetailPageTenant(tenant);
    setActiveTab('tenant-detail');
  };

  // Handle Save New Property & Units
  const handleSaveProperty = (newProp) => {
    setProperties(prev => [newProp, ...prev]);
    addToast(`Added new property ${newProp.name} with ${newProp.units} units!`, 'success');
  };

  // Tenant Uploads Payment Proof Handler
  const handleSubmitPaymentProof = async (proofData) => {
    const mongoPayment = await apiService.createPayment({
      tenantId: proofData.tenantId,
      tenantName: proofData.tenantName,
      roomNumber: proofData.roomNumber,
      month: proofData.month,
      amountPaid: proofData.amountPaid,
      paymentDate: proofData.paymentDate,
      status: 'verification_pending',
      paymentMethod: proofData.paymentMethod,
      reference: proofData.reference,
      proofFile: proofData.proofFile,
      electricityAmount: proofData.electricityAmount,
      electricityRef: proofData.electricityRef,
      electricityProofFile: proofData.electricityProofFile
    });

    const newProofObj = mongoPayment ? { ...mongoPayment, id: mongoPayment._id } : {
      id: `pay-${Date.now()}`,
      ...proofData,
      amount: proofData.amountPaid,
      period: proofData.month
    };

    setPayments(prev => [newProofObj, ...prev]);
    addToast(`Payment proof submitted! Awaiting owner verification.`, 'warning');
  };

  // Owner Verifies and Approves Payment Handler
  const handleVerifyPayment = (tenant, payment) => {
    const targetTenantId = tenant._id || tenant.id;

    // Update payment status to paid
    setPayments(prev => prev.map(p => {
      if ((p.id === payment?.id || p._id === payment?._id) || (p.tenantId === targetTenantId && p.month === payment?.month)) {
        return { ...p, status: 'paid' };
      }
      return p;
    }));

    // Update tenant status to Paid
    setTenants(prev => prev.map(t => (t.id === targetTenantId || t._id === targetTenantId) ? { ...t, paymentStatus: 'Paid' } : t));
    addToast(`Approved & Verified rent payment for ${tenant.name}!`, 'success');
  };

  // One-Click Owner Rent Toggle Handler
  const handleToggleRentStatus = async (tenant, month, currentPaidStatus) => {
    const targetTenantId = tenant._id || tenant.id;

    if (!currentPaidStatus) {
      const mongoPayment = await apiService.createPayment({
        tenantId: targetTenantId,
        tenantName: tenant.name,
        roomNumber: tenant.roomNo || tenant.roomNumber || tenant.unit,
        month: month,
        amountPaid: tenant.rentAmount || 12000,
        paymentDate: new Date().toISOString(),
        status: 'paid',
        paymentMethod: 'UPI (GPay)',
        reference: `UPI-${Math.floor(100000 + Math.random() * 900000)}`
      });

      const newPayObj = mongoPayment ? { ...mongoPayment, id: mongoPayment._id } : {
        id: `pay-${Date.now()}`,
        tenantId: targetTenantId,
        tenantName: tenant.name,
        unit: tenant.roomNo || tenant.unit,
        amount: tenant.rentAmount,
        period: month,
        month: month,
        status: 'paid',
        paymentMethod: 'UPI',
        reference: `UPI-${Math.floor(100000 + Math.random() * 900000)}`
      };

      setPayments(prev => [newPayObj, ...prev]);
      setTenants(prev => prev.map(t => (t.id === targetTenantId || t._id === targetTenantId) ? { ...t, paymentStatus: 'Paid' } : t));
      addToast(`Marked ${tenant.name} (${tenant.roomNo || tenant.unit}) rent as PAID for ${month}!`, 'success');
    } else {
      setTenants(prev => prev.map(t => (t.id === targetTenantId || t._id === targetTenantId) ? { ...t, paymentStatus: 'Pending' } : t));
      addToast(`Marked ${tenant.name} rent as PENDING for ${month}`, 'warning');
    }
  };

  // Handlers for Tenant CRUD (connected to MongoDB Atlas)
  const handleSaveTenant = async (tenantData) => {
    const exists = tenants.find(t => t.id === tenantData.id || t._id === tenantData.id);
    const payload = {
      name: tenantData.name,
      phone: tenantData.phone,
      email: tenantData.email,
      password: tenantData.password,
      roomNumber: tenantData.roomNo || tenantData.unit || tenantData.roomNumber,
      rentAmount: tenantData.rentAmount,
      deposit: tenantData.deposit,
      joiningDate: tenantData.joiningDate,
      idProof: tenantData.idProofDoc || tenantData.idProof || 'Aadhar_Proof.pdf',
      agreementFile: tenantData.agreementPdf || tenantData.agreementFile || 'Agreement_Doc.pdf',
      agreementExpiryDate: tenantData.agreementExpiryDate,
      status: tenantData.status || 'Active',
      propertyId: tenantData.propertyId,
      propertyName: tenantData.propertyName,
      aadharId: tenantData.aadharId,
      emergencyContact: tenantData.emergencyContact,
      occupation: tenantData.occupation,
      idProofCloudUrl: tenantData.idProofCloudUrl,
      agreementCloudUrl: tenantData.agreementCloudUrl,
      avatar: tenantData.avatar,
      avatarCloudUrl: tenantData.avatarCloudUrl
    };

    if (exists) {
      const mongoId = exists._id || exists.id;
      const updatedMongo = await apiService.updateTenant(mongoId, payload);

      setTenants(prev => prev.map(t => (t.id === tenantData.id || t._id === tenantData.id) ? { ...tenantData, ...(updatedMongo || {}) } : t));
      addToast(`Updated ${tenantData.name} in MongoDB Atlas`, 'success');
      if (drawerTenant && (drawerTenant.id === tenantData.id || drawerTenant._id === tenantData.id)) {
        setDrawerTenant(tenantData);
      }
      if (detailPageTenant && (detailPageTenant.id === tenantData.id || detailPageTenant._id === tenantData.id)) {
        setDetailPageTenant(tenantData);
      }
    } else {
      const createdMongo = await apiService.createTenant(payload);

      const newRecord = createdMongo 
        ? { ...tenantData, ...createdMongo, id: createdMongo._id, _id: createdMongo._id, roomNo: createdMongo.roomNumber || tenantData.roomNo } 
        : tenantData;
      setTenants(prev => [newRecord, ...prev]);
      addToast(`Registered tenant ${tenantData.name} in ${tenantData.propertyName || 'Property'}!`, 'success');
    }
  };

  const handleDeleteTenant = async (id) => {
    const target = tenants.find(t => t.id === id || t._id === id);
    if (window.confirm(`Delete tenant record for ${target?.name || 'this tenant'} from MongoDB Atlas?`)) {
      if (target?._id || target?.id) {
        await apiService.deleteTenant(target._id || target.id);
      }
      setTenants(prev => prev.filter(t => t.id !== id && t._id !== id));
      if (drawerTenant?.id === id || drawerTenant?._id === id) setDrawerTenant(null);
      if (detailPageTenant?.id === id || detailPageTenant?._id === id) setDetailPageTenant(null);
      addToast(`Tenant deleted from MongoDB Atlas`, 'warning');
    }
  };

  // Handlers for Payments
  const handleSavePayment = async (paymentData) => {
    const mongoPayment = await apiService.createPayment({
      tenantId: paymentData.tenantId,
      tenantName: paymentData.tenantName,
      roomNumber: paymentData.unit || paymentData.roomNo,
      month: paymentData.period || 'August 2026',
      amountPaid: paymentData.amount,
      paymentDate: paymentData.paidDate,
      status: 'paid',
      paymentMethod: paymentData.method,
      reference: paymentData.reference
    });

    const newPayRecord = mongoPayment ? { ...paymentData, id: mongoPayment._id, _id: mongoPayment._id } : paymentData;
    setPayments(prev => [newPayRecord, ...prev]);
    
    setTenants(prev => prev.map(t => {
      if (t.id === paymentData.tenantId || t._id === paymentData.tenantId) {
        return { 
          ...t, 
          paymentStatus: 'Paid',
          history: [
            { type: 'Rent Paid', date: paymentData.paidDate || new Date().toISOString().split('T')[0], details: `Paid ${paymentData.period} rent ₹${paymentData.amount} via ${paymentData.method}.` },
            ...(t.history || [])
          ]
        };
      }
      return t;
    }));

    addToast(`Rent payment of ₹${paymentData.amount} saved to MongoDB Atlas!`, 'success');
    setReceiptPayment(newPayRecord);
    setIsReceiptModalOpen(true);
  };

  // Handlers for Maintenance
  const handleSaveMaintenance = (ticketData) => {
    const exists = maintenance.find(m => m.id === ticketData.id);
    if (exists) {
      setMaintenance(prev => prev.map(m => m.id === ticketData.id ? ticketData : m));
      addToast(`Work order ticket updated`, 'info');
    } else {
      setMaintenance(prev => [ticketData, ...prev]);
      addToast(`New maintenance ticket logged: ${ticketData.title}`, 'warning');
    }
  };

  const handleMoveMaintenanceStatus = (id, newStatus) => {
    setMaintenance(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, status: newStatus };
      }
      return m;
    }));
    addToast(`Ticket status updated to ${newStatus}`, 'info');
  };

  // Reset Demo Data
  const handleResetData = async () => {
    if (window.confirm('Re-seed MongoDB Atlas database back to initial demo data?')) {
      await apiService.seedDatabase();
      const dbTenants = await apiService.getTenants();
      if (dbTenants) {
        setTenants(dbTenants.map(t => ({ ...t, id: t._id, unit: t.roomNumber, roomNo: t.roomNumber })));
      }
      const dbPayments = await apiService.getPayments();
      if (dbPayments) {
        setPayments(dbPayments.map(p => ({ ...p, id: p._id, unit: p.roomNumber })));
      }
      addToast('MongoDB Atlas database has been re-seeded with demo dataset!', 'success');
    }
  };

  if (!isAuthenticated) {
    return <Login tenants={tenants} />;
  }

  // IF LOGGED IN AS TENANT
  if (isTenant) {
    return (
      <div className="app-container" style={{ display: 'block', background: 'var(--bg-primary)', minHeight: '100vh' }}>
        <TenantPortal
          tenants={tenants}
          payments={payments}
          onSubmitPaymentProof={handleSubmitPaymentProof}
          onViewReceipt={(payment) => {
            setReceiptPayment(payment);
            setIsReceiptModalOpen(true);
          }}
          onOpenDocument={handleOpenDocument}
        />

        <ReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          payment={receiptPayment}
        />

        <DocumentModal
          isOpen={isDocModalOpen}
          onClose={() => setIsDocModalOpen(false)}
          documentTitle={docTitle}
          documentType={docType}
          tenantName={docTenantName}
          expiryDate={docExpiryDate}
          paymentData={docPaymentData}
          onApprovePayment={docApproveCallback}
        />

        <Toast toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  // IF LOGGED IN AS OWNER
  const pendingRentTenants = tenants.filter(t => t.paymentStatus !== 'Paid');
  const today = new Date('2026-08-02T00:00:00');
  
  const expiringWithin7Days = tenants.filter(t => {
    const expiry = new Date(t.agreementExpiryDate || t.leaseEnd);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  });

  const urgentAlerts = [
    ...pendingRentTenants.map(t => ({
      type: 'overdue',
      title: `🚨 RED ALERT: Rent Pending (${t.name})`,
      message: `${t.roomNo || t.roomNumber || t.unit} monthly rent ₹${t.rentAmount?.toLocaleString()} is unpaid.`
    })),
    ...expiringWithin7Days.map(t => {
      const expiry = new Date(t.agreementExpiryDate || t.leaseEnd);
      const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
      return {
        type: 'expiring',
        title: `⚠️ URGENT: Agreement Expiring in ${diffDays} Days!`,
        message: `${t.name} (${t.roomNo || t.roomNumber || t.unit}) contract ends on ${expiry.toLocaleDateString()}.`
      };
    })
  ];

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingRentCount={pendingRentTenants.length}
        openMaintenanceCount={maintenance.filter(m => m.status !== 'Resolved').length}
      />

      {/* Main View Area */}
      <div className="main-content">
        <Navbar
          activeTab={activeTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          theme={theme}
          setTheme={setTheme}
          urgentAlerts={urgentAlerts}
          onOpenAddTenant={() => {
            setTenantToEdit(null);
            setIsTenantModalOpen(true);
          }}
        />

        <main className="page-body">
          {activeTab === 'dashboard' && (
            <Dashboard
              tenants={tenants}
              properties={properties}
              payments={payments}
              maintenance={maintenance}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenAddTenant={() => {
                setTenantToEdit(null);
                setIsTenantModalOpen(true);
              }}
              onRecordPayment={(tenant) => {
                setPaymentPreselectedTenant(tenant);
                setIsPaymentModalOpen(true);
              }}
              onViewTenant={(tenant) => handleOpenDetailPage(tenant)}
              onViewReceipt={(payment) => {
                setReceiptPayment(payment);
                setIsReceiptModalOpen(true);
              }}
              onOpenDocument={handleOpenDocument}
            />
          )}

          {activeTab === 'tenants' && (
            <Tenants
              tenants={tenants}
              searchTerm={searchTerm}
              onOpenAddTenant={() => {
                setTenantToEdit(null);
                setIsTenantModalOpen(true);
              }}
              onEditTenant={(tenant) => {
                setTenantToEdit(tenant);
                setIsTenantModalOpen(true);
              }}
              onViewTenant={(tenant) => handleOpenDetailPage(tenant)}
              onRecordPayment={(tenant) => {
                setPaymentPreselectedTenant(tenant);
                setIsPaymentModalOpen(true);
              }}
              onDeleteTenant={handleDeleteTenant}
              onOpenDocument={handleOpenDocument}
            />
          )}

          {activeTab === 'tenant-detail' && (
            <TenantDetailPage
              tenant={detailPageTenant}
              onBack={() => setActiveTab('tenants')}
              onEdit={(tenant) => {
                setTenantToEdit(tenant);
                setIsTenantModalOpen(true);
              }}
              onRecordPayment={(tenant) => {
                setPaymentPreselectedTenant(tenant);
                setIsPaymentModalOpen(true);
              }}
              onViewReceipt={(payment) => {
                setReceiptPayment(payment);
                setIsReceiptModalOpen(true);
              }}
              onOpenDocument={handleOpenDocument}
              payments={payments}
            />
          )}

          {activeTab === 'properties' && (
            <Properties
              properties={properties}
              tenants={tenants}
              onAddProperty={handleSaveProperty}
            />
          )}

          {activeTab === 'payments' && (
            <Payments
              payments={payments}
              tenants={tenants}
              onToggleRentStatus={handleToggleRentStatus}
              onVerifyPayment={handleVerifyPayment}
              onRecordPayment={(tenant) => {
                setPaymentPreselectedTenant(tenant);
                setIsPaymentModalOpen(true);
              }}
              onViewReceipt={(payment) => {
                setReceiptPayment(payment);
                setIsReceiptModalOpen(true);
              }}
              onOpenDocument={handleOpenDocument}
            />
          )}

          {activeTab === 'maintenance' && (
            <Maintenance
              maintenance={maintenance}
              onOpenCreateTicket={() => {
                setMaintTicketToEdit(null);
                setIsMaintModalOpen(true);
              }}
              onEditTicket={(ticket) => {
                setMaintTicketToEdit(ticket);
                setIsMaintModalOpen(true);
              }}
              onMoveStatus={handleMoveMaintenanceStatus}
            />
          )}

          {activeTab === 'reports' && (
            <Reports
              tenants={tenants}
              properties={properties}
              payments={payments}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      <TenantModal
        isOpen={isTenantModalOpen}
        onClose={() => setIsTenantModalOpen(false)}
        onSave={handleSaveTenant}
        properties={properties}
        tenantToEdit={tenantToEdit}
      />

      <TenantDetailsDrawer
        tenant={drawerTenant}
        onClose={() => setDrawerTenant(null)}
        onEdit={(tenant) => {
          setTenantToEdit(tenant);
          setIsTenantModalOpen(true);
        }}
        onRecordPayment={(tenant) => {
          setPaymentPreselectedTenant(tenant);
          setIsPaymentModalOpen(true);
        }}
        onViewReceipt={(payment) => {
          setReceiptPayment(payment);
          setIsReceiptModalOpen(true);
        }}
        onOpenDocument={handleOpenDocument}
        payments={payments}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSave={handleSavePayment}
        tenants={tenants}
        preselectedTenant={paymentPreselectedTenant}
      />

      <MaintenanceModal
        isOpen={isMaintModalOpen}
        onClose={() => setIsMaintModalOpen(false)}
        onSave={handleSaveMaintenance}
        tenants={tenants}
        ticketToEdit={maintTicketToEdit}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        payment={receiptPayment}
      />

      <DocumentModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        documentTitle={docTitle}
        documentType={docType}
        tenantName={docTenantName}
        expiryDate={docExpiryDate}
        paymentData={docPaymentData}
        onApprovePayment={docApproveCallback}
      />

      {/* Toast Feedback Bar */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
