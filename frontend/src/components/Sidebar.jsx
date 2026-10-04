import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  // Define navigation items per role
  const getNavItems = () => {
    switch (user?.role) {
      case "student":
      case "faculty":
        return [
          {
            label: "Dashboard",
            path: "/dashboard",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            )
          },
          {
            label: "Report Issue",
            path: "/report",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h.01M16 20h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2m-8 0H6a2 2 0 00-2 2v2a2 2 0 002 2h2m0-16H6a2 2 0 00-2 2v2a2 2 0 002 2h2m8 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
              </svg>
            )
          },
          {
            label: "My Reports",
            path: "/my-reports",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            )
          },
          {
            label: "Notifications",
            path: "/notifications",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.07 6.07 0 00-1-3.5C15.5 5.5 13.5 4 11 4S6.5 5.5 5 7.5c-.7 1.1-1 2.3-1 3.5v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m9 0a3 3 0 11-6 0m6 0H9" />
              </svg>
            )
          }
        ];
      case "maintenance":
        return [
          {
            label: "Dashboard",
            path: "/dashboard",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            )
          },
          {
            label: "Assigned Tasks",
            path: "/maintenance-tasks",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            )
          },
          {
            label: "Notifications",
            path: "/notifications",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.07 6.07 0 00-1-3.5C15.5 5.5 13.5 4 11 4S6.5 5.5 5 7.5c-.7 1.1-1 2.3-1 3.5v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m9 0a3 3 0 11-6 0m6 0H9" />
              </svg>
            )
          }
        ];
      case "admin":
        return [
          {
            label: "Admin Dashboard",
            path: "/dashboard",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            )
          },
          {
            label: "Manage Tickets",
            path: "/admin-tickets",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            )
          },
          {
            label: "Locations & QR",
            path: "/admin-settings",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h.01M16 20h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2m-8 0H6a2 2 0 00-2 2v2a2 2 0 002 2h2m0-16H6a2 2 0 00-2 2v2a2 2 0 002 2h2m8 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
              </svg>
            )
          },
          {
            label: "Notifications",
            path: "/notifications",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.07 6.07 0 00-1-3.5C15.5 5.5 13.5 4 11 4S6.5 5.5 5 7.5c-.7 1.1-1 2.3-1 3.5v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m9 0a3 3 0 11-6 0m6 0H9" />
              </svg>
            )
          }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-emerald-900 text-emerald-100 transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Banner */}
        <div className="flex h-16 items-center justify-between border-b border-emerald-800 px-6">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white font-bold border border-emerald-600">
              C
            </div>
            <span className="text-xl font-bold tracking-wider text-white">CAMPUSTA</span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-emerald-800 focus:outline-none md:hidden"
          >
            <svg className="h-6 w-6 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Card */}
        <div className="border-b border-emerald-800/80 bg-emerald-950/40 p-4 mx-3 my-4 rounded-xl flex items-center gap-3">
          <img
            src={user?.profilePic || "https://api.dicebear.com/7.x/adventurer/svg?seed=default"}
            alt=""
            className="h-10 w-10 rounded-full border border-emerald-700/50 bg-emerald-950"
          />
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-semibold text-white">{user?.name}</h4>
            <p className="truncate text-[11px] text-emerald-300 capitalize">{user?.role} Account</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-800 text-white shadow-md border-l-4 border-emerald-400"
                    : "text-emerald-200 hover:bg-emerald-800/40 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="border-t border-emerald-800 p-4 flex flex-col gap-2">
          <span className="text-[10px] text-center text-emerald-400 font-medium font-mono">
            USPF Smart Maintenance v1.0
          </span>
        </div>
      </aside>
    </>
  );
}
