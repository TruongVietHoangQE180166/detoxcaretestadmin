import { useEffect, useState } from "react";
import VoucherFormModal from "../components/voucher/VoucherFormModal";
import type { Voucher } from "../components/voucher/types";
import VoucherCard from "../components/voucher/VoucherCard";
import { Ticket, Plus, Search } from "lucide-react";
import { getVouchersAll } from "../services/vouCher";
import { useToast } from "../components/common/ToastContext";

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSave = async (voucher: any) => {
    try {
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
      const data = await getVouchersAll({ page: 1, size: 1000 });
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

  const filteredVouchers = vouchers.filter(voucher => 
    voucher.code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center shadow-md">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Quản lý Voucher
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Tổng số: {vouchers.length} voucher
                </p>
              </div>
            </div>
            <button
              onClick={handleCreate}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-400 text-white font-medium rounded-xl shadow-md hover:bg-green-500 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Tạo Voucher</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm voucher theo mã hoặc mô tả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent shadow-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Vouchers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded-lg w-28"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-24 mt-4"></div>
                </div>
                <div className="flex justify-end mt-6 gap-2">
                  <div className="h-9 bg-gray-200 rounded-lg w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredVouchers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVouchers.map((voucher) => (
              <VoucherCard
                key={voucher.id}
                voucher={voucher}
                onEdit={handleEdit}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Ticket className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {searchQuery ? "Không tìm thấy voucher" : "Chưa có voucher nào"}
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              {searchQuery 
                ? "Không tìm thấy voucher phù hợp với từ khóa của bạn"
                : "Bắt đầu bằng cách tạo voucher đầu tiên của bạn"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreate}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-green-400 text-white font-medium rounded-xl shadow-md hover:bg-green-500 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                <span>Tạo Voucher Đầu Tiên</span>
              </button>
            )}
          </div>
        )}
      </div>

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