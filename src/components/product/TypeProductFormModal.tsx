import { useState, useEffect } from "react";
import type { TypeProduct } from "./types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tp: TypeProduct) => void;
  editingTypeProduct: TypeProduct | null;
};

const TypeProductFormModal = ({ isOpen, onClose, onSave, editingTypeProduct }: Props) => {
  const [form, setForm] = useState<TypeProduct>({
    id: "",
    name: "",
    image: "",
    description: "",
    is_deleted: false,
  });

  useEffect(() => {
    if (editingTypeProduct) {
      setForm(editingTypeProduct);
    } else {
      setForm({
        id: "",
        name: "",
        image: "",
        description: "",
        is_deleted: false,
      });
    }
  }, [editingTypeProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50  bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100 sm:max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {editingTypeProduct ? "Sửa loại sản phẩm" : "Thêm loại sản phẩm"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên loại sản phẩm
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập tên loại sản phẩm"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL ảnh
            </label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Nhập URL ảnh"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
            />
            {form.image && (
              <img
                src={form.image || "https://via.placeholder.com/64"}
                alt="Preview"
                className="mt-3 w-16 h-16 object-cover rounded-md border border-gray-200"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Nhập mô tả"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 resize-y min-h-[100px]"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_deleted"
              checked={form.is_deleted}
              onChange={handleChange}
              className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm font-medium text-gray-700">Ngừng hoạt động</span>
          </label>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 shadow-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TypeProductFormModal;