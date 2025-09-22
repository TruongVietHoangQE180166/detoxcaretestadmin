import { useEffect, useState } from "react";
import VoucherFormModal from "../components/voucher/VoucherFormModal";
import type { Voucher } from "../components/voucher/types";
import VoucherCard from "../components/voucher/VoucherCard";
import { Ticket } from "lucide-react";
import { getVouchersAll } from "../services/vouCher";
import { useToast } from "../components/common/ToastContext";

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = () => {
    setSelectedVoucher(null);
    setIsModalOpen(true);
  };

  const handleEdit = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleDelete = (voucher: Voucher) => {
    if (confirm(`Bạn có chắc chắn muốn xóa voucher ${voucher.code}?`)) {
      setVouchers((prev) => prev.filter((v) => v.id !== voucher.id));
      // TODO: call API xóa ở đây nếu có
    }
  };

  const handleSave = async (voucher: Voucher) => {
    try {
      // Sau khi lưu thành công, gọi lại API để lấy danh sách mới nhất
      await getAllVouchers();
      setIsModalOpen(false);
      addToast("Cập nhật voucher thành công!", "success");
    } catch (error) {
      addToast("Có lỗi xảy ra khi cập nhật danh sách voucher", "error");
    }
  };

  const getAllVouchers = async () => {
    try {
      setIsLoading(true);
      const data = await getVouchersAll({ page: 1, size: 10 });
      setVouchers(data.data.content);
    } catch (error) {
      addToast("Lỗi khi tải voucher", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllVouchers();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-600 flex items-center gap-3">
          <Ticket className="w-7 h-7" />
          Quản lý Voucher
        </h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          + Tạo Voucher
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between border border-gray-100 animate-pulse">
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
                <div className="h-4 bg-gray-200 rounded w-28"></div>
                <div className="h-5 bg-gray-200 rounded-full w-24"></div>
              </div>
              <div className="flex justify-end mt-4 gap-3">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {vouchers.length > 0 ? (
            vouchers.map((voucher) => (
              <VoucherCard
                key={voucher.id}
                voucher={voucher}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Không có voucher nào
            </p>
          )}
        </div>
      )}

      {isModalOpen && (
        <VoucherFormModal
          voucher={selectedVoucher}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default VoucherManagement;
