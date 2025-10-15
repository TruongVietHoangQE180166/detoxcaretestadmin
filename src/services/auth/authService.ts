import api from "../../api/Api";
import type { LoginResponse, UserResponse } from "./LoginResponse";
import { useUserStore } from "../../store/userStore";

export const login = async (data: { username: string; password: string }) => {
    const res = await api.post<LoginResponse>("/api/auth/login", data);
    return res.data;
};

export const logout = () => {
    // Clear all items stored in sessionStorage during login
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("role");
    // Clear user data from Zustand store
    useUserStore.getState().clearUser();
};

export const getUser = async (userId: string) => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
        throw new Error("No access token found");
    }
    
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