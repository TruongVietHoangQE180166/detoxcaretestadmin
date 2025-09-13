import React from "react";
import type { Blog, Category } from "./types";
import type { User } from "../user/types";

type BlogTableProps = {
    blogs: Blog[];
    categories: Category[];
    users: User[];
    sortField: "title" | "view" | "emojis" | "created_date" | "";
    sortDirection: "asc" | "desc";
    handleSort: (field: "title" | "view" | "emojis" | "created_date") => void;
    handleDelete: (id: string) => void;
    onEdit: (blog: Blog) => void;
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
        <div className="overflow-x-auto shadow-xl rounded-xl bg-white">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-green-600 text-white">
                        <th className="p-4 text-left text-sm font-semibold uppercase">ID</th>
                        <th className="p-4 text-left text-sm font-semibold uppercase">Image</th>
                        <th
                            className="p-4 text-left text-sm font-semibold uppercase cursor-pointer hover:bg-green-700"
                            onClick={() => handleSort("title")}
                        >
                            Title {sortField === "title" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="p-4 text-left text-sm font-semibold uppercase">Slug</th>
                        <th className="p-4 text-left text-sm font-semibold uppercase">Category</th>
                        <th className="p-4 text-left text-sm font-semibold uppercase">User</th>
                        <th
                            className="p-4 text-left text-sm font-semibold uppercase cursor-pointer hover:bg-green-700"
                            onClick={() => handleSort("view")}
                        >
                            Views {sortField === "view" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th
                            className="p-4 text-left text-sm font-semibold uppercase cursor-pointer hover:bg-green-700"
                            onClick={() => handleSort("emojis")}
                        >
                            Emojis {sortField === "emojis" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th
                            className="p-4 text-left text-sm font-semibold uppercase cursor-pointer hover:bg-green-700"
                            onClick={() => handleSort("created_date")}
                        >
                            Created Date {sortField === "created_date" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="p-4 text-center text-sm font-semibold uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((blog, index) => {
                        const category = categories.find((c) => c.id === blog.category.id);
                        const user = users.find((u) => u.id === blog.user.id);

                        return (
                            <tr
                                key={blog.id}
                                className={`${index % 2 === 0 ? "bg-green-50/50" : "bg-white"
                                    } hover:bg-green-100/70 transition-all duration-200`}
                            >
                                <td className="p-4 text-sm text-gray-800 font-medium border-b">{blog.id}</td>
                                <td className="p-4 border-b">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-16 h-10 object-cover rounded-lg shadow-sm"
                                    />
                                </td>
                                <td className="p-4 text-sm text-gray-700 border-b">{blog.title}</td>
                                <td className="p-4 text-sm text-gray-700 border-b">{blog.slug_name}</td>
                                <td className="p-4 text-sm text-gray-700 border-b">{category?.name}</td>
                                <td className="p-4 text-sm text-gray-700 border-b">{user?.email}</td>
                                <td className="p-4 text-sm text-gray-700 border-b">{blog.view}</td>
                                <td className="p-4 text-sm text-gray-700 border-b">{blog.emojis}</td>
                                <td className="p-4 text-sm text-gray-700 border-b">
                                    {new Date(blog.created_date).toLocaleDateString("vi-VN", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </td>
                                <td className="p-4 text-center border-b">
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            onClick={() => onEdit(blog)}
                                            className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog.id)}
                                            className="px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default BlogTable;
