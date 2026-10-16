// src/components/UserHeader.jsx
import { Menu, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function UserHeader({ onMenuClick, title = "User Portal" }) {
  return (
    <header
      className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/60
        flex items-center justify-between px-6 gap-4
        shadow-[0_4px_24px_-12px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-gray-900 transition"
        >
          <Menu className="w-5 h-5" />
        </motion.button>
        <h2 className="text-sm font-medium text-gray-700">{title}</h2>
      </div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        className="relative text-gray-500 hover:text-gray-800 transition"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-500" />
      </motion.button>
    </header>
  );
}
