export type Voucher = {
  id: number;
  code: string;
  discount_value: number;
  image?: string;
  is_active: boolean;
  is_percentage: boolean;
  min_order_value: number;
  exchange_point: number;
};
