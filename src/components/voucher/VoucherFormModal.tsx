import { useState, useEffect, useRef } from "react";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { createVoucher, updateVoucher, uploadVoucherImage } from "../../services/vouCher";
import type { IVoucher } from "../../services/vouCher/IVoucher";
import { useToast } from "../common/ToastContext";
import type { Voucher } from "./types";

type Props = {
  voucher: Voucher | null;
  onSave: (v: Voucher) => void;
  onClose: () => void;
};

const VoucherFormModal = ({ voucher, onSave, onClose }: Props) => {
  const [form, setForm] = useState<IVoucher>({
    code: voucher?.code || "",
    discountValue: voucher?.discountValue || 0,
    minOrderValue: voucher?.minOrderValue || 0,
    image: voucher?.image || "",
    exchangePoint: voucher?.exchangePoint || 0,
    active: voucher?.active || false,
    percentage: voucher?.percentage || false,
  });
  
  const [imagePreview, setImagePreview] = useState<string>(voucher?.image || "");
  const [tempImagePreview, setTempImagePreview] = useState<string>(""); // For temporary preview during upload
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (voucher) {
      setForm({
        code: voucher.code || "",
        discountValue: voucher.discountValue || 0,
        minOrderValue: voucher.minOrderValue || 0,
        image: voucher.image || "",
        exchangePoint: voucher.exchangePoint || 0,
        active: voucher.active || false,
        percentage: voucher.percentage || false,
      });
      setImagePreview(voucher.image || "");
    } else {
      setForm({
        code: "",
        discountValue: 0,
        minOrderValue: 0,
        image: "",
        exchangePoint: 0,
        active: true,
        percentage: false,
      });
      setImagePreview("");
    }
    setTempImagePreview(""); // Clear temporary preview
    setError(null);
  }, [voucher]);

  // Function to handle numeric input changes and remove leading zeros
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof IVoucher) => {
    let value = e.target.value;
    
    // Remove any non-digit characters except for the first character check
    value = value.replace(/\D/g, '');
    
    // Remove leading zeros but allow a single zero
    if (value.length > 1) {
      value = value.replace(/^0+/, '');
    }
    
    // Convert to number
    const numericValue = value ? Number(value) : 0;
    
    setForm(prev => ({ ...prev, [field]: numericValue }));
  };

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
        const imageUrl = await uploadVoucherImage(file);
        // Update the form with the uploaded image URL
        setForm(prev => ({ ...prev, image: imageUrl }));
        setImagePreview(imageUrl);
        setTempImagePreview(""); // Clear temporary preview
        addToast("Upload ảnh thành công!", "success");
      } catch (error: any) {
        addToast(`Lỗi khi upload ảnh: ${error.message || 'Đã có lỗi xảy ra'}`, "error");
        console.error("Error uploading image:", error);
        setImagePreview("");
        setTempImagePreview("");
        setForm(prev => ({ ...prev, image: "" }));
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setForm(prev => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    if (!form.code.trim()) {
      return "Vui lòng nhập mã voucher.";
    }
    
    if (form.discountValue <= 0) {
      return "Giá trị giảm phải lớn hơn 0.";
    }
    
    // Additional validation for percentage discounts
    if (form.percentage && (form.discountValue <= 0 || form.discountValue >= 100)) {
      return "Giá trị giảm phần trăm phải lớn hơn 0 và nhỏ hơn 100.";
    }
    
    if (form.minOrderValue < 0) {
      return "Đơn tối thiểu không được âm.";
    }
    if (form.exchangePoint < 0) {
      return "Điểm đổi không được âm.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      addToast(validationError, "error");
      return;
    }
    
    try {
      let res;
      if (voucher) {
        // Update existing voucher
        res = await updateVoucher(voucher.id.toString(), form);
      } else {
        // Create new voucher
        res = await createVoucher(form);
      }
      
      // Assuming the API returns the created/updated voucher with an ID
      onSave(res.data);
      addToast(`${voucher ? "Cập nhật" : "Tạo"} voucher thành công!`, "success");
      onClose();
    } catch (error: any) {
      addToast(`Lỗi khi ${voucher ? "cập nhật" : "tạo"} voucher: ${error.message || 'Đã có lỗi xảy ra'}`, "error");
      console.error(`Lỗi khi ${voucher ? "cập nhật" : "tạo"} voucher`, error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {voucher ? "Chỉnh sửa Voucher" : "Tạo Voucher"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-2 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Mã voucher */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Mã voucher <span className="text-red-500">*</span>
              </label>
              <input
                name="code"
                value={form.code}
                onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Nhập mã voucher"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Loại voucher - Fixed Amount or Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Loại voucher
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, percentage: false }))}
                  className={`p-3 rounded-lg border transition-all text-sm ${
                    !form.percentage
                      ? "border-green-500 bg-green-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">Giảm giá cố định</h3>
                    <div className="mt-1 text-base font-bold text-green-600">
                      {form.discountValue > 0 && !form.percentage 
                        ? `${form.discountValue.toLocaleString()}₫` 
                        : "Số tiền"}
                    </div>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, percentage: true }))}
                  className={`p-3 rounded-lg border transition-all text-sm ${
                    form.percentage
                      ? "border-green-500 bg-green-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">Giảm theo %</h3>
                    <div className="mt-1 text-base font-bold text-green-600">
                      {form.discountValue > 0 && form.percentage 
                        ? `${form.discountValue}%` 
                        : "Phần trăm"}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Giá trị giảm */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                {form.percentage ? "Phần trăm giảm (%)" : "Giá trị giảm (₫)"} <span className="text-red-500">*</span>
              </label>
              <input
                name="discountValue"
                type="text"
                value={form.discountValue}
                onChange={(e) => handleNumericChange(e, 'discountValue')}
                placeholder={form.percentage ? "Nhập phần trăm (1-99)" : "Nhập số tiền"}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                min={form.percentage ? "1" : "1"}
                max={form.percentage ? "99" : undefined}
              />
              {form.percentage ? (
                <p className="mt-1 text-xs text-gray-500">
                  Nhập giá trị từ 1 đến 99
                </p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  Nhập số tiền giảm giá
                </p>
              )}
            </div>

            {/* Đơn tối thiểu và Điểm đổi - Side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Đơn tối thiểu (₫)
                </label>
                <input
                  name="minOrderValue"
                  type="text"
                  value={form.minOrderValue}
                  onChange={(e) => handleNumericChange(e, 'minOrderValue')}
                  placeholder="Đơn tối thiểu"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Điểm đổi
                </label>
                <input
                  name="exchangePoint"
                  type="text"
                  value={form.exchangePoint}
                  onChange={(e) => handleNumericChange(e, 'exchangePoint')}
                  placeholder="Điểm đổi"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Trạng thái - Checkboxes */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={(e) => setForm(prev => ({ ...prev, active: e.target.checked }))}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
              />
              <label className="ml-2 text-sm text-gray-700">
                Hoạt động
              </label>
            </div>

            {/* Ảnh voucher */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Ảnh voucher
              </label>
              
              {/* Image Preview - Only show after successful upload */}
              {imagePreview && (
                <div className="mb-3 flex justify-center">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* File Input */}
              <div className="flex flex-col gap-2">
                <div>
                  <label className="flex items-center justify-center w-full px-3 py-2 text-sm border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex items-center gap-1 text-gray-600">
                      <PhotoIcon className="w-4 h-4" />
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
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG, GIF (tối đa 5MB)
              </p>
              
              {/* Temporary preview during upload */}
              {tempImagePreview && isUploading && (
                <div className="mt-3 flex justify-center">
                  <div className="relative">
                    <img
                      src={tempImagePreview}
                      alt="Uploading preview"
                      className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 shadow-sm opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-sm"
            >
              {voucher ? "Cập nhật" : "Tạo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoucherFormModal;