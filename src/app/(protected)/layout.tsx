"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Package, Receipt, UserRound } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { Footer } from "@/components/ui/Footer";
import { Logo } from "@/components/ui/Logo";
import { MobileNav } from "@/components/ui/MobileNav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { href: "/products", label: "Products", icon: Package },
  { href: "/orders", label: "Orders", icon: Receipt },
  { href: "/profile", label: "Profile", icon: UserRound },
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
  const [menuOpen, setMenuOpen] = useState(false);

  if (isLoading || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stroke border-t-brand-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-stroke bg-surface/85 backdrop-blur print:hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-8">
            <Link href="/products">
              <Logo />
            </Link>
            <nav className="hidden gap-1 sm:flex">
              {NAV_LINKS.slice(0, 2).map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    pathname === href
                      ? "bg-brand-500/15 text-brand-700 dark:text-brand-300"
                      : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-1 sm:flex">
            <ThemeToggle className="mr-2" />
            <Link
              href="/profile"
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                pathname === "/profile"
                  ? "bg-brand-500/15 text-brand-700 dark:text-brand-300"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
              }`}
            >
              <UserRound className="h-4 w-4" />
              Profile
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground sm:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={NAV_LINKS}
        pathname={pathname}
        onLogout={logout}
      />

      {children}
      <Footer />
    </div>
  );
}
