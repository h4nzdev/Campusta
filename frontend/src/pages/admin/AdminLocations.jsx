// src/pages/admin/AdminLocations.jsx
import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Search,
  Plus,
  QrCode,
  Building2,
  Layers,
  DoorOpen,
  Trash2,
  Printer,
  Copy,
  Check,
  X,
  Filter,
  Hash,
  List,
  LayoutGrid,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import AdminLayout from "../../layout/AdminLayout";
import Card from "../../components/ui/Card";
import {
  getLocations,
  store as storeLocation,
} from "../../services/locationService";

/* ---------------- Static UI config ---------------- */
const BUILDINGS = [
  "All",
  "ITBU",
  "Main Building",
  "Admin Building",
  "Lab Wing",
];

const TYPE_STYLES = {
  Classroom: "bg-blue-50 text-blue-600",
  Laboratory: "bg-emerald-50 text-emerald-600",
  Restroom: "bg-amber-50 text-amber-600",
  Office: "bg-indigo-50 text-indigo-600",
  "Function Hall": "bg-rose-50 text-rose-600",
};

/* ---------------- Helpers ---------------- */
// The backend returns { id, qr_code, building, floor, room, ... }
// We normalise to the shape the UI expects: { id, qr, building, floor, room, type, tickets }
function normalizeLocation(raw) {
  return {
    id: raw.id ?? Date.now(),
    qr: raw.qr_code ?? raw.qr ?? "",
    building: raw.building ?? "",
    floor: raw.floor ?? "",
    room: raw.room ?? "",
    type: raw.type ?? "Classroom",
    tickets: raw.tickets ?? 0,
  };
}

