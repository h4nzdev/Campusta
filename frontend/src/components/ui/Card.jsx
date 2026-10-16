// src/components/ui/Card.jsx
import { motion } from "framer-motion";

export default function Card({ children, className = "", hover = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={hover ? { y: -2 } : undefined}
      className={`bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100
        shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] p-5 ${className}`}
    >
      {children}
    </motion.div>
  );
}
