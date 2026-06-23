import { HashRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import EmployeeManagement from "./pages/Employees/EmployeeManagement";
import AddEmployee from "./pages/AddEmployee/AddEmployee";
import Attendance from "./pages/Attendance/Attendance";
import LeaveManagement from "./pages/LeaveManagement/LeaveManagement";
import BiometricSync from "./pages/BiometricSync/BiometricSync";
import Documents from "./pages/Documents/Documents";
import Payroll from "./pages/Payroll/Payroll";
import RolesPermissions from "./pages/RolesPermissions/RolesPermissions";
import Recruitment from "./pages/Recruitment/Recruitment";
import Settings from "./pages/Settings/Settings";
import ReportsAnalytics from "./pages/Reports/ReportsAnalytics";

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Employee Management */}
        <Route path="/employees" element={<EmployeeManagement />} />
        <Route path="/employees/add" element={<AddEmployee />} />

        {/* Attendance */}
        <Route path="/attendance" element={<Attendance />} />

        {/* Leave Management */}
        <Route
          path="/leave-management"
          element={<LeaveManagement />}
        />

        {/* Biometric Sync */}
        <Route
          path="/biometric-sync"
          element={<BiometricSync />}
        />

        {/* Documents */}
        <Route path="/documents" element={<Documents />} />

        {/* Payroll */}
        <Route path="/payroll" element={<Payroll />} />

        {/* Reports */}
        <Route
          path="/reports"
          element={<ReportsAnalytics />}
        />

        {/* Roles & Permissions */}
        <Route
          path="/roles-permissions"
          element={<RolesPermissions />}
        />

        {/* Recruitment */}
        <Route
          path="/recruitment"
          element={<Recruitment />}
        />

        {/* Settings */}
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </HashRouter>
  );
}

export default App;