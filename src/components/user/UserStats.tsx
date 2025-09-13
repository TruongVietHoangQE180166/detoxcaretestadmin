interface Props {
  totalUsers: number;
  todayUsers: number;
  growthRate: string;
}

const UserStats = ({ totalUsers, todayUsers, growthRate }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
          <p className="text-gray-600 text-sm font-medium">Tổng số User</p>
        </div>
        <h2 className="text-3xl font-bold text-green-700 mt-3">{totalUsers}</h2>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
          <p className="text-gray-600 text-sm font-medium">User mới hôm nay</p>
        </div>
        <h2 className="text-3xl font-bold text-blue-700 mt-3">{todayUsers}</h2>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 bg-purple-600 rounded-full"></span>
          <p className="text-gray-600 text-sm font-medium">Tăng trưởng</p>
        </div>
        <h2 className="text-3xl font-bold text-purple-700 mt-3">{growthRate}%</h2>
      </div>
    </div>
  );
};

export default UserStats;