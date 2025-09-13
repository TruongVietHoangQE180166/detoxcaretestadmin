import { useState } from "react";
import VoucherFormModal from "../components/voucher/VoucherFormModal";
import type { Voucher } from "../components/voucher/types";
import VoucherCard from "../components/voucher/VoucherCard";
import { Ticket } from "lucide-react";

const dummyVouchers: Voucher[] = [
    {
        id: 1,
        code: "THUONGPROVIP",
        discount_value: 5000,
        is_active: true,
        is_percentage: false,
        min_order_value: 30000,
        exchange_point: 0,
        image: "https://via.placeholder.com/150",
    },
    {
        id: 2,
        code: "THUONGPRO",
        discount_value: 10000,
        is_active: true,
        is_percentage: false,
        min_order_value: 30000,
        exchange_point: 0,
        image: "https://via.placeholder.com/150",
    },
];

const VoucherManagement = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>(dummyVouchers);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            setVouchers(vouchers.filter((v) => v.id !== voucher.id));
        }
    };

    const handleSave = (voucher: Voucher) => {
        if (voucher.id) {
            setVouchers(vouchers.map((v) => (v.id === voucher.id ? voucher : v)));
        } else {
            const newVoucher = { ...voucher, id: Date.now() };
            setVouchers([...vouchers, newVoucher]);
        }
        setIsModalOpen(false);
    };

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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {vouchers.map((voucher) => (
                    <VoucherCard
                        key={voucher.id}
                        voucher={voucher}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
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
