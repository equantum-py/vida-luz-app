import React, { createContext, useContext, useState } from 'react';
import { mockUser, MockUser } from '@/mocks/user';

interface AuthState {
  isAuthenticated: boolean;
  user: MockUser | null;
  login: (ci: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<MockUser | null>(null);

  async function login(ci: string, pin: string): Promise<{ success: boolean; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (ci.trim() === mockUser.ci && pin === mockUser.pinDemo) {
      setUser(mockUser);
      setIsAuthenticated(true);
      return { success: true };
    }

    return { success: false, error: 'CI o PIN incorrecto. Verifica tus datos.' };
  }

  function logout() {
    setUser(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
