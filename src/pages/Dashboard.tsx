import StatsCard from "../components/dashboard/StatsCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import ProductPieChart from "../components/dashboard/ProductPieChart";
import { BarChart3 } from "lucide-react";
import { useUserStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const user = useUserStore((state) => state.user);
    console.log("Current user in Dashboard:", user?.role);
    const navigate = useNavigate();


    if(!user){ 
        navigate("/login");
        
        return;
    }

    if(user.role !== "ADMIN"){
        navigate("/login");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("userName");
        sessionStorage.removeItem("email");
        useUserStore.getState().clearUser();
        return;
    }

    return (
        <div className="p-6">

            <h1 className="text-3xl font-bold text-green-600 flex items-center justify-center gap-3 mb-6">
                <BarChart3 className="w-7 h-7" />
                Dashboard Thống kê
            </h1>
            {/* Thẻ thống kê nhanh */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <StatsCard title="Doanh thu" value="70,000.000đ" color="bg-green-500" />
                <StatsCard title="Đơn hàng" value={320} color="bg-purple-500" />
                <StatsCard title="Khách hàng" value={150} color="bg-pink-500" />
                <StatsCard title="Sản phẩm" value={24} color="bg-orange-500" />
            </div>

            {/* Biểu đồ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RevenueChart />
                <ProductPieChart />
            </div>
        </div>
    );
};

export default Dashboard;
