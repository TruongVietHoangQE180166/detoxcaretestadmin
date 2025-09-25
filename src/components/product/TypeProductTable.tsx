import { PencilIcon } from "@heroicons/react/16/solid";
import type { TypeProduct } from "./types";

type Props = {
  typeProducts: TypeProduct[];
  onEdit: (item: TypeProduct) => void;
};

const TypeProductTable = ({ typeProducts, onEdit }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="p-3 font-medium text-sm">#</th>
              <th className="p-3 font-medium text-sm">Ảnh</th>
              <th className="p-3 font-medium text-sm">Tên loại</th>
              <th className="p-3 font-medium text-sm">Mô tả</th>
              <th className="p-3 font-medium text-sm">Trạng thái</th>
              <th className="p-3 font-medium text-sm text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {typeProducts.map((item, index) => (
              <tr key={item.id} className="hover:bg-green-50 transition-colors">
                <td className="p-3 text-sm">{index + 1}</td>
                <td className="p-3">
                  <img
                    src={item.image || "https://via.placeholder.com/64"}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                </td>
                <td className="p-3 text-sm font-medium max-w-xs truncate">{item.name}</td>
                <td className="p-3 text-sm text-gray-600 max-w-xs truncate">{item.description}</td>
                <td className="p-3">
                  {item.deleted ? (
                    <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                      Ngừng
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                      Hoạt động
                    </span>
                  )}
                </td>
                <td className="p-3 align-middle">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="px-3 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      <PencilIcon className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {typeProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500 text-sm">
                  Không có loại sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TypeProductTable;