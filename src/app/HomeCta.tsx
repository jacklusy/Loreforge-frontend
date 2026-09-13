"use client";

import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Skeleton } from "@/components/ui/Skeleton";

/** The hero CTA adapts to auth state instead of force-redirecting the visitor —
 * an already-signed-in user can still see the landing page, just with a
 * shortcut straight back into the store. */
export function HomeCta() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <Skeleton className="h-12 w-40" />;
  }

  return (
    <ButtonLink href={token ? "/products" : "/login"} size="lg" className="group">
      {token ? "Go to store" : "Sign in"}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </ButtonLink>
  );
}
