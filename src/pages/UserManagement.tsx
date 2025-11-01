import { useEffect, useState, useMemo } from "react";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import type { Profile, User } from "../components/user/types";
import UserTable from "../components/user/UserTable";
import UserPagination from "../components/user/UserPagination";
import ProfileTable from "../components/user/ProfileTable";
import ProfilePagination from "../components/user/ProfilePagination";
import ProfileDetail from "../components/user/ProfileDetail";
import { getAllUser, updateUserStatus } from "../services/users";
import { useToast } from "../components/common/ToastContext";
import { getAllProfile } from "../services/profile";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState<"users" | "profiles">("users");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [profileCurrentPage, setProfileCurrentPage] = useState(1);
  const [profileSearchTerm, setProfileSearchTerm] = useState("");
  const usersPerPage = 5;
  const profilesPerPage = 5;
  const {addToast} = useToast();

  // Filter users (no sorting)
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search only
    if (search) {
      const term = search.toLowerCase();
      result = result.filter((u) =>
        u.username.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      );
    }

    return result;
  }, [users, search]);

  // Process profiles with search
  const processedProfiles = useMemo(() => {
    let result = [...profiles];

    // Search only
    if (profileSearchTerm) {
      const term = profileSearchTerm.toLowerCase();
      result = result.filter((p) =>
        p.userId.toLowerCase().includes(term) ||
        p.fullName.toLowerCase().includes(term) ||
        (p.phoneNumber && p.phoneNumber.toLowerCase().includes(term))
      );
    }

    return result;
  }, [profiles, profileSearchTerm]);

  // Pagination for users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const userTotalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Pagination for profiles
  const indexOfLastProfile = profileCurrentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = processedProfiles.slice(indexOfFirstProfile, indexOfLastProfile);
  const profileTotalPages = Math.ceil(processedProfiles.length / profilesPerPage);

  const fetchDataUserGetAll = async () => {
    try {
      setLoading(true);
      const data = await getAllUser({ page: 1, size: 1000 });
      console.log("data user", data);
      setUsers(data.data.content);
    } catch (error) {
      addToast("Lỗi khi tải user", "error");
    } finally {
      setLoading(false);
    }
  }

  const fetchDataProfileGetAll = async () => {
    try {
      setLoading(true);
      const data = await getAllProfile({ page: 1, size: 1000 });
      setProfiles(data.data.content);
    } catch (error) {
      addToast("Lỗi khi tải user", "error");
    } finally {
      setLoading(false);
    }
  }

  const handleBanUnbanUser = async (userId: string, status: 'ACTIVE' | 'INACTIVE') => {
    try {
      setUpdating(true);
      await updateUserStatus(userId, status);
      
      // Update the user status in the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, status } : user
        )
      );
      
      addToast(
        status === 'ACTIVE' 
          ? 'Tài khoản đã được kích hoạt!' 
          : 'Tài khoản đã bị khóa!', 
        'success'
      );
    } catch (error) {
      addToast("Lỗi khi cập nhật trạng thái user", "error");
    } finally {
      setUpdating(false);
    }
  }

  const handleViewProfileDetails = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  const handleBackFromProfileDetail = () => {
    setSelectedProfile(null);
  };

  useEffect(() => {
    fetchDataUserGetAll();
    fetchDataProfileGetAll();
  },[])

  console.log("Profile", profiles);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-green-400 rounded-xl">
              <UserGroupIcon className="w-7 h-7 text-white" />
            </div>
            Quản lý User
          </h1>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <nav className="flex">
            <button
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                activeTab === "users"
                  ? "bg-green-400 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("users")}
            >
              Danh sách user
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all ${
                activeTab === "profiles"
                  ? "bg-green-400 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("profiles")}
            >
              Hồ sơ
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* User Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo Username hoặc Email..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  />
                </div>
              </div>
            </div>
            
            {/* Loading indicator */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            )}
            
            {/* User Table */}
            {!loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <UserTable 
                  users={currentUsers} 
                  onBanUnban={handleBanUnbanUser}
                  isUpdating={updating}
                />
              </div>
            )}
            
            {!loading && (
              <UserPagination 
                currentPage={currentPage}
                totalPages={userTotalPages}
                totalItems={filteredUsers.length}
                itemsPerPage={usersPerPage}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        )}

        {activeTab === "profiles" && (
          <div className="space-y-6">
            {/* Profile Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
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
                    value={profileSearchTerm}
                    onChange={(e) => { setProfileSearchTerm(e.target.value); setProfileCurrentPage(1); }}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  />
                </div>
              </div>
            </div>
            
            {/* Profile Detail View */}
            {selectedProfile ? (
              <ProfileDetail 
                profile={selectedProfile} 
                onBack={handleBackFromProfileDetail} 
              />
            ) : (
              <>
                {/* Loading indicator for profiles */}
                {loading && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-center items-center p-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                  </div>
                )}
                
                {/* Profile Table */}
                {!loading && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <ProfileTable 
                      profiles={currentProfiles} 
                      onViewDetails={handleViewProfileDetails}
                      loading={false}
                    />
                  </div>
                )}
                
                {!loading && (
                  <ProfilePagination 
                    currentPage={profileCurrentPage}
                    totalPages={profileTotalPages}
                    totalItems={processedProfiles.length}
                    itemsPerPage={profilesPerPage}
                    onPageChange={setProfileCurrentPage}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;