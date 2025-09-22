import api from "../../api/Api";
import type { Product, TypeProduct } from "../../components/product/types";
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
export const getAllProduct = async (params: Query) => {
    const res = await api.get<Product>("/api/product", { params });
    return res.data;
};

// Type Product

export const getTypeProducts = async () => {
    const token = localStorage.getItem("accessToken");
    const res = await api.get<TypeProduct>("/api/type-product", {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
    });
    return res.data;
};


// Rate