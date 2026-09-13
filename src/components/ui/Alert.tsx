import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { ReactNode } from "react";

type AlertVariant = "error" | "success" | "info";

const styles: Record<AlertVariant, string> = {
  error:
    "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
  info: "border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300",
};

const icons: Record<AlertVariant, ReactNode> = {
  error: <AlertTriangle className="h-4 w-4 shrink-0" />,
  success: <CheckCircle2 className="h-4 w-4 shrink-0" />,
  info: <Info className="h-4 w-4 shrink-0" />,
};

interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}

export function Alert({ variant = "info", children, className }: AlertProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm ${styles[variant]} ${className ?? ""}`}
    >
      {icons[variant]}
      <div className="min-w-0">{children}</div>
    </div>
  );
}
