import React from "react";
import "./Birthdays.css";
import { useAuth } from "../../../context/AuthContext";

export default function Birthdays() {
  const { teamMembers = [] } = useAuth();

  const birthdayList = teamMembers
    .filter((m) => m.dob || m.birthday)
    .map((m) => ({
      id: m.id,
      name: m.name || `${m.firstName || ""} ${m.lastName || ""}`.trim() || "Employee",
      dept: m.department || "General",
      badge: "This Month",
      avatar: (m.name || "EM").split(" ").map(n => n[0]).join("").slice(0, 2),
      avatarBg: m.avatarBg || "#a855f7"
    }));

  return (
    <div className="hradmin-dashboard-birthdays-card">
      <div className="hradmin-dashboard-birthdays-header">
        <h3 className="hradmin-dashboard-card-title">🎂 Birthdays & Celebrations</h3>
      </div>

      <div className="hradmin-dashboard-birthdays-list">
        {birthdayList.length > 0 ? (
          birthdayList.map((item) => (
            <div key={item.id} className="hradmin-dashboard-birthday-item">
              <div className="hradmin-dashboard-birthday-left">
                <div
                  className="hradmin-dashboard-birthday-avatar"
                  style={{ background: item.avatarBg }}
                >
                  {item.avatar}
                </div>
                <div className="hradmin-dashboard-birthday-info">
                  <h4 className="hradmin-dashboard-birthday-name">{item.name}</h4>
                  <span className="hradmin-dashboard-birthday-dept">{item.dept}</span>
                </div>
              </div>

              <span className="hradmin-dashboard-birthday-badge">
                {item.badge}
              </span>
            </div>
          ))
        ) : (
          <div style={{ padding: "18px 0", color: "#64748b", textAlign: "center", fontSize: "14px" }}>
            No upcoming birthdays this week.
          </div>
        )}
      </div>
    </div>
  );
}
