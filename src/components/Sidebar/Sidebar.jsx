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

import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div>
        <div className="logo">
          <div className="logo-icon">B</div>

          <div>
            <h3>BELNOVA</h3>
            <p>HRMS Platform</p>
          </div>
        </div>

        <ul className="menu">
          <li>
            <Link to="/dashboard" className="menu-link">
              <FiGrid />
              Dashboard
            </Link>
          </li>

          <li>
            <Link to="/employees" className="menu-link">
              <FiUsers />
              Employees
            </Link>
          </li>

  <li>
  <Link to="/attendance" className="menu-link">
    <FiCalendar />
    Attendance
  </Link>
</li>
  <li>
  <Link to="/leave-management" className="menu-link">
    <FiCalendar />
    Leave Management
  </Link>
</li>

          <li>
            <FiDollarSign />
            Payroll
          </li>

          <li>
            <FiShield />
            Roles & Permissions
          </li>

          <li>
            <FiBarChart2 />
            Reports & Analytics
          </li>

          <li>
            <FiFileText />
            Documents
          </li>

          <li>
            <FiBriefcase />
            Recruitment
          </li>

          <li>
            <FiWifi />
            Biometric Sync
          </li>

          <li>
            <FiSettings />
            Settings
          </li>
        </ul>
      </div>

      <div className="logout">
        <FiLogOut />
        Logout
      </div>
    </div>
  );
}