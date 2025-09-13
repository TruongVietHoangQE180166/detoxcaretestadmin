import type { Voucher } from "./types";

type Props = {
  voucher: Voucher;
  onEdit: (v: Voucher) => void;
  onDelete: (v: Voucher) => void;
};

const VoucherCard = ({ voucher, onEdit, onDelete }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between border border-gray-100 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-green-700 tracking-tight">{voucher.code}</h2>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Giảm: </span>
          {voucher.is_percentage
            ? `${voucher.discount_value}%`
            : `${voucher.discount_value.toLocaleString()}₫`}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Đơn tối thiểu: </span>
          {voucher.min_order_value.toLocaleString()}₫
        </p>
        {voucher.exchange_point > 0 ? (
          <p className="text-sm text-blue-600">
            <span className="font-medium">Đổi bằng: </span>
            {voucher.exchange_point} điểm
          </p>
        ) : (
          <p className="text-sm text-gray-400 invisible">Placeholder</p> 
        )}
        <p
          className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${
            voucher.is_active ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          {voucher.is_active ? "Đang hoạt động" : "Ngừng hoạt động"}
        </p>
      </div>

      <div className="flex justify-end mt-4 gap-3">
        <button
          onClick={() => onEdit(voucher)}
          className="px-4 py-1.5 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow-sm flex items-center gap-1.5"
        >
          Sửa
        </button>
        <button
          onClick={() => onDelete(voucher)}
          className="px-4 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm flex items-center gap-1.5"
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default VoucherCard;