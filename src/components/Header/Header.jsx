import "./Header.css";

import {
  FiSearch,
  FiMoon,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";

export default function Header() {
  return (
    <div className="header-wrapper">

      {/* TOP BAR */}
      <div className="header">
        <div className="header-left">
          <div className="breadcrumb">
            <span>Home</span>
            <span className="separator">&gt;</span>
            <span>Dashboard</span>
          </div>

          <h1 className="page-title">
            Executive Dashboard
          </h1>
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
            <button>
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