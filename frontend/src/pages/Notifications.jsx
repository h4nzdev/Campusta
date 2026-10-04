import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Notifications() {
  const { user, notifications, markNotificationsAsRead } = useAuth();

  const userNotifications = notifications.filter((n) => n.userId === user?.id);

  // Automatically mark as read when visiting this page
  useEffect(() => {
    if (user && userNotifications.some((n) => !n.read)) {
      markNotificationsAsRead(user.id);
    }
  }, [user, userNotifications, markNotificationsAsRead]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">System Notifications</h1>
          <p className="text-sm text-slate-500">Stay updated on the status of reported concerns and assignments.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-xs">
        {userNotifications.length === 0 ? (
          <div className="text-center py-16">
            <svg className="h-12 w-12 text-slate-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.07 6.07 0 00-1-3.5C15.5 5.5 13.5 4 11 4S6.5 5.5 5 7.5c-.7 1.1-1 2.3-1 3.5v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m9 0a3 3 0 11-6 0m6 0H9" />
            </svg>
            <p className="text-slate-500 text-sm mt-3 font-semibold">You have no notification logs at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {userNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`py-4 first:pt-0 last:pb-0 flex items-start gap-4 transition-colors ${
                  !notif.read ? "bg-emerald-50/10" : ""
                }`}
              >
                {/* Indicator icon */}
                <div
                  className={`mt-0.5 rounded-full p-2 ${
                    !notif.read ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-sm font-bold text-slate-800 ${!notif.read ? "text-emerald-950 font-black" : ""}`}>
                      {notif.title}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(notif.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
