import React from "react";
import type { User } from "../user/types";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

// Define the API response structure
interface BlogApiResponse {
  id: string;
  createdDate: string;
  title: string;
  content: string;
  image: string;
  emojis: number;
  view: boolean;
  userName: string;
  fullname: string;
  categoryName: string;
  slugName: string;
}

// Define the Category API response structure
interface CategoryApiResponse {
  id: string;
  createdDate: string;
  name: string;
  isActive: boolean;
}

type BlogTableProps = {
    blogs: BlogApiResponse[];
    categories: CategoryApiResponse[];
    users: User[];
    sortField: "title" | "view" | "emojis" | "createdDate" | "";
    sortDirection: "asc" | "desc";
    handleSort: (field: "title" | "view" | "emojis" | "createdDate") => void;
    handleDelete: (id: string) => void;
    onEdit: (blog: BlogApiResponse) => void;
};

const BlogTable: React.FC<BlogTableProps> = ({
    blogs,
    categories,
    users,
    sortField,
    sortDirection,
    handleSort,
    handleDelete,
    onEdit,
}) => {
    return (
        <div className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-900 text-white">
                        <tr>
                            <th className="p-4 font-semibold text-sm">#</th>
                            <th className="p-4 font-semibold text-sm">Ảnh</th>
                            <th 
                                className="p-4 font-semibold text-sm cursor-pointer hover:bg-gray-800"
                                onClick={() => handleSort("title")}
                            >
                                Tiêu đề {sortField === "title" && (sortDirection === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="p-4 font-semibold text-sm">Danh mục</th>
                            <th 
                                className="p-4 font-semibold text-sm cursor-pointer hover:bg-gray-800"
                                onClick={() => handleSort("createdDate")}
                            >
                                Ngày tạo {sortField === "createdDate" && (sortDirection === "asc" ? "↑" : "↓")}
                            </th>
                            <th className="p-4 font-semibold text-sm">Người tạo</th>
                            <th className="p-4 font-semibold text-sm text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {blogs.map((blog, index) => {
                            return (
                                <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-sm text-gray-600 font-medium">{index + 1}</td>
                                    <td className="p-4">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-200">
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm font-semibold text-gray-900 max-w-xs truncate">
                                        {blog.title}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                                        {blog.categoryName}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                                        {new Date(blog.createdDate).toLocaleDateString("vi-VN", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                                        {blog.userName}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => onEdit(blog)}
                                                className="p-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-all transform hover:scale-110 shadow-sm"
                                                title="Chỉnh sửa"
                                            >
                                                <PencilSquareIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog.id)}
                                                className="p-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-all transform hover:scale-110 shadow-sm"
                                                title="Xóa"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {blogs.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 font-medium">Không có blog nào</p>
                                        <p className="text-gray-400 text-sm">Thêm blog mới để bắt đầu</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BlogTable;