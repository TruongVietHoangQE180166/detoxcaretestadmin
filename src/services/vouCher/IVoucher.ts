
export interface IVoucher {
    code: string;
    discountValue: number;
    minOrderValue: number;
    image?: string;
    exchangePoint: number;
    active: boolean;
    percentage: boolean;
}


