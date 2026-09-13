import { apiFetch } from "@/lib/api/client";
import type { TokenResponse } from "@/types/auth";

export function login(email: string, password: string): Promise<TokenResponse> {
  return apiFetch<TokenResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}
