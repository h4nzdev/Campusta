// src/Role.jsx
import React from "react";
import { useAuth } from "./context/AuthContext";
import AuthRoutes from "./routes/AuthRoutes";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import MaintenanceRoutes from "./routes/MaintenanceRoutes";

const Role = () => {
  const { user } = useAuth();

  if (!user) return <AuthRoutes />;
  if (user.role === "Admin") return <AdminRoutes />;
  if (user.role === "Maintenance") return <MaintenanceRoutes />;
  return <UserRoutes />;
};

export default Role;
