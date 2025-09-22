// /api/orders
import api from "../../api/Api";
import type { Query } from "../common/queryCommon";


export const getAllOrders = async (params: Query) => {
    const res = await api.get("/api/orders", { params });
    return res.data;
};
