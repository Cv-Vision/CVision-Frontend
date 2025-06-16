import { createContext, useContext, ReactNode, useEffect, useState } from 'react';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  logout?: () => void;
  login?: (userData: any) => void;
}


const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: any) => {
    const token = userData?.token ?? userData?.idToken ?? null;

    const userToStore = {
      ...userData,
      token,
    };

    sessionStorage.setItem('user', JSON.stringify(userToStore));
    setUser(userToStore);
    setIsAuthenticated(true);
  };


  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  const authContextValue: AuthContextType = {
    user,
    isAuthenticated,
    logout,
    login,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

