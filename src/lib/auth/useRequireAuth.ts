"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

/**
 * Redirects to /login once it's certain there's no token. Returns the same
 * { token, isLoading } shape as useAuth so callers can render a loading state
 * until isLoading is false and token is confirmed present.
 */
export function useRequireAuth(): { token: string | null; isLoading: boolean } {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace("/login");
    }
  }, [isLoading, token, router]);

  return { token, isLoading };
}
