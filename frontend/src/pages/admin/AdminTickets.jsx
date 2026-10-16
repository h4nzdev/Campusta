// src/pages/admin/AdminTickets.jsx
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  User,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";
import Card from "../../components/ui/Card";

// ---------- Placeholder data ----------
const TICKETS = [
  {
    id: "TKT-0016",
    title: "AC not cooling in Faculty Room",
    description: "AC unit running but not producing cold air since morning.",
    location: "Admin Building · Faculty Room",
    category: "Aircon",
    reporter: "Prof. Davis",
    assignee: null,
    status: "Open",
    priority: "Urgent",
    date: "Oct 16, 2026",
  },
  {
    id: "TKT-0015",
    title: "Clogged sink in CR-1F",
    description: "Water draining very slowly, starting to overflow.",
    location: "Main Building · CR 1F",
    category: "Plumbing",
    reporter: "Hanz Student",
    assignee: null,
    status: "Open",
    priority: "Medium",
    date: "Oct 16, 2026",
  },
  {
    id: "TKT-0013",
    title: "Broken projector in Room 302",
    description: "Projector won't power on. Tried different outlets.",
    location: "ITBU · Room 302",
    category: "Electrical",
    reporter: "Hanz Student",
    assignee: "Raniel P.",
    status: "In Progress",
    priority: "High",
    date: "Oct 15, 2026",
  },
  {
    id: "TKT-0012",
    title: "Leaking faucet in CR-2F",
    description: "Continuous drip from the left faucet.",
    location: "Main Building · CR 2F",
    category: "Plumbing",
    reporter: "Hanz Student",
    assignee: "Raniel P.",
    status: "In Progress",
    priority: "Medium",
    date: "Oct 14, 2026",
  },
  {
    id: "TKT-0011",
    title: "Flickering lights in Lab 1",
    description: "Two fluorescent lights flickering on and off.",
    location: "ITBU · Lab 1",
    category: "Electrical",
    reporter: "Hanz Student",
    assignee: "Raniel P.",
    status: "Resolved",
    priority: "Low",
    date: "Oct 12, 2026",
  },
  {
    id: "TKT-0010",
    title: "AC not cooling in Faculty Room",
    description: "AC unit running but not producing cold air.",
    location: "Admin Building · Faculty Room",
    category: "Aircon",
    reporter: "Prof. Davis",
    assignee: "Raniel P.",
    status: "Closed",
    priority: "High",
    date: "Oct 10, 2026",
  },
  {
    id: "TKT-0009",
    title: "Loose chair in Room 205",
    description: "Chair leg is unstable and unsafe to sit on.",
    location: "Main Building · Room 205",
    category: "Furniture",
    reporter: "Hanz Student",
    assignee: null,
    status: "Rejected",
    priority: "Low",
    date: "Oct 08, 2026",
  },
];

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
  Resolved: {
    icon: CheckCircle2,
    style: "bg-emerald-50 text-emerald-600",
    strip: "bg-emerald-500",
  },
  Closed: {
    icon: CheckCircle2,
    style: "bg-gray-100 text-gray-600",
    strip: "bg-gray-400",
  },
  Rejected: {
    icon: XCircle,
    style: "bg-red-50 text-red-600",
    strip: "bg-red-500",
  },
};

const PRIORITY_STYLES = {
  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-amber-50 text-amber-600",
  High: "bg-rose-50 text-rose-600",
  Urgent: "bg-red-50 text-red-600",
};

const STATUS_FILTERS = ["All", "Open", "In Progress", "Resolved", "Closed"];
const PRIORITY_FILTERS = ["All", "Low", "Medium", "High", "Urgent"];

export default function AdminTickets() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");

  const filtered = useMemo(() => {
    return TICKETS.filter((t) => {
      const matchesStatus = status === "All" || t.status === status;
      const matchesPriority = priority === "All" || t.priority === priority;
      const matchesQuery =
        !query ||
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.id.toLowerCase().includes(query.toLowerCase()) ||
        t.location.toLowerCase().includes(query.toLowerCase()) ||
        t.reporter.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesPriority && matchesQuery;
    });
  }, [query, status, priority]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Tickets
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review, assign, and manage all campus concern tickets.
          </p>
        </div>

        {/* Filters */}
        <Card hover={false} className="!p-4">
          <div className="flex flex-col gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, ID, location, or reporter..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
              />
            </div>

            {/* Filter chips */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <Filter className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
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
              </div>

              <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1" />

              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
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
            </div>
          </div>
        </Card>

        {/* Results count */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filtered.length}
            </span>{" "}
            of {TICKETS.length} tickets
          </span>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <Card hover={false}>
            <div className="p-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50">
                <Ticket className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                No tickets found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filters.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((t, i) => (
                <TicketRow key={t.id} ticket={t} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function TicketRow({ ticket, index }) {
  const meta = STATUS_META[ticket.status] ?? STATUS_META.Open;
  const StatusIcon = meta.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.04, duration: 0.25, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100
        shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-5">
        {/* Left priority strip */}
        <div
          className={`hidden lg:block w-1 self-stretch rounded-full ${meta.strip}`}
        />

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono text-gray-400">
              {ticket.id}
            </span>
            <span className="text-[10px] text-gray-300">·</span>
            <span className="text-[10px] text-gray-500">{ticket.category}</span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${PRIORITY_STYLES[ticket.priority]}`}
            >
              {ticket.priority}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-700 transition">
            {ticket.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            {ticket.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {ticket.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {ticket.date}
            </span>
            <span className="inline-flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> {ticket.reporter}
            </span>
          </div>
        </div>

        {/* Right: status + assignee */}
        <div className="flex lg:flex-col items-center lg:items-end gap-3 lg:gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${meta.style}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {ticket.status}
          </span>

          {ticket.assignee ? (
            <span className="text-[10px] text-gray-500 inline-flex items-center gap-1">
              <User className="w-3 h-3" /> {ticket.assignee}
            </span>
          ) : (
            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Unassigned
            </span>
          )}

          <button
            className="ml-auto lg:ml-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium
              bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
          >
            Manage <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
