// src/pages/admin/AdminTickets.jsx
import { useState, useEffect } from "react";
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
  Plus,
} from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";
import Card from "../../components/ui/Card";
import { getTickets, deleteTicket, storeTicket } from "../../services/ticketsService";
import { getLocations } from "../../services/locationService";
import api from "../../services/api";

// ---------- Status / Priority meta ----------
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
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    reporter_id: "",
    location_id: "",
    assigned_personnel_id: "",
    category_name: "",
    description: "",
    priority: "Medium",
    status: "Open",
  });
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const [ticketsData, locationsData, usersData] = await Promise.all([
        getTickets(),
        getLocations(),
        api.get("/users"),
      ]);
      setTickets(Array.isArray(ticketsData) ? ticketsData : ticketsData.data || []);
      setLocations(Array.isArray(locationsData) ? locationsData : locationsData.data || []);
      setUsers(Array.isArray(usersData.data) ? usersData.data : usersData.data?.data || []);
    } catch (err) {
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      await deleteTicket(id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError("Failed to delete ticket.");
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await storeTicket(ticketForm);
      setModalOpen(false);
      setTicketForm({
        reporter_id: "",
        location_id: "",
        category_name: "",
        description: "",
        priority: "Medium",
        status: "Open",
      });
      await loadTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket.");
    }
  };

  const filtered = tickets.filter((t) => {
    const matchesStatus = status === "All" || t.status === status;
    const matchesPriority = priority === "All" || t.priority === priority;
    const matchesQuery =
      !query ||
      (t.title && t.title.toLowerCase().includes(query.toLowerCase())) ||
      (t.id && t.id.toString().toLowerCase().includes(query.toLowerCase())) ||
      (t.location && t.location.toLowerCase().includes(query.toLowerCase())) ||
      (t.reporter && t.reporter.toLowerCase().includes(query.toLowerCase()));
    return matchesStatus && matchesPriority && matchesQuery;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Ticket className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="mt-2 text-sm text-gray-500">Loading tickets...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Tickets
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Review, assign, and manage all campus concern tickets.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" /> New Ticket
          </button>
        </div>

        {error && (
          <Card hover={false}>
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card hover={false} className="!p-4">
          <div className="flex flex-col gap-3">
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
            <span className="font-semibold text-gray-700">{filtered.length}</span>{" "}
            of {tickets.length} tickets
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
                <TicketRow key={t.id} ticket={t} index={i} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Create Ticket Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Create New Ticket
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reporter (User)
                    </label>
                    <select
                      name="reporter_id"
                      value={ticketForm.reporter_id}
                      onChange={(e) =>
                        setTicketForm({ ...ticketForm, reporter_id: e.target.value })
                      }
                      className="w-full pl-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                        text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                    >
                      <option value="">Select reporter</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.school_id || u.username})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <select
                      name="location_id"
                      value={ticketForm.location_id}
                      onChange={(e) =>
                        setTicketForm({ ...ticketForm, location_id: e.target.value })
                      }
                      className="w-full pl-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                        text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                    >
                      <option value="">Select location</option>
                      {locations.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name || l.qr_code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned Personnel
                    </label>
                    <select
                      name="assigned_personnel_id"
                      value={ticketForm.assigned_personnel_id}
                      onChange={(e) =>
                        setTicketForm({ ...ticketForm, assigned_personnel_id: e.target.value })
                      }
                      className="w-full pl-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                        text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                    >
                      <option value="">Unassigned</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category_name"
                      value={ticketForm.category_name}
                      onChange={(e) =>
                        setTicketForm({ ...ticketForm, category_name: e.target.value })
                      }
                      className="w-full pl-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                        text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Aircon">Aircon</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Network">Network</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={ticketForm.description}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, description: e.target.value })
                    }
                    rows={3}
                    placeholder="Describe the issue..."
                    className="w-full pl-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                      text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={ticketForm.priority}
                      onChange={(e) =>
                        setTicketForm({ ...ticketForm, priority: e.target.value })
                      }
                      className="w-full pl-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                        text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={ticketForm.status}
                      onChange={(e) =>
                        setTicketForm({ ...ticketForm, status: e.target.value })
                      }
                      className="w-full pl-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                        text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                  >
                    Create Ticket
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function TicketRow({ ticket, index, onDelete }) {
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
              #{ticket.id}
            </span>
            <span className="text-[10px] text-gray-300">·</span>
            <span className="text-[10px] text-gray-500">{t.category_name || t.category || "-"}</span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${PRIORITY_STYLES[t.priority || "Low"]}`}
            >
              {t.priority || "Low"}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-700 transition">
            {t.title || "Untitled Ticket"}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            {t.description || "-"}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {t.location || "-"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {t.created_at ? new Date(t.created_at).toLocaleDateString() : "-"}
            </span>
            <span className="inline-flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> {t.reporter_name || t.reporter || "-"}
            </span>
          </div>
        </div>

        {/* Right: status + assignee */}
        <div className="flex lg:flex-col items-center lg:items-end gap-3 lg:gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${meta.style}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {t.status || "Open"}
          </span>

          {t.assigned_personnel_name || t.assignee ? (
            <span className="text-[10px] text-gray-500 inline-flex items-center gap-1">
              <User className="w-3 h-3" /> {t.assigned_personnel_name || t.assignee}
            </span>
          ) : (
            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Unassigned
            </span>
          )}

          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium
                bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            >
              Manage <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(t.id)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium
                bg-red-50 text-red-600 hover:bg-red-100 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
