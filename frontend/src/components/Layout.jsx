import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protected route check
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Body */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
