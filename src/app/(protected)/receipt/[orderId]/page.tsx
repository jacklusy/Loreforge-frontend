"use client";

import { use, useEffect } from "react";
import useSWR from "swr";
import { CheckCircle2, PackageX } from "lucide-react";
import { getOrder } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { Alert } from "@/components/ui/Alert";
import { ButtonLink } from "@/components/ui/ButtonLink";
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
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-16">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
        <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h1 className="mt-4 font-display text-3xl font-bold">Purchase complete</h1>
      <p className="mt-1 text-sm text-muted-foreground">Thanks for your order.</p>

      <dl className="mt-8 w-full divide-y divide-stroke rounded-2xl border border-stroke bg-surface">
        <Row label="Order ID" value={`#${order.id}`} />
        <Row label="Item" value={order.product_title} />
        <Row label="Price paid" value={`$${order.price_paid}`} />
        <Row label="Location" value={order.location} />
        <Row label="Date" value={new Date(order.created_at).toLocaleString()} />
      </dl>

      <ButtonLink href="/products" size="lg" className="mt-8 w-full">
        Continue shopping
      </ButtonLink>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between px-4 py-3.5 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono font-medium">{value}</dd>
    </div>
  );
}
