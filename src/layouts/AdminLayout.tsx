import type { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/auth/authService";
import { useUserStore } from "../store/userStore";
import {
  LayoutDashboard,
  Package,
  TicketPercent,
  FileText,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  Leaf,
  UserCircle,
} from "lucide-react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserStore((state) => state.user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Bảng điều khiển" },
    { path: "/products", icon: Package, label: "Quản lý sản phẩm" },
    { path: "/vouchers", icon: TicketPercent, label: "Quản lý voucher" },
    { path: "/blogs", icon: FileText, label: "Quản lý bài viết" },
    { path: "/users", icon: Users, label: "Quản lý người dùng" },
    { path: "/orders", icon: ShoppingCart, label: "Quản lý đơn hàng" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed position */}
      <aside className="fixed w-72 bg-white border-r border-gray-200 shadow-lg h-screen flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-400 rounded-xl flex items-center justify-center shadow-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Detox Admin</h1>
              <p className="text-xs text-gray-500">Hệ thống quản lý</p>
            </div>
          </div>
          {user && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
              <UserCircle className="w-4 h-4 text-green-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.username}
                </p>
                <p className="text-xs text-green-600 font-medium">
                  {user.role}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${
                    active
                      ? "bg-green-400 text-white shadow-lg shadow-green-400/30"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Divider */}
          <div className="pt-4 pb-2">
            <div className="border-t border-gray-200"></div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content - Adjusted for fixed sidebar */}
      <main className="flex-1 ml-72 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {menuItems.find((item) => isActive(item.path))?.label || "Bảng điều khiển"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Quản lý sản phẩm và dịch vụ detox của bạn
              </p>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                  <UserCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              )}
              <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-500 transition-colors shadow-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;