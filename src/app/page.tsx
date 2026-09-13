"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export default function HomePage() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(token ? "/products" : "/login");
  }, [token, isLoading, router]);

  return <p className="p-8 text-center text-sm text-gray-500">Loading…</p>;
}
