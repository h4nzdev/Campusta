import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { initialLocations } from "../data/mockData";

export default function MaintenanceTasks() {
  const { user, tickets, updateTicket } = useAuth();
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("active");

  // Form states for resolving
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolutionPhoto, setResolutionPhoto] = useState(null);
  const [formError, setFormError] = useState("");

  const myTasks = tickets.filter((t) => t.assignedPersonnelId === user?.id);

  // Filters
  const filteredTasks = myTasks.filter((task) => {
    if (statusFilter === "active") return ["Assigned", "In Progress"].includes(task.status);
    if (statusFilter === "completed") return ["Resolved", "Closed"].includes(task.status);
    return true;
  });

  const selectedTask = tickets.find((t) => t.id === selectedTaskId);

  const handleStartWork = (id) => {
    updateTicket(id, {
      status: "In Progress",
      historyNote: `${user.name} started working on this concern.`
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResolutionPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitResolution = (e) => {
    e.preventDefault();
    setFormError("");

    if (!resolutionNotes.trim() || resolutionNotes.trim().length < 10) {
      setFormError("Please write at least 10 characters describing the resolution.");
      return;
    }

    updateTicket(selectedTaskId, {
      status: "Resolved",
      workNotes: resolutionNotes,
      completionPhotoUrl: resolutionPhoto,
      historyNote: `${user.name} resolved the concern with notes: "${resolutionNotes}"`
    });

    // Reset resolution form states
    setResolutionNotes("");
    setResolutionPhoto(null);
    setShowResolveModal(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-50 text-red-700 border-red-200";
      case "High":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Low":
        return "bg-slate-50 text-slate-700 border-slate-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Task Queue column */}
      <div className="md:col-span-2 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">Assigned Tasks</h1>
            <p className="text-sm text-slate-500">View and update work orders assigned to your queue.</p>
          </div>

          <div className="flex rounded-xl bg-slate-150 p-1 text-xs font-semibold">
            <button
              onClick={() => setStatusFilter("active")}
              className={`rounded-lg px-3.5 py-2 transition-all ${
                statusFilter === "active" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Active Tasks
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`rounded-lg px-3.5 py-2 transition-all ${
                statusFilter === "completed" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Completed Today
            </button>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 border border-slate-200 bg-white rounded-2xl">
            <p className="text-slate-500 text-sm">No assignments found matching this status filter.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredTasks.map((task) => {
              const location = initialLocations.find((l) => l.code === task.locationCode);
              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`cursor-pointer rounded-2xl border p-5 bg-white flex flex-col justify-between h-48 transition-all hover:shadow-md ${
                    selectedTaskId === task.id ? "ring-2 ring-emerald-600 border-transparent" : "border-slate-200"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-400">{task.id}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-800 mt-2.5 line-clamp-1">{task.categoryName}</h3>
                    <p className="text-xs text-slate-600 mt-1 font-semibold">
                      Location: {location ? `${location.building} - ${location.room}` : task.locationCode}
                    </p>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 italic">"{task.description}"</p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg capitalize border border-amber-200">
                      {task.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Reported: {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Inspect Sidepanel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs h-fit sticky top-20">
        {selectedTask ? (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-slate-500">{selectedTask.id}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase border ${getPriorityColor(
                    selectedTask.priority
                  )}`}
                >
                  {selectedTask.priority}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 mt-3">{selectedTask.categoryName}</h2>
              <p className="text-xs text-slate-400 mt-1">Reporter: {selectedTask.reporterName} ({selectedTask.reporterRole})</p>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                <span className="inline-block mt-1 text-xs font-bold text-amber-850 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 uppercase">
                  {selectedTask.status}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Facility Details</span>
                <span className="font-mono font-semibold text-slate-700 mt-1 block">{selectedTask.locationCode}</span>
                <span className="text-xs text-slate-500">
                  {initialLocations.find((l) => l.code === selectedTask.locationCode)?.name}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Issue Details</span>
                <p className="text-slate-600 mt-1 text-xs leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
                  {selectedTask.description}
                </p>
              </div>

              {selectedTask.photoUrl && (
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Issue Photo Attachment</span>
                  <a href={selectedTask.photoUrl} target="_blank" rel="noreferrer" className="block max-h-40 rounded-xl overflow-hidden border border-slate-100">
                    <img src={selectedTask.photoUrl} alt="Reported Concern" className="w-full h-full object-cover" />
                  </a>
                </div>
              )}

              {/* ACTION INTERFACE */}
              <div className="border-t border-slate-100 pt-4 mt-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Work Order Actions</span>

                {selectedTask.status === "Assigned" && (
                  <button
                    onClick={() => handleStartWork(selectedTask.id)}
                    className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                  >
                    Start Work / Mark "In Progress"
                  </button>
                )}

                {selectedTask.status === "In Progress" && (
                  <button
                    onClick={() => setShowResolveModal(true)}
                    className="w-full rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors shadow-sm cursor-pointer"
                  >
                    Resolve Issue
                  </button>
                )}

                {selectedTask.status === "Resolved" && (
                  <div className="rounded-xl bg-green-50 p-4 border border-green-200 text-xs text-green-800">
                    <span className="font-bold block">Issue Marked as Resolved</span>
                    <p className="mt-1">Awaiting admin review and closing. Your resolution notes: "{selectedTask.workNotes}"</p>
                  </div>
                )}

                {selectedTask.status === "Closed" && (
                  <div className="rounded-xl bg-slate-100 p-4 border border-slate-200 text-xs text-slate-600">
                    <span className="font-bold block">Ticket Closed & Verified</span>
                    <p className="mt-1">Work order completed. History archived.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <svg className="h-10 w-10 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p className="text-sm mt-3 font-semibold">Select an assigned ticket to execute status updates and document resolution.</p>
          </div>
        )}
      </div>

      {/* RESOLUTION MODAL FORM */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-250 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">Complete Maintenance Ticket</h3>
              <button
                onClick={() => setShowResolveModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={submitResolution} className="space-y-4">
              {formError && (
                <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-800 border border-red-200">
                  {formError}
                </div>
              )}

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Resolution / Repairs Performed
                </label>
                <textarea
                  rows="4"
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Detail the repairs you have done. Describe materials replaced, tests ran, and confirmation details..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Upload Completion Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
                {resolutionPhoto && (
                  <div className="relative mt-2 rounded-lg overflow-hidden border border-slate-200 h-16 w-16 bg-slate-100">
                    <img src={resolutionPhoto} alt="Resolution" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setResolutionPhoto(null)}
                      className="absolute top-0.5 right-0.5 rounded-full bg-red-650 p-0.5 text-white"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
                >
                  Confirm & Resolve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
