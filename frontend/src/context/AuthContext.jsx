import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const demoUser = {
  id: 'demo-student-1',
  name: 'Arjun Mehta',
  email: 'arjun.mehta@nmims.edu',
  role: 'student',
  phone: '+91 98765 43210',
  currentHostel: 'horizon-heights-pg',
  moveInDate: '2025-07-15',
  leaseEndDate: '2026-05-31',
};

const demoAdmin = {
  id: 'demo-admin-1',
  name: 'Admin',
  email: 'admin@staynmims.com',
  role: 'admin',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = useCallback((email, password) => {
    if (email === 'admin@staynmims.com') {
      setUser(demoAdmin);
      setToken('demo-admin-token');
      return { success: true, user: demoAdmin };
    }
    setUser(demoUser);
    setToken('demo-token');
    return { success: true, user: demoUser };
  }, []);

  const register = useCallback((data) => {
    const newUser = { ...demoUser, ...data, id: 'new-' + Date.now() };
    setUser(newUser);
    setToken('demo-token');
    return { success: true, user: newUser };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  const loginAsParent = useCallback(() => {
    setUser({
      id: 'parent-1',
      name: 'Rajesh Mehta',
      email: 'rajesh.mehta@gmail.com',
      role: 'parent',
      childName: 'Arjun Mehta',
    });
    setToken('demo-parent-token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loginAsParent }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
