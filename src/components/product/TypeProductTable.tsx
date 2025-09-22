import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import type { TypeProduct } from "./types";

type Props = {
  typeProducts: TypeProduct[];
  onEdit: (item: TypeProduct) => void;
  onDelete: (item: TypeProduct) => void;
};

const TypeProductTable = ({ typeProducts, onEdit, onDelete }: Props) => {
  console.log("da nhan", typeProducts);
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
      <table className="w-full">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="p-4 font-semibold text-sm sm:text-base">#</th>
            <th className="p-4 font-semibold text-sm sm:text-base">Ảnh</th>
            <th className="p-4 font-semibold text-sm sm:text-base">Tên loại</th>
            <th className="p-4 font-semibold text-sm sm:text-base">Mô tả</th>
            <th className="p-4 font-semibold text-sm sm:text-base">Trạng thái</th>
            <th className="p-4 font-semibold text-sm sm:text-base">Hành động</th>
          </tr>
        </thead>
        <tbody>
         {typeProducts.data.content.map((item, index) => (
           <tr
              key={item.id}
              className={`border-b border-gray-200 hover:bg-green-50/50 transition-colors duration-150 ${
                index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
              }`}
            >
              <td className="p-4 text-gray-700 text-sm sm:text-base">{index + 1}</td>
              <td className="p-4">
                <img
                  src={item.image || "htitems://via.placeholder.com/64"}
                  alt={item.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover border border-gray-200"
                />
              </td>
              <td className="p-4 text-gray-900 font-medium text-sm sm:text-base">{item.name}</td>
              <td className="p-4 text-gray-600 text-sm sm:text-base max-w-xs truncate">{item.description}</td>
              <td className="p-4">
                {item.is_deleted ? (
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs sm:text-sm font-medium">
                    Ngừng
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-xs sm:text-sm font-medium">
                    Hoạt động
                  </span>
                )}
              </td>
              <td className="p-4 flex gap-2 flex-wrap">
                <button
                  onClick={() => onEdit(item)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg flex items-center gap-1.5 text-xs sm:text-sm hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                >
                  <PencilIcon className="w-4 h-4" /> Sửa
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg flex items-center gap-1.5 text-xs sm:text-sm hover:bg-red-700 transition-colors duration-200 shadow-sm"
                >
                  <TrashIcon className="w-4 h-4" /> Xóa
                </button>
              </td>
            </tr>
         ))}
        </tbody>
      </table>
    </div>
  );
};

export default TypeProductTable;