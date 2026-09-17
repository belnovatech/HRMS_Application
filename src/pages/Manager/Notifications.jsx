import React, { useMemo, useState } from "react";
import ManagerLayout from "../../layouts/ManagerLayout";
import { useAuth } from "../../context/AuthContext";
import {
  FiBell,
  FiCheck,
  FiFilter,
  FiX,
  FiFileText,
  FiDollarSign,
  FiClock,
  FiUsers,
  FiSettings,
} from "react-icons/fi";

// IMPORTANT: Notifications-specific CSS
import "./Notifications.css";

export default function Notifications() {
  const { notificationsList = [], markNotificationAsRead, markAllNotificationsAsRead } = useAuth();

  const notifications = useMemo(() => {
    if (notificationsList && notificationsList.length > 0) {
      return notificationsList.map((n) => ({
        id: n.id,
        title: n.title,
        desc: n.message || n.desc || "",
        time: n.createdAtUtc ? new Date(n.createdAtUtc).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : (n.time || "Today"),
        type: (n.category || n.type || "system").toLowerCase(),
        unread: !n.isRead && !n.read,
      }));
    }
    return [];
  }, [notificationsList]);

  const [activeCategory, setActiveCategory] = useState("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [onlyUnread, setOnlyUnread] = useState(false);

  const categoryConfig = {
    all: "All",
    leave: "Leave",
    payroll: "Payroll",
    attendance: "Attendance",
    hr: "HR",
    system: "System",
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "leave":
        return <FiBell size={17} />;

      case "payroll":
        return <FiDollarSign size={17} />;

      case "attendance":
        return <FiClock size={17} />;

      case "hr":
        return <FiFileText size={17} />;

      case "system":
        return <FiSettings size={17} />;

      default:
        return <FiUsers size={17} />;
    }
  };

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const getCategoryUnreadCount = (category) => {
    if (category === "all") {
      return unreadCount;
    }

    return notifications.filter(
      (notification) =>
        notification.type === category &&
        notification.unread
    ).length;
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const categoryMatch =
        activeCategory === "all" ||
        notification.type === activeCategory;

      const unreadMatch =
        !onlyUnread || notification.unread;

      return categoryMatch && unreadMatch;
    });
  }, [
    notifications,
    activeCategory,
    onlyUnread,
  ]);

  const markAllRead = () => {
    if (markAllNotificationsAsRead) markAllNotificationsAsRead();
  };

  const markAsRead = (id) => {
    if (markNotificationAsRead) markNotificationAsRead(id);
  };

  const handleNotificationClick = (notification) => {
    if (notification.unread) {
      markAsRead(notification.id);
    }
  };

  const clearFilters = () => {
    setActiveCategory("all");
    setOnlyUnread(false);
  };

  const hasActiveFilters =
    activeCategory !== "all" || onlyUnread;

  return (
    <ManagerLayout
      title="Notifications"
      breadcrumb="Notifications"
    >
      <div className="notifmgr-page">

        {/* ================= HEADER ================= */}

        <div className="notifmgr-header">

          <div className="notifmgr-heading">
            <h1>Notifications</h1>

            <p>
              {unreadCount} unread notifications
            </p>
          </div>

          <div className="notifmgr-header-actions">

            <button
              type="button"
              className="notifmgr-mark-all"
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              <FiCheck size={14} />

              <span>
                Mark all read
              </span>
            </button>

            <button
              type="button"
              className={`notifmgr-filter-button ${
                showFilterPanel
                  ? "notifmgr-filter-active"
                  : ""
              }`}
              onClick={() =>
                setShowFilterPanel(
                  !showFilterPanel
                )
              }
            >
              <FiFilter size={14} />

              <span>
                Filter
              </span>
            </button>

          </div>
        </div>


        {/* ================= CATEGORY FILTER ================= */}

        <div className="notifmgr-category-wrapper">

          <div className="notifmgr-category-list">

            {Object.entries(categoryConfig).map(
              ([key, label]) => {

                const categoryCount =
                  getCategoryUnreadCount(key);

                return (
                  <button
                    type="button"
                    key={key}
                    className={`notifmgr-category-chip ${
                      activeCategory === key
                        ? "notifmgr-category-active"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveCategory(key)
                    }
                  >
                    <span>
                      {label}
                    </span>

                    {key !== "all" &&
                      categoryCount > 0 && (
                        <span className="notifmgr-chip-count">
                          {categoryCount}
                        </span>
                      )}
                  </button>
                );
              }
            )}

          </div>
        </div>


        {/* ================= FILTER PANEL ================= */}

        {showFilterPanel && (
          <div className="notifmgr-filter-panel">

            <div className="notifmgr-filter-title">

              <div>
                <strong>
                  Notification Filters
                </strong>

                <span>
                  Customize which notifications are displayed.
                </span>
              </div>

              <button
                type="button"
                className="notifmgr-filter-close"
                onClick={() =>
                  setShowFilterPanel(false)
                }
                aria-label="Close filters"
              >
                <FiX size={15} />
              </button>

            </div>

            <div className="notifmgr-filter-options">

              <label className="notifmgr-checkbox-option">

                <input
                  type="checkbox"
                  checked={onlyUnread}
                  onChange={(event) =>
                    setOnlyUnread(
                      event.target.checked
                    )
                  }
                />

                <span>
                  Show unread only
                </span>

              </label>

              <button
                type="button"
                className="notifmgr-clear-filter"
                onClick={clearFilters}
              >
                Clear filters
              </button>

            </div>
          </div>
        )}


        {/* ================= NOTIFICATION LIST ================= */}

        <div className="notifmgr-list">

          {filteredNotifications.length > 0 ? (

            filteredNotifications.map(
              (notification) => (

                <article
                  key={notification.id}
                  className={`notifmgr-item ${
                    notification.unread
                      ? "notifmgr-item-unread"
                      : ""
                  }`}
                  onClick={() =>
                    handleNotificationClick(
                      notification
                    )
                  }
                >

                  {/* ICON */}

                  <div
                    className={`notifmgr-icon notifmgr-icon-${notification.type}`}
                  >
                    {getNotificationIcon(
                      notification.type
                    )}

                    {notification.unread && (
                      <span className="notifmgr-unread-dot" />
                    )}
                  </div>


                  {/* CONTENT */}

                  <div className="notifmgr-content">

                    <div className="notifmgr-title-row">

                      <div className="notifmgr-title-wrapper">

                        <strong>
                          {notification.title}
                        </strong>

                        <span
                          className={`notifmgr-type-badge notifmgr-type-${notification.type}`}
                        >
                          {
                            categoryConfig[
                              notification.type
                            ]
                          }
                        </span>

                      </div>

                      <time>
                        {notification.time}
                      </time>

                    </div>


                    <p>
                      {notification.desc}
                    </p>


                    {notification.unread && (
                      <button
                        type="button"
                        className="notifmgr-mark-read"
                        onClick={(event) => {
                          event.stopPropagation();

                          markAsRead(
                            notification.id
                          );
                        }}
                      >
                        <FiCheck size={11} />

                        <span>
                          Mark as read
                        </span>
                      </button>
                    )}

                  </div>

                </article>
              )
            )

          ) : (

            /* ================= EMPTY STATE ================= */

            <div className="notifmgr-empty">

              <div className="notifmgr-empty-icon">
                <FiBell size={23} />
              </div>

              <h3>
                No notifications found
              </h3>

              <p>
                There are no notifications matching
                your current filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>

          )}

        </div>


        {/* ================= FOOTER ================= */}

        {filteredNotifications.length > 0 && (
          <div className="notifmgr-footer">

            <span>
              Showing{" "}
              <strong>
                {filteredNotifications.length}
              </strong>{" "}
              of{" "}
              <strong>
                {notifications.length}
              </strong>{" "}
              notifications
            </span>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}

          </div>
        )}

      </div>
    </ManagerLayout>
  );
}