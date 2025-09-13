import type { Order, OrderDetail } from "./types";

type Props = {
  isOpen: boolean;
  order: Order | null;
  orderDetails: OrderDetail[];
  onClose: () => void;
};

const OrderDetailModal = ({ isOpen, order, orderDetails, onClose }: Props) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-[700px] max-h-[80vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Chi tiết Order #{order.id}
        </h2>

        <div className="space-y-2 mb-4 text-sm text-gray-700">
          <p><span className="font-semibold">User ID:</span> {order.user_id}</p>
          <p><span className="font-semibold">Địa chỉ:</span> {order.address}</p>
          <p><span className="font-semibold">SĐT:</span> {order.number_phone}</p>
          <p><span className="font-semibold">Trạng thái:</span> {order.order_status}</p>
          <p><span className="font-semibold">Tổng tiền:</span> {order.total_amount.toLocaleString()}₫</p>
        </div>

        <h3 className="text-lg font-semibold mb-2">Danh sách sản phẩm</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Ảnh</th>
              <th className="p-2 text-left">Tên sản phẩm</th>
              <th className="p-2 text-left">Loại</th>
              <th className="p-2 text-right">Giá</th>
              <th className="p-2 text-center">Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((detail) => (
              <tr key={detail.id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <img
                    src={detail.product.image}
                    alt={detail.product.name}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                </td>
                <td className="p-2">{detail.product.name}</td>
                <td className="p-2">{detail.product.typeProduct?.name}</td>
                <td className="p-2 text-right">{detail.price.toLocaleString()}₫</td>
                <td className="p-2 text-center">{detail.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
