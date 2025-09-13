import { useState } from "react";
import type { Voucher } from "./types";

type Props = {
  voucher: Voucher | null;
  onSave: (v: Voucher) => void;
  onClose: () => void;
};

const VoucherFormModal = ({ voucher, onSave, onClose }: Props) => {
  const [form, setForm] = useState<Voucher>(
    voucher || {
      id: 0,
      code: "",
      discount_value: 0,
      is_active: true,
      is_percentage: false,
      min_order_value: 0,
      exchange_point: 0,
      image: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      discount_value: Number(form.discount_value),
      min_order_value: Number(form.min_order_value),
      exchange_point: Number(form.exchange_point),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {voucher ? "Chỉnh sửa Voucher" : "Tạo Voucher"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã voucher
            </label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Nhập mã voucher"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá trị giảm
            </label>
            <input
              name="discount_value"
              type="number"
              value={form.discount_value}
              onChange={handleChange}
              placeholder="Nhập giá trị giảm"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đơn tối thiểu
            </label>
            <input
              name="min_order_value"
              type="number"
              value={form.min_order_value}
              onChange={handleChange}
              placeholder="Nhập đơn tối thiểu"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Điểm đổi
            </label>
            <input
              name="exchange_point"
              type="number"
              value={form.exchange_point}
              onChange={handleChange}
              placeholder="Nhập điểm đổi"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link hình ảnh
            </label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Nhập link hình ảnh"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
            />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />{" "}
              Hoạt động
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="is_percentage"
                checked={form.is_percentage}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />{" "}
              % Giảm giá
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200 shadow-sm"
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

export default VoucherFormModal;