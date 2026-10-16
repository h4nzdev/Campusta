// src/pages/users/UserDashboard.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  QrCode,
  ClipboardList,
  Bell,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Calendar,
  MapPin,
  ChevronRight,
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
import UserLayout from "../../layout/UserLayout";
import Card from "../../components/ui/Card";

// ---------- Placeholder data ----------
const STUDENT = { name: "Hanz", course: "BS Computer Science", year: "3rd Year" };

const STATS = [
  { label: "Open Tickets", value: 3, icon: AlertCircle, accent: "rose", trend: "+1 this week" },
  { label: "In Progress", value: 2, icon: Clock, accent: "amber", trend: "On track" },
  { label: "Resolved", value: 8, icon: CheckCircle2, accent: "emerald", trend: "+2 this week" },
  { label: "Total Submitted", value: 13, icon: Ticket, accent: "blue", trend: "All time" },
];

const MONTHLY_ACTIVITY = [
  { month: "Jun", submitted: 2, resolved: 1 },
  { month: "Jul", submitted: 3, resolved: 2 },
  { month: "Aug", submitted: 1, resolved: 2 },
  { month: "Sep", submitted: 4, resolved: 3 },
  { month: "Oct", submitted: 3, resolved: 0 },
];

const CATEGORY_BREAKDOWN = [
  { category: "Electrical", count: 3 },
  { category: "Plumbing", count: 2 },
  { category: "Furniture", count: 4 },
  { category: "Aircon", count: 1 },
  { category: "Network", count: 3 },
];

// "Courses" → Active ticket groups (LMS-style cards)
const ACTIVE_CONCERNS = [
  {
    id: "TKT-0013",
    title: "Broken projector in Room 302",
    category: "Electrical",
    location: "ITBU · Room 302",
    status: "Open",
    priority: "High",
    progress: 15,
    updated: "2h ago",
  },
  {
    id: "TKT-0012",
    title: "Leaking faucet in CR-2F",
    category: "Plumbing",
    location: "Main Building · CR 2F",
    status: "In Progress",
    priority: "Medium",
    progress: 60,
    updated: "5m ago",
  },
  {
    id: "TKT-0011",
    title: "Flickering lights in Lab 1",
    category: "Electrical",
    location: "ITBU · Lab 1",
    status: "Resolved",
    priority: "Low",
    progress: 100,
    updated: "Yesterday",
  },
];

// "Deadlines" → Pending verifications / follow-ups
const PENDING_ACTIONS = [
  {
    id: "TKT-0011",
    title: "Verify fix: Flickering lights",
    due: "Due today",
    urgent: true,
  },
  {
    id: "TKT-0008",
    title: "Follow-up: Loose chair Room 205",
    due: "Due in 2 days",
    urgent: false,
  },
  {
    id: "TKT-0007",
    title: "Verify fix: CR 2F faucet",
    due: "Due in 5 days",
    urgent: false,
  },
];

// Activity feed
const ACTIVITY_FEED = [
  { id: 1, text: "TKT-0012 moved to In Progress", time: "5m ago", accent: "amber" },
  { id: 2, text: "TKT-0011 marked as Resolved", time: "2h ago", accent: "emerald" },
  { id: 3, text: "TKT-0013 assigned to Raniel P.", time: "Yesterday", accent: "blue" },
  { id: 4, text: "TKT-0010 closed by admin", time: "2d ago", accent: "gray" },
];

const QUICK_ACTIONS = [
  { label: "Report Concern", to: "/user/report", icon: PlusCircle, accent: "bg-blue-50 text-blue-600" },
  { label: "Scan QR", to: "/user/report", icon: QrCode, accent: "bg-emerald-50 text-emerald-600" },
  { label: "My Tickets", to: "/user/tickets", icon: ClipboardList, accent: "bg-amber-50 text-amber-600" },
  { label: "Notifications", to: "/user/notifications", icon: Bell, accent: "bg-rose-50 text-rose-600" },
];

const STATUS_STYLES = {
  Open: "bg-rose-50 text-rose-600",
  "In Progress": "bg-amber-50 text-amber-600",
  Resolved: "bg-emerald-50 text-emerald-600",
  Closed: "bg-gray-100 text-gray-600",
};

const ACCENT_BG = {
  rose: "bg-rose-50 text-rose-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  gray: "bg-gray-100 text-gray-600",
};

