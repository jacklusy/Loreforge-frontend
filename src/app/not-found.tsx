import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-8">
        <Logo />
      </div>

      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
        <Compass className="h-8 w-8 text-muted-foreground" />
      </div>

      <p className="mt-6 font-mono text-sm font-semibold text-muted-foreground">404</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
      </p>

      <ButtonLink href="/" size="lg" className="mt-8">
        Back to home
      </ButtonLink>
    </div>
  );
}
