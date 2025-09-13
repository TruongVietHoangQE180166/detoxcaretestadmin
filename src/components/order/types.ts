import type { Product } from "../product/types";

export type Order = {
  id: string;
  user_id: string;
  address: string;
  number_phone: string;
  order_status: "PENDING" | "COMPLETED" | "CANCELLED";
  total_amount: number;
  created_date: string;
};

export type OrderDetail = {
  id: string;
  order_id: string;
  product: Product;  
  price: number;
  quantity: number;
};