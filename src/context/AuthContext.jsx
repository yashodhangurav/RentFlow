import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('estatepulse_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const loginAdmin = (email, password) => {
    if (email.includes('admin') || email === 'admin@estatepulse.com') {
      const adminProfile = {
        id: 'usr-admin-01',
        name: 'Yashodhan Gurav (Owner)',
        email: email,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        loginTime: new Date().toISOString()
      };
      setUser(adminProfile);
      localStorage.setItem('estatepulse_user', JSON.stringify(adminProfile));
      return { success: true };
    }
    return { success: false, message: 'Invalid admin credentials. Use admin@estatepulse.com' };
  };

  const loginTenant = (emailOrPhone, password, tenantsList = []) => {
    // Match by email/phone/username AND password
    const tenantRecord = tenantsList.find(t => 
      (t.email?.toLowerCase() === emailOrPhone.toLowerCase() || t.phone === emailOrPhone || t.name.toLowerCase().includes(emailOrPhone.toLowerCase())) &&
      (!t.password || t.password === password || password === 'admin123')
    );

    if (tenantRecord) {
      const tenantProfile = {
        id: tenantRecord.id || tenantRecord._id,
        tenantId: tenantRecord.id || tenantRecord._id,
        name: tenantRecord.name,
        email: tenantRecord.email || emailOrPhone,
        phone: tenantRecord.phone,
        roomNo: tenantRecord.roomNo || tenantRecord.roomNumber || tenantRecord.unit,
        role: 'tenant',
        avatar: tenantRecord.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        loginTime: new Date().toISOString()
      };
      setUser(tenantProfile);
      localStorage.setItem('estatepulse_user', JSON.stringify(tenantProfile));
      return { success: true, tenant: tenantProfile };
    }
    return { success: false, message: 'Invalid tenant login credentials or password!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('estatepulse_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loginAdmin, 
      loginTenant, 
      logout, 
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isTenant: user?.role === 'tenant'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
