import React, { createContext, useContext, useMemo, useState } from 'react';
import { Role } from '../types/role';

export type User = { id?: any; username?: string; role?: Role } | null;

type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  setUser: (u: User) => void;
  setIsAuthenticated: (v: boolean) => void;
  login: (u: User, token?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem('isAuthenticated') === 'true'
  );

  const login = (u: User, token?: string) => {
    setUser(u);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('isAuthenticated', 'true');
    if (token) localStorage.setItem('access_token', token);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('access_token');
  };

  const value = useMemo(
    () => ({ user, isAuthenticated, setUser, setIsAuthenticated, login, logout }),
    [user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
