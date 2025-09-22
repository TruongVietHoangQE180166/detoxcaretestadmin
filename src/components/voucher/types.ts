export type Voucher = {
  id: number;
  code: string;
  discountValue: number;
  image?: string;
  active: boolean;
  percentage: boolean;
  minOrderValue: number;
 exchangePoint: number;
};
