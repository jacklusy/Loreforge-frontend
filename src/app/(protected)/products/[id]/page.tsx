"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { toast } from "sonner";
import { ArrowLeft, Coins, MapPin, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { getProduct, buyProduct } from "@/lib/api/products";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ItemArt } from "@/components/ui/ItemArt";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Product } from "@/types/product";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

type Tab = "details" | "delivery";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "details", label: "Details" },
  { id: "delivery", label: "Delivery" },
];

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params);
  // The (protected) layout guarantees a token exists before this page renders.
  const { token } = useAuth();
  const router = useRouter();
  const [isBuying, setIsBuying] = useState(false);
  const [tab, setTab] = useState<Tab>("details");

  const {
    data: product,
    error,
    isLoading,
  } = useSWR<Product, ApiError>(token ? ["product", id] : null, () =>
    getProduct(token as string, id)
  );

  useEffect(() => {
    document.title = product ? `${product.title} · Loreforge` : "Product · Loreforge";
  }, [product]);

  async function handleBuy(): Promise<void> {
    if (!token || !product) return;
    setIsBuying(true);
    try {
      const order = await buyProduct(token, id);
      toast.success("Purchase complete", {
        description: `${product.title} — $${product.price}. Order #${order.id}.`,
      });
      router.push(`/receipt/${order.id}`);
    } catch (err) {
      toast.error("Purchase failed", {
        description:
          err instanceof ApiError ? err.message : "Something went wrong. Please try again.",
      });
      setIsBuying(false);
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <Skeleton className="h-4 w-32" />
        <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-5 w-28 rounded-full" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-12 w-44 rounded-lg" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 text-center">
        <Alert variant="error">
          {error instanceof ApiError ? error.message : "Product not found."}
        </Alert>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
        <div className="rounded-xl border border-stroke-strong/60 p-2">
          <ItemArt title={product.title} className="aspect-square w-full rounded-lg" feature />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-stroke bg-surface-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {product.location === "JO" ? "Jordan" : "Saudi Arabia"}
          </span>

          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {product.title}
          </h1>
          <p className="mt-3 text-muted-foreground">{product.description}</p>

          <p className="mt-6 flex items-center gap-2 font-mono text-4xl font-bold text-brand-700 dark:text-brand-300">
            <Coins className="h-7 w-7 shrink-0 text-brand-500" />${product.price}
          </p>

          <Button
            onClick={handleBuy}
            disabled={isBuying}
            size="lg"
            variant="accent"
            className="mt-6 w-full sm:w-auto"
          >
            <ShoppingCart className="h-4 w-4" />
            {isBuying ? "Processing…" : "Buy now"}
          </Button>

          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-accent-600 dark:text-accent-400" />
            Secure checkout — a receipt is issued instantly.
          </p>

          <div className="mt-8 border-b border-stroke">
            <div className="flex gap-1" role="tablist">
              {TABS.map(({ id: tabId, label }) => (
                <button
                  key={tabId}
                  role="tab"
                  aria-selected={tab === tabId}
                  onClick={() => setTab(tabId)}
                  className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                    tab === tabId
                      ? "border-brand-500 text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 text-sm text-muted-foreground" role="tabpanel">
            {tab === "details" ? (
              <dl className="space-y-2">
                <div className="flex justify-between border-b border-stroke pb-2">
                  <dt>Item ID</dt>
                  <dd className="font-mono text-foreground">#{product.id}</dd>
                </div>
                <div className="flex justify-between border-b border-stroke pb-2">
                  <dt>Region</dt>
                  <dd className="text-foreground">
                    {product.location === "JO" ? "Jordan (JO)" : "Saudi Arabia (SA)"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Price</dt>
                  <dd className="font-mono text-foreground">${product.price}</dd>
                </div>
              </dl>
            ) : (
              <p className="inline-flex items-start gap-2">
                <Truck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                Digital item — delivered to your account the moment the order is placed. Your
                receipt stays available under Orders.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
