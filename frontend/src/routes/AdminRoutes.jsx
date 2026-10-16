// src/routes/AdminRoutes.jsx
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminTickets from "../pages/admin/AdminTickets";
import AdminLocations from "../pages/admin/AdminLocations";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminAnalytics from "../pages/admin/AdminAnalytics";
import AdminNotifications from "../pages/admin/AdminNotifications";

const AdminRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/tickets" element={<AdminTickets />} />
        <Route path="/admin/locations" element={<AdminLocations />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AdminRoutes;
