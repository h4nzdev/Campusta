import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ReportIssue() {
  const { addTicket, locations, categories } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Mode: "qr" or "manual"
  const [reportMode, setReportMode] = useState("qr");

  // Form fields
  const [selectedQR, setSelectedQR] = useState("");
  const [customQrInput, setCustomQrInput] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null); // base64 string

  // UI states
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [successTicket, setSuccessTicket] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Auto-scan if QR code is passed in URL query parameter (?qr=QR-IT-LAB301)
  useEffect(() => {
    const qrParam = searchParams.get("qr");
    if (qrParam && locations && locations.length > 0) {
      setReportMode("qr");
      triggerScan(qrParam);
    }
  }, [searchParams, locations]);

  // QR Scan resolution logic
  const triggerScan = (qrCodeString) => {
    const cleanQr = qrCodeString.trim();
    if (!cleanQr) {
      setScanResult(null);
      return;
    }

    setSelectedQR(cleanQr);
    setScanning(true);
    setErrors((prev) => ({ ...prev, location: undefined }));

    // Simulate scan processing
    setTimeout(() => {
      const match = locations.find(
        (l) =>
          (l.qrCode && l.qrCode.toLowerCase() === cleanQr.toLowerCase()) ||
          (l.code && l.code.toLowerCase() === cleanQr.toLowerCase())
      );

      if (match) {
        setScanResult(match);
        setBuilding(match.building);
        setFloor(match.floor);
        setRoom(match.room);
      } else {
        setScanResult(null);
        setErrors((prev) => ({
          ...prev,
          location: `QR Code "${cleanQr}" not recognized in campus registry.`,
        }));
      }
      setScanning(false);
    }, 600);
  };

  // Image Upload handler (Base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (reportMode === "qr" && !scanResult) {
      newErrors.location = "Please scan or identify a valid location QR code first.";
    }
    if (reportMode === "manual") {
      if (!building) newErrors.building = "Building is required.";
      if (!floor) newErrors.floor = "Floor is required.";
      if (!room) newErrors.room = "Room / Area is required.";
    }
    if (!category) newErrors.category = "Please select an issue category.";
    if (!description.trim() || description.trim().length < 5) {
      newErrors.description = "Please describe the problem (at least 5 characters).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let finalLocationCode = "";
    if (reportMode === "qr" && scanResult) {
      finalLocationCode = scanResult.code;
    } else {
      const match = locations?.find(
        (l) =>
          l.building.toLowerCase() === building.toLowerCase() &&
          l.room.toLowerCase() === room.toLowerCase()
      );
      finalLocationCode = match
        ? match.code
        : `USPF-${building.substring(0, 4).toUpperCase()}-${room.replace(/\s+/g, "").toUpperCase()}`;
    }

    setSubmitting(true);
    try {
      const ticket = await addTicket({
        locationCode: finalLocationCode,
        categoryName: category,
        description: description.trim(),
        photoUrl: photo,
      });

      if (ticket) {
        setSuccessTicket(ticket);
      }
    } catch {
      setErrors((prev) => ({ ...prev, submit: "Failed to submit ticket. Please try again." }));
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setSelectedQR("");
    setCustomQrInput("");
    setBuilding("");
    setFloor("");
    setRoom("");
    setCategory("");
    setDescription("");
    setPhoto(null);
    setScanResult(null);
    setSuccessTicket(null);
    setErrors({});
  };

  if (successTicket) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg animate-in fade-in duration-300">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-slate-800">Report Successfully Filed!</h2>
        <p className="mt-2 text-sm text-slate-600">
          Your campus ticket has been generated and recorded in the management system.
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 border border-slate-100 p-4 font-mono">
          <div className="flex justify-between border-b border-slate-200 pb-2 text-xs text-slate-500">
            <span>TICKET ID</span>
            <span>STATUS</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-lg font-bold text-slate-800">{successTicket.id}</span>
            <span className="rounded-full bg-amber-100 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-800 uppercase">
              {successTicket.status}
            </span>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={handleReset}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Report Another
          </button>
          <button
            onClick={() => navigate("/my-reports")}
            className="flex-1 rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors shadow-sm cursor-pointer"
          >
            Track Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Report Campus Concern</h1>
        <p className="text-sm text-slate-500">
          Scan a QR code or choose a location to file a ticket for repairs, IT, facilities, or service requests.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs md:p-8">
        {/* Toggle Mode selection */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Location Identification Method
          </label>
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setReportMode("qr");
                setErrors({});
              }}
              className={`rounded-lg py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                reportMode === "qr"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              QR Code Scanner (Smart)
            </button>
            <button
              type="button"
              onClick={() => {
                setReportMode("manual");
                setErrors({});
              }}
              className={`rounded-lg py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                reportMode === "manual"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Manual Selection
            </button>
          </div>
        </div>

        {/* QR SCAN INTERFACE */}
        {reportMode === "qr" && (
          <div className="space-y-4">
            {/* Quick QR preset selection */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <label htmlFor="qr-select" className="text-xs font-bold text-slate-700 block">
                Select Registered Location QR
              </label>
              <select
                id="qr-select"
                value={selectedQR}
                onChange={(e) => triggerScan(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
              >
                <option value="">-- Choose a Campus Location QR Code to Scan --</option>
                {locations?.map((loc) => (
                  <option key={loc.qrCode || loc.code} value={loc.qrCode || loc.code}>
                    {loc.qrCode || loc.code} — {loc.building} &bull; {loc.room} ({loc.name})
                  </option>
                ))}
              </select>

              {/* Or manual QR tag scan/input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={customQrInput}
                  onChange={(e) => setCustomQrInput(e.target.value)}
                  placeholder="Or enter QR tag (e.g. QR-MAIN-101, QR-IT-LAB301)"
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono text-slate-800 focus:border-emerald-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => triggerScan(customQrInput)}
                  className="rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition-all cursor-pointer"
                >
                  Scan QR
                </button>
              </div>
            </div>

            {/* Simulated camera view */}
            <div className="relative mx-auto flex h-52 max-w-sm flex-col items-center justify-center rounded-2xl border-2 border-slate-800 bg-slate-950 overflow-hidden shadow-inner">
              {scanning ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-slate-200">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-emerald-400" />
                  <span className="text-xs font-bold mt-3 text-emerald-400">Decoding QR Code...</span>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">{selectedQR}</span>
                </div>
              ) : scanResult ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/95 text-white p-4 text-center animate-in zoom-in-95 duration-200">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs font-mono font-bold mt-2 text-emerald-300 bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    {scanResult.qrCode || scanResult.code}
                  </span>
                  <h4 className="text-sm font-extrabold text-white mt-1.5 line-clamp-1">{scanResult.name}</h4>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    {scanResult.building} &bull; {scanResult.floor} &bull; {scanResult.room}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setScanResult(null);
                      setSelectedQR("");
                    }}
                    className="mt-2 text-[10px] font-bold text-emerald-300 hover:text-white underline cursor-pointer"
                  >
                    Scan Different Location
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                  <svg className="h-12 w-12 text-slate-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h.01M16 20h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2m-8 0H6a2 2 0 00-2 2v2a2 2 0 002 2h2m0-16H6a2 2 0 00-2 2v2a2 2 0 002 2h2m8 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
                  </svg>
                  <span className="text-xs mt-2 font-bold text-slate-300">QR Scanner Ready</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    Choose a location QR above or click "Test Scan" from the Locations page
                  </span>
                </div>
              )}

              {/* Corner brackets simulating scanning viewport */}
              <div className="absolute top-4 left-4 h-4 w-4 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-4 right-4 h-4 w-4 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-4 left-4 h-4 w-4 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-4 right-4 h-4 w-4 border-b-2 border-r-2 border-emerald-400" />
            </div>

            {errors.location && (
              <p className="text-xs font-semibold text-red-600">{errors.location}</p>
            )}
          </div>
        )}

        {/* MANUAL LOCATION FORM */}
        {reportMode === "manual" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="bldg-select" className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Building
              </label>
              <select
                id="bldg-select"
                value={building}
                onChange={(e) => {
                  setBuilding(e.target.value);
                  setRoom("");
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
              >
                <option value="">-- Choose Building --</option>
                <option value="Main Building">Main Building</option>
                <option value="IT Building">IT Building</option>
                <option value="Gymnasium Complex">Gymnasium Complex</option>
                <option value="Admin Building">Admin Building</option>
              </select>
              {errors.building && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.building}</p>}
            </div>

            <div>
              <label htmlFor="floor-select" className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Floor
              </label>
              <select
                id="floor-select"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
              >
                <option value="">-- Choose Floor --</option>
                <option value="Ground Floor">Ground Floor</option>
                <option value="1st Floor">1st Floor</option>
                <option value="2nd Floor">2nd Floor</option>
                <option value="3rd Floor">3rd Floor</option>
              </select>
              {errors.floor && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.floor}</p>}
            </div>

            <div>
              <label htmlFor="room-select" className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Room / Facility
              </label>
              <select
                id="room-select"
                value={room}
                disabled={!building}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none disabled:bg-slate-100"
              >
                <option value="">-- Choose Room --</option>
                {locations
                  ?.filter((loc) => !building || loc.building === building)
                  ?.map((loc) => (
                    <option key={loc.id || loc.code} value={loc.room}>
                      {loc.room} ({loc.name})
                    </option>
                  ))}
              </select>
              {errors.room && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.room}</p>}
            </div>
          </div>
        )}

        {/* ISSUE CATEGORY */}
        <div>
          <label htmlFor="cat-select" className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
            Concern Category
          </label>
          <select
            id="cat-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
          >
            <option value="">-- Select Category --</option>
            {categories?.map((cat) => (
              <option key={cat.id || cat.name} value={cat.name}>
                {cat.name} ({cat.department})
              </option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-red-600 font-semibold mt-1">{errors.category}</p>}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label htmlFor="desc-text" className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
            Describe the Problem
          </label>
          <textarea
            id="desc-text"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detail the problem, symptoms, and exact position within the room or facility..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none placeholder:text-slate-400"
          />
          {errors.description && <p className="text-xs text-red-600 font-semibold mt-1">{errors.description}</p>}
        </div>

        {/* PHOTO ATTACHMENT */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
            Attach Photo (Optional)
          </label>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
            />
            {photo && (
              <div className="relative rounded-lg overflow-hidden border border-slate-200 h-20 w-20 bg-slate-100 flex-shrink-0">
                <img src={photo} alt="Preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="absolute top-0.5 right-0.5 rounded-full bg-red-600 p-0.5 text-white hover:bg-red-700"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SUBMIT */}
        <div className="pt-4 border-t border-slate-100 flex gap-4 justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-emerald-700 px-6 py-3 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-md cursor-pointer disabled:opacity-60"
          >
            {submitting ? "Submitting Ticket..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
