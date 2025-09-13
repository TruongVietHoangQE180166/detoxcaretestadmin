import { useState } from "react";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import type { Profile, User } from "../components/user/types";
import UserStats from "../components/user/UserStats";
import UserTabs from "../components/user/UserTabs";
import SearchSortBar from "../components/user/SearchSortBar";
import UserTable from "../components/user/UserTable";
import ProfileTable from "../components/user/ProfileTable";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState<"users" | "profiles">("users");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"created_date" | "username" | "is_deleted">("created_date");

  // mock data
const users: User[] = [
    { id: "1", email: "ledoanhieu12a6@gmail.com", username: "otisdoan1", status: "ACTIVE", role_name: "USER", is_deleted: 0, created_date: "2025-09-13" },
    { id: "2", email: "ledo@gmail.com", username: "otisdoan", status: "INACTIVE", role_name: "USER", is_deleted: 0, created_date: "2025-09-12" },
    { id: "3", email: "Thuong123@gmail.com", username: "Thuong123@", status: "ACTIVE", role_name: "USER", is_deleted: 0, created_date: "2025-09-13" },
];

  const profiles: Profile[] = [
    {id: "1", avatar: "https://dongvat.edu.vn/upload/2025/01/avatar1.png", full_name: "Thuong1234@", gender: "MALE", date_of_birth: "2000-01-01", nick_name: "Thuong", phone_number: "0379560889", user_id: "db1994aa-e595-452a-9292-3eeadc1bf6e1" },
    {id: "2", avatar: "https://dongvat.edu.vn/upload/2025/01/avatar2.png", full_name: "otisdoan", gender: "MALE", date_of_birth: "1999-05-10", nick_name: "Doan", phone_number: "0901234567", user_id: "135bbd39-f32f-4cae-a95e-01133d70a55c" },
  ];

  // filter + sort
  const filteredUsers = users
    .filter((u) => u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === "created_date") return new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
      if (sortKey === "username") return a.username.localeCompare(b.username);
      if (sortKey === "is_deleted") return a.is_deleted - b.is_deleted;
      return 0;
    });

  // statistics
  const today = "2025-09-13";
  const totalUsers = users.length;
  const todayUsers = users.filter((u) => u.created_date === today).length;
  const yesterdayUsers = users.filter((u) => u.created_date === "2025-09-12").length;
  const growthRate = yesterdayUsers > 0 ? (((todayUsers - yesterdayUsers) / yesterdayUsers) * 100).toFixed(1) : "100";

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
