"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

/** Sonner keeps its own theme, so it has to be told which one the app is in —
 * otherwise a light toast lands on a dark page. Bottom-right keeps toasts clear
 * of the sticky header. */
export function ToastHost() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="bottom-right"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      richColors
      closeButton
    />
  );
}
