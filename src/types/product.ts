export type Location = "JO" | "SA";

export interface Product {
  id: number;
  title: string;
  description: string;
  // Serialized as a string by the backend (Decimal), not a number.
  price: string;
  location: Location;
}

export interface ProductListResponse {
  items: Product[];
  page: number;
  page_size: number;
  total: number;
}
