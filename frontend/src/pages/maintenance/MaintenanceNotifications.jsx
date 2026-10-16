// src/pages/maintenance/MaintenanceNotifications.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  MessageSquare,
  Check,
  CheckCheck,
  Search,
  Filter,
  Trash2,
  UserCheck,
  Camera,
  Zap,
  Ticket,
} from "lucide-react";
import MaintenanceLayout from "../../layout/MaintenanceLayout";
import Card from "../../components/ui/Card";

// ---------- Placeholder data ----------
const NOTIFICATIONS = [
  {
    id: 1,
    type: "assigned",
    icon: UserCheck,
    accent: "bg-blue-50 text-blue-600",
    title: "New task assigned to you",
    message:
      "TKT-0016 (AC not cooling in Faculty Room) was assigned by Admin USPF.",
    time: "15m ago",
    unread: true,
  },
  {
    id: 2,
    type: "urgent",
    icon: AlertCircle,
    accent: "bg-rose-50 text-rose-600",
    title: "Urgent task — respond ASAP",
    message: "TKT-0016 has been flagged Urgent. Reporter: Prof. Davis.",
    time: "15m ago",
    unread: true,
  },
  {
    id: 3,
    type: "comment",
    icon: MessageSquare,
    accent: "bg-indigo-50 text-indigo-600",
    title: "New note on TKT-0013",
    message: "Admin added: 'Replacement bulb available in stock room.'",
    time: "2h ago",
    unread: true,
  },
  {
    id: 4,
    type: "verified",
    icon: CheckCircle2,
    accent: "bg-emerald-50 text-emerald-600",
    title: "Fix verified by reporter",
    message: "TKT-0011 (Flickering lights in Lab 1) was confirmed resolved.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 5,
    type: "reminder",
    icon: Clock,
    accent: "bg-amber-50 text-amber-600",
    title: "Task nearing deadline",
    message:
      "TKT-0012 (Leaking faucet in CR-2F) is approaching its target time.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 6,
    type: "photo",
    icon: Camera,
    accent: "bg-gray-100 text-gray-600",
    title: "Resolution photo request",
    message: "Add a completion photo to TKT-0010 before closing.",
    time: "2d ago",
    unread: false,
  },
  {
    id: 7,
    type: "system",
    icon: Zap,
    accent: "bg-blue-50 text-blue-600",
    title: "Weekly summary ready",
    message: "You completed 8 tasks this week. Great work!",
    time: "3d ago",
    unread: false,
  },
];

const FILTERS = ["All", "Unread", "Tasks", "Comments", "System"];

const FILTER_MAP = {
  Tasks: ["assigned", "urgent", "reminder", "photo"],
  Comments: ["comment", "verified"],
  System: ["system"],
};

export default function MaintenanceNotifications() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(NOTIFICATIONS);

  const visible = items.filter((n) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Unread" ? n.unread : FILTER_MAP[filter]?.includes(n.type));
    const matchesQuery =
      !query ||
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.message.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const unreadCount = items.filter((n) => n.unread).length;
  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  const markRead = (id) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  const removeItem = (id) =>
    setItems((prev) => prev.filter((n) => n.id !== id));

  return (
    <MaintenanceLayout>
      <div className="w-full flex justify-center">
        <div className="w-full space-y-6">
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
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={markAllRead}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium
                  text-blue-600 bg-blue-50 hover:bg-blue-100 transition shrink-0"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </motion.button>
            )}
          </div>

          {/* Filters + search */}
          <Card hover={false} className="!p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search notifications..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
                <Filter className="w-4 h-4 text-gray-400 shrink-0 hidden lg:block" />
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition
                      ${
                        filter === f
                          ? "bg-blue-600 text-white shadow-[0_4px_12px_-4px_rgba(59,130,246,0.5)]"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {f}
                    {f === "Unread" && unreadCount > 0 && (
                      <span
                        className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                          filter === f
                            ? "bg-white/25"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Count */}
          <div className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {visible.length}
            </span>{" "}
            of {items.length} notifications
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
                  {filter === "Unread"
                    ? "You're all caught up."
                    : "Try adjusting your filters."}
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
                    onRead={() => markRead(n.id)}
                    onDelete={() => removeItem(n.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </MaintenanceLayout>
  );
}

function NotificationRow({ data, index, onRead, onDelete }) {
  const Icon = data.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.04, duration: 0.25, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className={`group flex items-start gap-4 p-4 rounded-2xl
        bg-white/80 backdrop-blur-xl border transition
        shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]
        ${data.unread ? "border-blue-100 ring-1 ring-blue-100/60" : "border-gray-100"}`}
    >
      <div
        className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-xl ${data.accent}`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <button onClick={onRead} className="min-w-0 flex-1 text-left">
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
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" /> {data.time}
          </span>
          {!data.unread && (
            <span className="inline-flex items-center gap-1">
              <Check className="w-3 h-3" /> Read
            </span>
          )}
        </div>
      </button>

      <button
        onClick={onDelete}
        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg
          text-gray-300 opacity-0 group-hover:opacity-100
          hover:text-red-600 hover:bg-red-50 transition"
        title="Remove"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
