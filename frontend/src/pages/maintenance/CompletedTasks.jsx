// src/pages/maintenance/CompletedTasks.jsx
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Search,
  Filter,
  MapPin,
  Clock,
  Timer,
  ChevronRight,
  X,
  User,
  Calendar,
  MessageSquare,
  Camera,
  List,
  LayoutGrid,
  TrendingUp,
  Ticket,
  Award,
  CalendarDays,
} from "lucide-react";
import MaintenanceLayout from "../../layout/MaintenanceLayout";
import Card from "../../components/ui/Card";

// ---------- Placeholder data ----------
const COMPLETED = [
  {
    id: "TKT-0011",
    title: "Flickering lights in Lab 1",
    description: "Two fluorescent lights flickering on and off.",
    location: "ITBU · Lab 1",
    category: "Electrical",
    reporter: "Hanz Student",
    priority: "Low",
    completedAt: "Oct 15, 2026",
    completedAgo: "Yesterday",
    duration: "1h 20m",
    verified: true,
    photos: 2,
    notes: 3,
  },
  {
    id: "TKT-0010",
    title: "AC not cooling in Faculty Room",
    description: "AC unit running but not producing cold air.",
    location: "Admin Building · Faculty Room",
    category: "Aircon",
    reporter: "Prof. Davis",
    priority: "High",
    completedAt: "Oct 14, 2026",
    completedAgo: "2d ago",
    duration: "3h 45m",
    verified: true,
    photos: 4,
    notes: 5,
  },
  {
    id: "TKT-0008",
    title: "Loose chair in Room 205",
    description: "Chair leg is unstable and unsafe to sit on.",
    location: "Main Building · Room 205",
    category: "Furniture",
    reporter: "Hanz Student",
    priority: "Low",
    completedAt: "Oct 13, 2026",
    completedAgo: "3d ago",
    duration: "30m",
    verified: true,
    photos: 1,
    notes: 1,
  },
  {
    id: "TKT-0007",
    title: "CR 2F faucet leak",
    description: "Continuous drip from the left faucet.",
    location: "Main Building · CR 2F",
    category: "Plumbing",
    reporter: "Hanz Student",
    priority: "Medium",
    completedAt: "Oct 12, 2026",
    completedAgo: "4d ago",
    duration: "45m",
    verified: false,
    photos: 2,
    notes: 2,
  },
  {
    id: "TKT-0006",
    title: "Projector HDMI port not working",
    description: "HDMI port 2 on the projector has no signal.",
    location: "ITBU · Room 401",
    category: "Electrical",
    reporter: "Prof. Reyes",
    priority: "Medium",
    completedAt: "Oct 11, 2026",
    completedAgo: "5d ago",
    duration: "1h 10m",
    verified: true,
    photos: 3,
    notes: 4,
  },
  {
    id: "TKT-0005",
    title: "Door lock jammed in Room 108",
    description: "Key won't turn; door stuck from inside.",
    location: "Main Building · Room 108",
    category: "Furniture",
    reporter: "Maria Santos",
    priority: "High",
    completedAt: "Oct 10, 2026",
    completedAgo: "6d ago",
    duration: "2h",
    verified: true,
    photos: 2,
    notes: 3,
  },
];

const RANGE_FILTERS = ["All", "Today", "This Week", "This Month"];
const VERIFY_FILTERS = ["All", "Verified", "Awaiting"];

const PRIORITY_STYLES = {
  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-amber-50 text-amber-600",
  High: "bg-rose-50 text-rose-600",
  Urgent: "bg-red-50 text-red-600",
};

const CATEGORY_ACCENT = {
  Electrical: "from-blue-500 to-indigo-600",
  Plumbing: "from-cyan-500 to-blue-600",
  Furniture: "from-amber-500 to-orange-600",
  Aircon: "from-emerald-500 to-teal-600",
  Network: "from-purple-500 to-indigo-600",
};

