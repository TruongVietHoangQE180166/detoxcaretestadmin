import api from "../../api/Api";
import type { Query } from "../common/queryCommon";
import type { IBlog, IBlogCategory} from "./typeBlog";

export const getBlogsAll = async (params: Query) => {
    const res = await api.get("/api/blogs", { params });
    return res.data;
}

export const getBlogsCategoryAll = async (params: Query) => {
    const res = await api.get("/api/blog-categories/search", { params });
    return res.data;
}

export const createBlog  = async ( request: IBlog) => {
    const res = await api.post("/api/blogs", request);
    return res.data;
}

export const updateBlog = async (blogId: string, request: IBlog) => {
    const res = await api.put(`/api/blogs/blog-id/${blogId}`, request);
    return res.data;
}

export const deleteBlog = async (blogId: string) => {
    const res = await api.delete(`/api/blogs/${blogId}`);
    return res.data;
}

export const createBlogCategory  = async ( request: IBlogCategory) => {
    const res = await api.post("/api/blog-categories", request);
    return res.data;
}

export const updateBlogCategory = async (categoryId: string, request: IBlogCategory) => {
    const res = await api.put(`/api/blog-categories/${categoryId}`, request);
    return res.data;
}

// Image Upload
export const uploadBlogImage = async (file: File) => {
    const token = sessionStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await api.post("/api/images/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
        },
    });
    
    return res.data.data; // Return just the URL string from the data field
};