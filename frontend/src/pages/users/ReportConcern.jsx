// src/pages/users/ReportConcern.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Tag,
  AlignLeft,
  QrCode,
  Camera,
  X,
  Send,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import UserLayout from "../../layout/UserLayout";
import Card from "../../components/ui/Card";

const CATEGORIES = [
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "furniture", label: "Furniture" },
  { value: "aircon", label: "Air Conditioning" },
  { value: "network", label: "Network / IT" },
  { value: "others", label: "Others" },
];

const PRIORITIES = [
  { value: "Low", style: "bg-gray-100 text-gray-600 border-gray-200" },
  { value: "Medium", style: "bg-amber-50 text-amber-600 border-amber-200" },
  { value: "High", style: "bg-rose-50 text-rose-600 border-rose-200" },
  { value: "Urgent", style: "bg-red-50 text-red-600 border-red-200" },
];

export default function ReportConcern() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    location: "",
    category: "",
    priority: "Medium",
    description: "",
    photo: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) setForm({ ...form, photo: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to backend POST /api/tickets
    console.log(form);
    setSubmitted(true);
    setTimeout(() => navigate("/user/tickets"), 1500);
  };

  return (
    <UserLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Report a Concern
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Submit a maintenance or service issue.
          </p>
        </div>

        {/* Success state */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-sm text-emerald-700">
                Ticket submitted successfully. Redirecting to your tickets...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <Card hover={false}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* QR Scan shortcut */}
            <button
              type="button"
              className="w-full flex items-center justify-between gap-3 p-4 rounded-xl
                bg-gradient-to-r from-blue-50 to-blue-50/40 border border-blue-100
                hover:from-blue-50 hover:to-blue-100/60 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-sm">
                  <QrCode className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">
                    Scan QR Code
                  </p>
                  <p className="text-xs text-gray-500">
                    Auto-fill location from a campus QR badge
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-blue-600 group-hover:translate-x-0.5 transition-transform">
                Scan →
              </span>
            </button>

            {/* Location */}
            <Field label="Location" icon={MapPin}>
              <input
                type="text"
                value={form.location}
                onChange={update("location")}
                placeholder="e.g. ITBU Room 302"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                required
              />
            </Field>

            {/* Category + Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Category" icon={Tag}>
                <select
                  value={form.category}
                  onChange={update("category")}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition appearance-none"
                  required
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Priority
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setForm({ ...form, priority: p.value })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition
                        ${
                          form.priority === p.value
                            ? p.style + " ring-2 ring-offset-1 ring-blue-500/20"
                            : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      {p.value}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <Field label="Description" icon={AlignLeft} align="top">
              <textarea
                value={form.description}
                onChange={update("description")}
                placeholder="Describe the issue in detail..."
                rows={4}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400
                  transition resize-none"
                required
              />
            </Field>

            {/* Photo upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Photo{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>

              {form.photo ? (
                <div className="relative flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50">
                    <Camera className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-700 truncate">
                      {form.photo.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(form.photo.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, photo: null })}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl
                    border-2 border-dashed border-gray-200 bg-gray-50/50
                    hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition"
                >
                  <Camera className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    Click to upload a photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Reports are reviewed by admin</span>
              </div>
              <motion.button
                type="submit"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                  bg-blue-600 text-white text-sm font-medium
                  hover:bg-blue-700 shadow-[0_8px_24px_-8px_rgba(59,130,246,0.6)] transition"
              >
                <Send className="w-4 h-4" />
                Submit Report
              </motion.button>
            </div>
          </form>
        </Card>
      </div>
    </UserLayout>
  );
}

function Field({ label, icon: Icon, align = "center", children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon
          className={`w-4 h-4 text-gray-400 absolute left-3 ${
            align === "top" ? "top-3" : "top-1/2 -translate-y-1/2"
          }`}
        />
        {children}
      </div>
    </div>
  );
}
