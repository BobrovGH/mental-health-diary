// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextProps {
  isAuthenticated: boolean;
  username: string | null;
  login: (data: { access: string; refresh: string; username: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('access');
    const storedUsername = localStorage.getItem('username');

    if (accessToken) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  const login = (data: { access: string; refresh: string; username: string }) => {
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    localStorage.setItem('username', data.username);

    setIsAuthenticated(true);
    setUsername(data.username);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');

    setIsAuthenticated(false);
    setUsername(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};