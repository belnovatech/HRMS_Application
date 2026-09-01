import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// Auth
import Login from "./pages/Login/Login";

// HR Pages
import HRDashboard from "./pages/Dashboard/Dashboard";
import EmployeeManagement from "./pages/Employees/EmployeeManagement";
import AddEmployee from "./pages/AddEmployee/AddEmployee";
import HRAttendance from "./pages/Attendance/Attendance";
import HRLeaveManagement from "./pages/LeaveManagement/LeaveManagement";
import HRPayroll from "./pages/Payroll/Payroll";
import HRRolesPermissions from "./pages/RolesPermissions/RolesPermissions";
import HRReports from "./pages/Reports/ReportsAnalytics";
import HRDocuments from "./pages/Documents/Documents";
import HRRecruitment from "./pages/Recruitment/Recruitment";
import HRBiometricSync from "./pages/BiometricSync/BiometricSync";
import HRSettings from "./pages/Settings/Settings";

// Manager Pages
import ManagerDashboard from "./pages/Manager/ManagerDashboard";
import MyTeam from "./pages/Manager/MyTeam";
import TeamAttendance from "./pages/Manager/TeamAttendance";
import LeaveApprovals from "./pages/Manager/LeaveApprovals";
import TeamReports from "./pages/Manager/TeamReports";
import ManagerNotifications from "./pages/Manager/Notifications";
import ManagerHelp from "./pages/Manager/ManagerHelp";

// Employee Pages
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import EmployeeProfile from "./pages/Employee/EmployeeProfile";
import EmployeeAttendance from "./pages/Employee/EmployeeAttendance";
import EmployeeLeave from "./pages/Employee/EmployeeLeave";
import EmployeePayslips from "./pages/Employee/EmployeePayslips";
import EmployeeDocuments from "./pages/Employee/EmployeeDocuments";
import EmployeeHolidays from "./pages/Employee/EmployeeHolidays";
import EmployeeAnnouncements from "./pages/Employee/EmployeeAnnouncements";
import EmployeeRequests from "./pages/Employee/EmployeeRequests";
import EmployeeHelp from "./pages/Employee/EmployeeHelp";

// Root Redirect Helper
function RootRedirect() {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === "hr") return <Navigate to="/hr/dashboard" replace />;
  if (role === "manager") return <Navigate to="/manager/dashboard" replace />;
  if (role === "employee") return <Navigate to="/employee/dashboard" replace />;
  return <Navigate to="/login" replace />;
}

function AppContent() {
  return (
    <Routes>
      {/* Root & Login */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />

      {/* ================= HR ROUTES ================= */}
      <Route
        path="/hr/dashboard"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HRDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/employees"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <EmployeeManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/employees/add"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <AddEmployee />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/attendance"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HRAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/leave-management"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HRLeaveManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/payroll"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HRPayroll />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/roles-permissions"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HRRolesPermissions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/reports"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HRReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/documents"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HRDocuments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/recruitment"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HRRecruitment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/biometric-sync"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HRBiometricSync />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/settings"
        element={
          <ProtectedRoute allowedRoles={["hr"]}>
            <HRSettings />
          </ProtectedRoute>
        }
      />

      {/* ================= MANAGER ROUTES ================= */}
      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/team"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <MyTeam />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/attendance"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <TeamAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/leave-approvals"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <LeaveApprovals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/reports"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <TeamReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/notifications"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerNotifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/help"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerHelp />
          </ProtectedRoute>
        }
      />

      {/* ================= EMPLOYEE ROUTES ================= */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/profile"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/attendance"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/leave"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeLeave />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/payslips"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeePayslips />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/documents"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeDocuments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/holidays"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeHolidays />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/announcements"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeAnnouncements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/requests"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/help"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeHelp />
          </ProtectedRoute>
        }
      />

      {/* Legacy / Compatibility Fallback Redirects */}
      <Route path="/dashboard" element={<RootRedirect />} />
      <Route path="/manager" element={<RootRedirect />} />
      <Route path="/self-service" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
}