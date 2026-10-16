// src/components/admin/AdminHeader.jsx
import { Menu, Bell, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export default function AdminHeader({ onMenuClick, title = "Admin Portal" }) {
  const { user } = useAuth();
  const initials = (user?.name || "Admin")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/60
        flex items-center justify-between px-4 sm:px-6 gap-4
        shadow-[0_4px_24px_-12px_rgba(0,0,0,0.06)]
        shrink-0"
    >
      <div className="flex items-center gap-4 min-w-0">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-gray-900 transition"
        >
          <Menu className="w-5 h-5" />
        </motion.button>
        <h2 className="text-sm font-medium text-gray-700 truncate">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Search (desktop only) */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets, users..."
            className="w-56 pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white/70
              text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
          />
        </div>

        {/* Notifications */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="relative w-9 h-9 flex items-center justify-center rounded-xl
            text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white" />
        </motion.button>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
          <div
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600
            flex items-center justify-center text-white text-xs font-bold
            shadow-[0_4px_12px_-4px_rgba(59,130,246,0.5)]"
          >
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
