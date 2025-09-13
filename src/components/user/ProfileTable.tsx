import { useState, useMemo } from "react";
import type { Profile } from "./types";

interface Props {
  profiles: Profile[];
}

const ProfileTable = ({ profiles }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"date_of_birth" | "gender" | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const profilesPerPage = 5;

  // Hàm xử lý tìm kiếm và sắp xếp
  const processedProfiles = useMemo(() => {
    let result = [...profiles];

    // Tìm kiếm
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((p) =>
        p.user_id.toLowerCase().includes(term) ||
        p.full_name.toLowerCase().includes(term) ||
        (p.phone_number && p.phone_number.toLowerCase().includes(term))
      );
    }

    // Sắp xếp
    if (sortField) {
      result.sort((a, b) => {
        const aValue = sortField === "date_of_birth" ? (a[sortField] ? new Date(a[sortField]).getTime() : 0) : a[sortField];
        const bValue = sortField === "date_of_birth" ? (b[sortField] ? new Date(b[sortField]).getTime() : 0) : b[sortField];
        return aValue < bValue ? (sortDirection === "asc" ? -1 : 1) : aValue > bValue ? (sortDirection === "asc" ? 1 : -1) : 0;
      });
    }

    return result;
  }, [profiles, searchTerm, sortField, sortDirection]);

  // Phân trang
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = processedProfiles.slice(indexOfFirstProfile, indexOfLastProfile);
  const totalPages = Math.ceil(processedProfiles.length / profilesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Hàm định dạng ngày và giới tính
  const formatValue = (value: string | undefined, type: "date" | "gender") => {
    if (!value) return "N/A";
    return type === "date"
      ? new Date(value).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
      : value === "male" ? "Nam" : value === "female" ? "Nữ" : value;
  };

  // Xử lý sắp xếp
  const handleSort = (field: "date_of_birth" | "gender") => {
    setSortField(sortField === field ? (sortDirection === "asc" ? "" : field) : field);
    setSortDirection(sortField === field && sortDirection === "asc" ? "desc" : "asc");
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 rounded-xl shadow-lg">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-xl mb-6 flex flex-col md:flex-row justify-between items-center shadow-md gap-4">
        <h2 className="text-xl font-bold">Quản lý Hồ sơ</h2>
        <span className="bg-white/20 py-1 px-3 rounded-full text-sm">
          Tổng: {processedProfiles.length} hồ sơ
        </span>
      </div>

      {/* Search Box */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo User ID, Họ tên hoặc Số điện thoại..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSort("date_of_birth")}
              className={`px-3 py-2 rounded-lg border transition-colors duration-200 flex items-center ${
                sortField === "date_of_birth" 
                  ? "bg-blue-500 text-white border-blue-500" 
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Ngày sinh {sortField === "date_of_birth" && (sortDirection === "asc" ? "↑" : "↓")}
            </button>
            <button
              onClick={() => handleSort("gender")}
              className={`px-3 py-2 rounded-lg border transition-colors duration-200 flex items-center ${
                sortField === "gender" 
                  ? "bg-blue-500 text-white border-blue-500" 
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Giới tính {sortField === "gender" && (sortDirection === "asc" ? "↑" : "↓")}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <table className="w-full bg-white">
          <thead className="bg-gradient-to-r from-blue-400/20 to-indigo-400/20 text-left">
            <tr>
              <th className="p-4 border-b font-semibold text-gray-700 text-sm uppercase">Avatar</th>
              <th className="p-4 border-b font-semibold text-gray-700 text-sm uppercase">Full Name</th>
              <th className="p-4 border-b font-semibold text-gray-700 text-sm uppercase">Gender</th>
              <th className="p-4 border-b font-semibold text-gray-700 text-sm uppercase">DOB</th>
              <th className="p-4 border-b font-semibold text-gray-700 text-sm uppercase">Nick Name</th>
              <th className="p-4 border-b font-semibold text-gray-700 text-sm uppercase">Phone</th>
              <th className="p-4 border-b font-semibold text-gray-700 text-sm uppercase">User ID</th>
            </tr>
          </thead>
          <tbody>
            {currentProfiles.length > 0 ? (
              currentProfiles.map((p, i) => (
                <tr
                  key={i}
                  className={`transition-colors duration-200 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50/70`}
                >
                  <td className="p-4 border-b">
                    <img
                      src={p.avatar || "https://via.placeholder.com/40?text=No+Avatar"}
                      alt={p.full_name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                    />
                  </td>
                  <td className="p-4 border-b text-gray-900 text-sm font-medium">{p.full_name || "N/A"}</td>
                  <td className="p-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      p.gender === "male"
                        ? "bg-blue-100 text-blue-800"
                        : p.gender === "female"
                        ? "bg-pink-100 text-pink-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {formatValue(p.gender, "gender")}
                    </span>
                  </td>
                  <td className="p-4 border-b text-gray-700 text-sm">{formatValue(p.date_of_birth, "date")}</td>
                  <td className="p-4 border-b text-gray-700 text-sm">{p.nick_name || "N/A"}</td>
                  <td className="p-4 border-b text-gray-700 text-sm">{p.phone_number || "N/A"}</td>
                  <td className="p-4 border-b text-gray-700 text-sm font-mono">{p.user_id}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Không tìm thấy hồ sơ nào phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <div className="text-sm text-gray-600">
          Hiển thị {indexOfFirstProfile + 1} - {Math.min(indexOfLastProfile, processedProfiles.length)} của {processedProfiles.length} hồ sơ
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                currentPage === number
                  ? "bg-blue-500 text-white border-blue-500 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              } shadow-sm`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center shadow-sm"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTable;