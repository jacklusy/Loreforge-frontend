"use client";

import { use } from "react";
import Link from "next/link";
import useSWR from "swr";
import { getOrder } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
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

  if (isLoading) {
    return <p className="p-8 text-center text-sm text-gray-500">Loading…</p>;
  }

  if (error || !order) {
    return (
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-16 text-center">
        <p className="text-red-600">
          {error instanceof ApiError ? error.message : "Receipt not found."}
        </p>
        <Link href="/products" className="mt-4 inline-block text-sm underline">
          Back to products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-16">
      <h1 className="text-2xl font-bold">Purchase complete</h1>
      <p className="mt-1 text-gray-600">Thanks for your order.</p>

      <dl className="mt-6 divide-y divide-gray-200 rounded-lg border border-gray-200">
        <Row label="Order ID" value={`#${order.id}`} />
        <Row label="Item" value={order.product_title} />
        <Row label="Price paid" value={`$${order.price_paid}`} />
        <Row label="Location" value={order.location} />
        <Row label="Date" value={new Date(order.created_at).toLocaleString()} />
      </dl>

      <Link href="/products" className="mt-6 inline-block text-sm underline">
        Continue shopping
      </Link>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between px-4 py-3 text-sm">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
