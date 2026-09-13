"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { getProduct, buyProduct } from "@/lib/api/products";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
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
    return <p className="p-8 text-center text-sm text-gray-500">Loading…</p>;
  }

  if (error || !product) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 text-center">
        <p className="text-red-600">
          {error instanceof ApiError ? error.message : "Product not found."}
        </p>
        <Link href="/products" className="mt-4 inline-block text-sm underline">
          Back to products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <Link href="/products" className="text-sm text-gray-500 hover:underline">
        ← Back to products
      </Link>

      <h1 className="mt-4 text-3xl font-bold">{product.title}</h1>
      <p className="mt-3 text-gray-700">{product.description}</p>
      <p className="mt-4 text-xl font-semibold">${product.price}</p>
      <p className="text-sm text-gray-500">Location: {product.location}</p>

      {buyError && <p className="mt-4 text-sm text-red-600">{buyError}</p>}

      <button
        onClick={handleBuy}
        disabled={isBuying}
        className="mt-6 rounded bg-black px-6 py-3 font-medium text-white disabled:opacity-50"
      >
        {isBuying ? "Processing…" : "Buy"}
      </button>
    </main>
  );
}
