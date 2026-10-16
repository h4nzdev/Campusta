// src/pages/users/Settings.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  ShieldCheck,
  Trash2,
  Camera,
  Mail,
  IdCard,
  Eye,
  EyeOff,
  Save,
  Bell,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  X,
  BookOpen,
  HelpCircle,
  LogOut,
} from "lucide-react";
import UserLayout from "../../layout/UserLayout";
import Card from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "password", label: "Password", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

export default function UserSettings() {
  const [tab, setTab] = useState("profile");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <UserLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account, security, and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          {/* Tabs (sidebar) */}
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              const isDanger = id === "danger";
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`relative shrink-0 flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition text-left
                    ${
                      active
                        ? isDanger
                          ? "text-red-600"
                          : "text-blue-600"
                        : isDanger
                          ? "text-red-500 hover:bg-red-50"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  {active && (
                    <motion.div
                      layoutId="settings-tab-active"
                      className={`absolute inset-0 rounded-xl ${isDanger ? "bg-red-50" : "bg-blue-50"}`}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10 whitespace-nowrap">
                    {label}
                  </span>
                </button>
              );
            })}

            {/* Desktop-only logout */}
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium
                text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition mt-2 border-t border-gray-100 pt-4"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>

          {/* Content */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {tab === "profile" && <ProfileTab user={user} />}
                {tab === "password" && <PasswordTab />}
                {tab === "notifications" && <NotificationsTab />}
                {tab === "privacy" && <PrivacyTab />}
                {tab === "danger" && <DangerTab onLogout={handleLogout} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

/* ---------------- PROFILE TAB ---------------- */
function ProfileTab({ user }) {
  const [form, setForm] = useState({
    name: user?.name || "Hanz Student",
    email: user?.email || "hanz.student@uspf.edu.ph",
    id: "2023-00123",
    course: "BS Computer Science",
    year: "3rd Year",
  });
  const [saved, setSaved] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to backend
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card hover={false}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-800">
            Edit Profile
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Update your personal information.
          </p>
        </div>
        {saved && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Saved
          </motion.span>
        )}
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600
            flex items-center justify-center text-white text-xl font-bold shadow-[0_8px_24px_-8px_rgba(59,130,246,0.6)]"
          >
            {form.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <button
            type="button"
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-gray-200
              flex items-center justify-center shadow-sm hover:bg-gray-50 transition"
          >
            <Camera className="w-3 h-3 text-gray-600" />
          </button>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{form.name}</p>
          <p className="text-xs text-gray-500">
            Click the camera to change your avatar
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Full Name"
            value={form.name}
            onChange={update("name")}
            icon={User}
          />
          <InputField
            label="Student ID"
            value={form.id}
            onChange={update("id")}
            icon={IdCard}
            disabled
          />
          <InputField
            label="University Email"
            value={form.email}
            onChange={update("email")}
            icon={Mail}
            disabled
          />
          <InputField
            label="Course"
            value={form.course}
            onChange={update("course")}
            icon={BookOpen}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Year Level
          </label>
          <select
            value={form.year}
            onChange={update("year")}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/70 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
          >
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
          </select>
        </div>

        <div className="flex justify-end pt-2">
          <PrimaryButton icon={Save}>Save Changes</PrimaryButton>
        </div>
      </form>
    </Card>
  );
}

/* ---------------- PASSWORD TAB ---------------- */
function PasswordTab() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toggle = (k) => () => setShow((s) => ({ ...s, [k]: !s[k] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (form.next.length < 8)
      return setError("New password must be at least 8 characters.");
    if (form.next !== form.confirm) return setError("Passwords do not match.");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setForm({ current: "", next: "", confirm: "" });
  };

  return (
    <Card hover={false}>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-800">
          Update Password
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Use a strong password with at least 8 characters.
        </p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
      {saved && (
        <div className="mb-4 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> Password updated
          successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <PasswordField
          label="Current Password"
          value={form.current}
          onChange={update("current")}
          show={show.current}
          toggle={toggle("current")}
        />
        <PasswordField
          label="New Password"
          value={form.next}
          onChange={update("next")}
          show={show.next}
          toggle={toggle("next")}
        />
        <PasswordField
          label="Confirm New Password"
          value={form.confirm}
          onChange={update("confirm")}
          show={show.confirm}
          toggle={toggle("confirm")}
        />
        <div className="flex justify-end pt-2">
          <PrimaryButton icon={Lock}>Update Password</PrimaryButton>
        </div>
      </form>
    </Card>
  );
}

/* ---------------- NOTIFICATIONS TAB ---------------- */
function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    ticketUpdates: true,
    assignment: true,
    verification: true,
    comments: false,
    email: true,
    digest: false,
  });

  const items = [
    {
      key: "ticketUpdates",
      label: "Ticket status changes",
      desc: "Open → In Progress → Resolved",
    },
    {
      key: "assignment",
      label: "Assignment updates",
      desc: "When maintenance is assigned to your ticket",
    },
    {
      key: "verification",
      label: "Verification reminders",
      desc: "When a fix is ready for your review",
    },
    {
      key: "comments",
      label: "Comments & notes",
      desc: "New messages on your tickets",
    },
    {
      key: "email",
      label: "Email notifications",
      desc: "Send copies to your university email",
    },
    {
      key: "digest",
      label: "Weekly digest",
      desc: "Summary of your ticket activity",
    },
  ];

  return (
    <Card hover={false}>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-800">
          Notification Preferences
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Choose what updates you want to receive.
        </p>
      </div>

      <div className="space-y-1">
        {items.map(({ key, label, desc }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 py-3 px-3 rounded-xl hover:bg-gray-50/70 transition"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </div>
            <Toggle
              checked={prefs[key]}
              onChange={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------------- PRIVACY TAB ---------------- */
function PrivacyTab() {
  const sections = [
    {
      title: "Data We Collect",
      body: "Your name, university email, student ID, and the details of concerns you submit (location, category, description, photos). This data is used solely for maintenance tracking and resolution.",
    },
    {
      title: "How We Use It",
      body: "Ticket data is used to route concerns to the appropriate maintenance personnel and to provide analytics for campus improvements. Photos help maintenance staff understand the issue before arriving on-site.",
    },
    {
      title: "Who Can See It",
      body: "Students and faculty see only their own tickets. Maintenance sees assigned tickets. Admins see all tickets for routing and reporting purposes.",
    },
    {
      title: "Retention",
      body: "Resolved tickets are retained for institutional records and analytics for up to one academic year. You may request deletion of your account at any time from the Danger Zone tab.",
    },
    {
      title: "Your Rights",
      body: "You can view, edit, or delete your profile information. You can also request a copy of your ticket history by contacting the admin office.",
    },
  ];

  return (
    <Card hover={false}>
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-800">
          Privacy Policy
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          How CAMPUSTA handles your information.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
            className="p-4 rounded-xl bg-gray-50/60 border border-gray-100"
          >
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              {s.title}
            </h3>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed">
              {s.body}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-blue-800">Need more info?</p>
          <p className="text-xs text-blue-600 mt-0.5">
            Contact the CAMPUSTA admin team at admin@uspf.edu.ph for any privacy
            concerns.
          </p>
        </div>
      </div>
    </Card>
  );
}

/* ---------------- DANGER TAB ---------------- */
function DangerTab({ onLogout }) {
  const [confirm, setConfirm] = useState(false);
  const [text, setText] = useState("");

  const handleDelete = () => {
    // TODO: wire to backend DELETE /api/user
    console.log("Account deleted");
    onLogout();
  };

  return (
    <Card hover={false} className="!border-red-100">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Danger Zone
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Irreversible actions. Please proceed with caution.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-red-50/50 border border-red-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Delete Account
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Permanently remove your account and all associated ticket data.
              This action cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setConfirm(true)}
            className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium
              bg-red-600 text-white hover:bg-red-700 transition shadow-[0_8px_24px_-8px_rgba(239,68,68,0.6)]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-2xl border border-gray-100 p-6
                shadow-[0_20px_60px_-20px_rgba(0,0,0,0.3)]"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <button
                  onClick={() => setConfirm(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                Delete your account?
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This will permanently delete your account and all your tickets.
                Type{" "}
                <span className="font-mono font-semibold text-red-600">
                  DELETE
                </span>{" "}
                to confirm.
              </p>

              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="mt-4 w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/70 text-sm
                  focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400 transition"
              />

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setConfirm(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  disabled={text !== "DELETE"}
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white
                    bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Delete Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

/* ---------------- Shared bits ---------------- */
function InputField({ label, value, onChange, icon: Icon, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        )}
        <input
          type="text"
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
            text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition
            ${disabled ? "text-gray-400 cursor-not-allowed" : ""}`}
        />
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, toggle }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white/70 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
          required
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function PrimaryButton({ icon: Icon, children }) {
  return (
    <motion.button
      type="submit"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
        bg-blue-600 text-white text-sm font-medium
        hover:bg-blue-700 shadow-[0_8px_24px_-8px_rgba(59,130,246,0.6)] transition"
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.button>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-10 h-6 rounded-full transition-colors shrink-0
        ${checked ? "bg-blue-600" : "bg-gray-200"}`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm
          ${checked ? "left-[18px]" : "left-0.5"}`}
      />
    </button>
  );
}
