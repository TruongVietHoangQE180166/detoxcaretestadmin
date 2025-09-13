export type Product = {
  id: string;
  name: string;
  price: number;
  salePrice: number;
  sales: number;
  rating: number;
  image: string;
  isActive?: boolean;
  typeProduct?: TypeProduct; 
};

export type TypeProduct = {
  id: string;
  name: string;  
  image: string;
  description: string;
  is_deleted: boolean;
};