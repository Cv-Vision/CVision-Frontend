import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  role: 'candidate' | 'recruiter' | null;
  setRole: (role: 'candidate' | 'recruiter' | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<'candidate' | 'recruiter' | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('mockRole');
    if (storedRole === 'candidate' || storedRole === 'recruiter') {
      setRole(storedRole);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};