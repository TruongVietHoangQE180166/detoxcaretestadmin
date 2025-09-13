import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  TicketPercent,
  FileText,
  Users,
  ShoppingCart,
  Settings,
} from "lucide-react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-emerald-800 via-emerald-600 to-emerald-400 text-white shadow-2xl min-h-screen p-4">
        <div className="p-6 border-b border-green-700/50">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-green-300" />
            Admin Panel
          </h1>
        </div>
        <nav className="p-4 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 p-3 rounded-lg text-lg font-medium hover:bg-green-700/70 transition-colors duration-200"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            to="/products"
            className="flex items-center gap-3 p-3 rounded-lg text-lg font-medium hover:bg-green-700/70 transition-colors duration-200"
          >
            <Package className="w-5 h-5" />
            Product Management
          </Link>
          <Link
            to="/vouchers"
            className="flex items-center gap-3 p-3 rounded-lg text-lg font-medium hover:bg-green-700/70 transition-colors duration-200"
          >
            <TicketPercent className="w-5 h-5" />
            Voucher Management
          </Link>
          <Link
            to="/blogs"
            className="flex items-center gap-3 p-3 rounded-lg text-lg font-medium hover:bg-green-700/70 transition-colors duration-200"
          >
            <FileText className="w-5 h-5" />
            Blog Management
          </Link>
          <Link
            to="/users"
            className="flex items-center gap-3 p-3 rounded-lg text-lg font-medium hover:bg-green-700/70 transition-colors duration-200"
          >
            <Users className="w-5 h-5" />
            User Management
          </Link>
          <Link
            to="/orders"
            className="flex items-center gap-3 p-3 rounded-lg text-lg font-medium hover:bg-green-700/70 transition-colors duration-200"
          >
            <ShoppingCart className="w-5 h-5" />
            Order Management
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-b from-green-100 to-white">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
