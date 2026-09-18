import React, { useMemo, useState, useEffect } from "react";
import "./RecentActivity.css";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api/axiosInstance";

export default function RecentActivity() {
  const { leaveRequests = [], notificationsList = [] } = useAuth();
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    let active = true;
    api.get("/Audit")
      .then((res) => {
        if (active && Array.isArray(res.data) && res.data.length > 0) {
          setAuditLogs(res.data);
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const activities = useMemo(() => {
    const list = [];

    leaveRequests.forEach((req, idx) => {
      const name = req.employeeName || req.employee || `Employee ${req.employeeId || idx + 1}`;
      const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
      list.push({
        id: `leave-${req.id || idx}`,
        avatar: initials,
        user: name,
        action: `applied for ${req.leaveType || "Leave"} (${req.status || "Pending"})`,
        time: req.appliedOn || "Recent",
      });
    });

    notificationsList.forEach((notif, idx) => {
      list.push({
        id: `notif-${notif.id || idx}`,
        avatar: "HR",
        user: notif.audience || "HR Team",
        action: `published notification: ${notif.title || ""}`,
        time: notif.time || "Recent",
      });
    });

    auditLogs.forEach((audit, idx) => {
      const u = audit.userName || audit.user || "System";
      list.push({
        id: `audit-${audit.id || idx}`,
        avatar: u.slice(0, 2).toUpperCase(),
        user: u,
        action: `${audit.action || audit.event || "performed action"} in ${audit.module || "HRMS"}`,
        time: audit.timestamp ? new Date(audit.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recent",
      });
    });

    return list.slice(0, 6);
  }, [leaveRequests, notificationsList, auditLogs]);

  return (
    <div className="hradmin-dashboard-activity-card">
      <div className="hradmin-dashboard-activity-header">
        <h3 className="hradmin-dashboard-card-title">Recent Activity</h3>
        <div className="hradmin-dashboard-live-indicator">
          <span className="hradmin-dashboard-live-dot" />
          <span>Live</span>
        </div>
      </div>

      <div className="hradmin-dashboard-activity-list">
        {activities.length > 0 ? (
          activities.map((item) => (
            <div key={item.id} className="hradmin-dashboard-activity-item">
              <div className="hradmin-dashboard-activity-left">
                <div className="hradmin-dashboard-activity-avatar">
                  {item.avatar}
                </div>
                <div className="hradmin-dashboard-activity-text">
                  <strong>{item.user}</strong> <span>{item.action}</span>
                </div>
              </div>

              <span className="hradmin-dashboard-activity-time">{item.time}</span>
            </div>
          ))
        ) : (
          <div style={{ padding: "20px 0", color: "#64748b", textAlign: "center", fontSize: "14px" }}>
            No recent activity recorded.
          </div>
        )}
      </div>
    </div>
  );
}
