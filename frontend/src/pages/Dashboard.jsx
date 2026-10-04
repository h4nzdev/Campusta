import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { initialLocations, initialCategories } from "../data/mockData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function Dashboard() {
  const { user, tickets, notifications, updateTicket } = useAuth();

  // Filter items matching current session
  const userTickets = tickets.filter((t) => t.reporterId === user?.id);
  const assignedTickets = tickets.filter((t) => t.assignedPersonnelId === user?.id);
  const pendingTickets = tickets.filter((t) => t.status === "Pending");
  const userNotifications = notifications.filter((n) => n.userId === user?.id).slice(0, 4);

  // Statistics calculations
  const totalCount = tickets.length;
  const pendingCount = tickets.filter((t) => t.status === "Pending").length;
  const activeCount = tickets.filter((t) => t.status === "Assigned" || t.status === "In Progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "Resolved").length;
  const closedCount = tickets.filter((t) => t.status === "Closed").length;

  // Group by category for admin visual stats
  const catStats = initialCategories.map((cat) => {
    const count = tickets.filter((t) => t.categoryName === cat.name).length;
    return { name: cat.name, count, percent: totalCount > 0 ? (count / totalCount) * 100 : 0 };
  });

  // Group by priority
  const priorityStats = {
    Urgent: tickets.filter((t) => t.priority === "Urgent").length,
    High: tickets.filter((t) => t.priority === "High").length,
    Medium: tickets.filter((t) => t.priority === "Medium").length,
    Low: tickets.filter((t) => t.priority === "Low").length
  };

  // Generate last 7 days progression data dynamically
  const getProgressionData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const dayKey = d.toISOString().split("T")[0];
      
      // Count tickets created on this day
      const filed = tickets.filter((t) => t.createdAt && t.createdAt.startsWith(dayKey)).length;
      
      // Count tickets resolved/closed on this day (checks history logs for resolution)
      const resolved = tickets.filter((t) => {
        const resolvedHistory = t.history?.find((h) => h.status === "Resolved");
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

  // Render Student / Faculty Dashboard
  const renderReporterDashboard = () => {
    const activeUserTickets = userTickets.filter((t) => t.status !== "Closed");
    const closedUserTickets = userTickets.filter((t) => t.status === "Closed");

    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-800 to-green-700 p-6 text-white shadow-lg md:p-8">
          <h1 className="text-2xl font-bold md:text-3xl">Hello, {user?.name}!</h1>
          <p className="mt-2 text-sm text-emerald-100 max-w-xl">
            Welcome to the USPF CAMPUSTA Portal. Quickly report maintenance concerns or track the progress of your submitted service requests.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors shadow-md"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h.01M16 20h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2m-8 0H6a2 2 0 00-2 2v2a2 2 0 002 2h2m0-16H6a2 2 0 00-2 2v2a2 2 0 002 2h2m8 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
              </svg>
              Report New Concern
            </Link>
            <Link
              to="/my-reports"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700/50 border border-emerald-500/30 px-5 py-3 text-sm font-semibold hover:bg-emerald-600/30 transition-colors"
            >
              My Submitted Reports
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Submitted</span>
            <span className="text-2xl font-bold text-slate-800 block mt-1">{userTickets.length}</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Active / Pending</span>
            <span className="text-2xl font-bold text-blue-600 block mt-1">{activeUserTickets.length}</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Resolved & Closed</span>
            <span className="text-2xl font-bold text-green-600 block mt-1">{closedUserTickets.length}</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Recent Tickets List */}
          <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">My Recent Reports</h2>
              <Link to="/my-reports" className="text-xs font-semibold text-emerald-700 hover:underline">
                View all
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
              <div className="space-y-4">
                {userTickets.slice(0, 3).map((ticket) => {
                  const location = initialLocations.find((l) => l.code === ticket.locationCode);
                  return (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 p-4 hover:border-slate-200 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-500">{ticket.id}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                              ticket.status === "Pending"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : ticket.status === "Assigned"
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : ticket.status === "In Progress"
                                ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                                : ticket.status === "Resolved"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : "bg-slate-100 text-slate-800 border border-slate-200"
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">{ticket.categoryName}</h4>
                        <p className="text-xs text-slate-500">
                          {location ? `${location.building} - ${location.room}` : ticket.locationCode}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                        <Link
                          to="/my-reports"
                          className="mt-1 inline-block text-xs font-bold text-emerald-700 hover:underline"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Notifications */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Latest Alerts</h2>
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
        </div>
      </div>
    );
  };

  // Render Maintenance Dashboard
  const renderMaintenanceDashboard = () => {
    const activeTasks = assignedTickets.filter((t) => t.status === "Assigned" || t.status === "In Progress");
    const resolvedTasks = assignedTickets.filter((t) => t.status === "Resolved" || t.status === "Closed");

    return (
      <div className="space-y-6">
        {/* Profile Card / Overview */}
        <div className="rounded-2xl bg-slate-800 p-6 text-white shadow-lg md:p-8">
          <div className="flex items-center gap-4">
            <img src={user?.profilePic} alt="" className="h-16 w-16 rounded-full border-2 border-slate-600 bg-slate-900" />
            <div>
              <h1 className="text-xl font-bold md:text-2xl">Welcome Back, {user?.name}</h1>
              <p className="text-xs text-slate-400 mt-1">{user?.department}</p>
            </div>
          </div>
        </div>

        {/* Counter cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Assigned Tasks</span>
            <span className="text-2xl font-bold text-blue-600 block mt-1">
              {assignedTickets.filter((t) => t.status === "Assigned").length}
            </span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">In Progress</span>
            <span className="text-2xl font-bold text-amber-600 block mt-1">
              {assignedTickets.filter((t) => t.status === "In Progress").length}
            </span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Completed</span>
            <span className="text-2xl font-bold text-green-600 block mt-1">{resolvedTasks.length}</span>
          </div>
        </div>

        {/* Work Panel */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">My Work Queue</h2>
            <Link to="/maintenance-tasks" className="text-xs font-semibold text-emerald-700 hover:underline">
              Manage Tasks
            </Link>
          </div>

          {activeTasks.length === 0 ? (
            <div className="text-center py-8 rounded-xl bg-slate-50">
              <p className="text-sm text-slate-500">Hooray! No pending assigned tasks at this moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTasks.slice(0, 3).map((task) => {
                const location = initialLocations.find((l) => l.code === task.locationCode);
                return (
                  <div
                    key={task.id}
                    className="flex flex-col md:flex-row md:items-center justify-between rounded-xl border border-slate-100 p-4 gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">{task.id}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                            task.priority === "Urgent"
                              ? "bg-red-100 text-red-800"
                              : task.priority === "High"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg capitalize">
                          {task.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800 mt-1">{task.categoryName}</h4>
                      <p className="text-xs text-slate-600 mt-1 font-medium">
                        Location: {location ? `${location.building} - ${location.room}` : task.locationCode}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 italic line-clamp-1">"{task.description}"</p>
                    </div>
                    <div>
                      <Link
                        to="/maintenance-tasks"
                        className="inline-flex items-center rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-sm"
                      >
                        Action Panel
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render Administrator Dashboard
  const renderAdminDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">Admin Control Center</h1>
            <p className="text-sm text-slate-500">Monitor and orchestrate campus concerns across USPF departments.</p>
          </div>
          <div>
            <Link
              to="/admin-tickets"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors shadow-sm"
            >
              Ticket Dispatch
            </Link>
          </div>
        </div>

        {/* Counters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs text-center">
            <span className="text-xs font-semibold text-slate-500 block uppercase">Total Filed</span>
            <span className="text-2xl font-black text-slate-800 block mt-1">{totalCount}</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs text-center">
            <span className="text-xs font-semibold text-slate-500 block uppercase">Unassigned</span>
            <span className="text-2xl font-black text-amber-600 block mt-1">{pendingCount}</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs text-center">
            <span className="text-xs font-semibold text-slate-500 block uppercase">In Work</span>
            <span className="text-2xl font-black text-blue-600 block mt-1">{activeCount}</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs text-center">
            <span className="text-xs font-semibold text-slate-500 block uppercase">Resolved</span>
            <span className="text-2xl font-black text-emerald-600 block mt-1">{resolvedCount}</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs text-center">
            <span className="text-xs font-semibold text-slate-500 block uppercase">Closed</span>
            <span className="text-2xl font-black text-slate-600 block mt-1">{closedCount}</span>
          </div>
        </div>

        {/* Ticket Progression Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-800">Campus Ticket Progression</h2>
            <p className="text-xs text-slate-500">Progression of reported maintenance concerns against successful resolutions (Last 7 Days)</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={progressionData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorFiled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#047857" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#047857" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Area type="monotone" dataKey="Filed" name="Reports Filed" stroke="#047857" strokeWidth={2} fillOpacity={1} fill="url(#colorFiled)" />
                <Area type="monotone" dataKey="Resolved" name="Resolved Concerns" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Distribution */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Category distribution */}
          <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Tickets by Issue Category</h2>
            <div className="space-y-4">
              {catStats.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">{cat.name}</span>
                    <span className="font-bold text-slate-900">{cat.count} ticket(s)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-500"
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority stats */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Priority Breakdown</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-2.5 text-red-900 border border-red-200">
                <span className="text-xs font-bold uppercase tracking-wider">Urgent</span>
                <span className="text-xl font-bold">{priorityStats.Urgent}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-amber-50 px-4 py-2.5 text-amber-900 border border-amber-200">
                <span className="text-xs font-bold uppercase tracking-wider">High</span>
                <span className="text-xl font-bold">{priorityStats.High}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-2.5 text-blue-900 border border-blue-200">
                <span className="text-xs font-bold uppercase tracking-wider">Medium</span>
                <span className="text-xl font-bold">{priorityStats.Medium}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 text-slate-900 border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider">Low</span>
                <span className="text-xl font-bold">{priorityStats.Low}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Queue lists */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Pending Review Queue ({pendingCount})</h2>
            <Link to="/admin-tickets" className="text-xs font-semibold text-emerald-700 hover:underline">
              Open master board
            </Link>
          </div>

          {pendingTickets.length === 0 ? (
            <div className="text-center py-6 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500">Perfect! All incoming tickets have been processed.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase">
                    <th className="py-3 px-4">Ticket</th>
                    <th className="py-3 px-4">Reporter</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTickets.slice(0, 3).map((ticket) => {
                    const location = initialLocations.find((l) => l.code === ticket.locationCode);
                    return (
                      <tr key={ticket.id} className="border-b border-slate-100 text-sm hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-slate-700">{ticket.id}</td>
                        <td className="py-4 px-4 font-medium text-slate-900">{ticket.reporterName}</td>
                        <td className="py-4 px-4 text-slate-600">
                          {location ? `${location.building} - ${location.room}` : ticket.locationCode}
                        </td>
                        <td className="py-4 px-4 text-slate-500 line-clamp-1 max-w-[200px]" title={ticket.description}>
                          {ticket.description}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Link
                            to="/admin-tickets"
                            className="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-all border border-emerald-200"
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
