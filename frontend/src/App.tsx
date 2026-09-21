import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // 🔥 ADD THIS

import Layout from "./layout/Layout";

// Pages
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import ApplyLeave from "./pages/ApplyLeave";
import LeaveTracker from "./pages/LeaveTracker";
import Notices from "./pages/Notices";
import Signin from "./pages/Signin";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";

// 🔥 ADMIN
import AdminPanel from "./pages/admin/AdminPanel";

const App: React.FC = () => {
  return (
    <BrowserRouter>

      {/* 🔥 TOAST PROVIDER */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px",
          },
        }}
      />

      <Routes>

        {/* 🔓 PUBLIC ROUTES */}
        <Route path="/login" element={<Signin />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* 🔐 PROTECTED LAYOUT */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Redirect root → dashboard */}
          <Route index element={<Navigate to="/dashboard" />} />

          {/* USER PAGES */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="apply-leave" element={<ApplyLeave />} />
          <Route path="leave-tracker" element={<LeaveTracker />} />
          <Route path="notices" element={<Notices />} />

          {/* 🔐 ADMIN PAGE */}
          <Route
            path="admin"
            element={
              localStorage.getItem("admin") ? (
                <AdminPanel />
              ) : (
                <Navigate to="/admin-login" />
              )
            }
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;