export default function UserDashboard() {
  return (
    <UserLayout>
      <div className="space-y-6">
        {/* ---------- Hero Greeting Banner ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl p-6 sm:p-8
            bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600
            shadow-[0_20px_50px_-20px_rgba(59,130,246,0.6)]"
        >
          {/* decorative blobs */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-white/5 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-medium backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                {STUDENT.year} · {STUDENT.course}
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Welcome back, {STUDENT.name} 👋
              </h1>
              <p className="mt-1 text-sm text-white/80">
                You have <span className="font-semibold">3 open tickets</span> and{" "}
                <span className="font-semibold">1 pending verification</span>.
              </p>
            </div>

            <Link
              to="/user/report"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                bg-white text-blue-700 text-sm font-semibold
                hover:bg-blue-50 transition shrink-0
                shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)]"
            >
              <PlusCircle className="w-4 h-4" />
              Report Concern
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
                  <div className={`w-9 h-9 flex items-center justify-center rounded-xl ${ACCENT_BG[s.accent]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="mt-3 text-3xl font-bold text-gray-900 tracking-tight">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-gray-400">{s.trend}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ---------- Active Concerns (LMS course-card style) ---------- */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">Active Concerns</h2>
            <Link
              to="/user/tickets"
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACTIVE_CONCERNS.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                whileHover={{ y: -4 }}
                className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100
                  shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] overflow-hidden"
              >
                {/* colored top strip */}
                <div
                  className={`h-1.5 w-full ${
                    c.status === "Open"
                      ? "bg-gradient-to-r from-rose-400 to-rose-500"
                      : c.status === "In Progress"
                      ? "bg-gradient-to-r from-amber-400 to-amber-500"
                      : "bg-gradient-to-r from-emerald-400 to-emerald-500"
                  }`}
                />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[10px] font-mono text-gray-400">{c.id}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[c.status]}`}>
                      {c.status}
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-700 transition">
                    {c.title}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {c.location}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Updated {c.updated}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1.5">
                      <span>Progress</span>
                      <span className="font-medium text-gray-600">{c.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${c.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 + i * 0.1 }}
                        className={`h-full rounded-full ${
                          c.status === "Resolved"
                            ? "bg-emerald-500"
                            : c.status === "In Progress"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ---------- Two-column: Activity chart + Pending actions ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Activity Area chart */}
          <Card hover={false} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-700">Activity Overview</h2>
                <p className="text-xs text-gray-400 mt-0.5">Submitted vs. resolved</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> +12%
              </span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_ACTIVITY} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradSubmitted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #f1f5f9",
                      boxShadow: "0 8px 30px -12px rgba(0,0,0,0.1)",
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="submitted" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gradSubmitted)" />
                  <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2.5} fill="url(#gradResolved)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Pending actions (LMS "due soon" style) */}
          <Card hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">Pending Actions</h2>
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>

            <div className="space-y-2.5">
              {PENDING_ACTIONS.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                  whileHover={{ x: 3 }}
                  className="flex items-start gap-3 p-3 rounded-xl
                    bg-gray-50/70 hover:bg-gray-50 border border-transparent hover:border-gray-100
                    cursor-pointer transition group"
                >
                  <div
                    className={`mt-0.5 w-1.5 h-1.5 shrink-0 rounded-full ${
                      p.urgent ? "bg-rose-500" : "bg-blue-400"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-800 line-clamp-2 group-hover:text-blue-700 transition">
                      {p.title}
                    </p>
                    <p className={`text-[10px] mt-0.5 ${p.urgent ? "text-rose-600 font-medium" : "text-gray-400"}`}>
                      {p.due}
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition" />
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* ---------- Bottom row: Category bar + Quick actions + Activity feed ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Category breakdown */}
          <Card hover={false} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-700">Concerns by Category</h2>
                <p className="text-xs text-gray-400 mt-0.5">All-time breakdown</p>
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CATEGORY_BREAKDOWN} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #f1f5f9",
                      boxShadow: "0 8px 30px -12px rgba(0,0,0,0.1)",
                      fontSize: 12,
                    }}
                    cursor={{ fill: "#f8fafc" }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Quick actions */}
          <Card hover={false}>
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h2>
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
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center">{label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* ---------- Activity Feed ---------- */}
        <Card hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">Recent Activity</h2>
            <Link
              to="/user/notifications"
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
                <span className={`absolute -left-[15px] top-3.5 w-2 h-2 rounded-full ring-2 ring-white ${ACCENT_BG[a.accent]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{a.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </UserLayout>
  );
}