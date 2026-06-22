import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import EmployeeManagement from "./pages/Employees/EmployeeManagement";
import AddEmployee from "./pages/AddEmployee/AddEmployee";
import Attendance from "./pages/Attendance/Attendance";
import LeaveManagement from "./pages/LeaveManagement/LeaveManagement";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeeManagement />} />
          <Route
  path="/attendance"
  element={<Attendance />}
/>
<Route
  path="/leave-management"
  element={<LeaveManagement />}
/>
      <Route path="add-employee" element={<AddEmployee/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;