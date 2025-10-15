import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import ProductManagement from "../pages/ProductManagement";
import VoucherManagement from "../pages/VoucherManagement";
import BlogManagement from "../pages/BlogManagement";
import UserManagement from "../pages/UserManagement";
import OrderManagement from "../pages/OrderManagement";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public route - login page */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Private routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ProductManagement />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/vouchers"
          element={
            <PrivateRoute>
              <AdminLayout>
                <VoucherManagement />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/blogs"
          element={
            <PrivateRoute>
              <AdminLayout>
                <BlogManagement />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <AdminLayout>
                <UserManagement />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <AdminLayout>
                <OrderManagement />
              </AdminLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;