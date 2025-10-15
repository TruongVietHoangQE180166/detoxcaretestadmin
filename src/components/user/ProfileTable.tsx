import type { Profile } from "./types";

interface Props {
  profiles: Profile[];
}

const ProfileTable = ({ profiles }: Props) => {
  // Hàm định dạng ngày và giới tính
  const formatValue = (value: string | undefined, type: "date" | "gender") => {
    if (!value) return "N/A";
    return type === "date"
      ? new Date(value).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
      : value === "male" ? "Nam" : value === "female" ? "Nữ" : value;
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-4 font-semibold text-sm">#</th>
              <th className="p-4 font-semibold text-sm">Avatar</th>
              <th className="p-4 font-semibold text-sm">Full Name</th>
              <th className="p-4 font-semibold text-sm">Gender</th>
              <th className="p-4 font-semibold text-sm">Nick Name</th>
              <th className="p-4 font-semibold text-sm">Phone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {profiles.map((p, index) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm text-gray-600 font-medium">{index + 1}</td>
                <td className="p-4">
                  <img
                    src={p.avatar || "https://via.placeholder.com/40?text=No+Avatar"}
                    alt={p.avatar}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                  />
                </td>
                <td className="p-4 text-sm font-semibold text-gray-900 max-w-xs truncate">
                  {p.fullName || "N/A"}
                </td>
                <td className="p-4 text-sm">
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
                <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                  {p.nickName || "N/A"}
                </td>
                <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                  {p.phoneNumber || "N/A"}
                </td>
              </tr>
            ))}

            {profiles.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-gray-400"
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
                    </div>
                    <p className="text-gray-500 font-medium">Không có hồ sơ nào</p>
                    <p className="text-gray-400 text-sm">Thêm hồ sơ mới để bắt đầu</p>
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

export default ProfileTable;