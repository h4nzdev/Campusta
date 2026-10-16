// src/pages/auth/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  QrCode,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  BarChart3,
  Bell,
  Sparkles,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { login as loginService } from "../../services/authService";

const FACTS = [
  {
    icon: QrCode,
    label: "QR-based reporting",
    value: "Auto-pin exact campus location",
  },
  {
    icon: ShieldCheck,
    label: "Verified resolutions",
    value: "Reporters confirm every fix",
  },
  {
    icon: BarChart3,
    label: "Live analytics",
    value: "Response times & building trends",
  },
  { icon: Bell, label: "Notifications", value: "Real-time status updates" },
];

const WHY = [
  "Replace verbal & message-based reporting",
  "Track every concern from Open to Closed",
  "Give maintenance clear, actionable tasks",
  "Provide admins full campus oversight",
];

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const user = await loginService({ identifier, password });
      login(user, "no-token-yet");
      navigate("/user/dashboard", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Invalid credentials. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* ---------------- LEFT: INFO PANEL ---------------- */}
      <div
        className="relative w-full lg:w-1/2 overflow-hidden
        bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700
        flex items-center justify-center px-6 py-12 lg:py-16
        lg:order-1 order-2"
      >
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative w-full max-w-md"
        >
          {/* Logo + brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-white tracking-tight leading-tight">
                CAMPUSTA
              </p>
              <p className="text-[11px] text-white/70">
                USPF Campus Maintenance
              </p>
            </div>
          </div>

          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Smart campus, simplified
          </div>

          <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            Report. Track. <br />
            <span className="text-white/90">Resolve — together.</span>
          </h2>

          <p className="mt-4 text-sm text-white/80 leading-relaxed">
            One system for every campus concern — from a flickering bulb in Room
            302 to a leaking faucet in CR-2F.
          </p>

          {/* Facts */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FACTS.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.35 }}
                  className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15
                    hover:bg-white/15 transition"
                >
                  <Icon className="w-4 h-4 text-white/90" />
                  <p className="mt-2 text-xs font-semibold text-white">
                    {f.label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/70 leading-snug">
                    {f.value}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Why */}
          <div className="mt-8 pt-6 border-t border-white/15">
            <p className="text-[10px] uppercase tracking-wider text-white/60 font-semibold mb-3">
              Why CAMPUSTA
            </p>
            <ul className="space-y-2">
              {WHY.map((w, i) => (
                <motion.li
                  key={w}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
                  className="flex items-start gap-2 text-xs text-white/85"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-white mt-0.5 shrink-0" />
                  {w}
                </motion.li>
              ))}
            </ul>
          </div>

          <p className="mt-8 text-[10px] text-white/50">
            © {new Date().getFullYear()} CAMPUSTA · University of Southern
            Philippines Foundation
          </p>
        </motion.div>
      </div>

      {/* ---------------- RIGHT: LOGIN FORM ---------------- */}
      <div
        className="relative w-full lg:w-1/2 flex items-center justify-center px-6 py-12
        bg-gradient-to-br from-gray-50 via-white to-blue-50/30
        lg:order-2 order-1"
      >
        <Link
          to="/"
          className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-xs font-medium
            text-gray-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-14 h-14 flex items-center justify-center rounded-2xl bg-blue-50
              shadow-[0_8px_30px_-12px_rgba(59,130,246,0.4)]"
            >
              <QrCode className="w-7 h-7 text-blue-600" />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-gray-900 tracking-tight">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Sign in to your CAMPUSTA account
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm
                border border-red-100"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email or Student ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@uspf.edu.ph or 2023-00123"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white/70
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium
                hover:bg-blue-700 shadow-[0_12px_32px_-12px_rgba(59,130,246,0.7)] transition
                inline-flex items-center justify-center gap-2"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
