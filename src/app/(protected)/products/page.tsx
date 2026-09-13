"use client";

import { Suspense, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { PackageSearch, SlidersHorizontal } from "lucide-react";
import { listProducts } from "@/lib/api/products";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { getProductVisual } from "@/lib/product-visuals";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Location, ProductListResponse } from "@/types/product";

const PAGE_SIZE = 20;

function parsePage(value: string | null): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function parseLocation(value: string | null): Location | "" {
  return value === "JO" || value === "SA" ? value : "";
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stroke bg-surface">
      <Skeleton className="h-28 w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

function ProductsPageContent() {
  // The (protected) layout guarantees a token exists before this page renders.
  const { token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Page and filter live in the URL, not component state, so a reload, a shared
  // link, or the browser back/forward buttons all land on the same view.
  const page = parsePage(searchParams.get("page"));
  const location = parseLocation(searchParams.get("location"));

  const { data, error, isLoading } = useSWR<ProductListResponse, ApiError>(
    token ? ["products", page, location] : null,
    () => listProducts(token as string, { page, pageSize: PAGE_SIZE, location: location || undefined })
  );

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  const navigate = useCallback(
    (nextPage: number, nextLocation: Location | "") => {
      const params = new URLSearchParams();
      if (nextPage > 1) params.set("page", String(nextPage));
      if (nextLocation) params.set("location", nextLocation);
      const query = params.toString();
      router.push(query ? `/products?${query}` : "/products");
    },
    [router]
  );

  useEffect(() => {
    document.title = "Products · Loreforge";
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Game Items</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data ? `${data.total} items available` : "Browse the catalog"}
          </p>
        </div>

        <label className="flex items-center gap-2 rounded-lg border border-stroke bg-surface px-3 py-2 text-sm">
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={location}
            onChange={(event) => navigate(1, event.target.value as Location | "")}
            className="bg-transparent font-medium outline-none"
            aria-label="Filter by location"
          >
            <option value="">All locations</option>
            <option value="JO">Jordan</option>
            <option value="SA">Saudi Arabia</option>
          </select>
        </label>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error instanceof ApiError ? error.message : "Failed to load products."}
        </Alert>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-stroke py-20 text-center">
          <PackageSearch className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">No products found</p>
          <p className="text-sm text-muted-foreground">Try a different location filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((product) => {
            const { icon: Icon, gradient } = getProductVisual(product.title);
            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group overflow-hidden rounded-2xl border border-stroke bg-surface transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-stone-950/5"
              >
                <div
                  className={`flex h-28 items-center justify-center bg-gradient-to-br ${gradient}`}
                >
                  <Icon className="h-10 w-10 text-white/90 transition-transform group-hover:scale-110" />
                </div>
                <div className="p-4">
                  <h2 className="text-base font-bold leading-tight">{product.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {product.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-brand-700 dark:text-brand-400">
                      ${product.price}
                    </span>
                    <Badge tone={product.location === "JO" ? "brand" : "accent"}>
                      {product.location}
                    </Badge>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-10">
        <Pagination page={page} totalPages={totalPages} onChange={(next) => navigate(next, location)} />
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-sm text-gray-500">Loading…</p>}>
      <ProductsPageContent />
    </Suspense>
  );
}
