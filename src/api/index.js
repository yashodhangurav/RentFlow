const API_BASE_URL = 'http://localhost:5001/api';
const CLOUDINARY_CLOUD_NAME = 'dysl5mfsh';

export const apiService = {
  // Internal File & Cloudinary Upload Helper (returns file URL)
  async uploadToCloudinary(fileData, folder = 'tenant_management_system', filename = '') {
    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: fileData, folder, filename })
      });
      const data = await res.json();
      if (data.success && (data.url || data.secure_url)) {
        const fileUrl = data.url || data.secure_url;
        console.log('✅ File upload successful:', fileUrl);
        return fileUrl;
      }
    } catch (err) {
      console.warn('Backend upload route failed, checking fallback...', err);
    }

    try {
      const res2 = await fetch(`${API_BASE_URL}/upload/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: fileData, folder, filename })
      });
      const data2 = await res2.json();
      if (data2.success && (data2.url || data2.secure_url)) {
        const fileUrl = data2.url || data2.secure_url;
        console.log('✅ Fallback file upload successful:', fileUrl);
        return fileUrl;
      }
    } catch (err) {
      console.warn('Fallback upload route failed.', err);
    }
    
    // Return fileData if server is offline
    return fileData;
  },

  // Fetch All Tenants from MongoDB Atlas
  async getTenants() {
    try {
      const res = await fetch(`${API_BASE_URL}/tenants`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.warn('Backend API offline, using local memory state.', err);
      return null;
    }
  },

  // Create New Tenant in MongoDB Atlas
  async createTenant(tenantData) {
    try {
      const res = await fetch(`${API_BASE_URL}/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tenantData)
      });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.error('Error creating tenant in MongoDB:', err);
      return null;
    }
  },

  // Update Tenant in MongoDB Atlas
  async updateTenant(id, tenantData) {
    try {
      const res = await fetch(`${API_BASE_URL}/tenants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tenantData)
      });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.error('Error updating tenant in MongoDB:', err);
      return null;
    }
  },

  // Delete Tenant from MongoDB Atlas
  async deleteTenant(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/tenants/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      return data.success;
    } catch (err) {
      console.error('Error deleting tenant from MongoDB:', err);
      return false;
    }
  },

  // Fetch Rent Payments from MongoDB Atlas
  async getPayments() {
    try {
      const res = await fetch(`${API_BASE_URL}/payments`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      return null;
    }
  },

  // Create Rent Payment Record in MongoDB Atlas
  async createPayment(paymentData) {
    try {
      const res = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      return null;
    }
  },

  // Seed MongoDB Atlas Database
  async seedDatabase() {
    try {
      const res = await fetch(`${API_BASE_URL}/seed`, { method: 'POST' });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
};
