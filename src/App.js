import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import EmployeeManagement from "./pages/Employees/EmployeeManagement";
import AddEmployee from "./pages/AddEmployee/AddEmployee";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeeManagement />} />
      <Route path="add-employee" element={<AddEmployee/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;