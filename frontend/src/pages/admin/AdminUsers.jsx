// src/pages/admin/AdminUsers.jsx
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users as UsersIcon,
  Search,
  Plus,
  Filter,
  GraduationCap,
  BookOpen,
  Wrench,
  ShieldCheck,
  Mail,
  IdCard,
  MoreVertical,
  Edit3,
  Trash2,
  X,
  UserCheck,
  UserX,
  Hash,
} from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";
import Card from "../../components/ui/Card";

// ---------- Placeholder data ----------
const USERS = [
  {
    id: 1,
    name: "Hanz Student",
    email: "hanz.student@uspf.edu.ph",
    identifier: "2023-00123",
    role: "Student",
    status: "Active",
    tickets: 5,
  },
  {
    id: 2,
    name: "Prof. Davis",
    email: "prof.davis@uspf.edu.ph",
    identifier: "2018-00456",
    role: "Faculty",
    status: "Active",
    tickets: 3,
  },
  {
    id: 3,
    name: "Raniel Pianar",
    email: "raniel.maintenance@uspf.edu.ph",
    identifier: "raniel_maintenance",
    role: "Maintenance",
    status: "Active",
    tickets: 12,
  },
  {
    id: 4,
    name: "Admin USPF",
    email: "admin@uspf.edu.ph",
    identifier: "admin_uspf",
    role: "Admin",
    status: "Active",
    tickets: 0,
  },
  {
    id: 5,
    name: "Maria Santos",
    email: "maria.santos@uspf.edu.ph",
    identifier: "2023-00456",
    role: "Student",
    status: "Active",
    tickets: 2,
  },
  {
    id: 6,
    name: "Prof. Reyes",
    email: "prof.reyes@uspf.edu.ph",
    identifier: "2019-00789",
    role: "Faculty",
    status: "Inactive",
    tickets: 0,
  },
  {
    id: 7,
    name: "Jomar Cruz",
    email: "jomar.maintenance@uspf.edu.ph",
    identifier: "jomar_maintenance",
    role: "Maintenance",
    status: "Active",
    tickets: 8,
  },
];

const ROLE_FILTERS = ["All", "Student", "Faculty", "Maintenance", "Admin"];

const ROLE_META = {
  Student: {
    icon: GraduationCap,
    style: "bg-blue-50 text-blue-600",
    gradient: "from-blue-500 to-indigo-600",
  },
  Faculty: {
    icon: BookOpen,
    style: "bg-emerald-50 text-emerald-600",
    gradient: "from-emerald-500 to-teal-600",
  },
  Maintenance: {
    icon: Wrench,
    style: "bg-amber-50 text-amber-600",
    gradient: "from-amber-500 to-orange-600",
  },
  Admin: {
    icon: ShieldCheck,
    style: "bg-indigo-50 text-indigo-600",
    gradient: "from-indigo-500 to-purple-600",
  },
};

