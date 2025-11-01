// /api/orders
import api from "../../api/Api";
import type { Query } from "../common/queryCommon";


export const getAllOrders = async (params: Query) => {
    const res = await api.get("/api/orders", { params });
    return res.data;
};

export const updateOrderStatus = async (orderId: string, status: 'COMPLETED' | 'CANCELLED') => {
    const res = await api.put(`/api/orders/${orderId}/status`, null, { params: { status } });
    return res.data;
};