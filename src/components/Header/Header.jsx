import React, { useEffect, useRef, useState } from "react";
import "./Header.css";
import {
  FiSearch,
  FiMoon,
  FiSun,
  FiBell,
  FiChevronDown,
  FiMenu,
  FiHelpCircle,
  FiLogOut,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header({
  title = "Dashboard",
  breadcrumb = "Dashboard",
  onToggleSidebar,
}) {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const notifications = [
    {
      id: 1,
      title: "Leave Request Approved",
      time: "10 mins ago",
      read: false,
    },
    {
      id: 2,
      title: "Monthly Payroll Slip Available",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Team Outing Announcement",
      time: "Yesterday",
      read: true,
    },
  ];

  /*
   * Load saved theme.
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem("hrms-header-theme");

    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  /*
   * Close dropdowns when clicking outside.
   */
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /*
   * Toggle theme.
   */
  const handleThemeToggle = () => {
    const nextTheme = !isDarkMode;

    setIsDarkMode(nextTheme);

    localStorage.setItem(
      "hrms-header-theme",
      nextTheme ? "dark" : "light"
    );

    document.documentElement.setAttribute(
      "data-hrms-theme",
      nextTheme ? "dark" : "light"
    );
  };

  /*
   * Logout.
   */
  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    navigate("/login");
  };

  /*
   * Profile route based on role.
   */
  const getProfilePath = () => {
    if (role === "employee") return "/employee/profile";
    if (role === "manager") return "/manager/team";
    return "/hr/settings";
  };

  /*
   * Search submit.
   * Dispatches an event so other parts of the application can
   * listen for global header searches without changing existing pages.
   */
  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const searchTerm = searchValue.trim();

    if (!searchTerm) return;

    window.dispatchEvent(
      new CustomEvent("hrms-global-search", {
        detail: {
          query: searchTerm,
          role,
        },
      })
    );
  };

  /*
   * Clear search.
   */
  const handleClearSearch = () => {
    setSearchValue("");

    window.dispatchEvent(
      new CustomEvent("hrms-global-search", {
        detail: {
          query: "",
          role,
        },
      })
    );
  };

  /*
   * Hide duplicate breadcrumb when it is exactly the same
   * as the main dark page title.
   *
   * Example:
   * breadcrumb = "Team Attendance"
   * title = "Team Attendance"
   *
   * Result:
   * Only the dark "Team Attendance" remains.
   */
  const shouldShowActiveBreadcrumb =
    breadcrumb &&
    title &&
    breadcrumb.trim().toLowerCase() !== title.trim().toLowerCase();

  return (
    <header
      className={`hrms-header-shell ${
        isDarkMode ? "hrms-header-dark" : ""
      }`}
    >
      <div className="hrms-header-left">
        {/* Mobile / Tablet Sidebar Button */}
        <button
          type="button"
          className="hrms-header-menu-button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
          title="Toggle navigation"
        >
          <FiMenu size={22} />
        </button>

        {/* Brand + Breadcrumb + Title */}
        <div className="hrms-header-heading">
          <div className="hrms-header-breadcrumb-row">
            <span className="hrms-header-brand">
              BELNOVA HRMS
            </span>

            {shouldShowActiveBreadcrumb && (
              <>
                <span className="hrms-header-breadcrumb-arrow">
                  &gt;
                </span>

                <span className="hrms-header-current-breadcrumb">
                  {breadcrumb}
                </span>
              </>
            )}
          </div>

          <h1 className="hrms-header-page-title">
            {title}
          </h1>
        </div>
      </div>

      {/* Right Side */}
      <div className="hrms-header-right">
        {/* Search */}
        <form
          className="hrms-header-search"
          onSubmit={handleSearchSubmit}
        >
          <FiSearch
            className="hrms-header-search-icon"
            size={18}
          />

          <input
            type="text"
            value={searchValue}
            onChange={(event) =>
              setSearchValue(event.target.value)
            }
            placeholder="Search employees, modules..."
            aria-label="Search employees and modules"
          />

          {searchValue && (
            <button
              type="button"
              className="hrms-header-search-clear"
              onClick={handleClearSearch}
              aria-label="Clear search"
              title="Clear search"
            >
              <FiX size={15} />
            </button>
          )}
        </form>

        {/* Action Buttons */}
        <div className="hrms-header-actions">
          {/* Help */}
          <button
            type="button"
            className="hrms-header-action-button"
            title="Help & Support"
            aria-label="Help & Support"
            onClick={() =>
              navigate(`/${role || "hr"}/help`)
            }
          >
            <FiHelpCircle size={19} />
          </button>

          {/* Theme */}
          <button
            type="button"
            className="hrms-header-action-button"
            title={
              isDarkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            aria-label="Toggle theme"
            onClick={handleThemeToggle}
          >
            {isDarkMode ? (
              <FiSun size={19} />
            ) : (
              <FiMoon size={19} />
            )}
          </button>

          {/* Notifications */}
          <div
            className="hrms-header-dropdown-wrapper"
            ref={notificationRef}
          >
            <button
              type="button"
              className="hrms-header-action-button hrms-header-notification-button"
              onClick={() => {
                setShowNotifications((previous) => !previous);
                setShowProfileMenu(false);
              }}
              title="Notifications"
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <FiBell size={19} />

              <span className="hrms-header-notification-badge">
                2
              </span>
            </button>

            {showNotifications && (
              <div className="hrms-header-dropdown hrms-header-notification-dropdown">
                <div className="hrms-header-dropdown-heading">
                  <h3>Notifications</h3>

                  <button
                    type="button"
                    className="hrms-header-mark-read"
                    onClick={() => {
                      setShowNotifications(false);
                    }}
                  >
                    Mark all as read
                  </button>
                </div>

                <div className="hrms-header-notification-list">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`hrms-header-notification-item ${
                        item.read
                          ? "hrms-header-notification-read"
                          : "hrms-header-notification-unread"
                      }`}
                    >
                      <span className="hrms-header-notification-dot" />

                      <div className="hrms-header-notification-content">
                        <p>{item.title}</p>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div
            className="hrms-header-profile-wrapper"
            ref={profileRef}
          >
            <button
              type="button"
              className="hrms-header-profile-button"
              onClick={() => {
                setShowProfileMenu((previous) => !previous);
                setShowNotifications(false);
              }}
              aria-label="Open profile menu"
              aria-expanded={showProfileMenu}
            >
              <span
                className="hrms-header-avatar"
                style={{
                  background:
                    user?.avatarBg || "#2563eb",
                }}
              >
                {user?.avatar || "US"}
              </span>

              <span className="hrms-header-profile-text">
                <span className="hrms-header-profile-name">
                  {user?.name || "User Name"}
                </span>

                <span className="hrms-header-profile-role">
                  {user?.designation ||
                    user?.role ||
                    "Role"}
                </span>
              </span>

              <FiChevronDown
                className={`hrms-header-chevron ${
                  showProfileMenu
                    ? "hrms-header-chevron-open"
                    : ""
                }`}
                size={17}
              />
            </button>

            {showProfileMenu && (
              <div className="hrms-header-dropdown hrms-header-profile-dropdown">
                <div className="hrms-header-user-summary">
                  <span
                    className="hrms-header-large-avatar"
                    style={{
                      background:
                        user?.avatarBg || "#2563eb",
                    }}
                  >
                    {user?.avatar || "US"}
                  </span>

                  <div>
                    <strong>
                      {user?.name || "User Name"}
                    </strong>

                    <small>
                      {user?.email ||
                        user?.employeeId ||
                        ""}
                    </small>
                  </div>
                </div>

                <div className="hrms-header-profile-menu">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate(getProfilePath());
                    }}
                  >
                    <FiUser size={17} />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    className="hrms-header-logout-button"
                    onClick={handleLogout}
                  >
                    <FiLogOut size={17} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}