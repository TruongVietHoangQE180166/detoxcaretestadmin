import api from "../../api/Api";
import type { Query } from "../common/queryCommon";
import type { IVoucher } from "./IVoucher";

export const getVouchersAll = async (params: Query) => {
    const res = await api.get("/api/vouchers", { params });
    return res.data;
}

export const createVoucher  = async ( request: IVoucher) => {
    const res = await api.post("/api/vouchers", request);
    return res.data;
}

export const updateVoucher = async (voucherId: string, request: IVoucher) => {
    const res = await api.put(`/api/vouchers/${voucherId}`, request);
    return res.data;
}

export const uploadVoucherImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const res = await api.post("/api/images/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return res.data.data; // Return just the URL string from the data field
};
    
