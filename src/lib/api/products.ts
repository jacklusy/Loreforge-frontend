import { apiFetch } from "@/lib/api/client";
import type { Location, Product, ProductListResponse } from "@/types/product";
import type { Order } from "@/types/order";

interface ListProductsParams {
  page?: number;
  pageSize?: number;
  location?: Location;
}

export function listProducts(
  token: string,
  params: ListProductsParams = {}
): Promise<ProductListResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("page_size", String(params.pageSize));
  if (params.location) query.set("location", params.location);

  const queryString = query.toString();
  return apiFetch<ProductListResponse>(`/products${queryString ? `?${queryString}` : ""}`, {
    token,
  });
}

export function getProduct(token: string, id: string | number): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, { token });
}

export function buyProduct(token: string, id: string | number): Promise<Order> {
  return apiFetch<Order>(`/products/${id}/buy`, { method: "POST", token });
}
