// src/pages/maintenance/MaintenanceDashboard.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  MapPin,
  Timer,
  TrendingUp,
  Wrench,
  ChevronRight,
  Camera,
  MessageSquare,
  Activity,
  Calendar,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import MaintenanceLayout from "../../layout/MaintenanceLayout";
import Card from "../../components/ui/Card";

// ---------- Placeholder data ----------
const TECH = { name: "Raniel" };

const STATS = [
  {
    label: "Assigned Tasks",
    value: 5,
    icon: ClipboardList,
    accent: "amber",
    trend: "2 due today",
    up: null,
  },
  {
    label: "In Progress",
    value: 2,
    icon: Clock,
    accent: "blue",
    trend: "1 near deadline",
    up: false,
  },
  {
    label: "Completed This Week",
    value: 8,
    icon: CheckCircle2,
    accent: "emerald",
    trend: "+3 vs last week",
    up: true,
  },
  {
    label: "Avg Response",
    value: "4.2h",
    icon: Timer,
    accent: "indigo",
    trend: "-18% faster",
    up: true,
  },
];

const WEEKLY_PERFORMANCE = [
  { day: "Mon", completed: 2, assigned: 3 },
  { day: "Tue", completed: 1, assigned: 2 },
  { day: "Wed", completed: 3, assigned: 3 },
  { day: "Thu", completed: 2, assigned: 2 },
  { day: "Fri", completed: 4, assigned: 4 },
  { day: "Sat", completed: 1, assigned: 1 },
];

const CATEGORY_SPLIT = [
  { category: "Electrical", count: 3 },
  { category: "Plumbing", count: 2 },
  { category: "Furniture", count: 1 },
  { category: "Aircon", count: 1 },
  { category: "Network", count: 0 },
];

// Tickets (minimal preview)
const MY_TICKETS = [
  {
    id: "TKT-0013",
    title: "Broken projector in Room 302",
    location: "ITBU · Room 302",
    priority: "High",
    status: "In Progress",
    age: "2h",
  },
  {
    id: "TKT-0012",
    title: "Leaking faucet in CR-2F",
    location: "Main · CR 2F",
    priority: "Medium",
    status: "In Progress",
    age: "5h",
  },
  {
    id: "TKT-0015",
    title: "Clogged sink in CR-1F",
    location: "Main · CR 1F",
    priority: "Medium",
    status: "Open",
    age: "1h",
  },
  {
    id: "TKT-0016",
    title: "AC not cooling in Faculty Room",
    location: "Admin · Faculty",
    priority: "Urgent",
    status: "Open",
    age: "15m",
  },
];

// History (recently completed)
const HISTORY = [
  {
    id: "TKT-0011",
    title: "Flickering lights in Lab 1",
    location: "ITBU · Lab 1",
    completed: "Yesterday",
    duration: "1h 20m",
  },
  {
    id: "TKT-0010",
    title: "AC not cooling in Faculty Room",
    location: "Admin · Faculty",
    completed: "2d ago",
    duration: "3h 45m",
  },
  {
    id: "TKT-0008",
    title: "Loose chair in Room 205",
    location: "Main · Room 205",
    completed: "3d ago",
    duration: "30m",
  },
  {
    id: "TKT-0007",
    title: "CR 2F faucet leak",
    location: "Main · CR 2F",
    completed: "4d ago",
    duration: "45m",
  },
];

// Activity feed
const ACTIVITY_FEED = [
  {
    id: 1,
    text: "You marked TKT-0012 as In Progress",
    time: "5m ago",
    accent: "amber",
  },
  {
    id: 2,
    text: "TKT-0013 assigned to you by admin",
    time: "2h ago",
    accent: "blue",
  },
  {
    id: 3,
    text: "You resolved TKT-0011 (verified by reporter)",
    time: "Yesterday",
    accent: "emerald",
  },
  {
    id: 4,
    text: "Note added to TKT-0010: 'Parts ordered'",
    time: "2d ago",
    accent: "gray",
  },
];

const QUICK_ACTIONS = [
  {
    label: "My Tasks",
    to: "/maintenance/tasks",
    icon: ClipboardList,
    accent: "bg-amber-50 text-amber-600",
  },
  {
    label: "Completed",
    to: "/maintenance/completed",
    icon: CheckCircle2,
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Notifications",
    to: "/maintenance/notifications",
    icon: Zap,
    accent: "bg-blue-50 text-blue-600",
  },
];

const PRIORITY_STYLES = {
  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-amber-50 text-amber-600",
  High: "bg-rose-50 text-rose-600",
  Urgent: "bg-red-50 text-red-600",
};

const STATUS_STYLES = {
  Open: "bg-rose-50 text-rose-600",
  "In Progress": "bg-amber-50 text-amber-600",
  Resolved: "bg-emerald-50 text-emerald-600",
};

const ACCENT_BG = {
  rose: "bg-rose-50 text-rose-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  indigo: "bg-indigo-50 text-indigo-600",
  gray: "bg-gray-100 text-gray-600",
};

