"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { listProducts } from "@/lib/api/products";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import type { Location, ProductListResponse } from "@/types/product";

const PAGE_SIZE = 20;

export default function ProductsPage() {
  // The (protected) layout guarantees a token exists before this page renders.
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [location, setLocation] = useState<Location | "">("");

  const { data, error, isLoading } = useSWR<ProductListResponse, ApiError>(
    token ? ["products", page, location] : null,
    () => listProducts(token as string, { page, pageSize: PAGE_SIZE, location: location || undefined })
  );

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  function handleLocationChange(next: Location | ""): void {
    setLocation(next);
    setPage(1);
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Game Items</h1>
        <label className="flex items-center gap-2 text-sm">
          Location
          <select
            value={location}
            onChange={(event) => handleLocationChange(event.target.value as Location | "")}
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
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page <= 1}
          className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          disabled={page >= totalPages}
          className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </main>
  );
}
