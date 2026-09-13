import type { ReactNode } from "react";

type Tone = "brand" | "accent" | "success" | "neutral";

const tones: Record<Tone, string> = {
  brand: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  accent: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  neutral: "bg-surface-muted text-muted-foreground",
};

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]} ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
