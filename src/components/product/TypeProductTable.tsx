import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import type { TypeProduct } from "./types";

type Props = {
  typeProducts: TypeProduct[];
  onEdit: (tp: TypeProduct) => void;
  onDelete: (tp: TypeProduct) => void;
};

const TypeProductTable = ({ typeProducts, onEdit, onDelete }: Props) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
      <table className="w-full text-left border-collapse min-w-[640px]">
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
          {typeProducts.map((tp, index) => (
            <tr
              key={tp.id}
              className={`border-b border-gray-200 hover:bg-green-50/50 transition-colors duration-150 ${
                index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
              }`}
            >
              <td className="p-4 text-gray-700 text-sm sm:text-base">{index + 1}</td>
              <td className="p-4">
                <img
                  src={tp.image || "https://via.placeholder.com/64"}
                  alt={tp.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover border border-gray-200"
                />
              </td>
              <td className="p-4 text-gray-900 font-medium text-sm sm:text-base">{tp.name}</td>
              <td className="p-4 text-gray-600 text-sm sm:text-base max-w-xs truncate">{tp.description}</td>
              <td className="p-4">
                {tp.is_deleted ? (
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
                  onClick={() => onEdit(tp)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg flex items-center gap-1.5 text-xs sm:text-sm hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                >
                  <PencilIcon className="w-4 h-4" /> Sửa
                </button>
                <button
                  onClick={() => onDelete(tp)}
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