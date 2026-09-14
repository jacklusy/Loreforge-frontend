"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { login as loginRequest } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { Alert } from "@/components/ui/Alert";
import { AuthBackdrop } from "@/components/ui/AuthBackdrop";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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
      toast.success("Welcome back");
      router.push("/products");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setError(message);
      toast.error("Sign-in failed", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <AuthBackdrop />

      <div className="relative flex w-full max-w-md flex-col">
        <div className="absolute -top-11 right-0">
          <ThemeToggle />
        </div>
        <Link
          href="/"
          className="absolute -top-10 left-0 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="rounded-2xl border border-stroke bg-surface/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl dark:bg-surface/70 dark:shadow-black/60">
          <div className="mb-7 flex justify-center">
            <Logo />
          </div>

          <h1 className="text-center font-display text-3xl font-bold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1.5 text-center text-sm text-muted-foreground">
            Sign in to browse and buy game items.
          </p>

          {sessionExpired && (
            <Alert variant="info" className="mt-5">
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
                  className="w-full rounded-lg border border-stroke bg-surface py-2.5 pr-3 pl-10 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-brand-500"
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
                  className="w-full rounded-lg border border-stroke bg-surface py-2.5 pr-3 pl-10 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-brand-500"
                />
              </div>
            </label>

            {error && <Alert variant="error">{error}</Alert>}

            {/* Haloed, like the primary action in the rest of the app. */}
            <div className="relative mt-2">
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute -inset-1 rounded-xl bg-brand-500/35 blur-lg transition-opacity ${
                  isSubmitting ? "opacity-40" : ""
                }`}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="relative w-full ring-1 ring-brand-300/40"
              >
                {isSubmitting ? "Signing in…" : "Sign in"}
              </Button>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Need help?{" "}
          <Link href="/contact" className="underline hover:text-foreground">
            Contact support
          </Link>
        </p>
      </div>
    </main>
  );
}

export function LoginForm() {
  return (
    <Suspense
      fallback={<p className="p-8 text-center text-sm text-muted-foreground">Loading…</p>}
    >
      <LoginFormContent />
    </Suspense>
  );
}
