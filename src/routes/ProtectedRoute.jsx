import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect unauthorized cross-role access to user's valid dashboard
    if (role === "hr") {
      return <Navigate to="/hr/dashboard" replace />;
    } else if (role === "manager") {
      return <Navigate to="/manager/dashboard" replace />;
    } else if (role === "employee") {
      return <Navigate to="/employee/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
