"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** Header for the public pages (home, about, contact). The CTA follows auth
 * state so a signed-in visitor gets a way back into the store rather than a
 * pointless "sign in". */
export function SiteHeader() {
  const pathname = usePathname();
  const { token, isLoading } = useAuth();
  const [open, setOpen] = useState(false);

  const ctaHref = token ? "/products" : "/login";
  const ctaLabel = token ? "Go to store" : "Sign in";

  return (
    <header className="sticky top-0 z-30 border-b border-stroke bg-background/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {LINKS.map(({ href, label }) => (
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

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />
          {!isLoading && (
            <ButtonLink href={ctaHref} size="sm" className="hidden sm:inline-flex">
              {ctaLabel}
            </ButtonLink>
          )}
          <button
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground sm:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-stroke bg-surface px-4 py-3 sm:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-brand-500/15 text-brand-700 dark:text-brand-300"
                    : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-stroke pt-3">
            <ThemeToggle />
            <ButtonLink href={ctaHref} size="sm" onClick={() => setOpen(false)}>
              {ctaLabel}
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