export default function AdminLocations() {
  const [query, setQuery] = useState("");
  const [building, setBuilding] = useState("All");
  const [view, setView] = useState("list"); // "list" | "grid"
  const [preview, setPreview] = useState(null);
  const [copied, setCopied] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  /* ---------------- Remote state ---------------- */
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getLocations();
      const list = Array.isArray(data) ? data : (data?.data ?? []);
      setLocations(list.map(normalizeLocation));
    } catch (err) {
      setLoadError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load locations.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  /* ---------------- Derived ---------------- */
  const filtered = useMemo(() => {
    return locations.filter((l) => {
      const matchesBuilding = building === "All" || l.building === building;
      const matchesQuery =
        !query ||
        l.room.toLowerCase().includes(query.toLowerCase()) ||
        l.qr.toLowerCase().includes(query.toLowerCase()) ||
        l.building.toLowerCase().includes(query.toLowerCase());
      return matchesBuilding && matchesQuery;
    });
  }, [locations, query, building]);

  const buildingOptions = useMemo(() => {
    const unique = new Set(locations.map((l) => l.building).filter(Boolean));
    return ["All", ...Array.from(unique)];
  }, [locations]);

  const stats = useMemo(() => {
    return {
      total: locations.length,
      buildings: new Set(locations.map((l) => l.building)).size,
      activeQr: locations.length,
      tickets: locations.reduce((s, l) => s + (l.tickets || 0), 0),
    };
  }, [locations]);

  /* ---------------- Actions ---------------- */
  const handleCopy = async (qr) => {
    try {
      await navigator.clipboard.writeText(qr);
      setCopied(qr);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  const handleCreated = (rawLocation) => {
    const normalized = normalizeLocation(rawLocation);
    setLocations((prev) => [normalized, ...prev]);
    setAddOpen(false);
  };

  /* ---------------- Render ---------------- */
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Locations & QR Codes
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Register campus buildings, rooms, and generate QR badges.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={fetchLocations}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl
                bg-white border border-gray-200 text-gray-700 text-sm font-medium
                hover:bg-gray-50 transition shrink-0 disabled:opacity-60"
              title="Refresh"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                bg-blue-600 text-white text-sm font-medium hover:bg-blue-700
                shadow-[0_8px_24px_-8px_rgba(59,130,246,0.6)] transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Location
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniStat
            label="Total Locations"
            value={stats.total}
            icon={MapPin}
            accent="bg-blue-50 text-blue-600"
          />
          <MiniStat
            label="Buildings"
            value={stats.buildings}
            icon={Building2}
            accent="bg-emerald-50 text-emerald-600"
          />
          <MiniStat
            label="QR Codes Active"
            value={stats.activeQr}
            icon={QrCode}
            accent="bg-indigo-50 text-indigo-600"
          />
          <MiniStat
            label="Total Tickets"
            value={stats.tickets}
            icon={Hash}
            accent="bg-amber-50 text-amber-600"
          />
        </div>

        {/* Filters + view toggle */}
        <Card hover={false} className="!p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by room, building, or QR code..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/70
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              <Filter className="w-4 h-4 text-gray-400 shrink-0 hidden lg:block" />
              {buildingOptions.map((b) => (
                <button
                  key={b}
                  onClick={() => setBuilding(b)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition
                    ${
                      building === b
                        ? "bg-blue-600 text-white shadow-[0_4px_12px_-4px_rgba(59,130,246,0.5)]"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {b}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-50 border border-gray-100 shrink-0 self-start lg:self-auto">
              <ViewButton
                active={view === "list"}
                onClick={() => setView("list")}
                icon={List}
                label="List"
              />
              <ViewButton
                active={view === "grid"}
                onClick={() => setView("grid")}
                icon={LayoutGrid}
                label="Grid"
              />
            </div>
          </div>
        </Card>

        {/* Results count */}
        <div className="text-xs text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700">{filtered.length}</span>{" "}
          of {locations.length} locations
        </div>

        {/* Body */}
        {loading ? (
          <Card hover={false}>
            <div className="p-10 flex flex-col items-center text-center">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              <p className="mt-3 text-sm text-gray-500">Loading locations…</p>
            </div>
          </Card>
        ) : loadError ? (
          <Card hover={false}>
            <div className="p-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-50">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                Could not load locations
              </h3>
              <p className="mt-1 text-sm text-gray-500 max-w-sm">{loadError}</p>
              <button
                onClick={fetchLocations}
                className="mt-4 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium
                  bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          </Card>
        ) : filtered.length === 0 ? (
          <Card hover={false}>
            <div className="p-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                No locations found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {locations.length === 0
                  ? "Add your first location to get started."
                  : "Try adjusting your search or building filter."}
              </p>
            </div>
          </Card>
        ) : view === "list" ? (
          <Card hover={false} className="!p-0 overflow-hidden">
            <div className="divide-y divide-gray-100">
              <AnimatePresence mode="popLayout">
                {filtered.map((loc, i) => (
                  <LocationListRow
                    key={loc.id}
                    loc={loc}
                    index={i}
                    copied={copied === loc.qr}
                    onPreview={() => setPreview(loc)}
                    onCopy={() => handleCopy(loc.qr)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((loc, i) => (
                <LocationCard
                  key={loc.id}
                  loc={loc}
                  index={i}
                  copied={copied === loc.qr}
                  onPreview={() => setPreview(loc)}
                  onCopy={() => handleCopy(loc.qr)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add Location Modal */}
      <AnimatePresence>
        {addOpen && (
          <AddLocationModal
            onClose={() => setAddOpen(false)}
            onCreated={handleCreated}
          />
        )}
      </AnimatePresence>

      {/* QR Preview Modal */}
      <AnimatePresence>
        {preview && (
          <QRPreviewModal
            loc={preview}
            onClose={() => setPreview(null)}
            copied={copied === preview.qr}
            onCopy={() => handleCopy(preview.qr)}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

/* ---------------- View toggle button ---------------- */
function ViewButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition
        ${active ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
    >
      {active && (
        <motion.div
          layoutId="view-toggle-active"
          className="absolute inset-0 rounded-lg bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <Icon className="w-3.5 h-3.5 relative z-10" />
      <span className="relative z-10 hidden sm:inline">{label}</span>
    </button>
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

/* ---------------- Location List Row ---------------- */
function LocationListRow({ loc, index, copied, onPreview, onCopy }) {
  const typeStyle = TYPE_STYLES[loc.type] ?? "bg-gray-100 text-gray-600";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      whileHover={{ backgroundColor: "rgba(248,250,252,0.8)" }}
      className="relative flex items-center gap-4 px-5 py-4"
    >
      <div
        className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl
        bg-gradient-to-br from-blue-500 to-indigo-600
        shadow-[0_4px_12px_-4px_rgba(59,130,246,0.5)]"
      >
        <QrCode className="w-5 h-5 text-white/95" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-gray-800 truncate">
            {loc.room}
          </h3>
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeStyle}`}
          >
            {loc.type}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" /> {loc.building}
          </span>
          <span className="inline-flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> {loc.floor}
          </span>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 shrink-0 w-52">
        <span className="text-[10px] font-mono text-gray-600 truncate flex-1">
          {loc.qr}
        </span>
        <button
          onClick={onCopy}
          className="shrink-0 w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
          title="Copy QR code"
        >
          {copied ? (
            <Check className="w-3 h-3 text-emerald-600" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      </div>

      <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 shrink-0 w-24">
        <DoorOpen className="w-3.5 h-3.5" />
        {loc.tickets} ticket{loc.tickets !== 1 ? "s" : ""}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onPreview}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
            bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Print</span>
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg
            text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
          title="Delete location"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

/* ---------------- Location Grid Card ---------------- */
function LocationCard({ loc, index, copied, onPreview, onCopy }) {
  const typeStyle = TYPE_STYLES[loc.type] ?? "bg-gray-100 text-gray-600";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100
        shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col"
    >
      <div
        className="relative h-24 bg-gradient-to-br from-blue-500 via-blue-500 to-indigo-600
        flex items-center justify-center overflow-hidden"
      >
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
        <QrCode className="w-10 h-10 text-white/90 relative z-10" />
        <span
          className={`absolute top-3 right-3 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/95 ${typeStyle}`}
        >
          {loc.type}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[11px] text-gray-500">{loc.building}</span>
        </div>

        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition">
          {loc.room}
        </h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> {loc.floor}
          </span>
          <span className="inline-flex items-center gap-1">
            <DoorOpen className="w-3.5 h-3.5" /> {loc.tickets} ticket
            {loc.tickets !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
          <span className="text-[10px] font-mono text-gray-600 truncate flex-1">
            {loc.qr}
          </span>
          <button
            onClick={onCopy}
            className="shrink-0 w-6 h-6 flex items-center justify-center rounded-md
              text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Copy QR code"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-600" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={onPreview}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium
              bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print QR
          </button>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-xl
              text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
            title="Delete location"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- Add Location Modal ---------------- */
function AddLocationModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    qr_code: "",
    building: "",
    floor: "",
    room: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setServerError(null);
  };

  const validate = () => {
    const next = {};
    if (!form.qr_code.trim()) next.qr_code = "QR code is required.";
    if (!form.building.trim()) next.building = "Building is required.";
    if (!form.floor.trim()) next.floor = "Floor is required.";
    if (!form.room.trim()) next.room = "Room is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError(null);

    try {
      const created = await storeLocation({
        qr_code: form.qr_code.trim(),
        building: form.building.trim(),
        floor: form.floor.trim(),
        room: form.room.trim(),
      });
      onCreated(created);
    } catch (err) {
      // Axios errors carry response.data with Laravel's { message, errors }
      const data = err?.response?.data;
      if (data?.errors) {
        const mapped = {};
        Object.entries(data.errors).forEach(([k, v]) => {
          mapped[k] = Array.isArray(v) ? v[0] : String(v);
        });
        setErrors(mapped);
      } else {
        setServerError(
          data?.message ||
            err?.message ||
            "Something went wrong. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800">
              Add New Location
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={submitting}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Field
            label="QR Code"
            icon={QrCode}
            placeholder="e.g. QR-ITBU-ROOM401"
            value={form.qr_code}
            onChange={(v) => update("qr_code", v)}
            error={errors.qr_code}
            disabled={submitting}
            autoFocus
          />
          <Field
            label="Building"
            icon={Building2}
            placeholder="e.g. Oscar Jereza"
            value={form.building}
            onChange={(v) => update("building", v)}
            error={errors.building}
            disabled={submitting}
          />
          <Field
            label="Floor"
            icon={Layers}
            placeholder="e.g. 4th Floor"
            value={form.floor}
            onChange={(v) => update("floor", v)}
            error={errors.floor}
            disabled={submitting}
          />
          <Field
            label="Room"
            icon={DoorOpen}
            placeholder="e.g. Room 401"
            value={form.room}
            onChange={(v) => update("room", v)}
            error={errors.room}
            disabled={submitting}
          />

          {serverError && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {serverError}
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-medium
                bg-gray-50 text-gray-700 hover:bg-gray-100 transition disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium
                bg-blue-600 text-white hover:bg-blue-700 transition
                shadow-[0_8px_24px_-8px_rgba(59,130,246,0.6)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Save Location
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Reusable Field ---------------- */
function Field({
  label,
  icon: Icon,
  placeholder,
  value,
  onChange,
  error,
  disabled,
  autoFocus,
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm bg-white
            focus:outline-none focus:ring-2 transition disabled:opacity-60
            ${
              error
                ? "border-red-300 focus:ring-red-500/30 focus:border-red-400"
                : "border-gray-200 focus:ring-blue-500/40 focus:border-blue-400"
            }`}
        />
      </div>
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
    </div>
  );
}

/* ---------------- QR Preview Modal ---------------- */
function QRPreviewModal({ loc, onClose, copied, onCopy }) {
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
        className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 overflow-hidden
          shadow-[0_20px_60px_-20px_rgba(0,0,0,0.3)]"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">
            QR Badge Preview
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div
            className="w-56 p-5 rounded-2xl border-2 border-dashed border-gray-200 bg-white
            shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <QrCode className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-gray-800 tracking-tight">
                CAMPUSTA
              </span>
            </div>

            <div className="aspect-square w-full rounded-xl bg-gray-900 p-3 grid grid-cols-8 gap-1">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-sm ${
                    (i * 7 + (i % 3)) % 5 === 0 ? "bg-white" : "bg-gray-900"
                  }`}
                />
              ))}
            </div>

            <div className="mt-3 text-center">
              <p className="text-[11px] font-semibold text-gray-800">
                {loc.room}
              </p>
              <p className="text-[10px] text-gray-500">
                {loc.building} · {loc.floor}
              </p>
              <p className="mt-2 text-[9px] font-mono text-gray-400">
                {loc.qr}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-500 text-center max-w-xs">
            Print this badge and place it near the location entrance. Students
            can scan it to report concerns instantly.
          </p>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-2">
          <button
            onClick={onCopy}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium
              bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied" : "Copy code"}
          </button>
          <button
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium
              bg-blue-600 text-white hover:bg-blue-700 shadow-[0_8px_24px_-8px_rgba(59,130,246,0.6)] transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