export default function CompletedTasks() {
  const [query, setQuery] = useState("");
  const [range, setRange] = useState("All");
  const [verifyFilter, setVerifyFilter] = useState("All");
  const [view, setView] = useState("list");
  const [preview, setPreview] = useState(null);

  const filtered = useMemo(() => {
    return COMPLETED.filter((t) => {
      const matchesVerify =
        verifyFilter === "All" ||
        (verifyFilter === "Verified" && t.verified) ||
        (verifyFilter === "Awaiting" && !t.verified);
      const matchesQuery =
        !query ||
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.id.toLowerCase().includes(query.toLowerCase()) ||
        t.location.toLowerCase().includes(query.toLowerCase());
      return matchesVerify && matchesQuery;
    });
  }, [query, verifyFilter, range]);

  const stats = useMemo(() => {
    const totalDurationMins = COMPLETED.reduce((sum, t) => {
      const [h, m] = t.duration.replace("m", "").split("h ");
      return sum + (parseInt(h) || 0) * 60 + (parseInt(m) || 0);
    }, 0);
    const avgMins = Math.round(totalDurationMins / COMPLETED.length);
    return {
      total: COMPLETED.length,
      verified: COMPLETED.filter((t) => t.verified).length,
      avgTime: `${Math.floor(avgMins / 60)}h ${avgMins % 60}m`,
    };
  }, []);

  return (
    <MaintenanceLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Completed
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Your resolved tasks and their outcomes.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MiniStat
            label="Total Completed"
            value={stats.total}
            icon={CheckCircle2}
            accent="bg-emerald-50 text-emerald-600"
          />
          <MiniStat
            label="Verified by Reporter"
            value={stats.verified}
            icon={Award}
            accent="bg-blue-50 text-blue-600"
          />
          <MiniStat
            label="Avg Resolution Time"
            value={stats.avgTime}
            icon={Timer}
            accent="bg-amber-50 text-amber-600"
          />
        </div>

        {/* Filters + view */}
        <Card hover={false} className="!p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search completed tasks..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              <Filter className="w-4 h-4 text-gray-400 shrink-0 hidden lg:block" />
              {RANGE_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setRange(f)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition
                    ${
                      range === f
                        ? "bg-blue-600 text-white shadow-[0_4px_12px_-4px_rgba(59,130,246,0.5)]"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {f}
                </button>
              ))}

              <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1" />

              {VERIFY_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setVerifyFilter(f)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition
                    ${
                      verifyFilter === f
                        ? "bg-gray-800 text-white"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-50 border border-gray-100 shrink-0 self-start lg:self-auto">
              <ViewButton
                active={view === "list"}
                onClick={() => setView("list")}
                icon={List}
              />
              <ViewButton
                active={view === "grid"}
                onClick={() => setView("grid")}
                icon={LayoutGrid}
              />
            </div>
          </div>
        </Card>

        {/* Count */}
        <div className="text-xs text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">{filtered.length}</span>{" "}
          of {COMPLETED.length} completed tasks
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <Card hover={false}>
            <div className="p-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-50">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                No completed tasks found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filters.
              </p>
            </div>
          </Card>
        ) : view === "list" ? (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((t, i) => (
                <CompletedListRow
                  key={t.id}
                  task={t}
                  index={i}
                  onOpen={() => setPreview(t)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((t, i) => (
                <CompletedGridCard
                  key={t.id}
                  task={t}
                  index={i}
                  onOpen={() => setPreview(t)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {preview && (
          <CompletedDetailDrawer
            task={preview}
            onClose={() => setPreview(null)}
          />
        )}
      </AnimatePresence>
    </MaintenanceLayout>
  );
}

/* ---------------- View Toggle ---------------- */
function ViewButton({ active, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-8 h-8 flex items-center justify-center rounded-lg transition
        ${active ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
    >
      {active && (
        <motion.div
          layoutId="completed-view-toggle"
          className="absolute inset-0 rounded-lg bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <Icon className="w-3.5 h-3.5 relative z-10" />
    </button>
  );
}

/* ---------------- MiniStat ---------------- */
function MiniStat({ label, value, icon: Icon, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100
        shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] p-4 flex items-center gap-3"
    >
      <div
        className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-xl ${accent}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 truncate">{label}</p>
        <p className="text-lg font-bold text-gray-900 tracking-tight">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

/* ---------------- Verification Badge ---------------- */
function VerificationBadge({ verified }) {
  return verified ? (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
      <CheckCircle2 className="w-3 h-3" /> Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
      <Clock className="w-3 h-3" /> Awaiting
    </span>
  );
}

/* ---------------- List Row ---------------- */
function CompletedListRow({ task, index, onOpen }) {
  const accent =
    CATEGORY_ACCENT[task.category] ?? "from-emerald-500 to-teal-600";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      whileHover={{ y: -2 }}
      onClick={onOpen}
      className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100
        shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] overflow-hidden cursor-pointer"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-5">
        <div
          className={`hidden lg:flex w-10 h-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent} shadow-[0_4px_12px_-4px_rgba(16,185,129,0.4)]`}
        >
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono text-gray-400">
              {task.id}
            </span>
            <span className="text-[10px] text-gray-300">·</span>
            <span className="text-[10px] text-gray-500">{task.category}</span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${PRIORITY_STYLES[task.priority]}`}
            >
              {task.priority}
            </span>
            <VerificationBadge verified={task.verified} />
          </div>

          <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-700 transition">
            {task.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {task.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {task.completedAgo}
            </span>
            <span className="inline-flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> {task.reporter}
            </span>
          </div>
        </div>

        <div className="flex lg:flex-col items-center lg:items-end gap-3 lg:gap-1.5 shrink-0">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
            <Timer className="w-3.5 h-3.5" /> {task.duration}
          </span>

          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
            {task.photos > 0 && (
              <span className="inline-flex items-center gap-1">
                <Camera className="w-3 h-3" /> {task.photos}
              </span>
            )}
            {task.notes > 0 && (
              <span className="inline-flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> {task.notes}
              </span>
            )}
          </div>
        </div>

        <ChevronRight className="hidden lg:block w-4 h-4 text-gray-300 group-hover:text-gray-500 transition shrink-0" />
      </div>
    </motion.div>
  );
}

/* ---------------- Grid Card ---------------- */
function CompletedGridCard({ task, index, onOpen }) {
  const accent =
    CATEGORY_ACCENT[task.category] ?? "from-emerald-500 to-teal-600";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4 }}
      onClick={onOpen}
      className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100
        shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] overflow-hidden cursor-pointer flex flex-col"
    >
      <div
        className={`relative h-20 bg-gradient-to-br ${accent} overflow-hidden`}
      >
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute top-3 right-3">
          <VerificationBadge verified={task.verified} />
        </div>
        <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-white">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-[10px] font-semibold">{task.category}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <span className="text-[10px] font-mono text-gray-400">{task.id}</span>
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${PRIORITY_STYLES[task.priority]}`}
          >
            {task.priority}
          </span>
        </div>

        <h3 className="mt-2 text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-700 transition">
          {task.title}
        </h3>

        <div className="mt-3 space-y-1.5 text-xs text-gray-500">
          <p className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> {task.location}
          </p>
          <p className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {task.completedAgo}
          </p>
        </div>

        <div className="mt-auto pt-4 pt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
            <Timer className="w-3.5 h-3.5" /> {task.duration}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:translate-x-0.5 transition-transform">
            View <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- Detail Drawer ---------------- */
function CompletedDetailDrawer({ task, onClose }) {
  const accent =
    CATEGORY_ACCENT[task.category] ?? "from-emerald-500 to-teal-600";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-end"
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-white border-l border-gray-100
          shadow-[0_20px_60px_-20px_rgba(0,0,0,0.3)]
          flex flex-col"
      >
        {/* Header */}
        <div
          className={`relative h-24 bg-gradient-to-br ${accent} overflow-hidden shrink-0`}
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/5 blur-2xl" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg
              bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="absolute bottom-4 left-5 flex items-center gap-2 text-white">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-semibold">Completed</span>
            {task.verified && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                <Award className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-gray-500">{task.id}</span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${PRIORITY_STYLES[task.priority]}`}
              >
                {task.priority}
              </span>
            </div>
            <h3 className="text-base font-semibold text-gray-900">
              {task.title}
            </h3>
            <p className="text-sm text-gray-500 mt-2">{task.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoTile icon={MapPin} label="Location" value={task.location} />
            <InfoTile icon={Ticket} label="Category" value={task.category} />
            <InfoTile icon={User} label="Reporter" value={task.reporter} />
            <InfoTile
              icon={CalendarDays}
              label="Completed"
              value={task.completedAt}
            />
          </div>

          {/* Duration + counts */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <Timer className="w-4 h-4 text-gray-400 mx-auto" />
              <p className="mt-1.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                Duration
              </p>
              <p className="text-xs font-semibold text-gray-800 mt-0.5">
                {task.duration}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <Camera className="w-4 h-4 text-gray-400 mx-auto" />
              <p className="mt-1.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                Photos
              </p>
              <p className="text-xs font-semibold text-gray-800 mt-0.5">
                {task.photos}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <MessageSquare className="w-4 h-4 text-gray-400 mx-auto" />
              <p className="mt-1.5 text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                Notes
              </p>
              <p className="text-xs font-semibold text-gray-800 mt-0.5">
                {task.notes}
              </p>
            </div>
          </div>

          {/* Verification status banner */}
          {task.verified ? (
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-emerald-800">
                  Reporter verified the fix
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  This ticket is now fully closed.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-amber-800">
                  Awaiting reporter verification
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  {task.reporter} has not confirmed the resolution yet.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 flex items-center gap-2 shrink-0">
          <button
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
            bg-gray-50 text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
          >
            <MessageSquare className="w-4 h-4" />
            View Notes
          </button>
          <button
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
            bg-blue-600 text-white text-sm font-medium hover:bg-blue-700
            shadow-[0_8px_24px_-8px_rgba(59,130,246,0.6)] transition"
          >
            <Camera className="w-4 h-4" />
            View Photos
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3 text-gray-400" />
        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
          {label}
        </p>
      </div>
      <p className="text-xs text-gray-800 truncate">{value}</p>
    </div>
  );
}