export default function AdminUsers() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All");
  const [preview, setPreview] = useState(null);

  const filtered = useMemo(() => {
    return USERS.filter((u) => {
      const matchesRole = role === "All" || u.role === role;
      const matchesQuery =
        !query ||
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase()) ||
        u.identifier.toLowerCase().includes(query.toLowerCase());
      return matchesRole && matchesQuery;
    });
  }, [query, role]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Users
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage accounts for students, faculty, maintenance, and admins.
            </p>
          </div>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              bg-blue-600 text-white text-sm font-medium hover:bg-blue-700
              shadow-[0_8px_24px_-8px_rgba(59,130,246,0.6)] transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add User
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniStat
            label="Total Users"
            value={USERS.length}
            icon={UsersIcon}
            accent="bg-blue-50 text-blue-600"
          />
          <MiniStat
            label="Students"
            value={USERS.filter((u) => u.role === "Student").length}
            icon={GraduationCap}
            accent="bg-indigo-50 text-indigo-600"
          />
          <MiniStat
            label="Maintenance"
            value={USERS.filter((u) => u.role === "Maintenance").length}
            icon={Wrench}
            accent="bg-amber-50 text-amber-600"
          />
          <MiniStat
            label="Active"
            value={USERS.filter((u) => u.status === "Active").length}
            icon={UserCheck}
            accent="bg-emerald-50 text-emerald-600"
          />
        </div>

        {/* Filters */}
        <Card hover={false} className="!p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, or ID..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              <Filter className="w-4 h-4 text-gray-400 shrink-0 hidden lg:block" />
              {ROLE_FILTERS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition
                    ${
                      role === r
                        ? "bg-blue-600 text-white shadow-[0_4px_12px_-4px_rgba(59,130,246,0.5)]"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Count */}
        <div className="text-xs text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">{filtered.length}</span>{" "}
          of {USERS.length} users
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <Card hover={false}>
            <div className="p-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                No users found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or role filter.
              </p>
            </div>
          </Card>
        ) : (
          <Card hover={false} className="!p-0 overflow-hidden">
            <div className="divide-y divide-gray-100">
              <AnimatePresence mode="popLayout">
                {filtered.map((u, i) => (
                  <UserListRow
                    key={u.id}
                    user={u}
                    index={i}
                    onOpen={() => setPreview(u)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </Card>
        )}
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {preview && (
          <UserDetailModal user={preview} onClose={() => setPreview(null)} />
        )}
      </AnimatePresence>
    </AdminLayout>
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

/* ---------------- Avatar ---------------- */
function Avatar({ user, size = "md" }) {
  const meta = ROLE_META[user.role] ?? ROLE_META.Student;
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const sizes = {
    sm: "w-9 h-9 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
  };

  return (
    <div
      className={`${sizes[size]} shrink-0 rounded-xl bg-gradient-to-br ${meta.gradient}
      flex items-center justify-center text-white font-bold
      shadow-[0_4px_12px_-4px_rgba(59,130,246,0.4)]`}
    >
      {initials}
    </div>
  );
}

/* ---------------- Status pill ---------------- */
function StatusPill({ status }) {
  const style =
    status === "Active"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-gray-100 text-gray-500";
  const Icon = status === "Active" ? UserCheck : UserX;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${style}`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

/* ---------------- List Row ---------------- */
function UserListRow({ user, index, onOpen }) {
  const meta = ROLE_META[user.role] ?? ROLE_META.Student;
  const RoleIcon = meta.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      whileHover={{ backgroundColor: "rgba(248,250,252,0.8)" }}
      onClick={onOpen}
      className="flex items-center gap-4 px-5 py-4 cursor-pointer group"
    >
      <Avatar user={user} size="md" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-700 transition">
            {user.name}
          </h3>
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${meta.style}`}
          >
            <RoleIcon className="w-3 h-3" />
            {user.role}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1 truncate">
            <Mail className="w-3.5 h-3.5" /> {user.email}
          </span>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-500 shrink-0 w-32">
        <IdCard className="w-3.5 h-3.5" />
        <span className="font-mono truncate">{user.identifier}</span>
      </div>

      <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 shrink-0 w-20">
        <Hash className="w-3.5 h-3.5" />
        {user.tickets}
      </div>

      <div className="shrink-0">
        <StatusPill status={user.status} />
      </div>

      <button
        className="w-8 h-8 flex items-center justify-center rounded-lg
          text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <MoreVertical className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

/* ---------------- User Detail Modal ---------------- */
function UserDetailModal({ user, onClose }) {
  const meta = ROLE_META[user.role] ?? ROLE_META.Student;
  const RoleIcon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-2xl border border-gray-100 overflow-hidden
          shadow-[0_20px_60px_-20px_rgba(0,0,0,0.3)]"
      >
        <div
          className={`relative h-24 bg-gradient-to-br ${meta.gradient} overflow-hidden`}
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
        </div>

        <div className="px-6 -mt-10">
          <Avatar user={user} size="lg" />
        </div>

        <div className="px-6 pt-3 pb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${meta.style}`}
            >
              <RoleIcon className="w-3 h-3" />
              {user.role}
            </span>
          </div>
          <div className="mt-1">
            <StatusPill status={user.status} />
          </div>

          <div className="mt-5 space-y-3">
            <InfoRow icon={Mail} label="Email" value={user.email} />
            <InfoRow icon={IdCard} label="ID" value={user.identifier} mono />
            <InfoRow
              icon={Hash}
              label="Tickets Submitted"
              value={`${user.tickets} ticket${user.tickets !== 1 ? "s" : ""}`}
            />
          </div>

          <div className="mt-6 flex items-center gap-2">
            <button
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium
                bg-blue-600 text-white hover:bg-blue-700 shadow-[0_8px_24px_-8px_rgba(59,130,246,0.6)] transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit User
            </button>
            <button
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium
                bg-red-50 text-red-600 hover:bg-red-100 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function InfoRow({ icon: Icon, label, value, mono }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
      <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-white">
        <Icon className="w-3.5 h-3.5 text-gray-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
          {label}
        </p>
        <p
          className={`text-sm text-gray-800 truncate ${mono ? "font-mono" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
