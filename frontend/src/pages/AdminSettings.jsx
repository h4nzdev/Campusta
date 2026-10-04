import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminSettings() {
  const { locations, categories, addLocation, deleteLocation, resetAllData } = useAuth();
  const navigate = useNavigate();

  // Create Location Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [building, setBuilding] = useState("Main Building");
  const [floor, setFloor] = useState("1st Floor");
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [customQr, setCustomQr] = useState("");
  const [saving, setSaving] = useState(false);
  const [createError, setCreateError] = useState("");

  // QR Viewer Modal
  const [viewingQrLocation, setViewingQrLocation] = useState(null);

  const handleCreateLocation = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (!room.trim() || !name.trim()) {
      setCreateError("Please provide both the room/area number and location name.");
      return;
    }

    setSaving(true);
    try {
      const res = await addLocation({
        building,
        floor,
        room: room.trim(),
        name: name.trim(),
        code: customCode.trim() || undefined,
        qrCode: customQr.trim() || undefined,
      });

      if (res.success) {
        setShowCreateModal(false);
        setRoom("");
        setName("");
        setCustomCode("");
        setCustomQr("");
      } else {
        setCreateError("Failed to save location.");
      }
    } catch {
      setCreateError("An error occurred while creating the location.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, locName) => {
    if (window.confirm(`Are you sure you want to delete "${locName}"?`)) {
      await deleteLocation(id);
    }
  };

  const handleTestScan = (qrCode) => {
    navigate(`/report?qr=${encodeURIComponent(qrCode)}`);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        "This will clear all changes and reset the database back to the startup mockup state. Continue?"
      )
    ) {
      resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Add Location button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Campus Configuration & QR Management
          </h1>
          <p className="text-sm text-slate-500">
            Manage university buildings, rooms, issue categories, and generate printable QR code badges.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition-all shadow-sm cursor-pointer"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Generate New Location QR
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Campus Locations & QR Cards */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-800">
              Campus Locations ({locations?.length || 0})
            </h2>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              QR Enabled
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Scan or click "Test Scan" on any badge below to test automatic location identification in the reporting portal.
          </p>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {locations?.map((loc) => {
              const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                loc.qrCode || loc.code
              )}`;

              return (
                <div
                  key={loc.id || loc.code}
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-200 p-4 bg-slate-50/50 hover:bg-slate-50 transition-all gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800 text-xs bg-slate-200/80 px-2 py-0.5 rounded">
                        {loc.code}
                      </span>
                      <span className="font-mono text-[11px] text-emerald-800 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded">
                        {loc.qrCode}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{loc.name}</h3>
                    <p className="text-xs text-slate-500">
                      {loc.building} &bull; {loc.floor} &bull; {loc.room}
                    </p>
                  </div>

                  {/* QR Badge & Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => setViewingQrLocation(loc)}
                      title="View / Print QR Badge"
                      className="flex flex-col items-center gap-1 border border-slate-250 bg-white p-1.5 rounded-lg shadow-xs hover:border-emerald-500 transition-all cursor-pointer group"
                    >
                      <img
                        src={qrImageUrl}
                        alt="QR"
                        className="h-10 w-10 object-contain rounded"
                        loading="lazy"
                      />
                      <span className="text-[9px] font-bold text-slate-600 group-hover:text-emerald-700 uppercase">
                        View QR
                      </span>
                    </button>

                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleTestScan(loc.qrCode || loc.code)}
                        className="rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 px-2.5 py-1 text-[11px] font-bold hover:bg-emerald-100 transition-all cursor-pointer"
                      >
                        Test Scan &rarr;
                      </button>
                      {loc.id && (
                        <button
                          onClick={() => handleDelete(loc.id, loc.name)}
                          className="rounded-lg bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-0.5 text-[10px] font-semibold transition-all cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories & Utilities */}
        <div className="space-y-6">
          {/* Issue Categories Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Issue Categories & Responders
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Configured problem classifications routed to respective university departments.
            </p>
            <div className="space-y-3">
              {categories?.map((cat) => (
                <div
                  key={cat.id || cat.name}
                  className="rounded-xl border border-slate-100 p-3.5 hover:border-slate-200 transition-colors bg-slate-50/40"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{cat.name}</span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-800 text-[10px] border border-emerald-200">
                      {cat.department}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Developer / Demo Reset Utilities */}
          <div className="rounded-2xl border border-red-200 bg-red-50/30 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-red-900 mb-1">Database & Demo Reset</h2>
            <p className="text-xs text-red-700 mb-4">
              Reset all simulated ticket assignments, dynamic resolution logs, and custom QR codes back to the default initial database state.
            </p>
            <button
              onClick={handleResetData}
              className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors cursor-pointer"
            >
              Reset to Initial Seed State
            </button>
          </div>
        </div>
      </div>

      {/* CREATE LOCATION & QR MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Generate Location QR Code
                </h3>
                <p className="text-xs text-slate-500">
                  Register a campus room or facility and create a scannable QR label.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateLocation} className="space-y-4">
              {createError && (
                <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-800 border border-red-200">
                  {createError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Building
                  </label>
                  <select
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Main Building">Main Building</option>
                    <option value="IT Building">IT Building</option>
                    <option value="Gymnasium Complex">Gymnasium Complex</option>
                    <option value="Admin Building">Admin Building</option>
                    <option value="Science Wing">Science Wing</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Floor
                  </label>
                  <select
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Ground Floor">Ground Floor</option>
                    <option value="1st Floor">1st Floor</option>
                    <option value="2nd Floor">2nd Floor</option>
                    <option value="3rd Floor">3rd Floor</option>
                    <option value="4th Floor">4th Floor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Room / Area Code
                  </label>
                  <input
                    type="text"
                    required
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g., Room 402, Lab 4"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Facility Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Software Engineering Lab"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Custom Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    placeholder="Auto-generated if blank"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-mono text-slate-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Custom QR Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={customQr}
                    onChange={(e) => setCustomQr(e.target.value)}
                    placeholder="Auto-generated if blank"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-mono text-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-all shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {saving ? "Generating..." : "Generate & Save QR"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW & PRINT QR BADGE MODAL */}
      {viewingQrLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                USPF Campus Location QR
              </span>
              <button
                onClick={() => setViewingQrLocation(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Printable QR Card */}
            <div className="rounded-xl border-2 border-dashed border-emerald-600/40 p-6 bg-emerald-50/20 space-y-3">
              <div className="inline-block rounded-lg bg-emerald-700 px-3 py-1 text-xs font-bold text-white tracking-widest uppercase">
                CAMPUSTA QR
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {viewingQrLocation.name}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                {viewingQrLocation.building} &bull; {viewingQrLocation.floor} &bull; {viewingQrLocation.room}
              </p>

              <div className="mx-auto flex justify-center py-2">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    viewingQrLocation.qrCode || viewingQrLocation.code
                  )}`}
                  alt="QR Code"
                  className="h-44 w-44 rounded-xl border-2 border-slate-800 p-2 bg-white shadow-sm"
                />
              </div>

              <div className="font-mono text-xs font-bold text-slate-800 bg-white p-1.5 rounded border border-slate-200">
                {viewingQrLocation.qrCode || viewingQrLocation.code}
              </div>
              <p className="text-[10px] text-slate-400">
                Scan with CAMPUSTA mobile or web reporter to instantly report facility concerns.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleTestScan(viewingQrLocation.qrCode || viewingQrLocation.code)}
                className="flex-1 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm cursor-pointer"
              >
                Test Scan Now &rarr;
              </button>
              <button
                onClick={() => window.print()}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Print Badge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
