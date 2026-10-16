// src/pages/maintenance/AssignedTasks.jsx
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Search,
  Filter,
  MapPin,
  Clock,
  AlertCircle,
  ChevronRight,
  X,
  Play,
  Camera,
  MessageSquare,
  Calendar,
  User,
  List,
  LayoutGrid,
  Ticket,
  Zap,
  CheckCircle2,
} from "lucide-react";
import MaintenanceLayout from "../../layout/MaintenanceLayout";
import Card from "../../components/ui/Card";

// ---------- Placeholder data ----------
const TASKS = [
  {
    id: "TKT-0016",
    title: "AC not cooling in Faculty Room",
    description: "AC unit running but not producing cold air since morning.",
    location: "Admin Building · Faculty Room",
    category: "Aircon",
    reporter: "Prof. Davis",
    status: "Open",
    priority: "Urgent",
    date: "Oct 16, 2026",
    age: "15m",
    notes: 0,
  },
  {
    id: "TKT-0015",
    title: "Clogged sink in CR-1F",
    description: "Water draining very slowly, starting to overflow.",
    location: "Main Building · CR 1F",
    category: "Plumbing",
    reporter: "Hanz Student",
    status: "Open",
    priority: "Medium",
    date: "Oct 16, 2026",
    age: "1h",
    notes: 1,
  },
  {
    id: "TKT-0013",
    title: "Broken projector in Room 302",
    description: "Projector won't power on. Tried different outlets.",
    location: "ITBU · Room 302",
    category: "Electrical",
    reporter: "Hanz Student",
    status: "In Progress",
    priority: "High",
    date: "Oct 15, 2026",
    age: "2h",
    notes: 2,
  },
  {
    id: "TKT-0012",
    title: "Leaking faucet in CR-2F",
    description: "Continuous drip from the left faucet.",
    location: "Main Building · CR 2F",
    category: "Plumbing",
    reporter: "Hanz Student",
    status: "In Progress",
    priority: "Medium",
    date: "Oct 14, 2026",
    age: "5h",
    notes: 3,
  },
  {
    id: "TKT-0009",
    title: "Loose chair in Room 205",
    description: "Chair leg is unstable and unsafe to sit on.",
    location: "Main Building · Room 205",
    category: "Furniture",
    reporter: "Hanz Student",
    status: "Open",
    priority: "Low",
    date: "Oct 08, 2026",
    age: "8d",
    notes: 0,
  },
];

const STATUS_FILTERS = ["All", "Open", "In Progress"];
const PRIORITY_FILTERS = ["All", "Low", "Medium", "High", "Urgent"];

const STATUS_META = {
  Open: {
    icon: AlertCircle,
    style: "bg-rose-50 text-rose-600",
    strip: "bg-rose-500",
  },
  "In Progress": {
    icon: Clock,
    style: "bg-amber-50 text-amber-600",
    strip: "bg-amber-500",
  },
};

const PRIORITY_STYLES = {
  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-amber-50 text-amber-600",
  High: "bg-rose-50 text-rose-600",
  Urgent: "bg-red-50 text-red-600",
};

