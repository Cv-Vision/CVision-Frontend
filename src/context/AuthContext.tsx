import { createContext, useContext, ReactNode, useEffect, useState } from 'react';

interface User {
  email?: string;
  name?: string;
  company?: string;
  role?: string;
  token?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  logout?: () => void;
  login?: (userData: User) => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('Loading user from sessionStorage:', parsedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data from sessionStorage:', error);
        // Limpiar datos corruptos
        sessionStorage.removeItem('user');
      }
    }
  }, []);

  const login = (userData: User) => {
    const token = userData?.token ?? userData?.idToken ?? null;

    const userToStore = {
      ...userData,
      token,
    };

    console.log('Storing user data:', userToStore);
    sessionStorage.setItem('user', JSON.stringify(userToStore));
    setUser(userToStore);
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log('Logging out user');
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

