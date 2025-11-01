import { useState, useEffect, useRef } from "react";
import type { TypeProduct } from "./types";
import { uploadProductImage } from "../../services/product/productService";
import { XMarkIcon, CloudArrowUpIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useToast } from "../common/ToastContext";

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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();
  const isEditing = !!editingTypeProduct;

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
        setIsUploading(true);
        const imageUrl = await uploadProductImage(file);
        setForm({ ...form, image: imageUrl });
        setImagePreview(imageUrl);
        addToast("Upload ảnh thành công!", "success");
      } catch (error) {
        console.error("Error uploading image:", error);
        addToast("Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.", "error");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure deleted is always false
    const formData = { ...form, deleted: false };
    
    try {
      onSave(formData);
      addToast(
        isEditing 
          ? "Cập nhật loại sản phẩm thành công!" 
          : "Thêm loại sản phẩm thành công!", 
        "success"
      );
      onClose();
    } catch (error) {
      console.error("Error saving type product:", error);
      addToast("Có lỗi xảy ra khi lưu loại sản phẩm. Vui lòng thử lại.", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingTypeProduct ? "Sửa loại sản phẩm" : "Thêm loại sản phẩm"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tên loại sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập tên loại sản phẩm"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Image Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Ảnh loại sản phẩm
            </label>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-xl border-4 border-gray-200 shadow-md"
                  />
                  <div className="absolute -top-2 -right-2 bg-green-400 text-white p-1 rounded-full">
                    <PhotoIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )}

            {/* File Input + Upload Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhotoIcon className="w-5 h-5" />
                    <span className="font-medium">Chọn ảnh</span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={handleUploadImage}
                disabled={isUploading || !fileInputRef.current?.files?.[0]}
                className="px-6 py-3 bg-green-400 text-white font-semibold rounded-xl hover:bg-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tải...</span>
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="w-5 h-5" />
                    <span>Upload</span>
                  </>
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Định dạng: JPG, PNG, GIF. Kích thước tối đa: 5MB
            </p>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Mô tả
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Nhập mô tả chi tiết về loại sản phẩm"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all resize-none"
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-semibold bg-green-400 text-white rounded-xl hover:bg-green-500 transition-all shadow-sm transform hover:scale-105"
            >
              {editingTypeProduct ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TypeProductFormModal;