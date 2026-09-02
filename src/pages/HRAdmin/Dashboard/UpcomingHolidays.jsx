import React from "react";
import "./UpcomingHolidays.css";

export default function UpcomingHolidays() {
  const holidays = [
    {
      id: "h1",
      month: "Sep",
      day: "7",
      name: "Ganesh Chaturthi",
      weekday: "Monday"
    },
    {
      id: "h2",
      month: "Oct",
      day: "2",
      name: "Gandhi Jayanti",
      weekday: "Friday"
    },
    {
      id: "h3",
      month: "Oct",
      day: "20",
      name: "Diwali",
      weekday: "Monday"
    }
  ];

  return (
    <div className="hradmin-dashboard-holidays-card">
      <div className="hradmin-dashboard-holidays-header">
        <h3 className="hradmin-dashboard-card-title">🗓️ Upcoming Holidays</h3>
      </div>

      <div className="hradmin-dashboard-holidays-list">
        {holidays.map((h) => (
          <div key={h.id} className="hradmin-dashboard-holiday-item">
            <div className="hradmin-dashboard-holiday-date-col">
              <span className="hradmin-dashboard-holiday-month">{h.month}</span>
              <span className="hradmin-dashboard-holiday-day">{h.day}</span>
            </div>

            <div className="hradmin-dashboard-holiday-info">
              <h4 className="hradmin-dashboard-holiday-name">{h.name}</h4>
              <span className="hradmin-dashboard-holiday-weekday">{h.weekday}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
