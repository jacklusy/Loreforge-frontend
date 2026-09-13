"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { login as loginRequest } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

function LoginFormContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token, isLoading, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionExpired = searchParams.get("reason") === "session_expired";

  // An already-authenticated visitor landing on /login (e.g. a bookmark, or
  // browser back) belongs on /products, not a login form asking them to sign in
  // again.
  useEffect(() => {
    if (!isLoading && token) {
      router.replace("/products");
    }
  }, [isLoading, token, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { access_token: accessToken } = await loginRequest(email, password);
      login(accessToken);
      router.push("/products");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-12">
      {/* Ambient brand glow — decorative, not a full illustration budget, but enough
          to keep the screen from reading as a bare white form. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,theme(colors.orange.200/0.5),transparent_45%),radial-gradient(circle_at_85%_80%,theme(colors.teal.200/0.4),transparent_45%)] dark:bg-[radial-gradient(circle_at_15%_20%,theme(colors.orange.900/0.3),transparent_45%),radial-gradient(circle_at_85%_80%,theme(colors.teal.900/0.25),transparent_45%)]"
      />

      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl border border-stroke bg-surface p-7 shadow-lg shadow-stone-950/5">
          <h1 className="text-xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to browse and buy game items.
          </p>

          {sessionExpired && (
            <Alert variant="info" className="mt-4">
              Your session has expired. Please sign in again.
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Email
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-stroke bg-background py-2.5 pr-3 pl-10 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-brand-500"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Password
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-stroke bg-background py-2.5 pr-3 pl-10 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-brand-500"
                />
              </div>
            </label>

            {error && <Alert variant="error">{error}</Alert>}

            <Button type="submit" disabled={isSubmitting} size="lg" className="mt-2 w-full">
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-sm text-gray-500">Loading…</p>}>
      <LoginFormContent />
    </Suspense>
  );
}
