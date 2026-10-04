import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ReportIssue from "./pages/ReportIssue";
import MyReports from "./pages/MyReports";
import MaintenanceTasks from "./pages/MaintenanceTasks";
import AdminTickets from "./pages/AdminTickets";
import AdminSettings from "./pages/AdminSettings";
import Notifications from "./pages/Notifications";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Layout Routes */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="/maintenance-tasks" element={<MaintenanceTasks />} />
            <Route path="/admin-tickets" element={<AdminTickets />} />
            <Route path="/admin-settings" element={<AdminSettings />} />
            <Route path="/notifications" element={<Notifications />} />
            
            {/* Fallbacks */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
