import { useState, useEffect, useRef } from "react";
import type { Product, TypeProduct } from "./types";
import { uploadProductImage } from "../../services/product/productService";
import { XMarkIcon, PhotoIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useToast } from "../common/ToastContext";

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
  const [tempImagePreview, setTempImagePreview] = useState<string>(""); // For temporary preview during upload
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTypeProductOpen, setIsTypeProductOpen] = useState(false);
  const typeProductRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeProductRef.current && !typeProductRef.current.contains(event.target as Node)) {
        setIsTypeProductOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    setTempImagePreview(""); // Clear temporary preview
    setError(null);
  }, [editingProduct]);

  if (!isOpen) return null;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create temporary preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Automatically upload the image
      try {
        setIsUploading(true);
        const imageUrl = await uploadProductImage(file);
        setForm({ ...form, image: imageUrl });
        setImagePreview(imageUrl); // Set the final preview only after successful upload
        setTempImagePreview(""); // Clear temporary preview
        addToast("Upload ảnh thành công!", "success");
      } catch (error) {
        console.error("Error uploading image:", error);
        addToast("Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.", "error");
        setImagePreview("");
        setTempImagePreview("");
        setForm({ ...form, image: "" });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } finally {
        setIsUploading(false);
      }
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = !!editingProduct;
    const validationError = validateForm(isEditing);
    
    if (validationError) {
      setError(validationError);
      addToast(validationError, "error");
      return;
    }
    
    setError(null);
    
    try {
      onSave(form);
      addToast(
        isEditing 
          ? "Cập nhật sản phẩm thành công!" 
          : "Thêm sản phẩm thành công!", 
        "success"
      );
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      addToast("Có lỗi xảy ra khi lưu sản phẩm. Vui lòng thử lại.", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
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
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-5">
              {/* Tên sản phẩm */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>

              {/* Loại sản phẩm - Custom Dropdown */}
              <div ref={typeProductRef}>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Loại sản phẩm <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsTypeProductOpen(!isTypeProductOpen)}
                    className="w-full px-4 py-3 text-left border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all bg-white flex justify-between items-center"
                  >
                    <span className={form.typeProduct?.id ? "text-gray-900" : "text-gray-400"}>
                      {form.typeProduct?.name || "-- Chọn loại sản phẩm --"}
                    </span>
                    <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isTypeProductOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isTypeProductOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                      <div 
                        className="px-4 py-2 text-sm text-gray-500 cursor-pointer hover:bg-green-50"
                        onClick={() => {
                          setForm({ ...form, typeProduct: undefined });
                          setIsTypeProductOpen(false);
                        }}
                      >
                        -- Chọn loại sản phẩm -- 
                      </div>
                      {typeProducts.map(tp => (
                        <div
                          key={tp.id}
                          className="px-4 py-2 text-sm cursor-pointer hover:bg-green-50 hover:text-gray-900"
                          onClick={() => {
                            setForm({ ...form, typeProduct: tp });
                            setIsTypeProductOpen(false);
                          }}
                        >
                          {tp.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all resize-none"
                  placeholder="Nhập mô tả sản phẩm"
                  rows={3}
                />
              </div>
            </div>

            {/* Right Column - Other Fields */}
            <div className="space-y-5">
              {/* Giá gốc */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Giá gốc (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                  placeholder="Nhập giá gốc"
                  required
                />
              </div>

              {/* Giá khuyến mãi */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Giá khuyến mãi (VNĐ)
                </label>
                <input
                  type="number"
                  value={form.salePrice}
                  onChange={(e) => setForm({ ...form, salePrice: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                  placeholder="Nhập giá khuyến mãi"
                />
              </div>

              {/* Trạng thái - Checkbox */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Trạng thái
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>

              {/* Ảnh sản phẩm */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Ảnh sản phẩm
                </label>
                
                {/* Image Preview - Only show after successful upload */}
                {imagePreview && (
                  <div className="mb-4 flex justify-center">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-xl border-4 border-gray-200 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setForm({ ...form, image: "" });
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* File Input */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PhotoIcon className="w-5 h-5" />
                        <span className="font-medium">
                          {isUploading ? "Đang tải..." : "Chọn ảnh"}
                        </span>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Định dạng: JPG, PNG, GIF. Kích thước tối đa: 5MB
                </p>
                
                {/* Temporary preview during upload */}
                {tempImagePreview && isUploading && (
                  <div className="mt-4 flex justify-center">
                    <div className="relative">
                      <img
                        src={tempImagePreview}
                        alt="Uploading preview"
                        className="w-32 h-32 object-cover rounded-xl border-4 border-gray-200 shadow-md opacity-50"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
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
              {editingProduct ? "Cập nhật" : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;