import type { Product } from "./types";

type Props = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

const ProductTable = ({ products, onEdit, onDelete }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <table className="w-full text-left">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="p-4 font-semibold">#</th>
            <th className="p-4 font-semibold">Ảnh</th>
            <th className="p-4 font-semibold">Tên sản phẩm</th>
            <th className="p-4 font-semibold">Loại</th>
            <th className="p-4 font-semibold">Giá gốc</th>
            <th className="p-4 font-semibold">Giá KM</th>
            <th className="p-4 font-semibold">Đã bán</th>
            <th className="p-4 font-semibold">Đánh giá</th>
            <th className="p-4 font-semibold">Trạng thái</th>
            <th className="p-4 font-semibold text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, index) => (
            <tr
              key={p.id}
              className={`border-b border-gray-200 hover:bg-green-50/50 transition-colors duration-150 ${
                index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
              }`}
            >
              <td className="p-4 text-gray-700">{p.id}</td>
              <td className="p-4">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-12 h-12 object-cover rounded-lg shadow"
                />
              </td>
              <td className="p-4 text-gray-900 font-medium">{p.name}</td>
              <td className="p-4 text-gray-700">
                {p.typeProduct?.name || "Không rõ"}
              </td>
              <td className="p-4 text-gray-700">
                {p.price.toLocaleString()}đ
              </td>
              <td className="p-4 text-green-600 font-semibold">
                {p.salePrice.toLocaleString()}đ
              </td>
              <td className="p-4 text-gray-700">{p.sales}</td>
              <td className="p-4 flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                {p.rating.toFixed(1)}
              </td>
              <td className="p-4">
                {p.isActive ? (
                  <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700">
                    Stop
                  </span>
                )}
              </td>
              <td className="p-4 text-center space-x-3">
                <button
                  onClick={() => onEdit(p)}
                  className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                >
                  Sửa
                </button>
                <button
                  onClick={() => onDelete(p)}
                  className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
