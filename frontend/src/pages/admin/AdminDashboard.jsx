// src/pages/admin/AdminDashboard.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  MapPin,
  Users,
  BarChart3,
  Bell,
  ArrowRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  UserCheck,
  QrCode,
  Calendar,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import AdminLayout from "../../layout/AdminLayout";
import Card from "../../components/ui/Card";

// ---------- Placeholder data ----------
const ADMIN = { name: "Admin USPF" };

const STATS = [
  {
    label: "Open Tickets",
    value: 12,
    icon: AlertCircle,
    accent: "rose",
    trend: "+3 today",
    up: true,
  },
  {
    label: "In Progress",
    value: 8,
    icon: Clock,
    accent: "amber",
    trend: "Stable",
    up: null,
  },
  {
    label: "Resolved",
    value: 47,
    icon: CheckCircle2,
    accent: "emerald",
    trend: "+5 this week",
    up: true,
  },
  {
    label: "Urgent",
    value: 3,
    icon: Ticket,
    accent: "blue",
    trend: "-2 from yesterday",
    up: false,
  },
];

const MONTHLY_TREND = [
  { month: "Jun", opened: 8, resolved: 6, urgent: 1 },
  { month: "Jul", opened: 12, resolved: 9, urgent: 2 },
  { month: "Aug", opened: 9, resolved: 11, urgent: 1 },
  { month: "Sep", opened: 15, resolved: 12, urgent: 3 },
  { month: "Oct", opened: 11, resolved: 8, urgent: 2 },
];

const CATEGORY_BREAKDOWN = [
  { category: "Electrical", count: 12 },
  { category: "Plumbing", count: 8 },
  { category: "Furniture", count: 14 },
  { category: "Aircon", count: 6 },
  { category: "Network", count: 9 },
];

const BUILDING_RESOLUTION = [
  { building: "ITBU", rate: 82 },
  { building: "Main Bldg", rate: 74 },
  { building: "Admin", rate: 91 },
  { building: "Lab Wing", rate: 68 },
];

const PRIORITY_DISTRIBUTION = [
  { name: "Low", value: 14, color: "#94a3b8" },
  { name: "Medium", value: 22, color: "#3b82f6" },
  { name: "High", value: 9, color: "#f59e0b" },
  { name: "Urgent", value: 3, color: "#ef4444" },
];

// Queue preview — tickets awaiting assignment
const PENDING_ASSIGNMENT = [
  {
    id: "TKT-0013",
    title: "Broken projector in Room 302",
    category: "Electrical",
    priority: "High",
    age: "2h",
  },
  {
    id: "TKT-0015",
    title: "Clogged sink in CR-1F",
    category: "Plumbing",
    priority: "Medium",
    age: "1h",
  },
  {
    id: "TKT-0016",
    title: "AC not cooling in Faculty Room",
    category: "Aircon",
    priority: "Urgent",
    age: "15m",
  },
];

// Activity feed
const ACTIVITY_FEED = [
  {
    id: 1,
    text: "Raniel P. marked TKT-0012 as Resolved",
    time: "5m ago",
    accent: "emerald",
  },
  {
    id: 2,
    text: "TKT-0013 assigned to Raniel P.",
    time: "12m ago",
    accent: "blue",
  },
  {
    id: 3,
    text: "New ticket TKT-0016 submitted (Urgent)",
    time: "15m ago",
    accent: "rose",
  },
  {
    id: 4,
    text: "New location QR generated: ITBU Lab 2",
    time: "1h ago",
    accent: "amber",
  },
  {
    id: 5,
    text: "TKT-0010 closed after reporter verification",
    time: "3h ago",
    accent: "gray",
  },
];

const QUICK_ACTIONS = [
  {
    label: "Manage Tickets",
    to: "/admin/tickets",
    icon: Ticket,
    accent: "bg-blue-50 text-blue-600",
  },
  {
    label: "QR Locations",
    to: "/admin/locations",
    icon: QrCode,
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Manage Users",
    to: "/admin/users",
    icon: Users,
    accent: "bg-amber-50 text-amber-600",
  },
  {
    label: "View Analytics",
    to: "/admin/analytics",
    icon: BarChart3,
    accent: "bg-rose-50 text-rose-600",
  },
];

const PRIORITY_STYLES = {
  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-amber-50 text-amber-600",
  High: "bg-rose-50 text-rose-600",
  Urgent: "bg-red-50 text-red-600",
};

