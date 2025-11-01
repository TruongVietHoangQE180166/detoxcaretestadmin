import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

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

interface BlogDetailProps {
  blog: BlogApiResponse;
  onBack: () => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ blog, onBack }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Chi tiết blog</h2>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Quay lại
          </button>
        </div>

        <div className="space-y-6">
          {/* Blog Image */}
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Blog Info */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin blog</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tiêu đề</p>
                <p className="font-medium">{blog.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Slug</p>
                <p className="font-medium">{blog.slugName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Danh mục</p>
                <p className="font-medium">{blog.categoryName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày tạo</p>
                <p className="font-medium">
                  {new Date(blog.createdDate).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Người tạo</p>
                <p className="font-medium">{blog.userName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <p className="font-medium">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    blog.view ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {blog.view ? "Hiển thị" : "Ẩn"}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Biểu cảm</p>
                <p className="font-medium">{blog.emojis}</p>
              </div>
            </div>
          </div>

          {/* Blog Content */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Nội dung</h3>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;