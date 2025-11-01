import { useEffect, useState, useCallback } from "react";
import RevenueChart from "../components/dashboard/RevenueChart";
import { BarChart3, TrendingUp, ShoppingCart, Users, Package } from "lucide-react";
import { getAllOrders } from "../services/orders";
import { getAllUser } from "../services/users";
import { getAllProduct } from "../services/product/productService";
import { useToast } from "../components/common/ToastContext";
import type { Query } from "../services/common/queryCommon";
import type { Order } from "../components/order/types";

const Dashboard = () => {
    const [orderCount, setOrderCount] = useState<number>(0);
    const [userCount, setUserCount] = useState<number>(0);
    const [productCount, setProductCount] = useState<number>(0);
    const [revenue, setRevenue] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasFetched, setHasFetched] = useState<boolean>(false);
    const { addToast } = useToast();

    // Memoize the data fetching function to prevent unnecessary re-renders
    const fetchData = useCallback(async () => {
        // Prevent multiple fetches
        if (hasFetched) return;
        
        try {
            setLoading(true);
            // Create query params once
            const params: Query = { page: 1, size: 1000 };
            
            // Fetch all data in parallel to reduce loading time
            const [orderData, userData, productData] = await Promise.all([
                getAllOrders(params),
                getAllUser(params),
                getAllProduct(params)
            ]);
            
            // Process order data
            let ordersArray: Order[] = [];
            if (Array.isArray(orderData)) {
                ordersArray = orderData;
            } else if (orderData && typeof orderData === 'object' && 'data' in orderData) {
                if (Array.isArray(orderData.data)) {
                    ordersArray = orderData.data;
                } else if (orderData.data && typeof orderData.data === 'object' && 'content' in orderData.data) {
                    ordersArray = Array.isArray(orderData.data.content) ? orderData.data.content : [];
                }
            }
            
            // Calculate revenue from completed orders
            const completedOrders = ordersArray.filter(order => order.status === "COMPLETED");
            const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
            
            // Process user data
            let usersArray: any[] = [];
            if (Array.isArray(userData)) {
                usersArray = userData;
            } else if (userData && typeof userData === 'object' && 'data' in userData) {
                if (Array.isArray(userData.data)) {
                    usersArray = userData.data;
                } else if (userData.data && typeof userData.data === 'object' && 'content' in userData.data) {
                    usersArray = Array.isArray(userData.data.content) ? userData.data.content : [];
                }
            }
            
            // Process product data
            let productsArray: any[] = [];
            if (Array.isArray(productData)) {
                productsArray = productData;
            } else if (productData && typeof productData === 'object' && 'data' in productData) {
                if (Array.isArray(productData.data)) {
                    productsArray = productData.data;
                } else if (productData.data && typeof productData.data === 'object' && 'content' in productData.data) {
                    productsArray = Array.isArray(productData.data.content) ? productData.data.content : [];
                }
            }
            
            // Update all state values at once to prevent partial rendering
            setOrderCount(ordersArray.length);
            setUserCount(usersArray.length);
            setProductCount(productsArray.length);
            setRevenue(totalRevenue);
            setHasFetched(true);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            addToast("Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.", "error");
        } finally {
            setLoading(false);
        }
    }, [hasFetched, addToast]);

    useEffect(() => {
        fetchData();
        
        // Cleanup function to prevent state updates if component unmounts
        return () => {
            setLoading(false);
        };
    }, [fetchData]);

    // Format numbers with thousand separators
    const formatNumber = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // Format currency
    const formatCurrency = (amount: number): string => {
        return `${amount.toLocaleString('vi-VN')}đ`;
    };

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
                    {/* Revenue Card */}
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
                        {loading ? (
                            <div className="h-8 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#7FD957]"></div>
                            </div>
                        ) : (
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(revenue)}
                            </p>
                        )}
                    </div>

                    {/* Order Card */}
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
                        {loading ? (
                            <div className="h-8 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#7FD957]"></div>
                            </div>
                        ) : (
                            <p className="text-2xl font-bold text-gray-900">
                                {formatNumber(orderCount)}
                            </p>
                        )}
                    </div>

                    {/* User Card */}
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
                        {loading ? (
                            <div className="h-8 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#7FD957]"></div>
                            </div>
                        ) : (
                            <p className="text-2xl font-bold text-gray-900">
                                {formatNumber(userCount)}
                            </p>
                        )}
                    </div>

                    {/* Product Card */}
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
                        {loading ? (
                            <div className="h-8 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#7FD957]"></div>
                            </div>
                        ) : (
                            <p className="text-2xl font-bold text-gray-900">
                                {formatNumber(productCount)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Biểu đồ doanh thu */}
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Biểu đồ Doanh thu</h2>
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        {loading ? (
                            <div className="h-80 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7FD957]"></div>
                            </div>
                        ) : (
                            <RevenueChart />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;