export default function AssignedTasks() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [view, setView] = useState("list");
  const [preview, setPreview] = useState(null);

  const filtered = useMemo(() => {
    return TASKS.filter((t) => {
      const matchesStatus = status === "All" || t.status === status;
      const matchesPriority = priority === "All" || t.priority === priority;
      const matchesQuery =
        !query ||
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.id.toLowerCase().includes(query.toLowerCase()) ||
        t.location.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesPriority && matchesQuery;
    });
  }, [query, status, priority]);

  return (
    <MaintenanceLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Assigned Tasks
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Tickets assigned to you by the administrator.
          </p>
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
                placeholder="Search by title, ID, or location..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              <Filter className="w-4 h-4 text-gray-400 shrink-0 hidden lg:block" />
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setStatus(f)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition
                    ${
                      status === f
                        ? "bg-blue-600 text-white shadow-[0_4px_12px_-4px_rgba(59,130,246,0.5)]"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {f}
                </button>
              ))}

              <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1" />

              {PRIORITY_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setPriority(f)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition
                    ${
                      priority === f
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
          of {TASKS.length} tasks
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <Card hover={false}>
            <div className="p-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                No tasks found
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
                <TaskListRow
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
                <TaskGridCard
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

      {/* Task Detail Drawer */}
      <AnimatePresence>
        {preview && (
          <TaskDetailDrawer task={preview} onClose={() => setPreview(null)} />
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
          layoutId="task-view-toggle"
          className="absolute inset-0 rounded-lg bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <Icon className="w-3.5 h-3.5 relative z-10" />
    </button>
  );
}

/* ---------------- List Row ---------------- */
function TaskListRow({ task, index, onOpen }) {
  const meta = STATUS_META[task.status] ?? STATUS_META.Open;
  const StatusIcon = meta.icon;

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
          className={`hidden lg:block w-1 self-stretch rounded-full ${meta.strip}`}
        />

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
            {task.notes > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-500">
                <MessageSquare className="w-3 h-3" /> {task.notes}
              </span>
            )}
          </div>

          <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-700 transition">
            {task.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            {task.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {task.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {task.age} ago
            </span>
            <span className="inline-flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> {task.reporter}
            </span>
          </div>
        </div>

        <div className="flex lg:flex-col items-center lg:items-end gap-3 lg:gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${meta.style}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {task.status}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- Grid Card ---------------- */
function TaskGridCard({ task, index, onOpen }) {
  const meta = STATUS_META[task.status] ?? STATUS_META.Open;
  const StatusIcon = meta.icon;

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
      <div className={`h-1.5 w-full ${meta.strip}`} />

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
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {task.description}
        </p>

        <div className="mt-3 space-y-1.5 text-xs text-gray-500">
          <p className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> {task.location}
          </p>
          <p className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {task.age} ago
          </p>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full ${meta.style}`}
          >
            <StatusIcon className="w-3 h-3" />
            {task.status}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:translate-x-0.5 transition-transform">
            Open <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- Task Detail Drawer ---------------- */
function TaskDetailDrawer({ task, onClose }) {
  const meta = STATUS_META[task.status] ?? STATUS_META.Open;
  const StatusIcon = meta.icon;
  const [note, setNote] = useState("");

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
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-500">{task.id}</span>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${meta.style}`}
            >
              <StatusIcon className="w-3 h-3" />
              {task.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {task.title}
            </h3>
            <p className="text-sm text-gray-500 mt-2">{task.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoTile icon={MapPin} label="Location" value={task.location} />
            <InfoTile icon={Ticket} label="Category" value={task.category} />
            <InfoTile icon={User} label="Reporter" value={task.reporter} />
            <InfoTile icon={Calendar} label="Submitted" value={task.date} />
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-amber-800">
                Priority: {task.priority}
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                {task.priority === "Urgent"
                  ? "Handle this ticket as soon as possible."
                  : task.priority === "High"
                    ? "Aim to resolve within the day."
                    : "Handle within the standard window."}
              </p>
            </div>
          </div>

          {/* Work note */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Add Work Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe the steps you took..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white/70
                text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400
                transition resize-none"
            />
          </div>

          {/* Photo attach */}
          <button
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl
            border-2 border-dashed border-gray-200 bg-gray-50/50
            hover:border-blue-300 hover:bg-blue-50/30 transition text-xs text-gray-500"
          >
            <Camera className="w-4 h-4" />
            Attach resolution photo
          </button>
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-gray-100 flex items-center gap-2 shrink-0">
          {task.status === "Open" ? (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                bg-blue-600 text-white text-sm font-medium hover:bg-blue-700
                shadow-[0_8px_24px_-8px_rgba(59,130,246,0.6)] transition"
            >
              <Play className="w-4 h-4" />
              Start Task
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700
                shadow-[0_8px_24px_-8px_rgba(16,185,129,0.6)] transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark as Resolved
            </motion.button>
          )}

          <button
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium
            bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Note
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
