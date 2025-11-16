// @ts-nocheck
import type { Order, OrderDetail } from "./types";

type Props = {
  isOpen: boolean;
  order: Order | null;
  orderDetails: OrderDetail[];
  onClose: () => void;
};

const OrderDetailModal = ({ isOpen, order, orderDetails, onClose }: Props) => {
  if (!isOpen || !order) return null;

  // Calculate subtotal (temporary total) without shipping fee using salePrice or price
  const subtotal = orderDetails.reduce((sum, detail) => {
    // Use salePrice if available and not zero, otherwise use regular price
    const itemPrice = (parseFloat(detail.product.salePrice) > 0) 
      ? parseFloat(detail.product.salePrice) 
      : parseFloat(detail.product.priceProduct);
    return sum + (itemPrice * detail.quantity);
  }, 0);

  // Calculate total amount including shipping fee
  const totalWithShipping = subtotal + (order.shipping_fee || 0);
  
  // Calculate voucher discount
  const voucherDiscount = subtotal - order.total_amount;

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
          <p><span className="font-semibold">Tạm tính:</span> {order.total_amount.toLocaleString()}₫</p>
          {/* Show voucher discount if greater than 0 */}
          {voucherDiscount > 0 && (
            <p><span className="font-semibold">Voucher giảm giá:</span> <span className="text-red-600">-{voucherDiscount.toLocaleString()}₫</span></p>
          )}
          <p><span className="font-semibold">Phí vận chuyển:</span> {(order.shipping_fee || 0).toLocaleString()}₫</p>
          <p><span className="font-semibold">Tổng cộng:</span> {totalWithShipping.toLocaleString()}₫</p>
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
              <th className="p-2 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((detail) => {
              // Use salePrice if available and not zero, otherwise use regular price
              const displayPrice = (parseFloat(detail.product.salePrice) > 0) 
                ? parseFloat(detail.product.salePrice) 
                : parseFloat(detail.product.priceProduct);
              
              return (
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
                  <td className="p-2 text-right">{displayPrice.toLocaleString()}₫</td>
                  <td className="p-2 text-center">{detail.quantity}</td>
                  <td className="p-2 text-right">{(displayPrice * detail.quantity).toLocaleString()}₫</td>
                </tr>
              );
            })}
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