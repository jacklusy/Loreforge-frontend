"use client";

import { Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { listProducts } from "@/lib/api/products";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import type { Location, ProductListResponse } from "@/types/product";

const PAGE_SIZE = 20;

function parsePage(value: string | null): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function parseLocation(value: string | null): Location | "" {
  return value === "JO" || value === "SA" ? value : "";
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

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Game Items</h1>
        <label className="flex items-center gap-2 text-sm">
          Location
          <select
            value={location}
            onChange={(event) => navigate(1, event.target.value as Location | "")}
            className="rounded border border-gray-300 px-3 py-1.5"
          >
            <option value="">All</option>
            <option value="JO">Jordan</option>
            <option value="SA">Saudi Arabia</option>
          </select>
        </label>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600">
          {error instanceof ApiError ? error.message : "Failed to load products."}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-sm text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {data.items.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="rounded-lg border border-gray-200 p-4 transition hover:border-gray-400 hover:shadow-sm"
            >
              <h2 className="text-lg font-bold leading-tight">{product.title}</h2>
              <p className="mt-1 text-sm text-gray-600">{product.description}</p>
              <p className="mt-3 text-sm font-medium">
                ${product.price} · {product.location}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={() => navigate(page - 1, location)}
          disabled={page <= 1}
          className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => navigate(page + 1, location)}
          disabled={page >= totalPages}
          className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-40"
        >
          Next
        </button>
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
