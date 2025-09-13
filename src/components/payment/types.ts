import type { Order } from "../order/types";

export type Payment = {
  id: string;
  amount: number;
  content: string;
  method: string;
  qr_code: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  order: Order;
  created_date: string;
};
