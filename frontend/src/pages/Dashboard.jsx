import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { initialLocations, initialCategories } from "../data/mockData";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const PRIORITY_COLORS = {
  Urgent: "#ef4444",
  High: "#f59e0b",
  Medium: "#3b82f6",
  Low: "#10b981"
};

export default function Dashboard() {
  const { user, tickets, notifications, locations: contextLocations } = useAuth();
  const campusLocations = contextLocations?.length > 0 ? contextLocations : initialLocations;

  // Filter items matching current session
  const userTickets = tickets.filter((t) => t.reporterId === user?.id);
  const assignedTickets = tickets.filter((t) => t.assignedPersonnelId === user?.id);
  const pendingTickets = tickets.filter((t) => t.status === "Pending");
  const userNotifications = notifications.filter((n) => n.userId === user?.id).slice(0, 5);

  // General Statistics
  const totalCount = tickets.length;
  const pendingCount = tickets.filter((t) => t.status === "Pending").length;
  const assignedCount = tickets.filter((t) => t.status === "Assigned").length;
  const inProgressCount = tickets.filter((t) => t.status === "In Progress").length;
  const activeCount = assignedCount + inProgressCount;
  const resolvedCount = tickets.filter((t) => t.status === "Resolved").length;
  const closedCount = tickets.filter((t) => t.status === "Closed").length;
  const resolutionRate = totalCount > 0 ? Math.round(((resolvedCount + closedCount) / totalCount) * 100) : 0;
  const urgentActiveCount = tickets.filter((t) => t.priority === "Urgent" && t.status !== "Closed" && t.status !== "Resolved").length;

  // Category distribution
  const catStats = initialCategories.map((cat) => {
    const count = tickets.filter((t) => t.categoryName === cat.name).length;
    const resolved = tickets.filter((t) => t.categoryName === cat.name && (t.status === "Resolved" || t.status === "Closed")).length;
    return {
      name: cat.name,
      department: cat.department,
      count,
      resolved,
      percent: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
    };
  });

  // Building load distribution
  const buildingMap = {};
  campusLocations.forEach((loc) => {
    if (!buildingMap[loc.building]) {
      buildingMap[loc.building] = { name: loc.building, total: 0, active: 0, resolved: 0 };
    }
  });

  tickets.forEach((t) => {
    const loc = campusLocations.find((l) => l.code === t.locationCode || l.id === t.locationId);
    const bldgName = loc ? loc.building : "Other Facilities";
    if (!buildingMap[bldgName]) {
      buildingMap[bldgName] = { name: bldgName, total: 0, active: 0, resolved: 0 };
    }
    buildingMap[bldgName].total += 1;
    if (t.status === "Pending" || t.status === "Assigned" || t.status === "In Progress") {
      buildingMap[bldgName].active += 1;
    } else {
      buildingMap[bldgName].resolved += 1;
    }
  });

  const buildingData = Object.values(buildingMap).map((b) => ({
    name: b.name.replace(" Building", "").replace(" Complex", ""),
    Active: b.active,
    Resolved: b.resolved,
    Total: b.total
  }));

  // Priority chart data
  const priorityPieData = [
    { name: "Urgent", value: tickets.filter((t) => t.priority === "Urgent").length, color: PRIORITY_COLORS.Urgent },
    { name: "High", value: tickets.filter((t) => t.priority === "High").length, color: PRIORITY_COLORS.High },
    { name: "Medium", value: tickets.filter((t) => t.priority === "Medium").length, color: PRIORITY_COLORS.Medium },
    { name: "Low", value: tickets.filter((t) => t.priority === "Low").length, color: PRIORITY_COLORS.Low }
  ].filter((p) => p.value > 0);

  // Generate last 7 days progression data dynamically
  const getProgressionData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const dayKey = d.toISOString().split("T")[0];

      const filed = tickets.filter((t) => t.createdAt && t.createdAt.startsWith(dayKey)).length;
      const resolved = tickets.filter((t) => {
        const resolvedHistory = t.history?.find((h) => h.status === "Resolved" || h.status === "Closed");
        return resolvedHistory && resolvedHistory.timestamp && resolvedHistory.timestamp.startsWith(dayKey);
      }).length;

      data.push({
        name: dateStr,
        "Filed": filed,
        "Resolved": resolved
      });
    }
    return data;
  };
  const progressionData = getProgressionData();

  // Audit activity feed from history across all tickets
  const recentActivities = tickets
    .flatMap((t) =>
      (t.history || []).map((h) => ({
        ticketId: t.id,
        categoryName: t.categoryName,
        status: h.status,
        note: h.note,
        timestamp: h.timestamp
      }))
    )
    .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
    .slice(0, 5);

  // Helper for status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Assigned":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "In Progress":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Closed":
        return "bg-slate-100 text-slate-700 border-slate-300";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // ==========================================
  // RENDER: Student & Faculty (Reporter) Dashboard
  // ==========================================
  const renderReporterDashboard = () => {
    const activeUserTickets = userTickets.filter((t) => t.status !== "Closed");
    const closedUserTickets = userTickets.filter((t) => t.status === "Closed");
    const userPending = userTickets.filter((t) => t.status === "Pending").length;
    const userInProgress = userTickets.filter((t) => t.status === "In Progress" || t.status === "Assigned").length;
    const userResolved = userTickets.filter((t) => t.status === "Resolved").length;

    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-800 p-6 text-white shadow-lg md:p-8">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700/60 px-3 py-1 text-xs font-semibold text-emerald-200 border border-emerald-500/30">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  USPF Smart Campus Portal
                </span>
                <h1 className="mt-3 text-2xl font-bold md:text-3xl">Welcome back, {user?.name}!</h1>
                <p className="mt-1 text-sm text-emerald-100 max-w-xl">
                  {user?.role === "faculty" ? "Faculty Department Portal" : `${user?.course || "Student"} • ${user?.yearLevel || ""}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/report"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-emerald-800 hover:bg-emerald-50 transition-all shadow-md active:scale-95"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h.01M16 20h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2m-8 0H6a2 2 0 00-2 2v2a2 2 0 002 2h2m0-16H6a2 2 0 00-2 2v2a2 2 0 002 2h2m8 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
                  </svg>
                  Scan / Report Issue
                </Link>
                <Link
                  to="/my-reports"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-800/80 border border-emerald-600 px-4 py-2.5 text-sm font-semibold text-emerald-100 hover:bg-emerald-700 transition-colors"
                >
                  My Reports
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Stat Pipeline Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Submitted Reports</span>
            <span className="text-2xl font-bold text-slate-800 block mt-1">{userTickets.length}</span>
            <span className="text-[11px] text-slate-400 mt-1 block">Total lifetime requests</span>
          </div>
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 shadow-xs">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">Under Review</span>
            <span className="text-2xl font-bold text-amber-700 block mt-1">{userPending}</span>
            <span className="text-[11px] text-amber-600 mt-1 block">Awaiting admin assignment</span>
          </div>
          <div className="rounded-xl border border-blue-200/80 bg-blue-50/40 p-4 shadow-xs">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block">In Progress</span>
            <span className="text-2xl font-bold text-blue-700 block mt-1">{userInProgress}</span>
            <span className="text-[11px] text-blue-600 mt-1 block">Personnel actively working</span>
          </div>
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4 shadow-xs">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">Resolved & Closed</span>
            <span className="text-2xl font-bold text-emerald-700 block mt-1">{closedUserTickets.length + userResolved}</span>
            <span className="text-[11px] text-emerald-600 mt-1 block">Verified & completed</span>
          </div>
        </div>

        {/* Action Required Banner (if resolved tickets await verification) */}
        {userResolved > 0 && (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-bold text-emerald-950 text-sm">Action Needed: Verify Completed Work</h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  You have {userResolved} maintenance request(s) marked as resolved. Please confirm the fix to complete closure.
                </p>
              </div>
            </div>
            <Link
              to="/my-reports"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-sm"
            >
              Verify Fixes Now &rarr;
            </Link>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Recent Tickets List */}
          <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">My Recent Reports</h2>
                <p className="text-xs text-slate-500">Track status changes of your submitted campus requests</p>
              </div>
              <Link to="/my-reports" className="text-xs font-semibold text-emerald-700 hover:underline">
                View all ({userTickets.length})
              </Link>
            </div>

            {userTickets.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-sm text-slate-500">You haven't reported any campus concerns yet.</p>
                <Link to="/report" className="mt-3 inline-block text-xs font-bold text-emerald-700 hover:underline">
                  File your first report now &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userTickets.slice(0, 4).map((ticket) => {
                  const location = campusLocations.find((l) => l.code === ticket.locationCode || l.id === ticket.locationId);
                  return (
                    <div
                      key={ticket.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-100 p-4 hover:border-slate-200 hover:bg-slate-50/50 transition-all gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-700">{ticket.id}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${getStatusBadgeClass(ticket.status)}`}>
                            {ticket.status}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            • {ticket.priority} Priority
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">{ticket.categoryName}</h4>
                        <p className="text-xs text-slate-500">
                          📍 {location ? `${location.building} - ${location.room}` : ticket.locationCode}
                        </p>
                      </div>
                      <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between">
                        <span className="text-[10px] text-slate-400">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                        <Link
                          to="/my-reports"
                          className="mt-1 inline-block text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                        >
                          View Details &rarr;
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Notifications & Help */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-800">Latest Alerts</h2>
                <Link to="/notifications" className="text-xs font-semibold text-emerald-700 hover:underline">
                  View all
                </Link>
              </div>
              {userNotifications.length === 0 ? (
                <p className="text-center py-6 text-xs text-slate-500">No alerts matching your profile.</p>
              ) : (
                <div className="space-y-3">
                  {userNotifications.map((notif) => (
                    <div key={notif.id} className="rounded-xl bg-slate-50 p-3 text-xs border border-slate-100">
                      <div className="flex items-center justify-between font-bold text-slate-700">
                        <span>{notif.title}</span>
                        {!notif.read && <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
                      </div>
                      <p className="text-slate-600 mt-1">{notif.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Contact Card */}
            <div className="rounded-2xl border border-slate-200 bg-emerald-50/50 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">USPF Maintenance Helpline</h3>
              <p className="text-xs text-slate-600 mt-1">For urgent emergencies such as live wire hazards or severe flooding:</p>
              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-800">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-200 text-emerald-800 text-[11px]">📞</span>
                Local: 231-0284 ext. 104
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // RENDER: Maintenance Dashboard
  // ==========================================
  const renderMaintenanceDashboard = () => {
    const activeTasks = assignedTickets.filter((t) => t.status === "Assigned" || t.status === "In Progress");
    const inProgressTasks = assignedTickets.filter((t) => t.status === "In Progress");
    const assignedPendingTasks = assignedTickets.filter((t) => t.status === "Assigned");
    const resolvedTasks = assignedTickets.filter((t) => t.status === "Resolved" || t.status === "Closed");

    const maintenanceWorkloadData = [
      { name: "Assigned (Pending Start)", value: assignedPendingTasks.length, color: "#3b82f6" },
      { name: "In Progress", value: inProgressTasks.length, color: "#f59e0b" },
      { name: "Resolved / Done", value: resolvedTasks.length, color: "#10b981" }
    ].filter((d) => d.value > 0);

    return (
      <div className="space-y-6">
        {/* Profile / Duty Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white shadow-lg md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={user?.profilePic} alt="" className="h-16 w-16 rounded-full border-2 border-emerald-500 bg-slate-900" />
              <div>
                <span className="inline-block rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30 uppercase">
                  Service Personnel Active
                </span>
                <h1 className="text-xl font-bold md:text-2xl mt-1">{user?.name}</h1>
                <p className="text-xs text-slate-300">{user?.department} • ID: {user?.schoolId}</p>
              </div>
            </div>
            <Link
              to="/maintenance-tasks"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Open Active Task Board &rarr;
            </Link>
          </div>
        </div>

        {/* Counter cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Assigned</span>
            <span className="text-2xl font-bold text-slate-800 block mt-1">{assignedTickets.length}</span>
            <span className="text-[11px] text-slate-400 mt-1 block">Lifetime task assignments</span>
          </div>
          <div className="rounded-xl border border-blue-200/80 bg-blue-50/40 p-4 shadow-xs">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block">Queue (Not Started)</span>
            <span className="text-2xl font-bold text-blue-700 block mt-1">{assignedPendingTasks.length}</span>
            <span className="text-[11px] text-blue-600 mt-1 block">Ready for inspection</span>
          </div>
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 shadow-xs">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">In Progress</span>
            <span className="text-2xl font-bold text-amber-700 block mt-1">{inProgressTasks.length}</span>
            <span className="text-[11px] text-amber-600 mt-1 block">Active repair work</span>
          </div>
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4 shadow-xs">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">Completed</span>
            <span className="text-2xl font-bold text-emerald-700 block mt-1">{resolvedTasks.length}</span>
            <span className="text-[11px] text-emerald-600 mt-1 block">Successfully resolved</span>
          </div>
        </div>

        {/* Work Panel + Workload Chart */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Active Work Queue */}
          <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Immediate Task Queue</h2>
                <p className="text-xs text-slate-500">Tasks requiring your attention and resolution</p>
              </div>
              <Link to="/maintenance-tasks" className="text-xs font-semibold text-emerald-700 hover:underline">
                View all ({activeTasks.length})
              </Link>
            </div>

            {activeTasks.length === 0 ? (
              <div className="text-center py-10 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-sm text-slate-500 font-medium">Great work! All your assigned tasks are currently completed.</p>
                <span className="text-xs text-slate-400 mt-1 block">New dispatches from the administrator will show up here.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {activeTasks.slice(0, 4).map((task) => {
                  const location = campusLocations.find((l) => l.code === task.locationCode || l.id === task.locationId);
                  return (
                    <div
                      key={task.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-100 p-4 hover:border-slate-200 hover:bg-slate-50/50 transition-all gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-700">{task.id}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                              task.priority === "Urgent"
                                ? "bg-red-100 text-red-800 border border-red-200"
                                : task.priority === "High"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {task.priority}
                          </span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${getStatusBadgeClass(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-800 mt-1">{task.categoryName}</h4>
                        <p className="text-xs text-slate-600 font-medium">
                          📍 {location ? `${location.building} - ${location.room}` : task.locationCode}
                        </p>
                        <p className="text-xs text-slate-500 italic line-clamp-1">"{task.description}"</p>
                      </div>
                      <div>
                        <Link
                          to="/maintenance-tasks"
                          className="inline-flex items-center rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-xs"
                        >
                          Work On Task &rarr;
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Workload Status Distribution */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Task Completion Rate</h2>
              <p className="text-xs text-slate-500">Distribution of your assigned workload</p>

              <div className="h-48 w-full mt-4 flex items-center justify-center">
                {assignedTickets.length === 0 ? (
                  <p className="text-xs text-slate-400">No workload records found.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={maintenanceWorkloadData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {maintenanceWorkloadData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", fontSize: "12px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Pending Queue
                  </span>
                  <span className="font-bold text-slate-800">{assignedPendingTasks.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> In Progress
                  </span>
                  <span className="font-bold text-slate-800">{inProgressTasks.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Completed
                  </span>
                  <span className="font-bold text-slate-800">{resolvedTasks.length}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Efficiency Score</span>
              <span className="text-2xl font-black text-emerald-700 block mt-0.5">
                {assignedTickets.length > 0 ? Math.round((resolvedTasks.length / assignedTickets.length) * 100) : 100}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // RENDER: Administrator Control Dashboard
  // ==========================================
  const renderAdminDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">USPF Campus Command</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Admin Analytics & Operations Center</h1>
            <p className="text-xs sm:text-sm text-slate-500">Real-time status overview, campus facility load, and service dispatch telemetry.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin-settings"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
            >
              🏢 QR Locations
            </Link>
            <Link
              to="/admin-tickets"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-colors shadow-sm"
            >
              Ticket Dispatch Board &rarr;
            </Link>
          </div>
        </div>

        {/* 6-Counter Status Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">Total Filed</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">{totalCount}</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">All campus concerns</span>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs">
            <span className="text-[11px] font-bold text-amber-800 block uppercase tracking-wider">Unassigned</span>
            <span className="text-2xl font-black text-amber-600 block mt-1">{pendingCount}</span>
            <span className="text-[10px] text-amber-700 mt-0.5 block">Needs personnel dispatch</span>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs">
            <span className="text-[11px] font-bold text-blue-800 block uppercase tracking-wider">Assigned</span>
            <span className="text-2xl font-black text-blue-600 block mt-1">{assignedCount}</span>
            <span className="text-[10px] text-blue-700 mt-0.5 block">Dispatched to crew</span>
          </div>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 shadow-xs">
            <span className="text-[11px] font-bold text-indigo-800 block uppercase tracking-wider">In Progress</span>
            <span className="text-2xl font-black text-indigo-600 block mt-1">{inProgressCount}</span>
            <span className="text-[10px] text-indigo-700 mt-0.5 block">Repairs underway</span>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
            <span className="text-[11px] font-bold text-emerald-800 block uppercase tracking-wider">Resolved</span>
            <span className="text-2xl font-black text-emerald-600 block mt-1">{resolvedCount}</span>
            <span className="text-[10px] text-emerald-700 mt-0.5 block">Awaiting user confirmation</span>
          </div>
          <div className="rounded-xl border border-slate-300 bg-slate-100/60 p-4 shadow-xs">
            <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">Closed</span>
            <span className="text-2xl font-black text-slate-800 block mt-1">{closedCount}</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Verified & completed</span>
          </div>
        </div>

        {/* Priority Alert Banner if urgent tickets exist */}
        {urgentActiveCount > 0 && (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-4 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white font-bold text-sm">
                ⚠️
              </span>
              <div>
                <h4 className="font-bold text-red-950 text-sm">Attention: {urgentActiveCount} Urgent Priority Ticket(s) Active</h4>
                <p className="text-xs text-red-700 mt-0.5">High safety or critical infrastructure tickets require immediate assignment.</p>
              </div>
            </div>
            <Link
              to="/admin-tickets"
              className="rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-xs flex-shrink-0"
            >
              Dispatch Urgents &rarr;
            </Link>
          </div>
        )}

        {/* Charts Row 1: Ticket Progression (Area) + Building Load (Bar) */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Progression Area Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-800">Campus Ticket Progression</h2>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  Last 7 Days
                </span>
              </div>
              <p className="text-xs text-slate-500">Progression of reported maintenance concerns against successful resolutions</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFiled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#047857" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#047857" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                  <Area type="monotone" dataKey="Filed" name="Reports Filed" stroke="#047857" strokeWidth={2} fillOpacity={1} fill="url(#colorFiled)" />
                  <Area type="monotone" dataKey="Resolved" name="Resolved Concerns" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Building Load Bar Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-800">Facility Maintenance by Building</h2>
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                  Campus Facilities
                </span>
              </div>
              <p className="text-xs text-slate-500">Active maintenance backlog vs resolved requests per campus building</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={buildingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                  <Bar dataKey="Active" name="Active / In Progress" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Resolved" name="Resolved / Closed" fill="#047857" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2: Category Breakdown + Priority Pie + Resolution Rate */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Issue Category Breakdown */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-800">Tickets by Issue Category & Department</h2>
                <p className="text-xs text-slate-500">Volume and resolution distribution across campus departments</p>
              </div>
              <span className="text-xs font-bold text-slate-600 font-mono">
                {totalCount} Total Issues
              </span>
            </div>
            <div className="space-y-4">
              {catStats.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{cat.name}</span>
                      <span className="text-[11px] text-slate-400 block sm:inline sm:ml-2">({cat.department})</span>
                    </div>
                    <div className="text-right font-semibold text-slate-700 font-mono">
                      <span>{cat.count} ticket(s)</span>
                      <span className="text-emerald-600 text-[11px] ml-2">({cat.resolved} resolved)</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden flex">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-500"
                      style={{ width: `${cat.percent}%` }}
                      title={`${cat.name}: ${cat.count} tickets (${cat.percent}%)`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Pie & Resolution Rate Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Priority Distribution</h2>
              <p className="text-xs text-slate-500">Breakdown of reported issue urgency</p>

              <div className="h-44 w-full mt-2 flex items-center justify-center">
                {priorityPieData.length === 0 ? (
                  <p className="text-xs text-slate-400">No priority records.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={priorityPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {priorityPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", fontSize: "12px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                {priorityPieData.map((p) => (
                  <div key={p.name} className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5 border border-slate-100">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                      {p.name}
                    </span>
                    <span className="font-bold text-xs text-slate-900">{p.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Campus Resolution Rate</span>
                <p className="text-xs text-slate-400 mt-0.5">Tickets closed or resolved</p>
              </div>
              <span className="text-3xl font-black text-emerald-700 font-mono">
                {resolutionRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Row 3: Live System Audit Activity Feed & Pending Review Queue */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Review Queue */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-800">Pending Assignment Queue ({pendingCount})</h2>
                <p className="text-xs text-slate-500">Newly reported issues awaiting administrator dispatch</p>
              </div>
              <Link to="/admin-tickets" className="text-xs font-semibold text-emerald-700 hover:underline">
                Open dispatcher
              </Link>
            </div>

            {pendingTickets.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-sm font-medium text-slate-600">All incoming tickets are dispatched!</p>
                <span className="text-xs text-slate-400 mt-1 block">New user submissions will appear here.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase">
                      <th className="py-2.5 px-3">Ticket</th>
                      <th className="py-2.5 px-3">Location</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingTickets.slice(0, 4).map((ticket) => {
                      const location = campusLocations.find((l) => l.code === ticket.locationCode || l.id === ticket.locationId);
                      return (
                        <tr key={ticket.id} className="border-b border-slate-50 text-xs hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-slate-700 block">{ticket.id}</span>
                            <span className="text-[10px] text-slate-400">{ticket.reporterName}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 max-w-[140px] truncate">
                            {location ? `${location.building} - ${location.room}` : ticket.locationCode}
                          </td>
                          <td className="py-3 px-3 text-slate-700 font-medium">
                            {ticket.categoryName}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Link
                              to="/admin-tickets"
                              className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-all border border-emerald-200"
                            >
                              Assign &rarr;
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Live System Activity Feed */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-800">Live Campus Activity Feed</h2>
                <p className="text-xs text-slate-500">Real-time status changes and maintenance history logs</p>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {recentActivities.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">No activity logs recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((act, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-xs border border-slate-100">
                    <span className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border ${getStatusBadgeClass(act.status)}`}>
                      {act.status}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-800 truncate">{act.ticketId}: {act.categoryName}</span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">
                          {act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now"}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5 line-clamp-1">{act.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Selector logic based on active account role
  const selectDashboard = () => {
    switch (user?.role) {
      case "student":
      case "faculty":
        return renderReporterDashboard();
      case "maintenance":
        return renderMaintenanceDashboard();
      case "admin":
        return renderAdminDashboard();
      default:
        return (
          <div className="text-center py-12">
            <h1 className="text-xl font-bold text-red-600">User configuration error.</h1>
          </div>
        );
    }
  };

  return selectDashboard();
}

