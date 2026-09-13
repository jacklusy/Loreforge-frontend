"use client";

import { Suspense, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { ArrowUpDown, Coins, MapPin, PackageSearch, Search, ShoppingCart } from "lucide-react";
import { listProducts, type ProductSort } from "@/lib/api/products";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { Alert } from "@/components/ui/Alert";
import { ItemArt } from "@/components/ui/ItemArt";
import { Pagination } from "@/components/ui/Pagination";
import { RegionMedallion } from "@/components/ui/RegionMedallion";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Location, ProductListResponse } from "@/types/product";

const PAGE_SIZE = 12;

const LOCATION_OPTIONS = [
  { value: "" as const, label: "All locations" },
  { value: "JO" as const, label: "Jordan" },
  { value: "SA" as const, label: "Saudi Arabia" },
];

const SORT_OPTIONS = [
  { value: "default" as const, label: "Featured" },
  { value: "price_asc" as const, label: "Price: low to high" },
  { value: "price_desc" as const, label: "Price: high to low" },
  { value: "title_asc" as const, label: "Name: A to Z" },
];

function parsePage(value: string | null): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function parseLocation(value: string | null): Location | "" {
  return value === "JO" || value === "SA" ? value : "";
}

function parseSort(value: string | null): ProductSort {
  return value === "price_asc" || value === "price_desc" || value === "title_asc"
    ? value
    : "default";
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stroke bg-surface">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2.5 p-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="mt-3 h-5 w-24" />
      </div>
    </div>
  );
}

function ProductsPageContent() {
  // The (protected) layout guarantees a token exists before this page renders.
  const { token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Page, filter, search and sort live in the URL, not component state, so a
  // reload, a shared link, or the browser back/forward buttons all land on the
  // same view.
  const page = parsePage(searchParams.get("page"));
  const location = parseLocation(searchParams.get("location"));
  const sort = parseSort(searchParams.get("sort"));
  const search = searchParams.get("q") ?? "";

  const { data, error, isLoading } = useSWR<ProductListResponse, ApiError>(
    token ? ["products", page, location, sort, search] : null,
    () =>
      listProducts(token as string, {
        page,
        pageSize: PAGE_SIZE,
        location: location || undefined,
        search: search || undefined,
        sort,
      })
  );

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  const navigate = useCallback(
    (next: { page?: number; location?: Location | ""; sort?: ProductSort; search?: string }) => {
      const params = new URLSearchParams();
      const nextPage = next.page ?? 1;
      const nextLocation = next.location ?? location;
      const nextSort = next.sort ?? sort;
      const nextSearch = next.search ?? search;

      if (nextPage > 1) params.set("page", String(nextPage));
      if (nextLocation) params.set("location", nextLocation);
      if (nextSort !== "default") params.set("sort", nextSort);
      if (nextSearch) params.set("q", nextSearch);

      const query = params.toString();
      router.push(query ? `/products?${query}` : "/products");
    },
    [router, location, sort, search]
  );

  useEffect(() => {
    document.title = "Products · Loreforge";
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Game Items</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {data
              ? `${data.total} item${data.total === 1 ? "" : "s"}${search ? ` matching “${search}”` : " available"}`
              : "Browse the catalog"}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Search and sort share one bordered bar, as in the design, so the
              controls that narrow the same list read as a single instrument. */}
          <div className="flex divide-x divide-stroke rounded-xl border border-stroke bg-surface">
            {/* Uncontrolled and keyed on the committed query: typing doesn't push
                a history entry per keystroke, and a back/forward navigation
                remounts the field with the right value — no state to sync. */}
            <form
              key={search}
              onSubmit={(event) => {
                event.preventDefault();
                const value = new FormData(event.currentTarget).get("q");
                navigate({ search: String(value ?? "").trim(), page: 1 });
              }}
              className="relative flex-1"
            >
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                name="q"
                defaultValue={search}
                placeholder="Search items…"
                aria-label="Search items"
                className="w-full bg-transparent py-2 pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground/70 sm:w-52"
              />
            </form>

            <Select
              value={sort}
              options={SORT_OPTIONS}
              onChange={(value) => navigate({ sort: value, page: 1 })}
              label="Sort items"
              icon={<ArrowUpDown className="h-3.5 w-3.5" />}
              variant="bare"
              className="w-44 shrink-0"
            />
          </div>

          <Select
            value={location}
            options={LOCATION_OPTIONS}
            onChange={(value) => navigate({ location: value, page: 1 })}
            label="Filter by location"
            icon={<MapPin className="h-3.5 w-3.5" />}
            className="sm:w-44"
          />
        </div>
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
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-stroke py-20 text-center">
          <PackageSearch className="h-8 w-8 text-muted-foreground" />
          <p className="font-display text-lg font-semibold">Nothing found</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {search
              ? `No items match “${search}”. Try a different term or clear the filters.`
              : "Try a different location filter."}
          </p>
          {(search || location) && (
            <button
              onClick={() => navigate({ search: "", location: "", page: 1 })}
              className="mt-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group relative overflow-hidden rounded-2xl border border-stroke bg-surface transition-all hover:-translate-y-1 hover:border-brand-500/50 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/40"
            >
              <ItemArt
                title={product.title}
                className="aspect-[4/3] w-full"
                iconClassName="h-16 w-16 transition-transform duration-500 group-hover:scale-110"
              />

              <span className="pointer-events-none absolute top-3 right-3 inline-flex translate-y-1 items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                <ShoppingCart className="h-3.5 w-3.5" />
                View item
              </span>

              {/* Pulled up over the art and faded into the card colour, so the
                  artwork bleeds into the text block with no hard divider. */}
              <div className="relative -mt-10 bg-gradient-to-b from-transparent via-surface/95 to-surface px-4 pt-9 pb-4">
                <h2 className="font-display text-base font-semibold tracking-tight">
                  {product.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-brand-700 dark:text-brand-300">
                    <Coins className="h-4 w-4 text-brand-500" />${product.price}
                  </span>
                  <RegionMedallion location={product.location} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10">
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={(next) => navigate({ page: next })}
        />
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-sm text-muted-foreground">Loading…</p>}>
      <ProductsPageContent />
    </Suspense>
  );
}
