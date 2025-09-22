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

