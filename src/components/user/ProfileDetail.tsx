import type { Profile, Address } from "./types";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface Props {
  profile: Profile;
  onBack: () => void;
}

const ProfileDetail = ({ profile, onBack }: Props) => {
  // Hàm định dạng ngày
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  // Hàm định dạng giới tính
  const formatGender = (gender: string | undefined | null) => {
    if (!gender) return "N/A";
    return gender === "MALE" ? "Nam" : gender === "FEMALE" ? "Nữ" : gender;
  };

  // Hàm hiển thị địa chỉ
  const renderAddresses = (addresses: Address[] | undefined | null) => {
    if (!addresses || addresses.length === 0) return <p className="text-gray-500">Không có địa chỉ</p>;

    return (
      <div className="space-y-3">
        {addresses.map((addr, index) => (
          <div key={addr.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">{addr.address || "N/A"}</p>
                {addr.wardName && addr.districtName && addr.provinceName ? (
                  <p className="text-sm text-gray-500 mt-1">
                    {`${addr.wardName}, ${addr.districtName}, ${addr.provinceName}`}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">
                    Thông tin địa chỉ không đầy đủ
                  </p>
                )}
              </div>
              {addr.default && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Mặc định
                </span>
              )}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <p>Loại: {addr.type || "N/A"}</p>
              <p>Ghi chú: {addr.note || "Không có"}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Chi tiết hồ sơ</h2>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Quay lại
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Avatar and Basic Info */}
          <div className="md:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <img
                src={profile.avatar || "https://via.placeholder.com/150?text=No+Avatar"}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/150?text=No+Avatar";
                }}
              />
              <h3 className="text-xl font-bold mt-4 text-gray-900">{profile.fullName || "N/A"}</h3>
              <p className="text-gray-600">{profile.nickName || "Không có biệt danh"}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Thông tin cá nhân
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium">{profile.userId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">{profile.username || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày sinh</p>
                  <p className="font-medium">{formatDate(profile.dateOfBirth)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giới tính</p>
                  <p className="font-medium">{formatGender(profile.gender)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-medium">{profile.phoneNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày tạo</p>
                  <p className="font-medium">{formatDate(profile.createdDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày cập nhật</p>
                  <p className="font-medium">{formatDate(profile.updatedDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Địa chỉ
          </h3>
          {renderAddresses(profile.addresses)}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;