import type { User } from "./types";
import { UserMinusIcon, UserPlusIcon } from "@heroicons/react/24/outline";

interface Props {
  users: User[];
  onBanUnban: (userId: string, status: 'ACTIVE' | 'INACTIVE') => void;
  isUpdating: boolean;
}

const UserTable = ({ users, onBanUnban, isUpdating }: Props) => {
  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-4 font-semibold text-sm">Email</th>
              <th className="p-4 font-semibold text-sm">Tên đăng nhập</th>
              <th className="p-4 font-semibold text-sm">Trạng thái</th>
              <th className="p-4 font-semibold text-sm">Vai trò</th>
              <th className="p-4 font-semibold text-sm text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((u, index) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm font-semibold text-gray-900 max-w-xs truncate">
                  {u.email}
                </td>
                <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                  {u.username}
                </td>
                <td className="p-4 text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    u.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : u.status === 'INACTIVE' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {u.status === 'ACTIVE' 
                      ? 'Hoạt động' 
                      : u.status === 'INACTIVE' 
                        ? 'Không hoạt động' 
                        : u.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                  {u.role === 'ADMIN' ? 'Quản trị viên' : u.role === 'USER' ? 'Người dùng' : u.role}
                </td>
                <td className="p-4 align-middle">
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => onBanUnban(u.id, u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                      disabled={isUpdating}
                      className={`p-2 text-white rounded-lg transition-all transform hover:scale-110 shadow-sm flex items-center justify-center ${
                        u.status === 'ACTIVE' 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-green-500 hover:bg-green-600'
                      } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={u.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                    >
                      {u.status === 'ACTIVE' ? (
                        <UserMinusIcon className="w-4 h-4" />
                      ) : (
                        <UserPlusIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">Không có người dùng nào</p>
                    <p className="text-gray-400 text-sm">Thêm người dùng mới để bắt đầu</p>
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

export default UserTable;