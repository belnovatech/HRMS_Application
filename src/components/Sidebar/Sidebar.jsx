import "./Sidebar.css";
import {
  FiGrid,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiShield,
  FiBarChart2,
  FiFileText,
  FiBriefcase,
  FiWifi,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="logo">
          <div className="logo-icon">B</div>

          <div>
            <h3>BELNOVA</h3>
            <p>HRMS Platform</p>
          </div>
        </div>

        <ul className="menu">
          <li><Link to="/dashboard" className="menu-link"><FiGrid />Dashboard</Link></li>
          <li><Link to="/employees" className="menu-link"><FiUsers />Employees</Link></li>
          <li><Link to="/attendance" className="menu-link"><FiCalendar />Attendance</Link></li>
          <li><Link to="/leave-management" className="menu-link"><FiCalendar />Leave Management</Link></li>
          <li><Link to="/payroll" className="menu-link"><FiDollarSign />Payroll</Link></li>
          <li><Link to="/roles-permissions" className="menu-link"><FiShield />Roles & Permissions</Link></li>
          <li><Link to="/reports" className="menu-link"><FiBarChart2 />Reports & Analytics</Link></li>
          <li><Link to="/documents" className="menu-link"><FiFileText />Documents</Link></li>
          <li><Link to="/recruitment" className="menu-link"><FiBriefcase />Recruitment</Link></li>
          <li><Link to="/biometric-sync" className="menu-link"><FiWifi />Biometric Sync</Link></li>
          <li><Link to="/settings" className="menu-link"><FiSettings />Settings</Link></li>
        </ul>
      </div>

      <div className="logout" onClick={handleLogout}>
        <FiLogOut />
        Logout
      </div>
    </div>
  );
}