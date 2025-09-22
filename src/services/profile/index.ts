// /api/user
import api from "../../api/Api";
import type { Query } from "../common/queryCommon";


export const getAllProfile = async (params: Query) => {
    const res = await api.get("/api/profile", { params });
    return res.data;
};
