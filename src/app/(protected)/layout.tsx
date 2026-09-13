"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";

/**
 * Shared shell for every page that requires authentication: gates on the token
 * (redirecting to /login when absent) and renders the header once, so individual
 * pages don't each re-implement the auth check or the "log out" control.
 */
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { token, isLoading } = useRequireAuth();
  const { logout } = useAuth();

  if (isLoading || !token) {
    return <p className="p-8 text-center text-sm text-gray-500">Loading…</p>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <span className="font-bold">Tamatem Game Store</span>
        <button onClick={logout} className="text-sm text-gray-500 hover:underline">
          Log out
        </button>
      </header>
      {children}
    </div>
  );
}
