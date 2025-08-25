import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types/auth';

interface User {
  email?: string;
  name?: string;
  company?: string;
  role?: UserRole;
  token?: string;      // idToken o accessToken
  username?: string;   // <- la agregamos en memoria, NO se persiste
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
  if (!context) throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

/** Decodifica un JWT (sin librerías) */
function decodeJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}

/** Obtiene el mejor candidato a username desde los claims (Cognito/propio) */
function getUsernameFromClaims(claims: any): string {
  return (
    claims?.preferred_username ||
    claims?.['cognito:username'] ||
    claims?.nickname ||
    claims?.username ||
    ''
  );
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Cargar desde sessionStorage y ENRIQUECER en memoria con username derivado del token
  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (!userData) return;

    try {
      const parsedUser = JSON.parse(userData) as User;
      const token = parsedUser?.token ?? parsedUser?.idToken;
      const claims = token ? decodeJwt(token) : {};
      const username = getUsernameFromClaims(claims);

      const userInMemory: User = { ...parsedUser, username };
      setUser(userInMemory);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error parsing user data from sessionStorage:', error);
      sessionStorage.removeItem('user'); // limpiar datos corruptos
    }
  }, []);

  const login = (userData: User) => {
    const token = (userData as any)?.token ?? (userData as any)?.idToken ?? null;
    const claims = token ? decodeJwt(token) : {};
    const username = getUsernameFromClaims(claims);

    // Lo que PERSISTE (sin username)
    const userForStorage: User = { ...userData, token };
    sessionStorage.setItem('user', JSON.stringify(userForStorage));
    if (token) {
      sessionStorage.setItem('idToken', token);
    }

    // Lo que va al ESTADO (con username en memoria)
    const userForState: User = { ...userForStorage, username };
    setUser(userForState);
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};