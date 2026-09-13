"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Lock, Mail, ShieldCheck, Sparkles, Swords } from "lucide-react";
import { login as loginRequest } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const HIGHLIGHTS = [
  { icon: Swords, text: "100+ legendary items, ready to claim" },
  { icon: ShieldCheck, text: "Token-secured checkout on every request" },
  { icon: Sparkles, text: "Instant receipts, kept in your order history" },
];

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
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel — hidden on small screens, where it would just push the form
          below the fold. */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-stone-950 p-10 text-stone-100 lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(249,115,22,0.35),transparent_55%),radial-gradient(circle_at_80%_75%,rgba(20,184,166,0.22),transparent_55%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:repeating-linear-gradient(0deg,transparent,transparent_31px,white_31px,white_32px),repeating-linear-gradient(90deg,transparent,transparent_31px,white_31px,white_32px)]"
        />

        <Link href="/" className="relative z-10 inline-flex w-fit">
          <Logo tone="onDark" />
        </Link>

        <div className="relative z-10">
          <h2 className="font-display text-4xl leading-tight font-bold">
            Gear up.
            <br />
            The forge is open.
          </h2>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-stone-300">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4 text-brand-400" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-stone-500">
          Loreforge — built for the Tamatem technical assessment.
        </p>
      </aside>

      <div className="relative flex items-center justify-center px-4 py-12">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mb-8 flex justify-center lg:hidden">
            <Logo />
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
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

            <Button type="submit" disabled={isSubmitting} size="lg" className="mt-2 w-full">
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Need help? <Link href="/contact" className="underline hover:text-foreground">Contact support</Link>
          </p>
        </div>
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
