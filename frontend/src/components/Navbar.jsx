import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ onToggleSidebar }) {
  const { user, notifications, markNotificationsAsRead, logout } = useAuth();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const userNotifications = notifications.filter((n) => n.userId === user?.id);
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const handleMarkAsRead = () => {
    if (user) {
      markNotificationsAsRead(user.id);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm md:px-6">
      {/* Mobile Toggle Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 md:hidden"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden text-xl font-bold tracking-wider text-green-700 sm:inline">
            CAMPUSTA
          </span>
          <span className="inline rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-800 border border-green-200">
            USPF
          </span>
        </div>
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowProfileDropdown(false);
            }}
            className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 focus:outline-none"
          >
            <span className="sr-only">Notifications</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.07 6.07 0 00-1-3.5C15.5 5.5 13.5 4 11 4S6.5 5.5 5 7.5c-.7 1.1-1 2.3-1 3.5v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m9 0a3 3 0 11-6 0m6 0H9"
              />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white py-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
                <span className="font-semibold text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAsRead}
                    className="text-xs font-semibold text-green-700 hover:text-green-800 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {userNotifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-slate-500">
                    No notifications yet.
                  </div>
                ) : (
                  userNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`border-b border-slate-50 px-4 py-3 hover:bg-slate-50 transition-colors ${
                        !notif.read ? "bg-green-50/40" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-medium text-sm text-slate-800">{notif.title}</span>
                        {!notif.read && (
                          <span className="h-2 w-2 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{notif.message}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {new Date(notif.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-slate-100 px-4 py-2 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifDropdown(false)}
                  className="text-xs font-semibold text-slate-600 hover:text-green-700 hover:underline"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifDropdown(false);
            }}
            className="flex items-center gap-2 rounded-full p-1 text-slate-600 hover:bg-slate-100 focus:outline-none"
          >
            <img
              src={user?.profilePic || "https://api.dicebear.com/7.x/adventurer/svg?seed=default"}
              alt="Profile"
              className="h-8 w-8 rounded-full border border-slate-200 bg-slate-100"
            />
            <span className="hidden text-sm font-medium text-slate-700 md:inline">
              {user?.name}
            </span>
            <svg
              className="hidden h-4 w-4 text-slate-400 md:inline"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Logged In As
                </p>
                <p className="font-semibold text-slate-800 text-sm truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role} Account</p>
              </div>
              <div className="px-2 py-1">
                <div className="block rounded-lg px-3 py-2 text-xs text-slate-500 font-mono">
                  ID: {user?.schoolId}
                </div>
                <div className="block rounded-lg px-3 py-1 text-xs text-slate-500">
                  {user?.department}
                </div>
              </div>
              <div className="border-t border-slate-100 mt-2 pt-2 px-4">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
