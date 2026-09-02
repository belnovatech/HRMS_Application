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
    if (onClose) onClose();
  };

  const getMenuItems = () => {
if (role === "hr") {
  return [
    { path: "/hr/dashboard", label: "Dashboard", icon: <FiGrid /> },

    // MANAGEMENT
    { path: "/hr/organization", label: "Organization", icon: <FiBriefcase /> },
    { path: "/hr/employees", label: "Employees", icon: <FiUsers /> },
    { path: "/hr/attendance", label: "Attendance", icon: <FiCalendar /> },
    { path: "/hr/leave-management", label: "Leave", icon: <FiCheckSquare /> },
    { path: "/hr/payroll", label: "Payroll", icon: <FiDollarSign /> },
    { path: "/hr/recruitment", label: "Recruitment", icon: <FiBriefcase /> },

    // SYSTEM
    { path: "/hr/roles-permissions", label: "Roles & Permissions", icon: <FiShield /> },
    { path: "/hr/reports", label: "Reports", icon: <FiBarChart2 /> },
    { path: "/hr/documents", label: "Documents", icon: <FiFileText /> },
    { path: "/hr/biometric-sync", label: "Biometric", icon: <FiWifi /> },
    { path: "/hr/notifications", label: "Notifications", icon: <FiBell /> },
    { path: "/hr/settings", label: "Settings", icon: <FiSettings /> },

    // HELP
    { path: "/hr/help", label: "Help & Support", icon: <FiHelpCircle /> },
  ];
}

    if (role === "manager") {
      return [
        { path: "/manager/dashboard", label: "Dashboard", icon: <FiGrid /> },
        { path: "/manager/team", label: "My Team", icon: <FiUsers /> },
        { path: "/manager/attendance", label: "Team Attendance", icon: <FiClock /> },
        { path: "/manager/leave-approvals", label: "Leave Approvals", icon: <FiCheckSquare /> },
        { path: "/manager/reports", label: "Team Reports", icon: <FiBarChart2 /> },
        { path: "/manager/notifications", label: "Notifications", icon: <FiBell /> },
        { path: "/manager/help", label: "Help & Support", icon: <FiHelpCircle /> },
      ];
    }

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
  };

  const menuItems = getMenuItems();

  return (
    <>
      {isOpen && (
        <div
          className="belnova-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`belnova-sidebar ${isOpen ? "belnova-sidebar-open" : ""}`}
        aria-label="Main navigation"
      >
        {/* BRAND */}
        <div className="belnova-sidebar-header">
          <button
            type="button"
            className="belnova-sidebar-brand"
            onClick={() => navigate(`/${role || "hr"}/dashboard`)}
            aria-label="Go to dashboard"
          >
            <img
              src="/image.png"
              alt="BELNOVA HRMS"
              className="belnova-sidebar-logo"
            />

            <span className="belnova-sidebar-brand-copy">
              <strong>BELNOVA</strong>
              <small>HRMS Platform</small>
            </span>
          </button>

          <button
            type="button"
            className="belnova-sidebar-mobile-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <FiX />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="belnova-sidebar-nav">
          <div className="belnova-sidebar-nav-inner">
            {role === "hr" ? (
              <>
                <div className="belnova-sidebar-section-label">WORKSPACE</div>
                <ul className="belnova-sidebar-menu">
                  {menuItems.slice(0, 1).map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={item.path} className="belnova-sidebar-menu-item">
                        <NavLink
                          to={item.path}
                          end
                          className={`belnova-sidebar-link ${
                            isActive ? "belnova-sidebar-link-active" : ""
                          }`}
                          onClick={onClose}
                        >
                          <span className="belnova-sidebar-link-icon">{item.icon}</span>
                          <span className="belnova-sidebar-link-text">{item.label}</span>
                          {isActive && <span className="belnova-sidebar-active-indicator" />}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>

                <div className="belnova-sidebar-section-label" style={{ marginTop: "1rem" }}>MANAGEMENT</div>
                <ul className="belnova-sidebar-menu">
                  {menuItems.slice(1, 7).map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={item.path} className="belnova-sidebar-menu-item">
                        <NavLink
                          to={item.path}
                          end
                          className={`belnova-sidebar-link ${
                            isActive ? "belnova-sidebar-link-active" : ""
                          }`}
                          onClick={onClose}
                        >
                          <span className="belnova-sidebar-link-icon">{item.icon}</span>
                          <span className="belnova-sidebar-link-text">{item.label}</span>
                          {isActive && <span className="belnova-sidebar-active-indicator" />}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>

                <div className="belnova-sidebar-section-label" style={{ marginTop: "1rem" }}>SYSTEM</div>
                <ul className="belnova-sidebar-menu">
                  {menuItems.slice(7).map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={item.path} className="belnova-sidebar-menu-item">
                        <NavLink
                          to={item.path}
                          end
                          className={`belnova-sidebar-link ${
                            isActive ? "belnova-sidebar-link-active" : ""
                          }`}
                          onClick={onClose}
                        >
                          <span className="belnova-sidebar-link-icon">{item.icon}</span>
                          <span className="belnova-sidebar-link-text">{item.label}</span>
                          {isActive && <span className="belnova-sidebar-active-indicator" />}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <>
                <div className="belnova-sidebar-section-label">WORKSPACE</div>
                <ul className="belnova-sidebar-menu">
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={item.path} className="belnova-sidebar-menu-item">
                        <NavLink
                          to={item.path}
                          end
                          className={`belnova-sidebar-link ${
                            isActive ? "belnova-sidebar-link-active" : ""
                          }`}
                          onClick={onClose}
                        >
                          <span className="belnova-sidebar-link-icon">{item.icon}</span>
                          <span className="belnova-sidebar-link-text">{item.label}</span>
                          {isActive && <span className="belnova-sidebar-active-indicator" />}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </nav>

        {/* USER / FOOTER */}
        <div className="belnova-sidebar-footer">
          <div className="belnova-sidebar-user">
            <div
              className="belnova-sidebar-avatar"
              style={{ background: user?.avatarBg || "#2563eb" }}
            >
              {user?.avatar || "US"}
            </div>

            <div className="belnova-sidebar-user-details">
              <strong>{user?.name || "User Account"}</strong>
              <span>
                {user?.designation || user?.role || "Employee"}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="belnova-sidebar-logout"
            onClick={handleLogout}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
