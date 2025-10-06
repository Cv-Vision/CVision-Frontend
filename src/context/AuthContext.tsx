import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types/auth';
import { setGlobalLogout } from '../services/fetchWithAuth';
import { setGlobalAxiosLogout } from '../services/axiosConfig';

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
  isLoading: boolean;
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
export function decodeJwt(token: string): any {
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

/** Verifica si un token JWT ha expirado */
function isTokenExpired(token: string): boolean {
  try {
    const claims = decodeJwt(token);
    if (!claims.exp) return true; // Si no hay exp, consideramos que está expirado
    
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= claims.exp;
  } catch {
    return true; // Si hay error decodificando, consideramos que está expirado
  }
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar desde sessionStorage y ENRIQUECER en memoria con username derivado del token
  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    
    if (!userData) {
      setIsLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(userData) as User;
      const token = parsedUser?.token ?? parsedUser?.idToken;
      
      // Verificar si el token ha expirado
      if (token && isTokenExpired(token)) {
        console.log('Token expirado, cerrando sesión automáticamente');
        sessionStorage.clear();
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate('/login');
        return;
      }
      
      const claims = token ? decodeJwt(token) : {};
      const username = getUsernameFromClaims(claims);

      const userInMemory: User = { ...parsedUser, username };
      setUser(userInMemory);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error parsing user data from sessionStorage:', error);
      sessionStorage.removeItem('user'); // limpiar datos corruptos
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const login = (userData: User) => {
    const token = (userData as any)?.token ?? (userData as any)?.idToken ?? null;
    const claims = token ? decodeJwt(token) : {};
    const username = getUsernameFromClaims(claims);

    // Lo que PERSISTE (sin username)
    const userForStorage: User = { ...userData, token };
    sessionStorage.setItem('user', JSON.stringify(userForStorage));

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

  // Register the logout function with fetchWithAuth and axios
  useEffect(() => {
    setGlobalLogout(logout);
    setGlobalAxiosLogout(logout);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};
