"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { ArrowLeft, MapPin, ShoppingCart } from "lucide-react";
import { getProduct, buyProduct } from "@/lib/api/products";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { getProductVisual } from "@/lib/product-visuals";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Product } from "@/types/product";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params);
  // The (protected) layout guarantees a token exists before this page renders.
  const { token } = useAuth();
  const router = useRouter();
  const [buyError, setBuyError] = useState<string | null>(null);
  const [isBuying, setIsBuying] = useState(false);

  const {
    data: product,
    error,
    isLoading,
  } = useSWR<Product, ApiError>(token ? ["product", id] : null, () =>
    getProduct(token as string, id)
  );

  useEffect(() => {
    document.title = product
      ? `${product.title} · Tamatem Game Store`
      : "Product · Tamatem Game Store";
  }, [product]);

  async function handleBuy(): Promise<void> {
    if (!token) return;
    setBuyError(null);
    setIsBuying(true);
    try {
      const order = await buyProduct(token, id);
      router.push(`/receipt/${order.id}`);
    } catch (err) {
      setBuyError(err instanceof ApiError ? err.message : "Purchase failed. Please try again.");
      setIsBuying(false);
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <Skeleton className="h-4 w-32" />
        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <Skeleton className="h-56 w-full rounded-2xl" />
          <div className="space-y-3">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 text-center">
        <Alert variant="error" className="justify-center text-center">
          {error instanceof ApiError ? error.message : "Product not found."}
        </Alert>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
      </main>
    );
  }

  const { icon: Icon, gradient } = getProductVisual(product.title);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:items-start">
        <div
          className={`flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br sm:aspect-auto sm:h-72 ${gradient}`}
        >
          <Icon className="h-20 w-20 text-white/90" />
        </div>

        <div>
          <Badge tone={product.location === "JO" ? "brand" : "accent"}>
            <MapPin className="mr-1 h-3 w-3" />
            {product.location === "JO" ? "Jordan" : "Saudi Arabia"}
          </Badge>

          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{product.title}</h1>
          <p className="mt-3 text-muted-foreground">{product.description}</p>
          <p className="mt-5 font-mono text-3xl font-bold text-brand-700 dark:text-brand-400">
            ${product.price}
          </p>

          {buyError && (
            <Alert variant="error" className="mt-4">
              {buyError}
            </Alert>
          )}

          <Button onClick={handleBuy} disabled={isBuying} size="lg" variant="accent" className="mt-6">
            <ShoppingCart className="h-4 w-4" />
            {isBuying ? "Processing…" : "Buy now"}
          </Button>
        </div>
      </div>
    </main>
  );
}