const ACCENT_BG = {
  rose: "bg-rose-50 text-rose-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  gray: "bg-gray-100 text-gray-600",
};

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ---------- Hero Banner ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl p-6 sm:p-8
            bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500
            shadow-[0_20px_50px_-20px_rgba(59,130,246,0.6)]"
        >
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-white/5 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-medium backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Admin Control Center
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Welcome back, {ADMIN.name} 👋
              </h1>
              <p className="mt-1 text-sm text-white/80">
                <span className="font-semibold">12 open tickets</span>,{" "}
                <span className="font-semibold">3 urgent</span>, and{" "}
                <span className="font-semibold">5 pending assignments</span>.
              </p>
            </div>

            <Link
              to="/admin/tickets"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                bg-white text-blue-700 text-sm font-semibold
                hover:bg-blue-50 transition shrink-0
                shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)]"
            >
              <Ticket className="w-4 h-4" />
              Manage Tickets
            </Link>
          </div>
        </motion.div>

        {/* ---------- Stats ---------- */}
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
                    <TrendingDown className="w-3 h-3 text-rose-500" />
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

        {/* ---------- Pending Assignment Queue ---------- */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-700">
                Pending Assignment
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">
                {PENDING_ASSIGNMENT.length} waiting
              </span>
            </div>
            <Link
              to="/admin/tickets"
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
            >
              View queue <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card hover={false} className="!p-0 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {PENDING_ASSIGNMENT.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  whileHover={{ backgroundColor: "rgba(248,250,252,0.8)" }}
                  className="relative flex items-center gap-4 px-5 py-4 group"
                >
                  {/* Priority strip */}
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

                  {/* ID + title */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
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

                  {/* Category */}
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 shrink-0 w-32">
                    <Activity className="w-3.5 h-3.5" />
                    {t.category}
                  </div>

                  {/* Age */}
                  <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 shrink-0 w-24">
                    <Clock className="w-3.5 h-3.5" />
                    {t.age} ago
                  </div>

                  {/* Action */}
                  <button
                    className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium
              bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Assign</span>
                  </button>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* ---------- Charts row: Area trend + Category bar ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Monthly trend */}
          <Card hover={false} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-700">
                  Ticket Trends
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Opened vs. resolved vs. urgent
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> Healthy
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={MONTHLY_TREND}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gradOpened" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="gradResolved"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradUrgent" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#ef4444"
                        stopOpacity={0.25}
                      />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
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
                    dataKey="opened"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#gradOpened)"
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#gradResolved)"
                  />
                  <Area
                    type="monotone"
                    dataKey="urgent"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    fill="url(#gradUrgent)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Priority pie */}
          <Card hover={false}>
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-700">
                Priority Distribution
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Active tickets by priority
              </p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PRIORITY_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {PRIORITY_DISTRIBUTION.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #f1f5f9",
                      boxShadow: "0 8px 30px -12px rgba(0,0,0,0.1)",
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: 11, color: "#64748b" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* ---------- Charts row: Category + Building resolution + Quick actions ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Category breakdown */}
          <Card hover={false} className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-700">
                Concerns by Category
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">All-time breakdown</p>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={CATEGORY_BREAKDOWN}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
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
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Quick actions */}
          <Card hover={false}>
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map(({ label, to, icon: Icon, accent }) => (
                <Link key={label} to={to}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50/60
                      hover:bg-gray-50 border border-transparent hover:border-gray-100 transition"
                  >
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-xl ${accent}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center">
                      {label}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* ---------- Building resolution + Activity feed ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Building resolution rates */}
          <Card hover={false}>
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-gray-700">
                Building Resolution Rates
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                % of tickets resolved per building
              </p>
            </div>

            <div className="space-y-4">
              {BUILDING_RESOLUTION.map((b, i) => (
                <motion.div
                  key={b.building}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-gray-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {b.building}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {b.rate}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${b.rate}%` }}
                      transition={{
                        duration: 0.9,
                        ease: "easeOut",
                        delay: 0.2 + i * 0.1,
                      }}
                      className={`h-full rounded-full ${
                        b.rate >= 85
                          ? "bg-emerald-500"
                          : b.rate >= 70
                            ? "bg-blue-500"
                            : "bg-amber-500"
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Activity feed */}
          <Card hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">
                Recent Activity
              </h2>
              <Link
                to="/admin/notifications"
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
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
      </div>
    </AdminLayout>
  );
}
