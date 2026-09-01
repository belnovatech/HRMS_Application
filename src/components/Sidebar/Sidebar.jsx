import React from "react";
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
  FiCheckSquare,
  FiBell,
  FiHelpCircle,
  FiUser,
  FiClock,
  FiBookmark,
  FiSend,
  FiX,
} from "react-icons/fi";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Define navigation menus by role
  const getMenuItems = () => {
    if (role === "hr") {
      return [
        { path: "/hr/dashboard", label: "Dashboard", icon: <FiGrid /> },
        { path: "/hr/employees", label: "Employees", icon: <FiUsers /> },
        { path: "/hr/attendance", label: "Attendance", icon: <FiCalendar /> },
        { path: "/hr/leave-management", label: "Leave Management", icon: <FiCheckSquare /> },
        { path: "/hr/payroll", label: "Payroll", icon: <FiDollarSign /> },
        { path: "/hr/roles-permissions", label: "Roles & Permissions", icon: <FiShield /> },
        { path: "/hr/reports", label: "Reports & Analytics", icon: <FiBarChart2 /> },
        { path: "/hr/documents", label: "Documents", icon: <FiFileText /> },
        { path: "/hr/recruitment", label: "Recruitment", icon: <FiBriefcase /> },
        { path: "/hr/biometric-sync", label: "Biometric Sync", icon: <FiWifi /> },
        { path: "/hr/settings", label: "Settings", icon: <FiSettings /> },
      ];
    } else if (role === "manager") {
      return [
        { path: "/manager/dashboard", label: "Dashboard", icon: <FiGrid /> },
        { path: "/manager/team", label: "My Team", icon: <FiUsers /> },
        { path: "/manager/attendance", label: "Team Attendance", icon: <FiClock /> },
        { path: "/manager/leave-approvals", label: "Leave Approvals", icon: <FiCheckSquare /> },
        { path: "/manager/reports", label: "Team Reports", icon: <FiBarChart2 /> },
        { path: "/manager/notifications", label: "Notifications", icon: <FiBell /> },
        { path: "/manager/help", label: "Help & Support", icon: <FiHelpCircle /> },
      ];
    } else {
      // Employee role default
      return [
        { path: "/employee/dashboard", label: "Dashboard", icon: <FiGrid /> },
        { path: "/employee/profile", label: "My Profile", icon: <FiUser /> },
        { path: "/employee/attendance", label: "Attendance", icon: <FiClock /> },
        { path: "/employee/leave", label: "Leave", icon: <FiCalendar /> },
        { path: "/employee/payslips", label: "My Payslips", icon: <FiDollarSign /> },
        { path: "/employee/documents", label: "Documents", icon: <FiFileText /> },
        { path: "/employee/holidays", label: "Holidays", icon: <FiBookmark /> },
        { path: "/employee/announcements", label: "Announcements", icon: <FiBell /> },
        { path: "/employee/requests", label: "My Requests", icon: <FiSend /> },
        { path: "/employee/help", label: "Help & Support", icon: <FiHelpCircle /> },
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-box" onClick={() => navigate(`/${role || "hr"}/dashboard`)}>
            <img src="/image.png" alt="BELNOVA HRMS Logo" className="sidebar-logo-img" />
            <div className="logo-text">
              <h3>BELNOVA</h3>
              <span>HRMS Platform</span>
            </div>
          </div>
          <button className="mobile-close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="menu-list">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={`menu-link ${isActive ? "active" : ""}`}
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-text">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer User Info & Logout */}
        <div className="sidebar-footer">
          <div className="user-profile-snippet">
            <div
              className="user-avatar"
              style={{ background: user?.avatarBg || "#2563eb" }}
            >
              {user?.avatar || "US"}
            </div>
            <div className="user-info">
              <h4>{user?.name || "User Account"}</h4>
              <span>{user?.designation || user?.role || "Employee"}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Sign Out">
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}