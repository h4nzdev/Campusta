import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, user, loading } = useAuth();
  const [loginTab, setLoginTab] = useState("email"); // "email" | "id"
  const [email, setEmail] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const identifier = loginTab === "email" ? email : schoolId;

    if (!identifier.trim()) {
      setError(
        loginTab === "email"
          ? "Please enter your university email."
          : "Please enter your student / school ID."
      );
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await login(identifier, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred during sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-radial from-slate-100 to-slate-200 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl border border-slate-150">
        {/* Branding */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-white font-bold text-3xl shadow-lg shadow-emerald-700/20">
            C
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
            CAMPUSTA
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Smart Campus Maintenance & Service Management System
          </p>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
            USPF USERS PORTAL
          </span>
        </div>

        {/* Login Method Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
          <button
            type="button"
            onClick={() => {
              setLoginTab("email");
              setError("");
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all cursor-pointer ${
              loginTab === "email"
                ? "bg-white text-emerald-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            University Email
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginTab("id");
              setError("");
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all cursor-pointer ${
              loginTab === "id"
                ? "bg-white text-emerald-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
              />
            </svg>
            Student / ID Login
          </button>
        </div>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-800 border border-red-200 flex items-center gap-2">
              <svg className="h-4 w-4 flex-shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Dynamic Identifier Field */}
          {loginTab === "email" ? (
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                University Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@uspf.edu.ph"
                  className="block w-full rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-colors"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <label
                htmlFor="schoolId"
                className="text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                Student / School ID
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <input
                  id="schoolId"
                  name="schoolId"
                  type="text"
                  required
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  placeholder="e.g., 2024-00123"
                  className="block w-full rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-colors font-mono"
                />
              </div>
            </div>
          )}

          {/* Password Field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                Password
              </label>
              <span className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-10 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || loading}
              className="group relative flex w-full justify-center rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all cursor-pointer shadow-md active:scale-[0.99] disabled:opacity-60"
            >
              {submitting ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          University of Southern Philippines Foundation
        </div>
      </div>
    </div>
  );
}
