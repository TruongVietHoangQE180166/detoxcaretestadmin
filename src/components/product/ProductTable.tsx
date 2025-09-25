import type { Product } from "./types";

type Props = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

const ProductTable = ({ products, onEdit, onDelete }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="p-3 font-medium text-sm">#</th>
              <th className="p-3 font-medium text-sm">Ảnh</th>
              <th className="p-3 font-medium text-sm">Tên sản phẩm</th>
              <th className="p-3 font-medium text-sm">Loại</th>
              <th className="p-3 font-medium text-sm">Giá gốc</th>
              <th className="p-3 font-medium text-sm">Giá KM</th>
              <th className="p-3 font-medium text-sm">Đã bán</th>
              <th className="p-3 font-medium text-sm">Đánh giá</th>
              <th className="p-3 font-medium text-sm">Trạng thái</th>
              <th className="p-3 font-medium text-sm text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p, index) => (
              <tr key={p.id} className="hover:bg-green-50 transition-colors">
                <td className="p-3 text-sm">{index + 1}</td>
                <td className="p-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                </td>
                <td className="p-3 text-sm font-medium max-w-xs truncate">{p.name}</td>
                <td className="p-3 text-sm text-gray-600 max-w-xs truncate">{p.typeProduct?.name || 'Chưa phân loại'}</td>
                <td className="p-3 text-sm max-w-[120px] truncate">{p.price.toLocaleString()} đ</td>
                <td className="p-3 text-sm text-red-500 font-medium max-w-[120px] truncate">
                  {p.salePrice.toLocaleString()} đ
                </td>
                <td className="p-3 text-sm">{p.statisticsRate?.totalSale || 0}</td>
                <td className="p-3 text-sm">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                    {p.statisticsRate?.averageRate?.toFixed(1) || 0}
                  </span>
                </td>
                <td className="p-3">
                  {p.active ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="p-3 align-middle">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(p)}
                      className="px-3 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={10} className="p-6 text-center text-gray-500 text-sm">
                  Không có sản phẩm nào
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