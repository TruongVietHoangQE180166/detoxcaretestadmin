import type { Product } from "./types";
import { PencilSquareIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

type Props = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onViewDetails: (product: Product) => void;
};

const ProductTable = ({ products, onEdit, onDelete, onViewDetails }: Props) => {
  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-4 font-semibold text-sm">Ảnh</th>
              <th className="p-4 font-semibold text-sm">Tên sản phẩm</th>
              <th className="p-4 font-semibold text-sm">Loại</th>
              <th className="p-4 font-semibold text-sm">Giá gốc</th>
              <th className="p-4 font-semibold text-sm">Giá KM</th>
              <th className="p-4 font-semibold text-sm">Trạng thái</th>
              <th className="p-4 font-semibold text-sm text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((p, index) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-4 text-sm font-semibold text-gray-900 max-w-xs truncate">
                  {p.name}
                </td>
                <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                  {p.typeProduct?.name || (
                    <span className="text-gray-400 italic">Chưa phân loại</span>
                  )}
                </td>
                <td className="p-4 text-sm text-gray-600 max-w-[120px] truncate">
                  {p.price.toLocaleString()} đ
                </td>
                <td className="p-4 text-sm text-green-400 font-bold max-w-[120px] truncate">
                  {p.salePrice.toLocaleString()} đ
                </td>
                <td className="p-4">
                  {p.active ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold border border-green-200">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold border border-gray-300">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      Inactive
                    </span>
                  )}
                </td>
                <td className="p-4 align-middle">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onViewDetails(p)}
                      className="p-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all transform hover:scale-110 shadow-sm"
                      title="Xem chi tiết"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(p)}
                      className="p-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-all transform hover:scale-110 shadow-sm"
                      title="Chỉnh sửa"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      className="p-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-all transform hover:scale-110 shadow-sm"
                      title="Xóa"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">Không có sản phẩm nào</p>
                    <p className="text-gray-400 text-sm">Thêm sản phẩm mới để bắt đầu</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;