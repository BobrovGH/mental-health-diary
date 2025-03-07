import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuthStatus } from "./api";

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

  const updateAuthStatus = async () => {
    try {
      const data = await checkAuthStatus();
      setIsAuthenticated(data.isAuthenticated);
      setUsername(data.username);
    } catch {
      setIsAuthenticated(false);
      setUsername(null);
      logout();
    }
  };

  useEffect(() => {
    updateAuthStatus();
  }, []);

  const login = (data: { access: string; refresh: string; username: string }) => {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("username", data.username);
    setIsAuthenticated(true);
    setUsername(data.username);
    navigate("/");
    updateAuthStatus();
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUsername(null);
    navigate("/login");
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};