export default function MaintenanceDashboard() {
  return (
    <MaintenanceLayout>
      <div className="space-y-6">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl p-6 sm:p-8
            bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600
            shadow-[0_20px_50px_-20px_rgba(245,158,11,0.6)]"
        >
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-white/5 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-medium backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Maintenance Personnel
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Good day, {TECH.name} 👋
              </h1>
              <p className="mt-1 text-sm text-white/80">
                You have <span className="font-semibold">5 assigned tasks</span>{" "}
                and <span className="font-semibold">2 in progress</span>.
              </p>
            </div>

            <Link
              to="/maintenance/tasks"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                bg-white text-orange-700 text-sm font-semibold
                hover:bg-orange-50 transition shrink-0
                shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)]"
            >
              <ClipboardList className="w-4 h-4" />
              View My Tasks
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                whileHover={{ y: -3 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100
                  shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {s.label}
                  </p>
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-xl ${ACCENT_BG[s.accent]}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="mt-3 text-3xl font-bold text-gray-900 tracking-tight">
                  {s.value}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  {s.up === true && (
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  )}
                  {s.up === false && (
                    <Clock className="w-3 h-3 text-rose-500" />
                  )}
                  <p
                    className={`text-xs ${
                      s.up === true
                        ? "text-emerald-600"
                        : s.up === false
                          ? "text-rose-600"
                          : "text-gray-400"
                    }`}
                  >
                    {s.trend}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* My Tickets — minimal preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-700">
                My Tickets
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                {MY_TICKETS.length} active
              </span>
            </div>
            <Link
              to="/maintenance/tasks"
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card hover={false} className="!p-0 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {MY_TICKETS.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  whileHover={{ backgroundColor: "rgba(248,250,252,0.8)" }}
                  className="relative flex items-center gap-4 px-5 py-3.5 group cursor-pointer"
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${
                      t.priority === "Urgent"
                        ? "bg-red-500"
                        : t.priority === "High"
                          ? "bg-rose-500"
                          : t.priority === "Medium"
                            ? "bg-amber-500"
                            : "bg-gray-300"
                    }`}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono text-gray-400">
                        {t.id}
                      </span>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${PRIORITY_STYLES[t.priority]}`}
                      >
                        {t.priority}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-700 transition">
                      {t.title}
                    </h3>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                    {t.location}
                  </div>

                  <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {t.age} ago
                  </div>

                  <span
                    className={`shrink-0 text-[10px] font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[t.status]}`}
                  >
                    {t.status}
                  </span>

                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition shrink-0" />
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Charts row: performance + category */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card hover={false} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-700">
                  Weekly Performance
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Assigned vs. completed
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> 87% completion
              </span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={WEEKLY_PERFORMANCE}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="maintCompleted"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="maintAssigned"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#f59e0b"
                        stopOpacity={0.25}
                      />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #f1f5f9",
                      boxShadow: "0 8px 30px -12px rgba(0,0,0,0.1)",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    name="Assigned"
                    dataKey="assigned"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    fill="url(#maintAssigned)"
                  />
                  <Area
                    type="monotone"
                    name="Completed"
                    dataKey="completed"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#maintCompleted)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card hover={false}>
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-700">
                Tasks by Category
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Your active workload
              </p>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={CATEGORY_SPLIT}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #f1f5f9",
                      boxShadow: "0 8px 30px -12px rgba(0,0,0,0.1)",
                      fontSize: 12,
                    }}
                    cursor={{ fill: "#f8fafc" }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#f59e0b"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Bottom row: history + quick actions + activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* History */}
          <Card hover={false} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-700">
                  Recently Completed
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Your recent resolutions
                </p>
              </div>
              <Link
                to="/maintenance/completed"
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2">
              {HISTORY.map((h, i) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 hover:bg-gray-50
                    border border-transparent hover:border-gray-100 transition cursor-pointer group"
                >
                  <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-400">
                        {h.id}
                      </span>
                      <span className="text-[10px] text-gray-300">·</span>
                      <span className="text-[10px] text-gray-500">
                        {h.completed}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 truncate group-hover:text-blue-700 transition mt-0.5">
                      {h.title}
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                    {h.location}
                  </div>

                  <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 shrink-0">
                    <Timer className="w-3.5 h-3.5" />
                    {h.duration}
                  </div>

                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition shrink-0" />
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Quick actions */}
          <Card hover={false}>
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              {QUICK_ACTIONS.map(({ label, to, icon: Icon, accent }) => (
                <Link key={label} to={to}>
                  <motion.div
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 hover:bg-gray-50
                      border border-transparent hover:border-gray-100 transition"
                  >
                    <div
                      className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-xl ${accent}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 flex-1">
                      {label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Work note prompt */}
            <div className="mt-4 p-3 rounded-xl bg-amber-50/60 border border-amber-100">
              <div className="flex items-start gap-2">
                <Camera className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-amber-800">
                    Don't forget
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Add resolution photos when you mark tickets complete.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Activity feed */}
        <Card hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">
              Recent Activity
            </h2>
            <Link
              to="/maintenance/notifications"
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
            >
              All notifications <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="relative pl-5">
            <div className="absolute left-1.5 top-2 bottom-2 w-px bg-gray-100" />
            {ACTIVITY_FEED.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.25 }}
                className="relative flex items-start gap-3 py-2.5"
              >
                <span
                  className={`absolute -left-[15px] top-3.5 w-2 h-2 rounded-full ring-2 ring-white ${ACCENT_BG[a.accent]}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{a.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </MaintenanceLayout>
  );
}
