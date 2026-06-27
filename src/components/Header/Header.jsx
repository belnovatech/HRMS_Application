import "./Header.css";
import {
  FiSearch,
  FiMoon,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";

import { NavLink } from "react-router-dom";

export default function Header({
  title = "Executive Dashboard",
  breadcrumb = "Dashboard",
}) {
  return (
    <div className="header-wrapper">
      <div className="header">

        <div className="header-left">

          <div className="breadcrumb">
            <span>Home</span>
            <span className="separator">&gt;</span>
            <span>{breadcrumb}</span>
          </div>

          <h1 className="page-title">{title}</h1>

          {/* Portal Tabs */}
          <div className="portal-tabs">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "portal-tab active" : "portal-tab"
              }
            >
              Admin
            </NavLink>

            <NavLink
              to="/self-service"
              className={({ isActive }) =>
                isActive ? "portal-tab active" : "portal-tab"
              }
            >
              Self Service
            </NavLink>

            <NavLink
              to="/manager"
              className={({ isActive }) =>
                isActive ? "portal-tab active" : "portal-tab"
              }
            >
              Manager
            </NavLink>
          </div>

        </div>

        <div className="header-right-section">

          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search employees, modules..."
            />
          </div>

          <div className="header-right">

            <button className="header-icon-btn">
              <FiMoon />
            </button>

            <button className="notification-btn">
              <FiBell />
              <span className="notification-badge">2</span>
            </button>

            <div className="profile">
              <div className="avatar">PS</div>

              <div className="profile-info">
                <h4>Priya Sharma</h4>
                <span>HR Manager</span>
              </div>

              <FiChevronDown />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}