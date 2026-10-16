// src/components/UserSidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  QrCode,
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Bell,
  LogOut,
  X,
  SettingsIcon,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/user/dashboard", icon: LayoutDashboard },
  { label: "My Tickets", to: "/user/tickets", icon: ClipboardList },
  { label: "Report Concern", to: "/user/reports", icon: PlusCircle },
  { label: "Notifications", to: "/user/notifications", icon: Bell },
  { label: "Settings", to: "/user/settings", icon: SettingsIcon },
];

export default function UserSidebar({ open, onClose, onLogout }) {
  const location = useLocation();

  return (
    <aside
      className={`fixed lg:static z-40 inset-y-0 left-0 w-64
        bg-white/80 backdrop-blur-xl border-r border-gray-200/60
        shadow-[4px_0_24px_-12px_rgba(0,0,0,0.08)]
        transform transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      {/* Brand */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
        <Link to="/user/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-50">
            <QrCode className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-lg font-bold text-gray-800 tracking-tight">
            CAMPUSTA
          </span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-500 hover:text-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="p-4 space-y-1.5">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} onClick={onClose}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${
                    active
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                {active && (
                  <motion.div
                    layoutId="user-sidebar-active"
                    className="absolute inset-0 rounded-xl bg-blue-50"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
            text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
