"use client";

import { use, useEffect } from "react";
import useSWR from "swr";
import { CheckCircle2, PackageX, Printer } from "lucide-react";
import { getOrder } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ItemArt } from "@/components/ui/ItemArt";
import { LogoMark } from "@/components/ui/Logo";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Order } from "@/types/order";

interface ReceiptPageProps {
  params: Promise<{ orderId: string }>;
}

export default function ReceiptPage({ params }: ReceiptPageProps) {
  const { orderId } = use(params);
  // The (protected) layout guarantees a token exists before this page renders.
  const { token } = useAuth();

  const {
    data: order,
    error,
    isLoading,
  } = useSWR<Order, ApiError>(token ? ["order", orderId] : null, () =>
    getOrder(token as string, orderId)
  );

  useEffect(() => {
    document.title = "Receipt · Loreforge";
  }, []);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-16">
        <Skeleton className="mx-auto h-14 w-14 rounded-full" />
        <Skeleton className="mx-auto mt-4 h-6 w-40" />
        <Skeleton className="mt-8 h-48 w-full rounded-2xl" />
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted">
          <PackageX className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="mt-4 font-display text-xl font-bold">Receipt not found</h1>
        <Alert variant="error" className="mt-4 w-full text-left">
          {error instanceof ApiError ? error.message : "This receipt doesn't exist."}
        </Alert>
        <ButtonLink href="/products" variant="secondary" className="mt-6">
          Back to products
        </ButtonLink>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-16 print:py-0">
      {/* Only shown on a printed/PDF copy, which loses the app chrome (header,
          nav, theme) — the receipt needs to identify itself on its own. Explicit
          stone colors rather than the theme tokens: those follow dark mode via a
          CSS variable, which would print near-white text on white paper. */}
      <div className="mb-8 hidden w-full items-center justify-between border-b border-stone-300 pb-4 print:flex">
        <span className="flex items-center gap-2 text-base font-bold text-stone-900">
          <LogoMark className="h-6 w-6" />
          Loreforge
        </span>
        <span className="text-sm text-stone-600">Order #{order.id}</span>
      </div>

      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15 print:hidden">
        <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h1 className="mt-4 font-display text-3xl font-bold print:mt-0">Purchase complete</h1>
      <p className="mt-1 text-sm text-muted-foreground print:hidden">Thanks for your order.</p>

      <div className="mt-8 w-full overflow-hidden rounded-2xl border border-stroke bg-surface print:mt-0 print:rounded-none print:border-stone-300 print:bg-white">
        {/* The item's own art, so the receipt shows what was bought rather than
            naming it in a table row alone. Dropped on the printed copy — it's
            decorative, and printing a photo wastes ink for no informational gain. */}
        <div className="relative print:hidden">
          <ItemArt
            title={order.product_title}
            className="h-28 w-full"
            sizes="448px"
            iconClassName="h-10 w-10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-surface to-transparent"
          />
        </div>

        <dl className="divide-y divide-stroke print:divide-stone-200">
          <Row label="Order ID" value={`#${order.id}`} />
          <Row label="Item" value={order.product_title} />
          <Row label="Price paid" value={`$${order.price_paid}`} />
          <Row label="Location" value={order.location} />
          <Row label="Date" value={new Date(order.created_at).toLocaleString()} />
        </dl>
      </div>

      <p className="mt-6 hidden text-center text-xs text-stone-500 print:block">
        Thank you for shopping with Loreforge.
      </p>

      <div className="mt-8 flex w-full gap-3 print:hidden">
        <Button
          onClick={() => window.print()}
          variant="secondary"
          size="lg"
          className="flex-1"
        >
          <Printer className="h-4 w-4" />
          Print receipt
        </Button>
        <ButtonLink href="/products" size="lg" className="flex-1">
          Continue shopping
        </ButtonLink>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between px-4 py-3.5 text-sm print:text-stone-900">
      <dt className="text-muted-foreground print:text-stone-500">{label}</dt>
      <dd className="font-mono font-medium">{value}</dd>
    </div>
  );
}
