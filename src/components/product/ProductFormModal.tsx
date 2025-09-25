import { useState, useEffect, useRef } from "react";
import type { Product, TypeProduct } from "./types";
import { uploadProductImage } from "../../services/product/productService";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  editingProduct?: Product | null;
  typeProducts?: TypeProduct[]; // danh sách loại sản phẩm truyền từ ngoài
};

const ProductFormModal = ({ isOpen, onClose, onSave, editingProduct, typeProducts = [] }: Props) => {
  const [form, setForm] = useState<Product>({
    id: "",
    name: "",
    price: 0,
    salePrice: 0,
    image: "",
    description: "",
    active: true,
    typeProduct: undefined,
    statisticsRate: {
      totalRate: 0,
      averageRate: 0,
      totalSale: 0
    }
  });
  
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
      setImagePreview(editingProduct.image || "");
    } else {
      setForm({
        id: "",
        name: "",
        price: 0,
        salePrice: 0,
        image: "",
        description: "",
        active: true,
        typeProduct: undefined,
        statisticsRate: {
          totalRate: 0,
          averageRate: 0,
          totalSale: 0
        }
      });
      setImagePreview("");
    }
    setError(null);
  }, [editingProduct]);

  if (!isOpen) return null;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image
    setIsUploading(true);
    setError(null);
    try {
      const imageUrl = await uploadProductImage(file);
      setForm({ ...form, image: imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Không thể tải ảnh lên. Vui lòng thử lại.");
      setImagePreview("");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const validateForm = (isEditing: boolean) => {
    // Common validations for both editing and creating
    if (form.price <= 0) {
      return "Vui lòng nhập giá gốc hợp lệ.";
    }
    if (form.salePrice < 0) {
      return "Giá khuyến mãi không được âm.";
    }
    if (form.salePrice >= form.price) {
      return "Giá khuyến mãi phải thấp hơn giá gốc.";
    }
    
    if (isEditing) {
      // For editing, we just need to ensure we have an ID
      if (!form.id) {
        return "Không tìm thấy ID sản phẩm.";
      }
      return null;
    } else {
      // For creating new product, all fields are required
      if (!form.name.trim()) {
        return "Vui lòng nhập tên sản phẩm.";
      }
      if (!form.typeProduct?.id) {
        return "Vui lòng chọn loại sản phẩm.";
      }
      if (!form.image) {
        return "Vui lòng chọn ảnh sản phẩm.";
      }
      return null;
    }
  };

  const handleSubmit = () => {
    const isEditing = !!editingProduct;
    const validationError = validateForm(isEditing);
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError(null);
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Form Fields */}
          <div className="space-y-5">
            {/* Tên sản phẩm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên sản phẩm
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition"
                placeholder="Nhập tên sản phẩm"
              />
            </div>

            {/* Loại sản phẩm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại sản phẩm
              </label>
              <select
                value={form.typeProduct?.id || ""}
                onChange={(e) => {
                  const selected = typeProducts.find(tp => tp.id === e.target.value);
                  setForm({ ...form, typeProduct: selected });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition"
              >
                <option value="">-- Chọn loại sản phẩm --</option>
                {typeProducts.map(tp => (
                  <option key={tp.id} value={tp.id}>
                    {tp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mô tả */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition"
                placeholder="Nhập mô tả sản phẩm"
                rows={3}
              />
            </div>

            {/* Giá gốc */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá gốc (VNĐ)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition"
                placeholder="Nhập giá gốc"
              />
            </div>

            {/* Giá khuyến mãi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá khuyến mãi (VNĐ)
              </label>
              <input
                type="number"
                value={form.salePrice}
                onChange={(e) => setForm({ ...form, salePrice: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition"
                placeholder="Nhập giá khuyến mãi"
              />
            </div>

            {/* Trạng thái */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={form.active ? "true" : "false"}
                onChange={(e) =>
                  setForm({ ...form, active: e.target.value === "true" })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition"
              >
                <option value="true">Active</option>
                <option value="false">Stop</option>
              </select>
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="space-y-5">
            {/* Ảnh sản phẩm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh sản phẩm
              </label>
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              
              {/* Custom upload button */}
              <div className="flex items-center gap-3 mb-4">
                <button
                  type="button"
                  onClick={triggerFileSelect}
                  disabled={isUploading}
                  className={`px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUploading ? "Đang tải lên..." : "Chọn ảnh"}
                </button>
                {form.image && (
                  <span className="text-sm text-gray-600 truncate flex-1">
                    {form.image.split('/').pop()}
                  </span>
                )}
              </div>
              
              {/* Image preview - wider and shorter */}
              {(imagePreview || form.image) && (
                <div className="flex justify-center">
                  <img
                    src={imagePreview || form.image}
                    alt="Preview"
                    className="w-full max-w-xs h-48 object-contain rounded-lg border-2 border-green-200 shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/150?text=No+Image";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition"
          >
            {editingProduct ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;