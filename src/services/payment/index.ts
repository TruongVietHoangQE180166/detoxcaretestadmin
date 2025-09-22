import api from "../../api/Api";
import type { Query } from "../common/queryCommon";


// export const getAllProduct = async (userId: string) => {
//     const token = localStorage.getItem("accessToken");
//     const res = await api.get<Product>(
//         `/api/user/get-detail/${userId}`,
//         {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         }
//     );
//     return res.data;
// };
// Product
export const getAllPayment = async (params: Query) => {
    const res = await api.get("/api/payment", { params });
    return res.data;
};

