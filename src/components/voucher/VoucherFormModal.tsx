import { useState, useEffect, useRef } from "react";
import { XMarkIcon, PhotoIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";
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
    setError(null);
  }, [voucher]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
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

  const handleUploadImage = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const imageUrl = await uploadVoucherImage(file);
        // Update the form with the uploaded image URL
        setForm(prev => ({ ...prev, image: imageUrl }));
        setImagePreview(imageUrl);
        addToast("Upload ảnh thành công!", "success");
      } catch (error: any) {
        addToast(`Lỗi khi upload ảnh: ${error.message || 'Đã có lỗi xảy ra'}`, "error");
        console.error("Error uploading image:", error);
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
      onClose();
      // The parent component will handle the toast notification
    } catch (error: any) {
      // The parent component will handle the toast notification
      console.error(`Lỗi khi ${voucher ? "cập nhật" : "tạo"} voucher`, error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {voucher ? "Chỉnh sửa Voucher" : "Tạo Voucher"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-5">
              {/* Mã voucher */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mã voucher <span className="text-red-500">*</span>
                </label>
                <input
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="Nhập mã voucher"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Giá trị giảm */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Giá trị giảm <span className="text-red-500">*</span>
                </label>
                <input
                  name="discountValue"
                  type="number"
                  value={form.discountValue}
                  onChange={handleChange}
                  placeholder="Nhập giá trị giảm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Đơn tối thiểu */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Đơn tối thiểu
                </label>
                <input
                  name="minOrderValue"
                  type="number"
                  value={form.minOrderValue}
                  onChange={handleChange}
                  placeholder="Nhập đơn tối thiểu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>

              {/* Điểm đổi */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Điểm đổi
                </label>
                <input
                  name="exchangePoint"
                  type="number"
                  value={form.exchangePoint}
                  onChange={handleChange}
                  placeholder="Nhập điểm đổi"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Right Column - Other Fields */}
            <div className="space-y-5">
              {/* Trạng thái - Checkboxes */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Trạng thái
                </label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="active"
                      checked={form.active}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Hoạt động
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="percentage"
                      checked={form.percentage}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      % Giảm giá
                    </label>
                  </div>
                </div>
              </div>

              {/* Ảnh voucher */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Ảnh voucher
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
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
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
              {voucher ? "Cập nhật" : "Tạo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoucherFormModal;