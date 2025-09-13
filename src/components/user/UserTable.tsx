import { useState } from "react";
import type { User } from "./types";

interface Props {
  users: User[];
}

const UserTable = ({ users }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Hàm định dạng ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-cyan-50 p-4 md:p-6 rounded-xl shadow-lg">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-xl mb-6 flex justify-between items-center shadow-md">
        <h2 className="text-xl font-bold">Quản lý Người dùng</h2>
        <span className="bg-white/20 py-1 px-3 rounded-full text-sm">
          Tổng: {users.length} người dùng
        </span>
      </div>
      
      <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="w-full border-collapse bg-white rounded-xl overflow-hidden">
          <thead className="bg-gradient-to-r from-green-400/20 to-teal-400/20 text-left">
            <tr>
              <th className="p-4 border-b font-semibold text-gray-700 text-sm uppercase">Email</th>
              <th className="p-4 border-b font-semibold text-gray-700 text-sm uppercase">Username</th>
              <th className="p-4 border-b font-semibold text-gray-700 text-sm uppercase">Status</th>
              <th className="p-4 border-b font-semibold text-gray-700 text-sm uppercase">Role</th>
              <th className="p-4 border-b font-semibold text-gray-700 text-sm uppercase">Deleted</th>
              <th className="p-4 border-b font-semibold text-gray-700 text-sm uppercase">Created Date</th>
              <th className="p-4 border-b font-semibold text-gray-700 text-sm uppercase text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((u, i) => (
              <tr
                key={i}
                className={`transition-colors duration-200 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50/70`}
              >
                <td className="p-4 border-b text-gray-900 text-sm font-medium">{u.email}</td>
                <td className="p-4 border-b text-gray-700 text-sm">{u.username}</td>
                <td className="p-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-4 border-b text-gray-700 text-sm">{u.role_name}</td>
                <td className="p-4 border-b">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${u.is_deleted ? 'bg-red-100' : 'bg-green-100'}`}>
                    <span className={`text-xs font-bold ${u.is_deleted ? 'text-red-600' : 'text-green-600'}`}>
                      {u.is_deleted ? "Yes" : "No"}
                    </span>
                  </span>
                </td>
                <td className="p-4 border-b text-gray-700 text-sm">{formatDate(u.created_date)}</td>
                <td className="p-4 border-b text-center">
                  <div className="flex justify-center gap-2">
                    <button className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors duration-200 shadow-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Sửa
                    </button>
                    <button className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors duration-200 shadow-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <div className="text-sm text-gray-600">
          Hiển thị {indexOfFirstUser + 1} - {Math.min(indexOfLastUser, users.length)} của {users.length} người dùng
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${currentPage === number
                ? "bg-green-500 text-white border-green-500 shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              } shadow-sm`}
            >
              {number}
            </button>
          ))}
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center shadow-sm"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;