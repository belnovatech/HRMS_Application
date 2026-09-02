import React from "react";
import "./RecentActivity.css";

export default function RecentActivity() {
  const activities = [
    {
      id: "a1",
      avatar: "RK",
      user: "Rahul Kumar",
      action: "joined Engineering",
      time: "2m ago"
    },
    {
      id: "a2",
      avatar: "PS",
      user: "Priya Sharma",
      action: "applied for Sick Leave",
      time: "14m ago"
    },
    {
      id: "a3",
      avatar: "AR",
      user: "Arjun Reddy",
      action: "payslip downloaded",
      time: "28m ago"
    },
    {
      id: "a4",
      avatar: "SR",
      user: "Sneha Rao",
      action: "attendance regularized",
      time: "1h ago"
    },
    {
      id: "a5",
      avatar: "VS",
      user: "Vikram Singh",
      action: "profile updated",
      time: "2h ago"
    }
  ];

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
        {activities.map((item) => (
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
        ))}
      </div>
    </div>
  );
}
