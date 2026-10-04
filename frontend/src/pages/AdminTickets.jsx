import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { initialLocations, initialUsers } from "../data/mockData";

export default function AdminTickets() {
  const { tickets, updateTicket } = useAuth();
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Form states for assignment
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedPersonnel, setSelectedPersonnel] = useState("");

  const maintenanceStaff = initialUsers.filter((u) => u.role === "maintenance");

  // Filter logic
  const filteredTickets = tickets.filter((t) => {
    const matchStatus = statusFilter === "all" ? true : t.status === statusFilter;
    const matchPriority = priorityFilter === "all" ? true : t.priority === priorityFilter;
    return matchStatus && matchPriority;
  });

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  // Sync inputs on select ticket
  React.useEffect(() => {
    if (selectedTicket) {
      setSelectedPriority(selectedTicket.priority);
      setSelectedPersonnel(selectedTicket.assignedPersonnelId || "");
    }
  }, [selectedTicket]);

  const handleSaveAssignments = (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    const staffObj = maintenanceStaff.find((s) => s.id === selectedPersonnel);
    const updatedFields = {
      priority: selectedPriority,
      assignedPersonnelId: selectedPersonnel || null,
      assignedPersonnelName: staffObj ? staffObj.name : null
    };

    // If it was pending and we assign someone, move status to Assigned
    if (selectedTicket.status === "Pending" && selectedPersonnel) {
      updatedFields.status = "Assigned";
      updatedFields.historyNote = `Assigned to ${staffObj.name} and priority set to ${selectedPriority} by Administrator.`;
    } else {
      updatedFields.historyNote = `Priority updated to ${selectedPriority} and assignment adjusted by Administrator.`;
    }

    updateTicket(selectedTicket.id, updatedFields);
  };

  const handleCloseTicket = () => {
    if (!selectedTicket) return;
    updateTicket(selectedTicket.id, {
      status: "Closed",
      historyNote: "Administrator verified the resolution and closed the ticket."
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Assigned":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "In Progress":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Resolved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Closed":
        return "bg-slate-100 text-slate-800 border-slate-200";
      default:
        return "bg-slate-50 text-slate-700";
    }
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
        return "bg-slate-50 text-slate-700 border-slate-250";
      default:
        return "bg-slate-50 text-slate-700";
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Master Tickets Board Column */}
      <div className="md:col-span-2 space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Campus Service Board</h1>
          <p className="text-sm text-slate-500">Monitor overall concerns, adjust urgencies, and dispatch staff.</p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-250 shadow-xs">
          <div className="flex-1">
            <label htmlFor="filter-status" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Filter Status
            </label>
            <select
              id="filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="filter-priority" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Filter Priority
            </label>
            <select
              id="filter-priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs focus:border-emerald-600 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Tickets Table / List */}
        {filteredTickets.length === 0 ? (
          <div className="text-center py-16 border border-slate-200 bg-white rounded-2xl">
            <p className="text-slate-500 text-sm">No tickets found matching current filters.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase bg-slate-50/55">
                    <th className="py-3 px-4">Ticket</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => {
                    const location = initialLocations.find((l) => l.code === ticket.locationCode);
                    return (
                      <tr
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className={`cursor-pointer border-b border-slate-100 text-xs hover:bg-slate-50 transition-colors ${
                          selectedTicketId === ticket.id ? "bg-emerald-50/40 hover:bg-emerald-50/50" : ""
                        }`}
                      >
                        <td className="py-4 px-4 font-mono font-bold text-slate-700">{ticket.id}</td>
                        <td className="py-4 px-4 font-medium text-slate-900">
                          {location ? `${location.building} - ${location.room}` : ticket.locationCode}
                        </td>
                        <td className="py-4 px-4 text-slate-600 font-semibold">{ticket.categoryName}</td>
                        <td className="py-4 px-4">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border uppercase ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border uppercase ${getStatusBadge(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right text-slate-400">
                          {new Date(ticket.updatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Admin Action Sidepanel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs h-fit sticky top-20">
        {selectedTicket ? (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-slate-500">{selectedTicket.id}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase border ${getStatusBadge(selectedTicket.status)}`}>
                  {selectedTicket.status}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 mt-3">{selectedTicket.categoryName}</h2>
              <span className="text-xs text-slate-400 block mt-1">
                Reported by: <span className="font-bold text-slate-700">{selectedTicket.reporterName}</span> ({selectedTicket.reporterRole})
              </span>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Description</span>
                <p className="text-slate-600 mt-1 text-xs leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
                  {selectedTicket.description}
                </p>
              </div>

              {selectedTicket.photoUrl && (
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Issue Attachment</span>
                  <a href={selectedTicket.photoUrl} target="_blank" rel="noreferrer" className="block max-h-40 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                    <img src={selectedTicket.photoUrl} alt="Problem Photo" className="w-full h-full object-cover" />
                  </a>
                </div>
              )}

              {/* RESOLUTION STATUS */}
              {selectedTicket.status === "Resolved" && (
                <div className="rounded-xl bg-green-50 p-4 border border-green-200">
                  <span className="text-xs font-bold text-green-800 uppercase tracking-wider block">Specialist Resolution Details</span>
                  <p className="text-xs text-green-700 italic mt-1 font-medium bg-white p-2 rounded-lg border border-green-100">
                    "{selectedTicket.workNotes}"
                  </p>
                  {selectedTicket.completionPhotoUrl && (
                    <div className="mt-3">
                      <span className="text-[11px] font-semibold text-green-700 block mb-1">Resolution Attachment</span>
                      <a href={selectedTicket.completionPhotoUrl} target="_blank" rel="noreferrer" className="block max-h-32 rounded-lg overflow-hidden border border-green-150">
                        <img src={selectedTicket.completionPhotoUrl} alt="Resolution Complete" className="w-full h-full object-cover" />
                      </a>
                    </div>
                  )}
                  
                  <button
                    onClick={handleCloseTicket}
                    className="w-full mt-4 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-sm cursor-pointer"
                  >
                    Approve Repairs & Close Ticket
                  </button>
                </div>
              )}

              {/* ADMIN CONTROL MODULE */}
              {selectedTicket.status !== "Closed" && selectedTicket.status !== "Resolved" && (
                <form onSubmit={handleSaveAssignments} className="border-t border-slate-100 pt-4 space-y-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Dispatch & Priority Controls</span>

                  <div>
                    <label htmlFor="priority-select" className="text-xs font-semibold text-slate-600 block mb-1">
                      Set Urgency Priority
                    </label>
                    <select
                      id="priority-select"
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="personnel-select" className="text-xs font-semibold text-slate-600 block mb-1">
                      Assign Maintenance Personnel
                    </label>
                    <select
                      id="personnel-select"
                      value={selectedPersonnel}
                      onChange={(e) => setSelectedPersonnel(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="">-- Unassigned / Reviewing --</option>
                      {maintenanceStaff.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.name} ({staff.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-sm cursor-pointer"
                  >
                    Apply Settings
                  </button>
                </form>
              )}

              {selectedTicket.status === "Closed" && (
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs text-slate-600">
                  <span className="font-bold block text-slate-850">Archived Ticket</span>
                  <p className="mt-1">This ticket has been completed, closed, and stored in the campus maintenance histories.</p>
                </div>
              )}
            </div>

            {/* History timeline */}
            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Ticket Workflow History</h3>
              <div className="space-y-4 relative pl-4 border-l border-slate-200 ml-2">
                {selectedTicket.history?.map((hist, index) => (
                  <div key={index} className="relative text-xs">
                    <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-600 border-2 border-white ring-2 ring-emerald-100" />
                    <span className="font-bold text-slate-700 capitalize block">{hist.status}</span>
                    <p className="text-slate-600 mt-0.5">{hist.note}</p>
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
            <p className="text-sm mt-3 font-semibold">Select a maintenance ticket from the board to alter its assignment and details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
