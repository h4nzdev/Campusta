// src/routes/UserRoutes.jsx
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import UserDashboard from "../pages/users/UserDashboard";
import MyTickets from "../pages/users/MyTickets";
import ReportConcern from "../pages/users/ReportConcern";
import UserNotifications from "../pages/users/Notifications";
import UserSettings from "../pages/users/UserSettings";

const UserRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/tickets" element={<MyTickets />} />
        <Route path="/user/reports" element={<ReportConcern />} />
        <Route path="/user/notifications" element={<UserNotifications />} />
        <Route path="/user/settings" element={<UserSettings />} />
        <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default UserRoutes;
