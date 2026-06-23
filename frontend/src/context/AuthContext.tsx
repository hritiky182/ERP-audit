import React, { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  email: string;
  name: string;
  role: string;
  token?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("erp-audit-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("erp-audit-user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    const name = email
      .split("@")[0]
      .replace(/\./g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const newUser: AuthUser = {
      email,
      name,
      role: "Lead Auditor",
      token: "mock-jwt-token-12345",
    };
    setUser(newUser);
    localStorage.setItem("erp-audit-user", JSON.stringify(newUser));
    localStorage.setItem("erp-audit-token", "mock-jwt-token-12345");
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("erp-audit-user");
    localStorage.removeItem("erp-audit-token");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
