// src/pages/admin/AdminAnalytics.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Timer,
  Download,
  Calendar,
  MapPin,
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
  RadialBarChart,
  RadialBar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AdminLayout from "../../layout/AdminLayout";
import Card from "../../components/ui/Card";

// ---------- Placeholder data ----------
const RANGE_OPTIONS = ["7D", "30D", "90D", "1Y"];
const [_, setIgnored] = [null, null]; // placeholder for future

const KPIS = [
  {
    label: "Avg Response Time",
    value: "4.2h",
    change: "-18%",
    up: true,
    icon: Timer,
    accent: "bg-blue-50 text-blue-600",
  },
  {
    label: "Avg Resolution Time",
    value: "1.8d",
    change: "-12%",
    up: true,
    icon: Clock,
    accent: "bg-amber-50 text-amber-600",
  },
  {
    label: "Resolution Rate",
    value: "87%",
    change: "+5%",
    up: true,
    icon: CheckCircle2,
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Urgent Pending",
    value: "3",
    change: "+1",
    up: false,
    icon: AlertCircle,
    accent: "bg-rose-50 text-rose-600",
  },
];

const RESPONSE_TREND = [
  { month: "Jun", response: 6.2, resolution: 2.4 },
  { month: "Jul", response: 5.8, resolution: 2.1 },
  { month: "Aug", response: 5.1, resolution: 2.0 },
  { month: "Sep", response: 4.6, resolution: 1.9 },
  { month: "Oct", response: 4.2, resolution: 1.8 },
];

const VOLUME_TREND = [
  { month: "Jun", opened: 8, resolved: 6 },
  { month: "Jul", opened: 12, resolved: 9 },
  { month: "Aug", opened: 9, resolved: 11 },
  { month: "Sep", opened: 15, resolved: 12 },
  { month: "Oct", opened: 11, resolved: 8 },
];

const CATEGORY_BREAKDOWN = [
  { category: "Electrical", count: 12 },
  { category: "Plumbing", count: 8 },
  { category: "Furniture", count: 14 },
  { category: "Aircon", count: 6 },
  { category: "Network", count: 9 },
];

const BUILDING_RATES = [
  { building: "ITBU", rate: 82 },
  { building: "Main Bldg", rate: 74 },
  { building: "Admin", rate: 91 },
  { building: "Lab Wing", rate: 68 },
];

const STATUS_DISTRIBUTION = [
  { name: "Open", value: 12, color: "#f43f5e" },
  { name: "In Progress", value: 8, color: "#f59e0b" },
  { name: "Resolved", value: 47, color: "#10b981" },
  { name: "Closed", value: 21, color: "#94a3b8" },
];

const PEAK_HOURS = [
  { hour: "6a", count: 1 },
  { hour: "8a", count: 3 },
  { hour: "10a", count: 6 },
  { hour: "12p", count: 4 },
  { hour: "2p", count: 8 },
  { hour: "4p", count: 5 },
  { hour: "6p", count: 2 },
];

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #f1f5f9",
  boxShadow: "0 8px 30px -12px rgba(0,0,0,0.1)",
  fontSize: 12,
};

export default function AdminAnalytics() {
  const [range, setRange] = useState("30D");

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Analytics
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Issue breakdowns, resolution rates, and response benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Range toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-50 border border-gray-100">
              {RANGE_OPTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition
                    ${range === r ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {range === r && (
                    <motion.div
                      layoutId="analytics-range"
                      className="absolute inset-0 rounded-lg bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{r}</span>
                </button>
              ))}
            </div>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl
                bg-white border border-gray-200 text-gray-700 text-sm font-medium
                hover:bg-gray-50 transition shrink-0"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </motion.button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KPIS.map((k, i) => {
            const Icon = k.icon;
            return (
              <motion.div
                key={k.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                whileHover={{ y: -3 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100
                  shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {k.label}
                  </p>
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-xl ${k.accent}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-gray-900 tracking-tight">
                  {k.value}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  {k.up ? (
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-rose-500" />
                  )}
                  <p
                    className={`text-xs ${k.up ? "text-emerald-600" : "text-rose-600"}`}
                  >
                    {k.change} vs previous period
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Row: Response trend + Status donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card hover={false} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-700">
                  Response & Resolution Time
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Avg hours / days per month
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> Improving
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={RESPONSE_TREND}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
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
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend
                    wrapperStyle={{ fontSize: 11, color: "#64748b" }}
                    iconType="circle"
                  />
                  <Line
                    type="monotone"
                    name="Response (h)"
                    dataKey="response"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#3b82f6" }}
                  />
                  <Line
                    type="monotone"
                    name="Resolution (d)"
                    dataKey="resolution"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#f59e0b" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card hover={false}>
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-700">
                Status Distribution
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                All active & archived tickets
              </p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={STATUS_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {STATUS_DISTRIBUTION.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
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

        {/* Row: Volume trend + Category + Building rates */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card hover={false} className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-700">
                Ticket Volume
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Opened vs. resolved per month
              </p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={VOLUME_TREND}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="analyticsOpened"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="analyticsResolved"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
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
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend
                    wrapperStyle={{ fontSize: 11, color: "#64748b" }}
                    iconType="circle"
                  />
                  <Area
                    type="monotone"
                    name="Opened"
                    dataKey="opened"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#analyticsOpened)"
                  />
                  <Area
                    type="monotone"
                    name="Resolved"
                    dataKey="resolved"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#analyticsResolved)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card hover={false}>
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-700">
                Peak Reporting Hours
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Tickets submitted per hour
              </p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={PEAK_HOURS}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="hour"
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
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "#f8fafc" }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#6366f1"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Row: Category breakdown + Building resolution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card hover={false}>
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-700">
                Concerns by Category
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">All-time breakdown</p>
            </div>
            <div className="h-56">
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
                    contentStyle={tooltipStyle}
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

          <Card hover={false}>
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-gray-700">
                Building Resolution Rates
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                % resolved per building
              </p>
            </div>

            <div className="space-y-4">
              {BUILDING_RATES.map((b, i) => (
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

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
              <Activity className="w-3.5 h-3.5" />
              <span>
                Campus-wide average:{" "}
                <span className="font-semibold text-gray-700">78%</span>
              </span>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
