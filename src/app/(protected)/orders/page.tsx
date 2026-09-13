"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { Coins, PackageOpen } from "lucide-react";
import { listOrders } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { Alert } from "@/components/ui/Alert";
import { ItemArt } from "@/components/ui/ItemArt";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import type { OrderListResponse } from "@/types/order";

const PAGE_SIZE = 10;

function parsePage(value: string | null): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function OrderRowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-stroke bg-surface p-4">
      <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

function OrderHistoryContent() {
  // The (protected) layout guarantees a token exists before this page renders.
  const { token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parsePage(searchParams.get("page"));

  const { data, error, isLoading } = useSWR<OrderListResponse, ApiError>(
    token ? ["orders", page] : null,
    () => listOrders(token as string, { page, pageSize: PAGE_SIZE })
  );

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  useEffect(() => {
    document.title = "Order History · Loreforge";
  }, []);

  function goToPage(next: number): void {
    router.push(next > 1 ? `/orders?page=${next}` : "/orders");
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Order History</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {data ? `${data.total} order${data.total === 1 ? "" : "s"} placed` : "Your past purchases"}
        </p>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error instanceof ApiError ? error.message : "Failed to load your orders."}
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <OrderRowSkeleton key={index} />
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-stroke py-20 text-center">
          <PackageOpen className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">No orders yet</p>
          <p className="text-sm text-muted-foreground">Items you buy will show up here.</p>
          <Link href="/products" className="mt-2 text-sm font-medium text-brand-600 hover:underline">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {data.items.map((order) => (
            <Link
              key={order.id}
              href={`/receipt/${order.id}`}
              className="flex items-center gap-4 rounded-xl border border-stroke bg-surface p-4 transition-colors hover:border-brand-500/50"
            >
              <ItemArt
                title={order.product_title}
                className="h-14 w-14 shrink-0 rounded-lg"
                iconClassName="h-6 w-6"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-semibold">{order.product_title}</p>
                <p className="text-xs text-muted-foreground">
                  Order #{order.id} · {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full border border-stroke-strong bg-surface-muted font-mono text-[10px] font-bold text-muted-foreground sm:inline-flex">
                {order.location}
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-sm font-semibold text-brand-700 dark:text-brand-300">
                <Coins className="h-4 w-4 text-brand-500" />${order.price_paid}
              </span>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10">
        <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
      </div>
    </main>
  );
}

export default function OrderHistoryPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-sm text-gray-500">Loading…</p>}>
      <OrderHistoryContent />
    </Suspense>
  );
}
