import type { Location } from "@/types/product";

export interface Order {
  id: number;
  product_id: number;
  product_title: string;
  price_paid: string;
  location: Location;
  created_at: string;
}

export interface OrderListResponse {
  items: Order[];
  page: number;
  page_size: number;
  total: number;
}
