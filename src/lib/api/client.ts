import { AUTH_TOKEN_STORAGE_KEY } from "@/lib/auth/token-storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Thrown for any non-2xx response, carrying the backend's status and detail message. */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string | null;
}

interface ErrorBody {
  detail?: string;
}

/** A small typed fetch wrapper: attaches the auth header and normalizes errors. */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    // A 401 on a request that carried a token means the token itself is no
    // longer valid (expired, or the account is gone) — not that this specific
    // action was disallowed. Every other 401 in this app (e.g. a wrong
    // "current password" while changing it) uses a different status code
    // specifically so it doesn't trigger this. Clear the stale token and send
    // the user back to login with an explanation, instead of leaving them on a
    // page that will just keep failing silently in the background.
    if (response.status === 401 && options.token && typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      if (!window.location.pathname.startsWith("/login")) {
        // A hard navigation (not the Next.js router) is deliberate: apiFetch is a
        // plain function with no access to a router instance, and a full reload
        // guarantees every component's in-memory state resets along with the
        // token, rather than a stale, half-authenticated page sticking around.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/login?reason=session_expired";
      }
    }

    const errorBody: ErrorBody | null = await response.json().catch(() => null);
    const message = errorBody?.detail ?? `Request failed with status ${response.status}`;
    throw new ApiError(response.status, message);
  }

  // A 204 (e.g. PUT /me/password) has no body — calling .json() on it would
  // throw trying to parse an empty string.
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
