"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { AUTH_TOKEN_STORAGE_KEY as STORAGE_KEY } from "@/lib/auth/token-storage";

type Listener = () => void;
const listeners = new Set<Listener>();

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): string | null {
  return window.localStorage.getItem(STORAGE_KEY);
}

// Distinct from `null` ("confirmed no token"): means "not yet known" — this runs
// during server rendering and the initial client hydration pass, before
// localStorage can be read at all.
function getServerSnapshot(): undefined {
  return undefined;
}

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

interface AuthContextValue {
  token: string | null;
  /** True until the token has been read from localStorage at least once. */
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // useSyncExternalStore (rather than useState+useEffect) is what lets this read a
  // browser-only API safely across server rendering and hydration without a
  // mismatch, and without an effect that only exists to call setState once.
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isLoading = snapshot === undefined;
  const token = isLoading ? null : snapshot;

  function login(newToken: string): void {
    window.localStorage.setItem(STORAGE_KEY, newToken);
    notifyListeners();
  }

  function logout(): void {
    window.localStorage.removeItem(STORAGE_KEY);
    notifyListeners();
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
