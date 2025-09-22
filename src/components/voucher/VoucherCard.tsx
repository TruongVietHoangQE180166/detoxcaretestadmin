import type { Voucher } from "./types";

type Props = {
  voucher: Voucher;
  onEdit: (v: Voucher) => void;
  onDelete: (v: Voucher) => void;
};

const VoucherCard = ({ voucher, onEdit, onDelete }: Props) => {
  // Thêm kiểm tra để tránh lỗi khi giá trị undefined hoặc null
  const formatNumber = (value: number | undefined | null) => {
    return value ? value.toLocaleString() : "0";
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between border border-gray-100 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-green-700 tracking-tight">{voucher?.code || "N/A"}</h2>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Giảm: </span>
          {voucher?.percentage
            ? `${formatNumber(voucher.discountValue)}%`
            : `${formatNumber(voucher.discountValue)}₫`}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Đơn tối thiểu: </span>
          {formatNumber(voucher?.minOrderValue)}₫
        </p>
        {(voucher?.exchangePoint || 0) > 0 ? (
          <p className="text-sm text-blue-600">
            <span className="font-medium">Đổi bằng: </span>
            {voucher.exchangePoint} điểm
          </p>
        ) : (
          <p className="text-sm text-gray-400 invisible">Placeholder</p> 
        )}
        <p
          className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${
            voucher?.active ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          {voucher?.active ? "Đang hoạt động" : "Ngừng hoạt động"}
        </p>
      </div>

      <div className="flex justify-end mt-4 gap-3">
        <button
          onClick={() => voucher && onEdit(voucher)}
          className="px-4 py-1.5 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow-sm flex items-center gap-1.5"
        >
          Sửa
        </button>
        <button
          onClick={() => voucher && onDelete(voucher)}
          className="px-4 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm flex items-center gap-1.5"
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default VoucherCard;