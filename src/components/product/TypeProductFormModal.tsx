import { useState, useEffect, useRef } from "react";
import type { TypeProduct } from "./types";
import { uploadProductImage } from "../../services/product/productService";

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
    deleted: false, // Always false by default
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTypeProduct) {
      setForm({
        ...editingTypeProduct,
        deleted: false // Keep it false even when editing
      });
      setImagePreview(editingTypeProduct.image || "");
    } else {
      setForm({
        id: "",
        name: "",
        image: "",
        description: "",
        deleted: false, // Always false
      });
      setImagePreview("");
    }
  }, [editingTypeProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as any;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async (e: React.MouseEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      try {
        const imageUrl = await uploadProductImage(file);
        setForm({ ...form, image: imageUrl });
        setImagePreview(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure deleted is always false
    const formData = { ...form, deleted: false };
    onSave(formData);
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
              Ảnh
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
              />
              <button
                type="button"
                onClick={handleUploadImage}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Upload
              </button>
            </div>
            {imagePreview && (
              <img
                src={imagePreview}
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