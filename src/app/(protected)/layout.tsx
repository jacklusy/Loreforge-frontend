"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { Footer } from "@/components/ui/Footer";
import { Logo } from "@/components/ui/Logo";

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/orders", label: "Orders" },
];

/**
 * Shared shell for every page that requires authentication: gates on the token
 * (redirecting to /login when absent) and renders the header once, so individual
 * pages don't each re-implement the auth check or the "log out" control.
 */
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { token, isLoading } = useRequireAuth();
  const { logout } = useAuth();
  const pathname = usePathname();

  if (isLoading || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stroke border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-stroke bg-surface/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-8">
            <Link href="/products">
              <Logo />
            </Link>
            <nav className="hidden gap-1 sm:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                      : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1">
            <Link
              href="/profile"
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                pathname === "/profile"
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
              }`}
            >
              <UserRound className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>
      {children}
      <Footer />
    </div>
  );
}
