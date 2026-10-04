import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { initialLocations } from "../data/mockData";

export default function MyReports() {
  const { user, tickets, updateTicket } = useAuth();
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const myTickets = tickets.filter((t) => t.reporterId === user?.id);

  // Status filtering logic
  const filteredTickets = myTickets.filter((ticket) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "pending") return ticket.status === "Pending";
    if (statusFilter === "active") return ["Assigned", "In Progress"].includes(ticket.status);
    if (statusFilter === "resolved") return ticket.status === "Resolved";
    if (statusFilter === "closed") return ticket.status === "Closed";
    return true;
  });

  const [reopenReason, setReopenReason] = useState("");
  const [showReopenForm, setShowReopenForm] = useState(false);
  const [reopenError, setReopenError] = useState("");

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  React.useEffect(() => {
    setShowReopenForm(false);
    setReopenReason("");
    setReopenError("");
  }, [selectedTicketId]);

  const handleConfirmClose = () => {
    if (!selectedTicket) return;
    updateTicket(selectedTicket.id, {
      status: "Closed",
      historyNote: `Reporter ${user.name} confirmed the resolution and closed the ticket.`
    });
  };

  const handleReopenSubmit = (e) => {
    e.preventDefault();
    if (!reopenReason.trim() || reopenReason.trim().length < 10) {
      setReopenError("Please provide a reason of at least 10 characters.");
      return;
    }
    updateTicket(selectedTicket.id, {
      status: "Assigned",
      workNotes: "",
      completionPhotoUrl: null,
      historyNote: `Reporter ${user.name} reopened the ticket. Reason: "${reopenReason.trim()}"`
    });
    setShowReopenForm(false);
    setReopenReason("");
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "Assigned":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "In Progress":
        return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      case "Resolved":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "Closed":
        return "bg-slate-100 text-slate-800 border border-slate-200";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800 border border-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Low":
        return "bg-slate-100 text-slate-800 border border-slate-200";
      default:
        return "bg-slate-100 text-slate-850";
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Tickets List Column */}
      <div className="md:col-span-2 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">My Reports</h1>
            <p className="text-sm text-slate-500">Track and view campus concerns you have reported.</p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-1 rounded-xl bg-slate-150 p-1 text-xs font-semibold">
            <button
              onClick={() => setStatusFilter("all")}
              className={`rounded-lg px-3 py-2 transition-all ${
                statusFilter === "all" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`rounded-lg px-3 py-2 transition-all ${
                statusFilter === "pending" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`rounded-lg px-3 py-2 transition-all ${
                statusFilter === "active" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("resolved")}
              className={`rounded-lg px-3 py-2 transition-all ${
                statusFilter === "resolved" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Resolved
            </button>
            <button
              onClick={() => setStatusFilter("closed")}
              className={`rounded-lg px-3 py-2 transition-all ${
                statusFilter === "closed" ? "bg-white text-emerald-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Closed
            </button>
          </div>
        </div>

        {/* Tickets Loop */}
        {filteredTickets.length === 0 ? (
          <div className="text-center py-16 border border-slate-200 bg-white rounded-2xl">
            <p className="text-slate-500 text-sm">No tickets found matching this filter.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredTickets.map((ticket) => {
              const location = initialLocations.find((l) => l.code === ticket.locationCode);
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`cursor-pointer rounded-2xl border p-5 shadow-xs transition-all hover:shadow-md hover:border-emerald-300 bg-white flex flex-col justify-between h-48 ${
                    selectedTicketId === ticket.id ? "ring-2 ring-emerald-600 border-transparent" : "border-slate-200"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-400">{ticket.id}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getStatusBadgeClass(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-800 mt-2 line-clamp-1">{ticket.categoryName}</h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Location: {location ? `${location.building} - ${location.room}` : ticket.locationCode}
                    </p>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 italic">"{ticket.description}"</p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>Priority: <span className="font-bold text-slate-700">{ticket.priority}</span></span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Details Inspect Pane */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs h-fit sticky top-20">
        {selectedTicket ? (
          <div className="space-y-6">
            {/* Header detail */}
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-slate-500">{selectedTicket.id}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${getStatusBadgeClass(selectedTicket.status)}`}>
                  {selectedTicket.status}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 mt-3">{selectedTicket.categoryName}</h2>
              <span className="text-xs text-slate-400 block mt-1">
                Reported on {new Date(selectedTicket.createdAt).toLocaleString()}
              </span>
            </div>

            {/* Info table */}
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Priority</span>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${getPriorityBadgeClass(selectedTicket.priority)}`}>
                  {selectedTicket.priority}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Location Code</span>
                <span className="font-mono font-semibold text-slate-700 mt-1 block">{selectedTicket.locationCode}</span>
                <span className="text-xs text-slate-500">
                  {initialLocations.find((l) => l.code === selectedTicket.locationCode)?.name}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Problem Description</span>
                <p className="text-slate-600 mt-1 text-xs leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
                  {selectedTicket.description}
                </p>
              </div>

              {selectedTicket.photoUrl && (
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Reporter Attachment</span>
                  <a href={selectedTicket.photoUrl} target="_blank" rel="noreferrer" className="block max-h-40 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                    <img src={selectedTicket.photoUrl} alt="Issue Attachment" className="w-full h-full object-cover" />
                  </a>
                </div>
              )}

              {/* Maintenance assignment card */}
              {selectedTicket.assignedPersonnelName ? (
                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/40">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Assigned Specialist</span>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                      {selectedTicket.assignedPersonnelName[0]}
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-slate-800 block">{selectedTicket.assignedPersonnelName}</span>
                      <span className="text-[10px] text-slate-500 block">Facilities & Maintenance</span>
                    </div>
                  </div>

                  {selectedTicket.workNotes && (
                    <div className="mt-3 border-t border-slate-250 pt-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase block">Work Update Notes</span>
                      <p className="text-xs text-slate-600 italic mt-0.5 bg-white p-2 rounded-lg border border-slate-100">
                        "{selectedTicket.workNotes}"
                      </p>
                    </div>
                  )}

                  {selectedTicket.completionPhotoUrl && (
                    <div className="mt-3">
                      <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Completion Photo</span>
                      <a href={selectedTicket.completionPhotoUrl} target="_blank" rel="noreferrer" className="block max-h-32 rounded-lg overflow-hidden border border-slate-100">
                        <img src={selectedTicket.completionPhotoUrl} alt="Resolution" className="w-full h-full object-cover" />
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center bg-slate-50/30">
                  <p className="text-xs text-slate-500">Awaiting administrator review for priority level and staff assignment.</p>
                </div>
              )}
            </div>

            {/* Reporter actions if status is Resolved */}
            {selectedTicket.status === "Resolved" && (
              <div className="border-t border-slate-100 pt-4 mt-6 space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Verify Resolution</span>
                
                {!showReopenForm ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleConfirmClose}
                      className="flex-1 rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white hover:bg-emerald-800 transition-all shadow-sm cursor-pointer text-center"
                    >
                      Confirm Fixed & Close
                    </button>
                    <button
                      onClick={() => setShowReopenForm(true)}
                      className="flex-1 rounded-xl bg-red-50 text-red-700 border border-red-200 py-3 text-xs font-bold hover:bg-red-100 transition-all cursor-pointer text-center"
                    >
                      Not Fixed - Reopen
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReopenSubmit} className="space-y-3 bg-red-50/30 p-4 rounded-xl border border-red-100">
                    <span className="text-xs font-bold text-red-900 block">Why is this concern not fixed?</span>
                    {reopenError && (
                      <p className="text-[11px] font-bold text-red-800">{reopenError}</p>
                    )}
                    <textarea
                      rows="3"
                      value={reopenReason}
                      onChange={(e) => setReopenReason(e.target.value)}
                      placeholder="Describe what still needs attention or what failed..."
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-red-500 focus:outline-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setShowReopenForm(false);
                          setReopenReason("");
                          setReopenError("");
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-lg bg-red-650 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-red-700 shadow-sm"
                      >
                        Submit Reopen
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Timeline history log */}
            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Ticket Activity</h3>
              <div className="space-y-4 relative pl-4 border-l border-slate-200 ml-2">
                {selectedTicket.history?.map((hist, index) => (
                  <div key={index} className="relative text-xs">
                    {/* circular dot */}
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-600 border-2 border-white ring-2 ring-emerald-100" />
                    <span className="font-bold text-slate-700 capitalize block">{hist.status}</span>
                    <p className="text-slate-600 mt-0.5 leading-tight">{hist.note}</p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {new Date(hist.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <svg className="h-10 w-10 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <p className="text-sm mt-3 font-semibold">Select a ticket from the list to view its complete tracking timeline.</p>
          </div>
        )}
      </div>
    </div>
  );
}
