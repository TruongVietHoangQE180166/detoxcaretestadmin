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
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="p-4">{index + 1}</td>
              <td className="p-4">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              </td>
              <td className="p-4">{p.name}</td>
              <td className="p-4">{p.typeProduct?.name}</td>
              <td className="p-4">{p.price.toLocaleString()} đ</td>
              <td className="p-4 text-red-500">
                {p.salePrice.toLocaleString()} đ
              </td>
              <td className="p-4">{p.sales}</td>
              <td className="p-4">{p.rating}</td>
              <td className="p-4">
                {p.isActive ? (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                    Hoạt động
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-lg text-sm">
                    Ẩn
                  </span>
                )}
              </td>
              <td className="p-4 flex justify-center gap-3">
                <button
                  onClick={() => onEdit(p)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Sửa
                </button>
                <button
                  onClick={() => onDelete(p)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan={10} className="p-6 text-center text-gray-500">
                Không có sản phẩm nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
