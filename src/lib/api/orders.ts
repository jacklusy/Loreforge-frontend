import { apiFetch } from "@/lib/api/client";
import type { Order, OrderListResponse } from "@/types/order";

export function getOrder(token: string, id: string | number): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}`, { token });
}

interface ListOrdersParams {
  page?: number;
  pageSize?: number;
}

export function listOrders(
  token: string,
  params: ListOrdersParams = {}
): Promise<OrderListResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("page_size", String(params.pageSize));

  const queryString = query.toString();
  return apiFetch<OrderListResponse>(`/orders${queryString ? `?${queryString}` : ""}`, { token });
}
