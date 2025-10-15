// @ts-nocheck
import { Search } from "lucide-react";
import type { Payment } from "./types";
import { useState, useMemo } from "react";

type Props = {
  payments: Payment[];
};

const PaymentTable = ({ payments }: Props) => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof Payment | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Search
  const filteredPayments = useMemo(() => {
    return payments.filter(
      (p) =>
        p.ordersId.toLowerCase().includes(search.toLowerCase()) ||
        p.method.toLowerCase().includes(search.toLowerCase()) ||
        p.status.toLowerCase().includes(search.toLowerCase())
    );
  }, [payments, search]);

  // Sort
  const sortedPayments = useMemo(() => {
    if (!sortField) return filteredPayments;
    return [...filteredPayments].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue! < bValue!) return sortOrder === "asc" ? -1 : 1;
      if (aValue! > bValue!) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredPayments, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedPayments.length / itemsPerPage);
  const paginatedPayments = sortedPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: keyof Payment) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex justify-end">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by Order ID, Method, Status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 p-2 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm text-gray-700"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-xl rounded-xl bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-600 text-white">
              <th
                className="p-4 text-left text-sm font-semibold uppercase tracking-wide cursor-pointer hover:bg-green-700"
                onClick={() => handleSort("ordersId")}
              >
                Order ID {sortField === "ordersId" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="p-4 text-left text-sm font-semibold uppercase tracking-wide cursor-pointer hover:bg-green-700"
                onClick={() => handleSort("amount")}
              >
                Amount {sortField === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-4 text-left text-sm font-semibold uppercase tracking-wide">Method</th>
              <th
                className="p-4 text-left text-sm font-semibold uppercase tracking-wide cursor-pointer hover:bg-green-700"
                onClick={() => handleSort("status")}
              >
                Status {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="p-4 text-left text-sm font-semibold uppercase tracking-wide">QR Code</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPayments.map((p, index) => (
              <tr
                key={`${p.ordersId}-${index}`}
                className={`${
                  index % 2 === 0 ? "bg-green-50/50" : "bg-white"
                } hover:bg-green-100/70 transition-all duration-200`}
              >
                <td className="p-4 text-sm text-gray-800 font-medium border-b border-green-100">
                  {p.ordersId}
                </td>
                <td className="p-4 text-sm text-gray-800 border-b border-green-100">
                  <span className="font-semibold text-green-700">
                    {p.amount.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-700 border-b border-green-100">{p.method}</td>
                <td className="p-4 text-sm border-b border-green-100">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      p.status === "COMPLETED"
                        ? "bg-green-200 text-green-900"
                        : p.status === "PENDING"
                        ? "bg-yellow-200 text-yellow-900"
                        : "bg-red-200 text-red-900"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-700 border-b border-green-100">
                  {p.qrCode ? (
                    <a href={p.qrCode} target="_blank" rel="noopener noreferrer">
                      <img src={p.qrCode} alt="QR" className="w-12 h-12 object-contain" />
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, sortedPayments.length)} of {sortedPayments.length} entries
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentTable;
