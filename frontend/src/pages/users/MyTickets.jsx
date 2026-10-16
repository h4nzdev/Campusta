// src/pages/users/MyTickets.jsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Search,
  Filter,
  PlusCircle,
  MapPin,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import UserLayout from "../../layout/UserLayout";
import Card from "../../components/ui/Card";

// Placeholder tickets (replace with API later)
const TICKETS = [
  {
    id: "TKT-0013",
    title: "Broken projector in Room 302",
    description: "Projector won't power on. Tried different outlets.",
    location: "ITBU · Room 302",
    category: "Electrical",
    status: "Open",
    priority: "High",
    date: "Oct 15, 2026",
  },
  {
    id: "TKT-0012",
    title: "Leaking faucet in CR-2F",
    description: "Continuous drip from the left faucet.",
    location: "Main Building · CR 2F",
    category: "Plumbing",
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
    status: "Rejected",
    priority: "Low",
    date: "Oct 08, 2026",
  },
];

const STATUS_META = {
  Open: {
    icon: AlertCircle,
    style: "bg-rose-50 text-rose-600",
    dot: "bg-rose-500",
  },
  "In Progress": {
    icon: Clock,
    style: "bg-amber-50 text-amber-600",
    dot: "bg-amber-500",
  },
  Resolved: {
    icon: CheckCircle2,
    style: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },
  Closed: {
    icon: CheckCircle2,
    style: "bg-gray-100 text-gray-600",
    dot: "bg-gray-400",
  },
  Rejected: {
    icon: XCircle,
    style: "bg-red-50 text-red-600",
    dot: "bg-red-500",
  },
};

const FILTERS = ["All", "Open", "In Progress", "Resolved", "Closed"];

export default function MyTickets() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    return TICKETS.filter((t) => {
      const matchesFilter = filter === "All" || t.status === filter;
      const matchesQuery =
        !query ||
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.id.toLowerCase().includes(query.toLowerCase()) ||
        t.location.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              My Tickets
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track all your submitted concerns.
            </p>
          </div>
          <Link
            to="/user/report"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              bg-blue-600 text-white text-sm font-medium hover:bg-blue-700
              shadow-[0_8px_24px_-8px_rgba(59,130,246,0.6)] transition"
          >
            <PlusCircle className="w-4 h-4" />
            Report Concern
          </Link>
        </div>

        {/* Search + Filters */}
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
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Tickets List */}
        {filtered.length === 0 ? (
          <Card hover={false}>
            <div className="p-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50">
                <ClipboardList className="w-6 h-6 text-blue-600" />
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
    </UserLayout>
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
        shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] p-5 transition"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-gray-400">{ticket.id}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{ticket.category}</span>
            <span className="text-xs text-gray-300">·</span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-md
              ${
                ticket.priority === "High" || ticket.priority === "Urgent"
                  ? "bg-rose-50 text-rose-600"
                  : ticket.priority === "Medium"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {ticket.priority}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-gray-800 truncate">
            {ticket.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {ticket.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {ticket.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {ticket.date}
            </span>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${meta.style}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {ticket.status}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
