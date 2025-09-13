import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import ProductManagement from "../pages/ProductManagement";
import VoucherManagement from "../pages/VoucherManagement";
import BlogManagement from "../pages/BlogManagement";
import UserManagement from "../pages/UserManagement";
import OrderManagement from "../pages/OrderManagement";

const AppRoutes = () => {
    return (
        <Router>
            <AdminLayout>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<ProductManagement />} />
                    <Route path="/vouchers" element={<VoucherManagement />} />
                    <Route path="/blogs" element={<BlogManagement />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/orders" element={<OrderManagement />} />

                </Routes>
            </AdminLayout>
        </Router>
    );
};

export default AppRoutes;
