import { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
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
  const authContextValue: AuthContextType = {
    user: null,
    isAuthenticated: false, // De momento false porque no tenemos login persistente
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
