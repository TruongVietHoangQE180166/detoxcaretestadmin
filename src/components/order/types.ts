import type { Product } from "../product/types";

export type Order = {
  id: string;
  userId: string;
  email: string;
  address: string;
  numberPhone: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED" | null;
  totalAmount: number;
  createdDate?: string; // optional vì BE hiện chưa trả created_date
};


export type OrderDetail = {
  id: string;
  order_id: string;
  product: Product;  
  price: number;
  quantity: number;
};