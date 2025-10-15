import type { Voucher } from "./types";

type Props = {
  voucher: Voucher;
  onEdit: (v: Voucher) => void;
  // Removed onDelete prop since we're removing delete functionality
};

// Removed onDelete from the props destructuring
const VoucherCard = ({ voucher, onEdit }: Props) => {
  const formatNumber = (value: number | undefined | null) => {
    return value ? value.toLocaleString() : "0";
  };

  const hasImage = voucher?.image && voucher.image.trim() !== "";

  return (
    <div className="group relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      {/* Background Image hoặc Gray Background */}
      <div className="relative h-36 overflow-hidden">
        {hasImage ? (
          <>
            <img
              src={voucher.image}
              alt={voucher.code}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-bold shadow backdrop-blur-sm ${
              voucher?.active
                ? "bg-green-400 text-black"
                : "bg-gray-800 text-white"
            }`}
          >
            {voucher?.active ? "ĐANG HOẠT ĐỘNG" : "NGỪNG HOẠT ĐỘNG"}
          </span>
        </div>

        {/* Voucher Code */}
        <div className="absolute bottom-3 left-3 right-3">
          <h2 className="text-lg font-bold text-white tracking-wide drop-shadow">
            {voucher?.code || "N/A"}
          </h2>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Discount Value */}
        <div className="flex items-center justify-between p-3 bg-green-400/10 rounded-lg border border-green-400/30">
          <span className="text-xs font-medium text-gray-700">Giảm giá</span>
          <span className="text-lg font-bold text-green-400">
            {voucher?.percentage
              ? `${formatNumber(voucher.discountValue)}%`
              : `${formatNumber(voucher.discountValue)}₫`}
          </span>
        </div>

        {/* Min Order Value */}
        <div className="flex items-center justify-between py-2 border-b border-gray-200">
          <span className="text-xs font-medium text-gray-700">Đơn tối thiểu</span>
          <span className="text-sm font-semibold text-black">
            {formatNumber(voucher?.minOrderValue)}₫
          </span>
        </div>

        {/* Exchange Points */}
        {(voucher?.exchangePoint || 0) > 0 && (
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-xs font-medium text-gray-700">Đổi điểm</span>
            <span className="text-sm font-semibold text-green-400">
              {voucher.exchangePoint} điểm
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons - Only Edit button remains */}
      <div className="px-4 pb-4">
        <button
          onClick={() => voucher && onEdit(voucher)}
          className="w-full px-3 py-2 text-xs font-bold bg-black text-white border border-black rounded-lg hover:bg-white hover:text-black transition-all duration-200 shadow hover:shadow-md"
        >
          SỬA
        </button>
      </div>
    </div>
  );
};

export default VoucherCard;