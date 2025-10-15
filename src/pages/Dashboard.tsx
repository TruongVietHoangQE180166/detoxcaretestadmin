import StatsCard from "../components/dashboard/StatsCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import { BarChart3, TrendingUp, ShoppingCart, Users, Package } from "lucide-react";

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header với gradient và shadow */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-green-400">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-400 p-3 rounded-xl">
                            <BarChart3 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Dashboard Thống kê
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Tổng quan hoạt động kinh doanh
                            </p>
                        </div>
                    </div>
                </div>

                {/* Thẻ thống kê với design mới */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-t-4 border-green-400">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-green-50 p-3 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-green-400" />
                            </div>
                            <span className="text-xs font-semibold text-green-400 bg-green-50 px-3 py-1 rounded-full">
                                +12.5%
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Doanh thu</h3>
                        <p className="text-2xl font-bold text-gray-900">3,000.000đ</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-t-4 border-gray-900">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <ShoppingCart className="w-6 h-6 text-gray-900" />
                            </div>
                            <span className="text-xs font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                                +8.2%
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Đơn hàng</h3>
                        <p className="text-2xl font-bold text-gray-900">40</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-t-4 border-green-400">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-green-50 p-3 rounded-lg">
                                <Users className="w-6 h-6 text-green-400" />
                            </div>
                            <span className="text-xs font-semibold text-green-400 bg-green-50 px-3 py-1 rounded-full">
                                +15.3%
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Khách hàng</h3>
                        <p className="text-2xl font-bold text-gray-900">20</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-t-4 border-gray-400">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <Package className="w-6 h-6 text-gray-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                +5.1%
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Sản phẩm</h3>
                        <p className="text-2xl font-bold text-gray-900">24</p>
                    </div>
                </div>

                {/* Biểu đồ doanh thu */}
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Biểu đồ Doanh thu</h2>
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        <RevenueChart />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;