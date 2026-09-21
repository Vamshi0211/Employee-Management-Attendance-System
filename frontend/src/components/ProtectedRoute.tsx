import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }: any) => {
  const location = useLocation();

  // ✅ Get user from localStorage
  const storedUser = localStorage.getItem("user");

  // ❌ Not logged in
  if (!storedUser) {
    return <Navigate to="/login" />;
  }

  const user = JSON.parse(storedUser);

  // ❌ Invalid user
  if (!user || !user._id) {
    return <Navigate to="/login" />;
  }

  // 🔐 ADMIN ROUTE PROTECTION
  if (location.pathname.includes("admin") && user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;