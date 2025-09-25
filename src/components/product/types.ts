export type Product = {
  id: string;
  name: string;
  price: number;
  salePrice: number;
  image: string;
  description?: string;
  active?: boolean;
  typeProduct?: TypeProduct;
  statisticsRate?: {
    totalRate: number;
    averageRate: number;
    totalSale: number;
  };
  rateResponses?: Array<{
    id: string;
    rating: number;
    comment: string;
    productId: string;
    productName: string;
    fullName: string;
    avatar: string;
    createdDate: string;
  }>;
};

export type TypeProduct = {
  id: string;
  name: string;
  image: string;
  description: string;
  deleted: boolean;
};