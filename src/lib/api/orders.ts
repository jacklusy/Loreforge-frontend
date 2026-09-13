import { apiFetch } from "@/lib/api/client";
import type { Order } from "@/types/order";

export function getOrder(token: string, id: string | number): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}`, { token });
}
