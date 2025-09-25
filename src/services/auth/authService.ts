import api from "../../api/Api";
import type { LoginResponse, UserResponse } from "./LoginResponse";

export const login = async (data: { username: string; password: string }) => {
    const res = await api.post<LoginResponse>("/api/auth/login", data);
    return res.data;
};

export const getUser = async (userId: string) => {
    const token = sessionStorage.getItem("accessToken");
    const res = await api.get<UserResponse>(
        `/api/user/get-detail/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data;
};
