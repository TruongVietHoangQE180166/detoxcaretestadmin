import { useEffect, useState } from "react";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import type { Profile, User } from "../components/user/types";
import UserStats from "../components/user/UserStats";
import UserTabs from "../components/user/UserTabs";
import SearchSortBar from "../components/user/SearchSortBar";
import UserTable from "../components/user/UserTable";
import ProfileTable from "../components/user/ProfileTable";
import { getAllUser } from "../services/users";
import { useToast } from "../components/common/ToastContext";
import { getAllProfile } from "../services/profile";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState<"users" | "profiles">("users");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"created_date" | "username" | "is_deleted">("created_date");
  const [users, setUsers] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const {addToast} = useToast();

  // filter + sort
  const filteredUsers = users
    .filter((u) => u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === "created_date") return new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
      if (sortKey === "username") return a.username.localeCompare(b.username);
      if (sortKey === "is_deleted") return a.deleted - b.deleted;
      return 0;
    });

  // statistics
  const today = "2025-09-13";
  const totalUsers = users.length;
  const todayUsers = users.filter((u) => u.created_date === today).length;
  const yesterdayUsers = users.filter((u) => u.created_date === "2025-09-12").length;
  const growthRate = yesterdayUsers > 0 ? (((todayUsers - yesterdayUsers) / yesterdayUsers) * 100).toFixed(1) : "100";

  const fetchDataUserGetAll = async () => {
    try {
      setLoading(true);
      const data = await getAllUser({ page: 1, size: 10 });
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
      const data = await getAllProfile({ page: 1, size: 10 });
      setProfiles(data.data.content);
    } catch (error) {
      addToast("Lỗi khi tải user", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDataUserGetAll();
    fetchDataProfileGetAll();
  },[])

  console.log("Profile", profiles);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-green-600 flex items-center gap-3">
        <UserGroupIcon className="w-8 h-8 text-green-600" />
        Quản lý User
      </h1>

      <UserStats totalUsers={totalUsers} todayUsers={todayUsers} growthRate={growthRate} />
      <UserTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "users" && (
        <>
          <SearchSortBar search={search} setSearch={setSearch} sortKey={sortKey} setSortKey={setSortKey} />
          <UserTable users={filteredUsers} />
        </>
      )}

      {activeTab === "profiles" && <ProfileTable profiles={profiles} />}
    </div>
  );
};

export default UserManagement;
