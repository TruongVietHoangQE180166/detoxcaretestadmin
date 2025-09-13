import { useState, useEffect } from "react";
import type { Product, TypeProduct } from "./types";

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
    sales: 0,
    rating: 0,
    image: "",
    isActive: true,
    typeProduct: undefined,
  });

  useEffect(() => {
    if (editingProduct) {
      setForm(editingProduct);
    } else {
      setForm({
        id: "",
        name: "",
        price: 0,
        salePrice: 0,
        sales: 0,
        rating: 0,
        image: "",
        isActive: true,
        typeProduct: undefined,
      });
    }
  }, [editingProduct]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[420px]">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">
          {editingProduct ? " Cập nhật sản phẩm" : " Thêm sản phẩm"}
        </h2>

        <div className="space-y-4">
          {/* Tên sản phẩm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          {/* Loại sản phẩm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại sản phẩm
            </label>
            <select
              value={form.typeProduct?.id || ""}
              onChange={(e) => {
                const selected = typeProducts.find(tp => tp.id === String(e.target.value));
                setForm({ ...form, typeProduct: selected });
              }}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="">-- Chọn loại sản phẩm --</option>
              {typeProducts.map(tp => (
                <option key={tp.id} value={tp.id}>
                  {tp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Giá gốc */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá gốc (VNĐ)
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Nhập giá gốc"
            />
          </div>

          {/* Giá khuyến mãi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá khuyến mãi (VNĐ)
            </label>
            <input
              type="number"
              value={form.salePrice}
              onChange={(e) => setForm({ ...form, salePrice: Number(e.target.value) })}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Nhập giá khuyến mãi"
            />
          </div>

          {/* Ảnh sản phẩm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh sản phẩm (URL)
            </label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Dán link ảnh vào đây"
            />
            {form.image && (
              <div className="mt-3 flex justify-center">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/150?text=No+Image";
                  }}
                />
              </div>
            )}
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              value={form.isActive ? "true" : "false"}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.value === "true" })
              }
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="true">Active</option>
              <option value="false">Stop</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6 border-t pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;
