import React, { useMemo, useState } from "react";
import "./Notifications.css";
import HRLayout from "../../../layouts/HRLayout";
import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiFilter,
  FiMail,
  FiPlus,
  FiSearch,
  FiSend,
  FiSettings,
  FiShield,
  FiTrash2,
  FiUsers,
  FiX,
  FiAlertCircle,
  FiDollarSign,
  FiCalendar,
  FiFileText,
} from "react-icons/fi";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    category: "Leave",
    title: "Leave request approved",
    message:
      "Casual Leave request for Sep 5–7 has been approved by Arjun Reddy.",
    time: "2 min ago",
    unread: true,
    priority: "Normal",
    audience: "Rahul Kumar",
    icon: "leave",
  },
  {
    id: 2,
    category: "Payroll",
    title: "August payslip available",
    message:
      "The August 2026 payslip has been processed and is ready to download.",
    time: "1h ago",
    unread: true,
    priority: "Normal",
    audience: "All Employees",
    icon: "payroll",
  },
  {
    id: 3,
    category: "Attendance",
    title: "Attendance correction approved",
    message:
      "Attendance regularization request for Aug 28 has been approved.",
    time: "3h ago",
    unread: true,
    priority: "Normal",
    audience: "Rahul Kumar",
    icon: "attendance",
  },
  {
    id: 4,
    category: "HR",
    title: "Document verification request",
    message:
      "HR has requested verification of your educational certificates.",
    time: "1d ago",
    unread: false,
    priority: "Normal",
    audience: "Sneha Rao",
    icon: "hr",
  },
  {
    id: 5,
    category: "Payroll",
    title: "Payroll processing completed",
    message:
      "August 2026 payroll cycle has been successfully processed for all employees.",
    time: "1d ago",
    unread: false,
    priority: "Normal",
    audience: "All Employees",
    icon: "payroll",
  },
  {
    id: 6,
    category: "HR",
    title: "New policy update",
    message:
      "The updated hybrid work policy is now available in the employee portal.",
    time: "2d ago",
    unread: false,
    priority: "Normal",
    audience: "All Employees",
    icon: "hr",
  },
  {
    id: 7,
    category: "System",
    title: "Biometric device synchronization completed",
    message:
      "Attendance data from 5 registered biometric devices has been synchronized.",
    time: "2d ago",
    unread: false,
    priority: "Low",
    audience: "HR Administrators",
    icon: "system",
  },
  {
    id: 8,
    category: "Attendance",
    title: "Attendance anomaly detected",
    message:
      "An unusual attendance pattern requires HR review for the Bangalore office.",
    time: "3d ago",
    unread: false,
    priority: "High",
    audience: "HR Administrators",
    icon: "attendance",
  },
  {
    id: 9,
    category: "System",
    title: "Scheduled maintenance completed",
    message:
      "The HRMS maintenance window has completed successfully.",
    time: "4d ago",
    unread: false,
    priority: "Low",
    audience: "All Portals",
    icon: "system",
  },
];

const CATEGORY_OPTIONS = [
  "All",
  "Leave",
  "Payroll",
  "Attendance",
  "HR",
  "System",
];

const CATEGORY_META = {
  Leave: {
    icon: FiCalendar,
    className: "leave",
  },
  Payroll: {
    icon: FiDollarSign,
    className: "payroll",
  },
  Attendance: {
    icon: FiClock,
    className: "attendance",
  },
  HR: {
    icon: FiUsers,
    className: "hr",
  },
  System: {
    icon: FiSettings,
    className: "system",
  },
};

function getCategoryMeta(category) {
  return CATEGORY_META[category] || {
    icon: FiBell,
    className: "system",
  };
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [readFilter, setReadFilter] = useState("All");
  const [audienceFilter, setAudienceFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState("");
  const [composeForm, setComposeForm] = useState({
    title: "",
    message: "",
    category: "HR",
    audience: "All Employees",
    priority: "Normal",
  });

  const unreadCount = notifications.filter((item) => item.unread).length;

  const categoryCounts = useMemo(() => {
    const counts = { All: notifications.length };
    CATEGORY_OPTIONS.slice(1).forEach((category) => {
      counts[category] = notifications.filter(
        (item) => item.category === category
      ).length;
    });
    return counts;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return notifications.filter((item) => {
      const categoryMatch =
        activeCategory === "All" || item.category === activeCategory;

      const searchMatch =
        !normalizedSearch ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.message.toLowerCase().includes(normalizedSearch) ||
        item.audience.toLowerCase().includes(normalizedSearch);

      const priorityMatch =
        priorityFilter === "All" || item.priority === priorityFilter;

      const readMatch =
        readFilter === "All" ||
        (readFilter === "Unread" && item.unread) ||
        (readFilter === "Read" && !item.unread);

      const audienceMatch =
        audienceFilter === "All" || item.audience === audienceFilter;

      return (
        categoryMatch &&
        searchMatch &&
        priorityMatch &&
        readMatch &&
        audienceMatch
      );
    });
  }, [
    notifications,
    activeCategory,
    searchText,
    priorityFilter,
    readFilter,
    audienceFilter,
  ]);

  const showToast = (message) => {
    setToastMessage(message);
    window.clearTimeout(window.__belNotificationToast);
    window.__belNotificationToast = window.setTimeout(
      () => setToastMessage(""),
      2600
    );
  };

  const markAsRead = (notificationId) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === notificationId ? { ...item, unread: false } : item
      )
    );
  };

  const markAllAsRead = () => {
    if (!notifications.some((item) => item.unread)) {
      showToast("All notifications are already read.");
      return;
    }

    setNotifications((current) =>
      current.map((item) => ({ ...item, unread: false }))
    );
    showToast("All notifications marked as read.");
  };

  const deleteNotification = (notificationId) => {
    setNotifications((current) =>
      current.filter((item) => item.id !== notificationId)
    );
    showToast("Notification removed.");
  };

  const clearFilters = () => {
    setSearchText("");
    setActiveCategory("All");
    setPriorityFilter("All");
    setReadFilter("All");
    setAudienceFilter("All");
    setShowFilterPanel(false);
  };

  const submitAnnouncement = (event) => {
    event.preventDefault();

    if (!composeForm.title.trim() || !composeForm.message.trim()) {
      showToast("Please enter an announcement title and message.");
      return;
    }

    const newNotification = {
      id: Date.now(),
      category: composeForm.category,
      title: composeForm.title.trim(),
      message: composeForm.message.trim(),
      time: "Just now",
      unread: false,
      priority: composeForm.priority,
      audience: composeForm.audience,
      icon: composeForm.category.toLowerCase(),
    };

    setNotifications((current) => [newNotification, ...current]);
    setComposeForm({
      title: "",
      message: "",
      category: "HR",
      audience: "All Employees",
      priority: "Normal",
    });
    setShowCompose(false);
    showToast("Announcement published successfully.");
  };

  const getIconForNotification = (notification) => {
    const meta = getCategoryMeta(notification.category);
    const Icon = meta.icon;
    return <Icon />;
  };

  return (
    <HRLayout title="Notifications" breadcrumb="Notifications">
      <div className="bel-notifications-page">
        <header className="bel-notifications-header">
          <div>
            <h1>Notifications</h1>
            <p>
              {unreadCount} unread notification
              {unreadCount === 1 ? "" : "s"}
            </p>
          </div>

          <div className="bel-notifications-header-actions">
            <button
              type="button"
              className="bel-notifications-mark-all"
              onClick={markAllAsRead}
            >
              <FiCheck />
              Mark all read
            </button>

            <button
              type="button"
              className={`bel-notifications-filter-trigger ${
                showFilterPanel ? "active" : ""
              }`}
              onClick={() => setShowFilterPanel((value) => !value)}
            >
              <FiFilter />
              Filter
              <span className="bel-notifications-filter-count">
                {[
                  priorityFilter !== "All",
                  readFilter !== "All",
                  audienceFilter !== "All",
                ].filter(Boolean).length || ""}
              </span>
            </button>
          </div>
        </header>

        <div className="bel-notifications-category-bar">
          {CATEGORY_OPTIONS.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category
                  ? "bel-notifications-category active"
                  : "bel-notifications-category"
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
              <span>{categoryCounts[category]}</span>
            </button>
          ))}
        </div>

        <section className="bel-notifications-controls">
          <div className="bel-notifications-search">
            <FiSearch />
            <input
              type="search"
              placeholder="Search notifications, employees or announcements..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText("")}
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>

          <button
            type="button"
            className="bel-notifications-compose-button"
            onClick={() => setShowCompose(true)}
          >
            <FiPlus />
            New Announcement
          </button>
        </section>

        {showFilterPanel && (
          <section className="bel-notifications-filter-panel">
            <div className="bel-notifications-filter-heading">
              <div>
                <strong>Notification Filters</strong>
                <span>Refine the HR notification inbox.</span>
              </div>
              <button
                type="button"
                onClick={() => setShowFilterPanel(false)}
                aria-label="Close filters"
              >
                <FiX />
              </button>
            </div>

            <label>
              Priority
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
              >
                <option>All</option>
                <option>High</option>
                <option>Normal</option>
                <option>Low</option>
              </select>
            </label>

            <label>
              Status
              <select
                value={readFilter}
                onChange={(event) => setReadFilter(event.target.value)}
              >
                <option>All</option>
                <option>Unread</option>
                <option>Read</option>
              </select>
            </label>

            <label>
              Audience
              <select
                value={audienceFilter}
                onChange={(event) => setAudienceFilter(event.target.value)}
              >
                <option>All</option>
                <option>All Employees</option>
                <option>HR Administrators</option>
                <option>All Portals</option>
                <option>Rahul Kumar</option>
                <option>Sneha Rao</option>
              </select>
            </label>

            <div className="bel-notifications-filter-actions">
              <button type="button" onClick={clearFilters}>
                Clear
              </button>
              <button
                type="button"
                className="primary"
                onClick={() => setShowFilterPanel(false)}
              >
                Apply Filters
              </button>
            </div>
          </section>
        )}

        <section className="bel-notifications-list-header">
          <div>
            <h2>
              {activeCategory === "All"
                ? "All Notifications"
                : `${activeCategory} Notifications`}
            </h2>
            <span>
              Showing {filteredNotifications.length} of{" "}
              {notifications.length}
            </span>
          </div>

          {(searchText ||
            activeCategory !== "All" ||
            priorityFilter !== "All" ||
            readFilter !== "All" ||
            audienceFilter !== "All") && (
            <button
              type="button"
              className="bel-notifications-clear-inline"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </section>

        <main className="bel-notifications-list">
          {filteredNotifications.map((notification) => {
            const categoryMeta = getCategoryMeta(notification.category);

            return (
              <article
                key={notification.id}
                className={`bel-notification-item ${
                  notification.unread ? "unread" : "read"
                }`}
              >
                <div
                  className={`bel-notification-icon ${categoryMeta.className}`}
                >
                  {getIconForNotification(notification)}
                  {notification.unread && (
                    <span className="bel-notification-unread-dot" />
                  )}
                </div>

                <div className="bel-notification-content">
                  <div className="bel-notification-title-line">
                    <h3>{notification.title}</h3>
                    <span
                      className={`bel-notification-category-tag ${categoryMeta.className}`}
                    >
                      {notification.category}
                    </span>
                    {notification.priority === "High" && (
                      <span className="bel-notification-priority-tag">
                        High Priority
                      </span>
                    )}
                  </div>

                  <p>{notification.message}</p>

                  <div className="bel-notification-meta">
                    <span>
                      <FiClock />
                      {notification.time}
                    </span>
                    <span>
                      <FiUsers />
                      {notification.audience}
                    </span>
                  </div>
                </div>

                <div className="bel-notification-item-actions">
                  {notification.unread ? (
                    <button
                      type="button"
                      className="bel-notification-read-button"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <FiCheck />
                      Mark as read
                    </button>
                  ) : (
                    <span className="bel-notification-read-state">
                      <FiCheckCircle />
                      Read
                    </span>
                  )}

                  <button
                    type="button"
                    className="bel-notification-delete-button"
                    onClick={() => deleteNotification(notification.id)}
                    aria-label={`Delete ${notification.title}`}
                    title="Remove notification"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </article>
            );
          })}

          {filteredNotifications.length === 0 && (
            <div className="bel-notifications-empty">
              <div>
                <FiBell />
              </div>
              <strong>No notifications found</strong>
              <span>
                Try another category, search term or filter combination.
              </span>
              <button type="button" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </main>

        <section className="bel-notifications-admin-footer">
          <div>
            <div className="bel-notifications-footer-icon">
              <FiShield />
            </div>
            <div>
              <strong>HR notification center</strong>
              <span>
                Important employee events, payroll updates, attendance alerts
                and HR announcements appear here.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => showToast("Notification preferences opened.")}
          >
            <FiSettings />
            Notification Settings
          </button>
        </section>

        {showCompose && (
          <div
            className="bel-notifications-modal-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setShowCompose(false);
              }
            }}
          >
            <form
              className="bel-notifications-compose-modal"
              onSubmit={submitAnnouncement}
            >
              <div className="bel-notifications-modal-header">
                <div>
                  <div className="bel-notifications-modal-icon">
                    <FiSend />
                  </div>
                  <div>
                    <h2>New Announcement</h2>
                    <p>
                      Send an HR announcement to a selected audience.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  aria-label="Close announcement"
                >
                  <FiX />
                </button>
              </div>

              <div className="bel-notifications-compose-grid">
                <label className="full">
                  Announcement Title
                  <input
                    type="text"
                    placeholder="e.g. Quarterly performance reviews are open"
                    value={composeForm.title}
                    onChange={(event) =>
                      setComposeForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  Category
                  <select
                    value={composeForm.category}
                    onChange={(event) =>
                      setComposeForm((current) => ({
                        ...current,
                        category: event.target.value,
                      }))
                    }
                  >
                    <option>HR</option>
                    <option>Payroll</option>
                    <option>Attendance</option>
                    <option>Leave</option>
                    <option>System</option>
                  </select>
                </label>

                <label>
                  Audience
                  <select
                    value={composeForm.audience}
                    onChange={(event) =>
                      setComposeForm((current) => ({
                        ...current,
                        audience: event.target.value,
                      }))
                    }
                  >
                    <option>All Employees</option>
                    <option>HR Administrators</option>
                    <option>All Portals</option>
                    <option>Rahul Kumar</option>
                    <option>Sneha Rao</option>
                  </select>
                </label>

                <label>
                  Priority
                  <select
                    value={composeForm.priority}
                    onChange={(event) =>
                      setComposeForm((current) => ({
                        ...current,
                        priority: event.target.value,
                      }))
                    }
                  >
                    <option>Normal</option>
                    <option>High</option>
                    <option>Low</option>
                  </select>
                </label>

                <label className="full">
                  Message
                  <textarea
                    rows="5"
                    placeholder="Write the announcement message..."
                    value={composeForm.message}
                    onChange={(event) =>
                      setComposeForm((current) => ({
                        ...current,
                        message: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              <div className="bel-notifications-compose-note">
                <FiShield />
                <span>
                  Announcements are visible only to the selected audience.
                  Production delivery should be connected to your notification
                  service/API.
                </span>
              </div>

              <div className="bel-notifications-modal-actions">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary">
                  <FiSend />
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        )}

        {toastMessage && (
          <div className="bel-notifications-toast">
            <FiCheckCircle />
            {toastMessage}
          </div>
        )}
      </div>
    </HRLayout>
  );
}
