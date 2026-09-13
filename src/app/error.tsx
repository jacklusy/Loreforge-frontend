"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { AlertOctagon } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // In a real deployment this would report to an error-tracking service.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-8">
        <Logo />
      </div>

      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/15">
        <AlertOctagon className="h-8 w-8 text-rose-600 dark:text-rose-400" />
      </div>

      <h1 className="mt-6 text-2xl font-bold tracking-tight">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        An unexpected error occurred. You can try again, or head back to the store.
      </p>

      <div className="mt-8 flex gap-3">
        <Button onClick={retry} size="lg">
          Try again
        </Button>
        <ButtonLink href="/products" variant="secondary" size="lg">
          Back to store
        </ButtonLink>
      </div>
    </div>
  );
}
