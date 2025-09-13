import { useState, useMemo } from "react";
import type { Order } from "./types";

type Props = {
  orders: Order[];
  onView: (order: Order) => void;
};

const OrderTable = ({ orders, onView }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"created_date" | "total_amount" | "order_status" | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const ordersPerPage = 5;

  // Search and filter
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const term = searchTerm.toLowerCase();
    return orders.filter((order) =>
      order.user_id.toLowerCase().includes(term) ||
      order.address.toLowerCase().includes(term) ||
      order.number_phone.toLowerCase().includes(term)
    );
  }, [orders, searchTerm]);

  // Sort
  const sortedOrders = useMemo(() => {
    if (!sortField) return filteredOrders;
    return [...filteredOrders].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      if (sortField === "total_amount") {
        aValue = aValue || 0;
        bValue = bValue || 0;
      } else if (sortField === "created_date") {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }
      return aValue < bValue ? (sortDirection === "asc" ? -1 : 1) : aValue > bValue ? (sortDirection === "asc" ? 1 : -1) : 0;
    });
  }, [filteredOrders, sortField, sortDirection]);

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle sort
  const handleSort = (field: "created_date" | "total_amount" | "order_status") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Box */}
      <div className="flex justify-end">
        <div className="relative w-full max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo User ID, Địa chỉ hoặc SĐT..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 w-full border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 text-sm text-gray-700 bg-white shadow-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-xl rounded-xl bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="p-4 text-left text-sm font-semibold uppercase tracking-wide">ID</th>
              <th className="p-4 text-left text-sm font-semibold uppercase tracking-wide">User ID</th>
              <th className="p-4 text-left text-sm font-semibold uppercase tracking-wide">Địa chỉ</th>
              <th className="p-4 text-left text-sm font-semibold uppercase tracking-wide">SĐT</th>
              <th
                className="p-4 text-left text-sm font-semibold uppercase tracking-wide cursor-pointer hover:bg-green-700 transition-colors duration-150"
                onClick={() => handleSort("order_status")}
              >
                Trạng thái {sortField === "order_status" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-4 text-left text-sm font-semibold uppercase tracking-wide cursor-pointer hover:bg-green-700 transition-colors duration-150"
                onClick={() => handleSort("total_amount")}
              >
                Tổng tiền {sortField === "total_amount" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-4 text-left text-sm font-semibold uppercase tracking-wide cursor-pointer hover:bg-green-700 transition-colors duration-150"
                onClick={() => handleSort("created_date")}
              >
                Ngày tạo {sortField === "created_date" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-4 text-center text-sm font-semibold uppercase tracking-wide">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <tr
                key={order.id}
                className={`${
                  index % 2 === 0 ? "bg-green-50/50" : "bg-white"
                } hover:bg-green-100/70 transition-all duration-200 ease-in-out transform hover:scale-[1.002] borderвью
                `}
              >
                <td className="p-4 text-sm text-gray-800 font-medium border-b border-green-100">{order.id}</td>
                <td className="p-4 text-sm text-gray-700 border-b border-green-100">{order.user_id}</td>
                <td className="p-4 text-sm text-gray-700 border-b border-green-100">{order.address}</td>
                <td className="p-4 text-sm text-gray-700 border-b border-green-100">{order.number_phone}</td>
                <td className="p-4 text-sm border-b border-green-100">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.order_status === "COMPLETED"
                        ? "bg-green-200 text-green-900"
                        : order.order_status === "PENDING"
                        ? "bg-yellow-200 text-yellow-900"
                        : "bg-red-200 text-red-900"
                    }`}
                  >
                    {order.order_status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-700 border-b border-green-100">
                  <span className="font-semibold text-green-700">
                    {order.total_amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-700 border-b border-green-100">
                  {new Date(order.created_date).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="p-4 text-center border-b border-green-100">
                  <button
                    onClick={() => onView(order)}
                    className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 px-4">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, sortedOrders.length)} of {sortedOrders.length} entries
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                currentPage === number
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-green-100"
              } transition-colors duration-200`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;