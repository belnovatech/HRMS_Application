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
          <li className="active">
            <FiGrid /> Dashboard
          </li>

          <li>
            <FiUsers /> Employees
          </li>

          <li>
            <FiCalendar /> Attendance
          </li>

          <li>
            <FiCalendar /> Leave Management
          </li>

          <li>
            <FiDollarSign /> Payroll
          </li>

          <li>
            <FiShield /> Roles & Permissions
          </li>

          <li>
            <FiBarChart2 /> Reports & Analytics
          </li>

          <li>
            <FiFileText /> Documents
          </li>

          <li>
            <FiBriefcase /> Recruitment
          </li>

          <li>
            <FiWifi /> Biometric Sync
          </li>

          <li>
            <FiSettings /> Settings
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