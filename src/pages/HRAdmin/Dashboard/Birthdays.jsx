import React from "react";
import "./Birthdays.css";

export default function Birthdays() {
  const birthdayList = [
    {
      id: "b1",
      name: "Priya Sharma",
      dept: "HR",
      badge: "Today",
      avatar: "P",
      avatarBg: "#a855f7"
    },
    {
      id: "b2",
      name: "Kiran Reddy",
      dept: "Engineering",
      badge: "Tomorrow",
      avatar: "K",
      avatarBg: "#a855f7"
    },
    {
      id: "b3",
      name: "Anjali Nair",
      dept: "Finance",
      badge: "Sep 3",
      avatar: "A",
      avatarBg: "#a855f7"
    }
  ];

  return (
    <div className="hradmin-dashboard-birthdays-card">
      <div className="hradmin-dashboard-birthdays-header">
        <h3 className="hradmin-dashboard-card-title">🎂 Birthdays</h3>
      </div>

      <div className="hradmin-dashboard-birthdays-list">
        {birthdayList.map((item) => (
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
        ))}
      </div>
    </div>
  );
}
