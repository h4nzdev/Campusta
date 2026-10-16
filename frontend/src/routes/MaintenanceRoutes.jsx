// src/routes/MaintenanceRoutes.jsx
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MaintenanceDashboard from "../pages/maintenance/MaintenanceDashboard";
import AssignedTasks from "../pages/maintenance/AssignedTasks";
import CompletedTasks from "../pages/maintenance/CompletedTasks";
import MaintenanceNotifications from "../pages/maintenance/MaintenanceNotifications";

const MaintenanceRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/maintenance/dashboard" replace />}
        />
        <Route
          path="/maintenance/dashboard"
          element={<MaintenanceDashboard />}
        />
        <Route path="/maintenance/tasks" element={<AssignedTasks />} />
        <Route path="/maintenance/completed" element={<CompletedTasks />} />
        <Route
          path="/maintenance/notifications"
          element={<MaintenanceNotifications />}
        />
        <Route
          path="*"
          element={<Navigate to="/maintenance/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default MaintenanceRoutes;
