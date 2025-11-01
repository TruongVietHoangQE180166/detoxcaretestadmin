// /api/user
import api from "../../api/Api";
import type { Query } from "../common/queryCommon";


export const getAllUser = async (params: Query) => {
    const res = await api.get("/api/user", { params });
    return res.data;
};

export const updateUserStatus = async (userId: string, status: 'ACTIVE' | 'INACTIVE') => {
    const res = await api.put(`/api/user/status/${userId}`, null, { params: { status } });
    return res.data;
};