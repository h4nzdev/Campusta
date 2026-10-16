// src/components/ui/StatCard.jsx
import { motion } from "framer-motion";

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = "blue",
}) {
  const accents = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100
        shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        {Icon && (
          <div
            className={`w-9 h-9 flex items-center justify-center rounded-xl ${accents[accent]}`}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <p className="mt-3 text-3xl font-bold text-gray-900 tracking-tight">
        {value}
      </p>
    </motion.div>
  );
}
