"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "tamatem_auth_token";

interface AuthContextValue {
  token: string | null;
  /** True until the token has been read from localStorage at least once. */
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // localStorage isn't available during server rendering, so the token is read
  // once the component mounts on the client.
  useEffect(() => {
    setToken(window.localStorage.getItem(STORAGE_KEY));
    setIsLoading(false);
  }, []);

  function login(newToken: string): void {
    window.localStorage.setItem(STORAGE_KEY, newToken);
    setToken(newToken);
  }

  function logout(): void {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
