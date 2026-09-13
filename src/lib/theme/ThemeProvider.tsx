"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * Wraps next-themes with this app's settings. `class` strategy (rather than the
 * media query) is what lets a user override their OS preference; next-themes
 * injects a blocking script that applies the stored choice before first paint,
 * which is what avoids the light-flash-then-dark flicker a hand-rolled
 * useEffect toggle would cause.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
