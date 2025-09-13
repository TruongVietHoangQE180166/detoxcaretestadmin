import { useState, useEffect } from "react";
import type { Blog, Category } from "./types";
import type { User } from "../user/types";

type BlogFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (blog: Blog) => void;
  categories: Category[];
  users: User[];
  initialData?: Blog | null;
};

const BlogFormModal = ({ isOpen, onClose, onSave, categories, users, initialData }: BlogFormModalProps) => {
  const [formData, setFormData] = useState<Blog>({
    id: "",
    title: "",
    slug_name: "",
    image: "",
    content: "",
    emojis: 0,
    view: 0,
    category: categories[0] || { id: "", name: "", is_active: true, created_date: "" },
    user: users[0] || { id: "", email: "", username: "", status: "ACTIVE", role_name: "USER", is_deleted: 0, created_date: "" },
    created_date: new Date().toISOString(),
  });
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setImageError(false);
    } else {
      setFormData({
        id: `b${Date.now()}`,
        title: "",
        slug_name: "",
        image: "",
        content: "",
        emojis: 0,
        view: 0,
        category: categories[0] || { id: "", name: "", is_active: true, created_date: "" },
        user: users[0] || { id: "", email: "", username: "", status: "ACTIVE", role_name: "USER", is_deleted: 0, created_date: "" },
        created_date: new Date().toISOString(),
      });
      setImageError(false);
    }
  }, [initialData, categories, users]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "category") {
      setFormData({ ...formData, category: categories.find((c) => c.id === value) || formData.category });
    } else if (name === "user") {
      setFormData({ ...formData, user: users.find((u) => u.id === value) || formData.user });
    } else {
      setFormData({ ...formData, [name]: value });
      if (name === "image") setImageError(false); // Reset image error on URL change
    }
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl transform transition-all duration-300 scale-100">
        <h2 className="text-2xl font-bold text-green-800 mb-6 tracking-tight">
          {initialData ? "Chỉnh sửa Blog" : "Tạo Blog Mới"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Nhập tiêu đề blog"
                className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-sm text-gray-700 bg-white shadow-sm transition-all duration-200 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
              <input
                name="slug_name"
                value={formData.slug_name}
                onChange={handleChange}
                placeholder="Nhập slug (ví dụ: detox-giai-nhiet)"
                className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-sm text-gray-700 bg-white shadow-sm transition-all duration-200 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
              <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Nhập URL hình ảnh"
                className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-sm text-gray-700 bg-white shadow-sm transition-all duration-200 placeholder-gray-400"
              />
              <div className="mt-2">
                {formData.image && !imageError ? (
                  <img
                    src={formData.image}
                    alt="Image Preview"
                    className="w-full h-32 object-cover rounded-lg border border-green-200 shadow-sm"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg border border-green-200 shadow-sm text-gray-400 text-sm">
                    {imageError ? "Không thể tải hình ảnh" : "Chưa có hình ảnh"}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label>
              <select
                name="category"
                value={formData.category.id}
                onChange={handleChange}
                className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-sm text-gray-700 bg-white shadow-sm transition-all duration-200"
              >
                <option value="" disabled>Chọn danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Người tạo</label>
              <select
                name="user"
                value={formData.user.id}
                onChange={handleChange}
                className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-sm text-gray-700 bg-white shadow-sm transition-all duration-200"
              >
                <option value="" disabled>Chọn người tạo</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.email}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Nhập nội dung blog"
                className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-sm text-gray-700 bg-white shadow-sm transition-all duration-200 placeholder-gray-400 resize-y min-h-[120px]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
          >
            {initialData ? "Cập nhật" : "Tạo"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogFormModal;