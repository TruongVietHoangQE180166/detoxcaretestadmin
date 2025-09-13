interface Props {
  activeTab: "users" | "profiles";
  setActiveTab: (tab: "users" | "profiles") => void;
}

const UserTabs = ({ activeTab, setActiveTab }: Props) => {
  return (
    <div className="border-b border-gray-200 flex gap-6">
      <button
        onClick={() => setActiveTab("users")}
        className={`pb-2 ${
          activeTab === "users"
            ? "border-b-2 border-green-600 text-green-600 font-semibold"
            : "text-gray-600"
        }`}
      >
        Danh sách User
      </button>
      <button
        onClick={() => setActiveTab("profiles")}
        className={`pb-2 ${
          activeTab === "profiles"
            ? "border-b-2 border-green-600 text-green-600 font-semibold"
            : "text-gray-600"
        }`}
      >
        Danh sách Profile
      </button>
    </div>
  );
};

export default UserTabs;
