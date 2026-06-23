import { BrowserRouter, Routes, Route } from "react-router-dom";

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
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/employees"
          element={<EmployeeManagement />}
        />

        <Route
          path="/add-employee"
          element={<AddEmployee />}
        />

        <Route
          path="/attendance"
          element={<Attendance />}
        />
<Route path="/reports" element={<ReportsAnalytics />} />
        <Route
          path="/leave-management"
          element={<LeaveManagement />}
        />

        <Route
          path="/biometric-sync"
          element={<BiometricSync />}
        />

        <Route
          path="/documents"
          element={<Documents />}
        />

        <Route
          path="/payroll"
          element={<Payroll />}
        />

        <Route
          path="/roles-permissions"
          element={<RolesPermissions />}
        />

        <Route
          path="/recruitment"
          element={<Recruitment />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;