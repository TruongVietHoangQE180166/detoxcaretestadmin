import api from "../../api/Api";
import type { Product, TypeProduct } from "../../components/product/types";
import type { Query } from "../common/queryCommon";

// Define the type for the update product request body
type UpdateProductRequest = {
  name: string;
  price: number;
  salePrice: number;
  image: string;
  description: string;
  typeProductId: string;
  active: boolean;
};

// Define the type for the create type product request body
type CreateTypeProductRequest = {
  name: string;
  description: string;
  image: string;
};

// Define the type for the update type product request body
type UpdateTypeProductRequest = {
  id: string;
  name: string;
  description: string;
  image: string;
  deleted: boolean;
};

// Define the type for API response
type ApiResponse<T> = {
  message: {
    messageCode: string;
    messageDetail: string;
  };
  errors: {
    field: string;
    message: string;
  }[];
  data: T;
  success: boolean;
};

// Product
export const getAllProduct = async (params: Query) => {
  const res = await api.get<Product>("/api/product", { params });
  return res.data;
};

// Update Product
export const updateProduct = async (productId: string, productData: UpdateProductRequest) => {
  const token = sessionStorage.getItem("accessToken");
  
  const res = await api.put<Product>(`/api/product/${productId}`, productData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res.data;
};

// Create Product
export const createProduct = async (productData: UpdateProductRequest) => {
  const token = sessionStorage.getItem("accessToken");
  
  const res = await api.post<Product>("/api/product", productData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res.data;
};

// Image Upload
export const uploadProductImage = async (file: File) => {
  const token = sessionStorage.getItem("accessToken");
  const formData = new FormData();
  formData.append("file", file);
  
  const res = await api.post<ApiResponse<string>>("/api/images/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  
  return res.data.data; // Return just the URL string from the data field
};

// Type Product
export const getTypeProducts = async () => {
  const token = sessionStorage.getItem("accessToken");
  const res = await api.get<TypeProduct>("/api/type-product", {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res.data;
};

// Create Type Product
export const createTypeProduct = async (typeProductData: CreateTypeProductRequest) => {
  const token = sessionStorage.getItem("accessToken");
  
  const res = await api.post<TypeProduct>("/api/type-product", typeProductData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res.data;
};

// Update Type Product
export const updateTypeProduct = async (typeProductData: UpdateTypeProductRequest) => {
  const token = sessionStorage.getItem("accessToken");
  
  const res = await api.put<TypeProduct>("/api/type-product", typeProductData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res.data;
};

// Delete Product
export const deleteProduct = async (productId: string) => {
  const token = sessionStorage.getItem("accessToken");
  
  const res = await api.delete(`/api/product/${productId}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return res.data;
};