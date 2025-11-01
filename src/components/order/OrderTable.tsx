import { useState, useMemo } from "react";
import type { Order } from "./types";
import { EyeIcon } from "@heroicons/react/24/outline";

// Define the order item type based on the API response
type OrderItem = {
  priceProduct: string;
  salePrice: string;
  productName: string;
  image: string;
  typeProductName: string;
  quantity: number;
  price: number;
};

// Extend the Order type to include order items and other details
type OrderWithItems = Order & {
  orderCode?: string;
  shippingFee?: number;
  expectedDeliveryTime?: string;
  orderItems: OrderItem[];
  createdDate?: string;
};

type Props = {
  orders: OrderWithItems[];
  onView: (order: OrderWithItems) => void;
};

const OrderTable = ({ orders, onView }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"totalAmount" | "status" | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Search and filter
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const term = searchTerm.toLowerCase();
    return orders.filter(
      (order) =>
        order?.id.toLowerCase().includes(term) ||
        order?.address.toLowerCase().includes(term) ||
        order?.numberPhone.toLowerCase().includes(term) ||
        order?.email.toLowerCase().includes(term)
    );
  }, [orders, searchTerm]);

  // Sort
  const sortedOrders = useMemo(() => {
    if (!sortField) return filteredOrders;
    return [...filteredOrders].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "totalAmount") {
        // Calculate total amount including shipping fee for sorting
        const aSubtotal = a.orderItems.reduce((sum, item) => {
          const itemPrice = (parseFloat(item.salePrice) > 0) 
            ? parseFloat(item.salePrice) 
            : parseFloat(item.priceProduct);
          return sum + (itemPrice * item.quantity);
        }, 0);
        const aTotalWithShipping = aSubtotal + (a.shippingFee || 0);
        
        const bSubtotal = b.orderItems.reduce((sum, item) => {
          const itemPrice = (parseFloat(item.salePrice) > 0) 
            ? parseFloat(item.salePrice) 
            : parseFloat(item.priceProduct);
          return sum + (itemPrice * item.quantity);
        }, 0);
        const bTotalWithShipping = bSubtotal + (b.shippingFee || 0);
        
        aValue = aTotalWithShipping;
        bValue = bTotalWithShipping;
      }

      return aValue < bValue
        ? sortDirection === "asc"
          ? -1
          : 1
        : aValue > bValue
        ? sortDirection === "asc"
          ? 1
          : -1
        : 0;
    });
  }, [filteredOrders, sortField, sortDirection]);

  // Handle sort
  const handleSort = (field: "totalAmount" | "status") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-4 font-semibold text-sm">ID</th>
              <th className="p-4 font-semibold text-sm">Email</th>
              <th className="p-4 font-semibold text-sm">Địa chỉ</th>
              <th className="p-4 font-semibold text-sm">SĐT</th>
              <th 
                className="p-4 font-semibold text-sm cursor-pointer hover:bg-gray-800 transition-colors whitespace-nowrap"
                onClick={() => handleSort("status")}
              >
                Trạng thái {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th 
                className="p-4 font-semibold text-sm cursor-pointer hover:bg-gray-800 transition-colors whitespace-nowrap"
                onClick={() => handleSort("totalAmount")}
              >
                Tổng tiền {sortField === "totalAmount" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-4 font-semibold text-sm text-center whitespace-nowrap">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedOrders.map((order, index) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm font-semibold text-gray-900 max-w-[100px] truncate" title={order.orderCode}>
                  {order.orderCode || order.id.slice(0, 8)}
                </td>
                <td className="p-4 text-sm text-gray-600 max-w-[120px] truncate">
                  {order?.email}
                </td>
                <td className="p-4 text-sm text-gray-600 max-w-[150px] truncate" title={order?.address}>
                  {order?.address}
                </td>
                <td className="p-4 text-sm text-gray-600 max-w-[100px] truncate">
                  {order?.numberPhone}
                </td>
                <td className="p-4 text-sm text-gray-600 align-middle">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    order?.status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : order?.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : order?.status === "CANCELLED"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {order?.status === "COMPLETED"
                      ? "Hoàn thành"
                      : order?.status === "PENDING"
                      ? "Đang xử lý"
                      : order?.status === "CANCELLED"
                      ? "Đã hủy"
                      : order?.status || "Chưa xác định"}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600 align-middle">
                  <span className="font-semibold whitespace-nowrap">
                    {(() => {
                      // Calculate total amount including shipping fee
                      const subtotal = order.orderItems.reduce((sum, item) => {
                        // Use salePrice if available and not zero, otherwise use regular price
                        const itemPrice = (parseFloat(item.salePrice) > 0) 
                          ? parseFloat(item.salePrice) 
                          : parseFloat(item.priceProduct);
                        return sum + (itemPrice * item.quantity);
                      }, 0);
                      
                      const totalWithShipping = subtotal + (order.shippingFee || 0);
                      return totalWithShipping.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
                    })()}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600 align-middle">
                  <div className="flex justify-center">
                    <button
                      onClick={() => onView(order)}
                      className="p-2 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-all transform hover:scale-110 shadow-sm"
                      title="Xem chi tiết"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {sortedOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">Không có đơn hàng nào</p>
                    <p className="text-gray-400 text-sm">Các đơn hàng sẽ xuất hiện ở đây</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;