"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { toast } from "sonner";
import { ArrowLeft, Coins, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { getProduct, buyProduct } from "@/lib/api/products";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ItemArt } from "@/components/ui/ItemArt";
import { RegionMedallion } from "@/components/ui/RegionMedallion";
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

/** Bracket positions for the corners of the art frame. */
const FRAME_CORNERS = [
  "top-1 left-1 border-t-2 border-l-2 rounded-tl",
  "top-1 right-1 border-t-2 border-r-2 rounded-tr",
  "bottom-1 left-1 border-b-2 border-l-2 rounded-bl",
  "bottom-1 right-1 border-r-2 border-b-2 rounded-br",
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
        {/* A struck metal frame around the art, as in the design: an outer
            bevelled plate, an inner hairline, and a bracket at each corner. */}
        <div className="relative rounded-2xl border-2 border-stroke-strong/70 bg-gradient-to-br from-surface-muted via-surface to-surface-muted p-3 shadow-2xl shadow-black/20 dark:shadow-black/60">
          <ItemArt
            title={product.title}
            className="aspect-square w-full rounded-lg ring-1 ring-stroke-strong/50"
            sizes="(max-width: 768px) 100vw, 50vw"
            feature
          />
          {FRAME_CORNERS.map((corner) => (
            <span
              key={corner}
              aria-hidden="true"
              className={`pointer-events-none absolute h-4 w-4 border-brand-500/40 ${corner}`}
            />
          ))}
        </div>

        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-stroke bg-surface-muted py-1 pr-3.5 pl-1 text-xs font-medium text-muted-foreground">
            <RegionMedallion location={product.location} className="h-6 w-6 ring-offset-0" />
            {product.location === "JO" ? "Jordan" : "Saudi Arabia"}
          </span>

          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {product.title}
          </h1>
          <p className="mt-3 text-muted-foreground">{product.description}</p>

          <p className="mt-6 flex items-center gap-2 font-mono text-4xl font-bold text-brand-700 dark:text-brand-300">
            <Coins className="h-7 w-7 shrink-0 text-brand-500" />${product.price}
          </p>

          {/* The purchase action is the one lit control on the page, so it gets
              a halo behind it rather than only a fill colour. */}
          <div className="relative mt-6 inline-block w-full sm:w-auto">
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute -inset-1 rounded-xl bg-accent-500/35 blur-lg transition-opacity duration-300 ${
                isBuying ? "opacity-40" : ""
              }`}
            />
            <Button
              onClick={handleBuy}
              disabled={isBuying}
              size="lg"
              variant="accent"
              className="relative w-full ring-1 ring-accent-300/40 sm:w-auto"
            >
              <ShoppingCart className="h-4 w-4" />
              {isBuying ? "Processing…" : "Buy now"}
            </Button>
          </div>

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
