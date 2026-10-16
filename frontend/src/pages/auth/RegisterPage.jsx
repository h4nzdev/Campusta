// src/pages/auth/RegisterPage.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  BookOpen,
} from "lucide-react";

const FACTS = [
  {
    icon: GraduationCap,
    label: "For Students",
    value: "Report campus concerns in seconds",
  },
  {
    icon: BookOpen,
    label: "For Faculty",
    value: "Priority classroom & lab reporting",
  },
  { icon: QrCode, label: "QR-Based", value: "Auto-pin exact campus location" },
  {
    icon: ShieldCheck,
    label: "Verified",
    value: "Confirm fixes before closure",
  },
];

const BENEFITS = [
  "Submit concerns with photo evidence",
  "Track every ticket in real time",
  "Receive notifications on status changes",
  "Verify completed fixes before closing",
];

export default function RegisterPage() {
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [form, setForm] = useState({
    name: "",
    identifier: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!acceptedPrivacy) {
      setError("You must accept the Privacy Policy to continue.");
      return;
    }

    // TODO: wire up to backend /api/register → then send OTP
    setStep("otp");
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6 || otp.some((d) => d === "")) {
      setError("Please enter the 6-digit code.");
      return;
    }
    // TODO: wire up to backend /api/verify-otp
    console.log("Verify code:", code);
    navigate("/login", { replace: true });
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
          {/* Brand */}
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
            Join the smarter campus
          </div>

          <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            Your voice, <br />
            <span className="text-white/90">one QR away.</span>
          </h2>

          <p className="mt-4 text-sm text-white/80 leading-relaxed">
            Register once. Report anywhere on campus. Track everything — from
            submission to verified fix.
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

          {/* Benefits */}
          <div className="mt-8 pt-6 border-t border-white/15">
            <p className="text-[10px] uppercase tracking-wider text-white/60 font-semibold mb-3">
              What you get
            </p>
            <ul className="space-y-2">
              {BENEFITS.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
                  className="flex items-start gap-2 text-xs text-white/85"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-white mt-0.5 shrink-0" />
                  {b}
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

      {/* ---------------- RIGHT: FORM / OTP ---------------- */}
      <div
        className="relative w-full lg:w-1/2 flex items-center justify-center px-6 py-12
        bg-gradient-to-br from-gray-50 via-white to-blue-50/30
        lg:order-2 order-1"
      >
        <Link
          to="/"
          className="absolute top-6 right-6 inline-flex items-center gap-1.5 text-xs font-medium
            text-gray-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>

        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {step === "form" ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                  <div
                    className="w-14 h-14 flex items-center justify-center rounded-2xl bg-blue-50
                    shadow-[0_8px_30px_-12px_rgba(59,130,246,0.4)]"
                  >
                    <QrCode className="w-7 h-7 text-blue-600" />
                  </div>
                  <h1 className="mt-5 text-2xl font-bold text-gray-900 tracking-tight">
                    Create account
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Register as a student or faculty
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Field label="Full Name" icon={User}>
                    <input
                      type="text"
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Juan Dela Cruz"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                        text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                      required
                    />
                  </Field>

                  <Field label="Email or Student ID" icon={Mail}>
                    <input
                      type="text"
                      value={form.identifier}
                      onChange={update("identifier")}
                      placeholder="you@uspf.edu.ph or 2023-00123"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                        text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                      required
                    />
                  </Field>

                  <Field label="Password" icon={Lock}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={update("password")}
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
                  </Field>

                  <Field label="Confirm Password" icon={Lock}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={update("confirmPassword")}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                        text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                      required
                    />
                  </Field>

                  {/* Privacy policy */}
                  <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
                    <input
                      type="checkbox"
                      checked={acceptedPrivacy}
                      onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                      className="sr-only"
                    />
                    <span
                      className={`mt-0.5 w-4 h-4 shrink-0 rounded-md border flex items-center justify-center transition
                        ${
                          acceptedPrivacy
                            ? "bg-blue-600 border-blue-600"
                            : "bg-white border-gray-300"
                        }`}
                    >
                      {acceptedPrivacy && (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      )}
                    </span>
                    <span className="text-xs text-gray-600 leading-relaxed">
                      I agree to the{" "}
                      <Link
                        to="/privacy"
                        className="text-blue-600 font-medium hover:underline"
                      >
                        Privacy Policy
                      </Link>{" "}
                      and consent to CAMPUSTA processing my submitted concerns.
                    </span>
                  </label>

                  <motion.button
                    type="submit"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    disabled={!acceptedPrivacy}
                    className={`w-full py-2.5 rounded-xl text-white text-sm font-medium transition
                      ${
                        acceptedPrivacy
                          ? "bg-blue-600 hover:bg-blue-700 shadow-[0_12px_32px_-12px_rgba(59,130,246,0.7)]"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                  >
                    Create Account
                  </motion.button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </motion.div>
            ) : (
              <OtpStep
                key="otp"
                otp={otp}
                setOtp={setOtp}
                error={error}
                onSubmit={handleVerify}
                onBack={() => {
                  setStep("form");
                  setError("");
                  setOtp(["", "", "", "", "", ""]);
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Field wrapper ---------------- */
function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
        {children}
      </div>
    </div>
  );
}

/* ---------------- OTP Step ---------------- */
function OtpStep({ otp, setOtp, error, onSubmit, onBack }) {
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5)
      inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const next = ["", "", "", "", "", ""];
    pasted.split("").forEach((d, i) => (next[i] = d));
    setOtp(next);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 transition mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </button>

      <div className="flex flex-col items-center mb-8">
        <div
          className="w-14 h-14 flex items-center justify-center rounded-2xl bg-blue-50
          shadow-[0_8px_30px_-12px_rgba(59,130,246,0.4)]"
        >
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-gray-900 tracking-tight">
          Verify your email
        </h1>
        <p className="mt-1 text-sm text-gray-500 text-center max-w-xs">
          We sent a 6-digit confirmation code to your university email.
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm
            border border-red-100 text-center"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div
          className="flex items-center justify-center gap-2 sm:gap-3"
          onPaste={handlePaste}
        >
          {otp.map((digit, i) => (
            <motion.input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-xl
                border bg-white/70 text-gray-900
                focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition
                ${digit ? "border-blue-400" : "border-gray-200"}`}
            />
          ))}
        </div>

        <p className="text-center text-xs text-gray-500">
          Didn't receive the code?{" "}
          <button
            type="button"
            className="text-blue-600 font-medium hover:underline"
          >
            Resend
          </button>
        </p>

        <motion.button
          type="submit"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium
            hover:bg-blue-700 shadow-[0_12px_32px_-12px_rgba(59,130,246,0.7)] transition
            inline-flex items-center justify-center gap-2"
        >
          Verify & Continue
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </form>

      <p className="mt-6 text-center text-xs text-gray-500">
        Wrong email?{" "}
        <button
          onClick={onBack}
          className="text-blue-600 font-medium hover:underline"
        >
          Go back
        </button>
      </p>
    </motion.div>
  );
}
