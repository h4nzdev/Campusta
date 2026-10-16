// src/pages/users/Notifications.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  UserCheck,
  MessageSquare,
  Check,
  CheckCheck,
} from "lucide-react";
import UserLayout from "../../layout/UserLayout";
import Card from "../../components/ui/Card";

// Placeholder notifications (replace with API later)
const NOTIFICATIONS = [
  {
    id: 1,
    type: "status",
    icon: Clock,
    accent: "bg-amber-50 text-amber-600",
    title: "Ticket in progress",
    message: "TKT-0012 (Leaking faucet) is now being worked on by maintenance.",
    time: "5 minutes ago",
    unread: true,
  },
  {
    id: 2,
    type: "resolved",
    icon: CheckCircle2,
    accent: "bg-emerald-50 text-emerald-600",
    title: "Fix ready for verification",
    message:
      "TKT-0011 (Flickering lights) has been marked as resolved. Please verify.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 3,
    type: "assigned",
    icon: UserCheck,
    accent: "bg-blue-50 text-blue-600",
    title: "Ticket assigned",
    message: "TKT-0013 (Broken projector) was assigned to Raniel P.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 4,
    type: "comment",
    icon: MessageSquare,
    accent: "bg-indigo-50 text-indigo-600",
    title: "New note on your ticket",
    message: "Maintenance added a note: 'Parts ordered, ETA 2 days.'",
    time: "2 days ago",
    unread: false,
  },
  {
    id: 5,
    type: "alert",
    icon: AlertCircle,
    accent: "bg-rose-50 text-rose-600",
    title: "High priority update",
    message: "Your urgent ticket TKT-0009 has been flagged for review.",
    time: "3 days ago",
    unread: false,
  },
];

const FILTERS = ["All", "Unread"];

export default function Notifications() {
  const [filter, setFilter] = useState("All");
  const [items, setItems] = useState(NOTIFICATIONS);

  const visible = items.filter((n) => (filter === "Unread" ? n.unread : true));
  const unreadCount = items.filter((n) => n.unread).length;

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  const markRead = (id) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );

  return (
    <UserLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Notifications
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
                : "You're all caught up."}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium
                text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
                ${
                  filter === f
                    ? "bg-blue-600 text-white shadow-[0_4px_12px_-4px_rgba(59,130,246,0.5)]"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
            >
              {f}
              {f === "Unread" && unreadCount > 0 && (
                <span className="ml-1.5 text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {visible.length === 0 ? (
          <Card hover={false}>
            <div className="p-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                No notifications
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You're all caught up.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {visible.map((n, i) => (
                <NotificationRow
                  key={n.id}
                  data={n}
                  index={i}
                  onClick={() => markRead(n.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </UserLayout>
  );
}

function NotificationRow({ data, index, onClick }) {
  const Icon = data.icon;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.04, duration: 0.25, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`w-full text-left flex items-start gap-4 p-4 rounded-2xl
        bg-white/80 backdrop-blur-xl border transition
        shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]
        ${
          data.unread
            ? "border-blue-100 ring-1 ring-blue-100/60"
            : "border-gray-100"
        }`}
    >
      <div
        className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-xl ${data.accent}`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={`text-sm truncate ${data.unread ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}
          >
            {data.title}
          </h3>
          {data.unread && (
            <span className="shrink-0 mt-1 w-2 h-2 rounded-full bg-blue-500" />
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {data.message}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-gray-400">{data.time}</span>
          {!data.unread && (
            <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
              <Check className="w-3 h-3" /> Read
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
