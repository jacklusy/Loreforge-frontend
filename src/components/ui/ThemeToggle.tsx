"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { useHasMounted } from "@/lib/hooks/useHasMounted";

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

/**
 * A three-way segmented control rather than a two-way toggle, because "follow my
 * OS" is a real, distinct choice — a plain sun/moon switch silently drops it.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  // The stored theme isn't known during SSR, so the active state can't be
  // rendered until after hydration without a mismatch.
  const mounted = useHasMounted();

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full border border-stroke bg-surface-muted p-0.5 ${className ?? ""}`}
      role="group"
      aria-label="Color theme"
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-label={label}
            aria-pressed={active}
            title={label}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
              active
                ? "bg-brand-500/20 text-brand-700 dark:text-brand-300"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}
